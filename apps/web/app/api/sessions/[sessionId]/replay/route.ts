import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { demoReplayData } from "@/features/replay/fixtures/demo-replay";

type RouteContext = {
  params: Promise<{ sessionId: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { sessionId } = await context.params;

  if (sessionId === "demo") {
    return Response.json(demoReplayData);
  }

  const supabase = createSupabaseAdminClient();

  const { data: session, error: sessionError } = await supabase
    .from("sessions")
    .select("*")
    .eq("id", sessionId)
    .single();

  if (sessionError) {
    return Response.json({ error: "Session not found" }, { status: 404 });
  }

  const [events, markers, chapters, behaviorSummary, notes, metadata] = await Promise.all([
    supabase.from("events").select("*").eq("session_id", sessionId).order("seq"),
    supabase.from("markers").select("*").eq("session_id", sessionId).order("seq"),
    supabase.from("chapters").select("*").eq("session_id", sessionId).order("start_seq"),
    supabase.from("behavior_summary").select("*").eq("session_id", sessionId).maybeSingle(),
    supabase.from("session_notes").select("*").eq("session_id", sessionId).maybeSingle(),
    supabase.from("replay_metadata").select("*").eq("session_id", sessionId).maybeSingle()
  ]);

  return Response.json({
    session,
    events: events.data ?? [],
    markers: markers.data ?? [],
    chapters: chapters.data ?? [],
    behaviorSummary: normalizeBehaviorSummary(
      behaviorSummary.data ?? metadata.data?.behavior_summary_json
    ),
    notes: notes.data?.content ?? metadata.data?.notes ?? "",
    redactionSummary: metadata.data?.redaction_summary_json ?? {}
  });
}

function normalizeBehaviorSummary(value: unknown) {
  const summary = isRecord(value) ? value : {};

  return {
    read_count: getNumber(summary.read_count),
    edit_count: getNumber(summary.edit_count),
    run_count: getNumber(summary.run_count),
    fail_count: getNumber(summary.fail_count),
    fix_count: getNumber(summary.fix_count),
    verify_count: getNumber(summary.verify_count),
    review_count: getNumber(summary.review_count),
    important_files_json: getStringArray(summary.important_files_json),
    important_commands_json: getStringArray(summary.important_commands_json)
  };
}

function getNumber(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function getStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
