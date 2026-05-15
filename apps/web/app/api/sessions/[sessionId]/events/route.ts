import { normalizedEventInputSchema, redactJson } from "@looma/shared";
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
  const input = normalizedEventInputSchema.parse(await request.json());
  const supabase = createSupabaseAdminClient();

  const { data: session, error: sessionError } = await supabase
    .from("sessions")
    .select("id, user_id")
    .eq("id", sessionId)
    .single();

  if (sessionError || !session || session.user_id !== actor.userId) {
    return Response.json({ error: "Session not found" }, { status: 404 });
  }

  const { count, error: countError } = await supabase
    .from("events")
    .select("id", { count: "exact", head: true })
    .eq("session_id", sessionId);

  if (countError) {
    return Response.json({ error: countError.message }, { status: 500 });
  }

  const redactedPayload = redactJson(input.payload);
  const seq = input.seq ?? (count ?? 0) + 1;

  const { data, error } = await supabase
    .from("events")
    .insert({
      session_id: sessionId,
      seq,
      timestamp: input.timestamp ?? new Date().toISOString(),
      type: input.type,
      category: input.category,
      source: input.source,
      actor: input.actor,
      workspace_path: input.workspacePath,
      related_file: input.relatedFile,
      related_command: input.relatedCommand,
      payload_json: input.payload,
      redacted_payload_json: redactedPayload.value,
      display_text: input.displayText,
      sensitivity: input.sensitivity,
      redaction_applied: redactedPayload.redactionApplied
    })
    .select("id, seq, redaction_applied")
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({
    eventId: data.id,
    seq: data.seq,
    redactionApplied: data.redaction_applied
  });
}
