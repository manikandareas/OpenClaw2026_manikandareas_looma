import { importTranscriptInputSchema, normalizedEventInputSchema } from "@looma/shared";
import { redactJson } from "@looma/shared";
import { runLensAgent } from "@/features/lens-agent/api/run-lens-agent";
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
      status: "processing",
      started_at: new Date().toISOString(),
      ended_at: new Date().toISOString()
    })
    .select("id, status")
    .single();

  if (sessionError) {
    return Response.json({ error: sessionError.message }, { status: 500 });
  }

  let normalizedEventCount = 0;

  let parsedEvents: unknown[] | null = null;
  try {
    const parsed = JSON.parse(input.transcript);
    if (Array.isArray(parsed)) {
      parsedEvents = parsed;
    }
  } catch {
    // Not valid JSON array — treat as raw transcript string
  }

  if (parsedEvents && parsedEvents.length > 0) {
    const rows = parsedEvents.map((raw, index) => {
      const event = normalizedEventInputSchema.safeParse(raw);
      const payload = event.success ? event.data.payload : { raw };
      const redacted = redactJson(payload);
      const displayText = event.success
        ? event.data.displayText || `Event ${index + 1}`
        : `Imported event ${index + 1}`;

      return {
        session_id: session.id,
        seq: index + 1,
        timestamp: event.success && event.data.timestamp
          ? event.data.timestamp
          : new Date().toISOString(),
        type: event.success ? event.data.type : "unknown",
        category: event.success ? event.data.category : "system",
        source: event.success ? (event.data.source || "import") : "import",
        actor: event.success ? event.data.actor : "agent",
        workspace_path: event.success ? event.data.workspacePath : null,
        related_file: event.success ? event.data.relatedFile : null,
        related_command: event.success ? event.data.relatedCommand : null,
        payload_json: payload,
        redacted_payload_json: redacted.value,
        display_text: displayText,
        sensitivity: event.success ? event.data.sensitivity : "none",
        redaction_applied: redacted.redactionApplied,
      };
    });

    const { error: insertError } = await supabase.from("events").insert(rows);
    if (insertError) {
      return Response.json({ error: insertError.message }, { status: 500 });
    }
    normalizedEventCount = rows.length;
  } else {
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
    normalizedEventCount = 1;
  }

  try {
    const result = await runLensAgent({
      sessionId: session.id,
      userId: actor.userId,
      force: true,
    });

    return Response.json({
      ...result,
      replayUrl: getReplayUrl(session.id),
      normalizedEventCount,
    });
  } catch (error) {
    return Response.json(
      {
        sessionId: session.id,
        status: "failed",
        replayUrl: getReplayUrl(session.id),
        normalizedEventCount,
        error: error instanceof Error ? error.message : "Failed to process imported transcript",
      },
      { status: 500 }
    );
  }
}
