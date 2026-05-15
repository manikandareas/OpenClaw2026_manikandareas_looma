import { createSupabaseAdminClient } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{ sessionId: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { sessionId } = await context.params;
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
    behaviorSummary: behaviorSummary.data ?? metadata.data?.behavior_summary_json ?? {},
    notes: notes.data?.content ?? metadata.data?.notes ?? "",
    redactionSummary: metadata.data?.redaction_summary_json ?? {}
  });
}
