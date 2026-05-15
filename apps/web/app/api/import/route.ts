import { importTranscriptInputSchema } from "@looma/shared";
import { getApiActor, unauthorized } from "@/lib/api/auth";
import { getReplayUrl } from "@/lib/api/replay-url";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const actor = await getApiActor(request);
  if (!actor) {
    return unauthorized();
  }

  const input = importTranscriptInputSchema.parse(await request.json());
  const supabase = createSupabaseAdminClient();

  const { data: session, error: sessionError } = await supabase
    .from("sessions")
    .insert({
      user_id: actor.userId,
      name: input.name,
      harness: input.harness,
      workspace_name: input.workspaceName,
      source_type: "json_import",
      status: "replay_ready",
      started_at: new Date().toISOString(),
      ended_at: new Date().toISOString()
    })
    .select("id, status")
    .single();

  if (sessionError) {
    return Response.json({ error: sessionError.message }, { status: 500 });
  }

  await supabase.from("events").insert({
    session_id: session.id,
    seq: 1,
    timestamp: new Date().toISOString(),
    type: "transcript_import",
    category: "system",
    source: "import",
    actor: "user",
    payload_json: { transcript: input.transcript },
    redacted_payload_json: { transcript: input.transcript },
    display_text: "Imported transcript",
    sensitivity: "none",
    redaction_applied: false
  });

  return Response.json({
    sessionId: session.id,
    status: session.status,
    replayUrl: getReplayUrl(session.id)
  });
}
