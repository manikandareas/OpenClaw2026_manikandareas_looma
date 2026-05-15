import { getReplayUrl } from "@/lib/api/replay-url";
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

  return Response.json({
    sessionId: data.id,
    status: data.status,
    replayUrl: getReplayUrl(data.id)
  });
}
