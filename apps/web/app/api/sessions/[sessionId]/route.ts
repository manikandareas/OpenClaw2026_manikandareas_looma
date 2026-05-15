import { getApiActor, unauthorized } from "@/lib/api/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{ sessionId: string }>;
};

export async function GET(request: Request, context: RouteContext) {
  const actor = await getApiActor(request);
  if (!actor) {
    return unauthorized();
  }

  const { sessionId } = await context.params;
  const supabase = createSupabaseAdminClient();

  const [sessionResult, eventCountResult, markerCountResult] = await Promise.all([
    supabase
      .from("sessions")
      .select("*")
      .eq("id", sessionId)
      .eq("user_id", actor.userId)
      .single(),
    supabase
      .from("events")
      .select("id", { count: "exact", head: true })
      .eq("session_id", sessionId),
    supabase
      .from("markers")
      .select("id", { count: "exact", head: true })
      .eq("session_id", sessionId),
  ]);

  if (sessionResult.error || !sessionResult.data) {
    return Response.json({ error: "Session not found" }, { status: 404 });
  }

  const s = sessionResult.data;

  return Response.json({
    session: {
      id: s.id,
      name: s.name,
      status: s.status,
      harness: s.harness,
      agentName: s.agent_name,
      workspaceName: s.workspace_name,
      sourceType: s.source_type,
      durationMs: s.duration_ms,
      startedAt: s.started_at,
      endedAt: s.ended_at,
      createdAt: s.created_at,
    },
    eventCount: eventCountResult.count ?? 0,
    markerCount: markerCountResult.count ?? 0,
  });
}
