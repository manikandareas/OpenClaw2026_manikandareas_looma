import { createSessionInputSchema } from "@looma/shared";
import { getApiActor, unauthorized } from "@/lib/api/auth";
import { getReplayUrl } from "@/lib/api/replay-url";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const actor = await getApiActor(request);
  if (!actor) {
    return unauthorized();
  }

  const url = new URL(request.url);
  const status = url.searchParams.get("status");
  const search = url.searchParams.get("search");
  const limit = Math.min(Number(url.searchParams.get("limit") || "20"), 50);
  const offset = Number(url.searchParams.get("offset") || "0");

  const supabase = createSupabaseAdminClient();

  let query = supabase
    .from("sessions")
    .select("*", { count: "exact" })
    .eq("user_id", actor.userId)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (status) {
    query = query.eq("status", status);
  }
  if (search) {
    query = query.ilike("name", `%${search}%`);
  }

  const { data: sessions, error, count } = await query;

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  const sessionIds = (sessions ?? []).map((s) => s.id);
  const markerCounts: Record<string, number> = {};

  if (sessionIds.length > 0) {
    const { data: markers } = await supabase
      .from("markers")
      .select("session_id")
      .in("session_id", sessionIds);

    if (markers) {
      for (const m of markers) {
        markerCounts[m.session_id] = (markerCounts[m.session_id] || 0) + 1;
      }
    }
  }

  const mapped = (sessions ?? []).map((s) => ({
    id: s.id,
    name: s.name,
    status: s.status,
    harness: s.harness,
    agentName: s.agent_name,
    durationMs: s.duration_ms,
    markerCount: markerCounts[s.id] || 0,
    createdAt: s.created_at,
    startedAt: s.started_at,
    endedAt: s.ended_at,
  }));

  return Response.json({
    sessions: mapped,
    total: count ?? 0,
    limit,
    offset,
  });
}

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
