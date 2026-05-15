import { createSessionInputSchema } from "@looma/shared";
import { getApiActor, unauthorized } from "@/lib/api/auth";
import { getReplayUrl } from "@/lib/api/replay-url";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const actor = await getApiActor(request);
  if (!actor) {
    return unauthorized();
  }

  const input = createSessionInputSchema.parse(await request.json());
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("sessions")
    .insert({
      user_id: actor.userId,
      name: input.name,
      harness: input.harness,
      agent_name: input.agentName,
      workspace_name: input.workspaceName,
      source_type: input.sourceType,
      status: "recording",
      started_at: new Date().toISOString()
    })
    .select("id, status")
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({
    sessionId: data.id,
    status: data.status,
    replayUrl: getReplayUrl(data.id)
  });
}
