import { redactJson, stopSessionInputSchema, type FinalOutputInput } from "@looma/shared";
import { getReplayUrl } from "@/lib/api/replay-url";
import { runLensAgent } from "@/features/lens-agent/api/run-lens-agent";
import { getApiActor, unauthorized } from "@/lib/api/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const maxDuration = 60;

type RouteContext = {
  params: Promise<{ sessionId: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  const actor = await getApiActor(request);
  if (!actor) {
    return unauthorized();
  }

  const { sessionId } = await context.params;
  const input = stopSessionInputSchema.parse(await request.json().catch(() => ({})));
  const supabase = createSupabaseAdminClient();
  const endedAt = new Date().toISOString();

  const { data: session, error: sessionError } = await supabase
    .from("sessions")
    .select("id, user_id")
    .eq("id", sessionId)
    .eq("user_id", actor.userId)
    .single();

  if (sessionError || !session) {
    return Response.json({ error: "Session not found" }, { status: 404 });
  }

  if (input.finalOutput) {
    const finalOutputError = await recordFinalOutputEvent(
      supabase,
      session.id,
      input.finalOutput
    );

    if (finalOutputError) {
      return Response.json({ error: finalOutputError.message }, { status: 500 });
    }
  }

  const { data, error } = await supabase
    .from("sessions")
    .update({
      status: input.status,
      ended_at: endedAt
    })
    .eq("id", session.id)
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

async function recordFinalOutputEvent(
  supabase: ReturnType<typeof createSupabaseAdminClient>,
  sessionId: string,
  finalOutput: FinalOutputInput
): Promise<Error | null> {
  const { count, error: countError } = await supabase
    .from("events")
    .select("id", { count: "exact", head: true })
    .eq("session_id", sessionId);

  if (countError) {
    return new Error(countError.message);
  }

  const redactedPayload = redactJson({
    title: finalOutput.title ?? "Final output",
    content: finalOutput.content,
    format: finalOutput.format,
  });

  const { error } = await supabase.from("events").insert({
    session_id: sessionId,
    seq: (count ?? 0) + 1,
    timestamp: new Date().toISOString(),
    type: "final_output",
    category: "review",
    source: "record_stop",
    actor: "agent",
    payload_json: redactedPayload.value,
    redacted_payload_json: redactedPayload.value,
    display_text: finalOutput.title ?? "Final output",
    sensitivity: finalOutput.sensitivity,
    redaction_applied: redactedPayload.redactionApplied,
  });

  return error ? new Error(error.message) : null;
}
