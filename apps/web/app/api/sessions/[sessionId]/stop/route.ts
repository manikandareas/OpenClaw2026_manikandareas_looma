import { getReplayUrl } from "@/lib/api/replay-url";
import { runLensAgent } from "@/features/lens-agent/api/run-lens-agent";
import { getApiActor, unauthorized } from "@/lib/api/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{ sessionId: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  const actor = await getApiActor(request);
  if (!actor) {
    return unauthorized();
  }

  const { sessionId } = await context.params;
  const supabase = createSupabaseAdminClient();
  const endedAt = new Date().toISOString();

  const { data, error } = await supabase
    .from("sessions")
    .update({
      status: "processing",
      ended_at: endedAt
    })
    .eq("id", sessionId)
    .eq("user_id", actor.userId)
    .select("id, status")
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 404 });
  }

  try {
    const result = await runLensAgent({
      sessionId: data.id,
      userId: actor.userId,
      force: true,
    });

    return Response.json({
      ...result,
      replayUrl: getReplayUrl(data.id)
    });
  } catch (processError) {
    return Response.json(
      {
        sessionId: data.id,
        status: "failed",
        replayUrl: getReplayUrl(data.id),
        error: processError instanceof Error ? processError.message : "Failed to process session",
      },
      { status: 500 }
    );
  }
}
