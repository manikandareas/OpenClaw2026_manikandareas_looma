import { getApiActor, unauthorized } from "@/lib/api/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  const actor = await getSessionActor(request);
  if (!actor) return unauthorized();

  const { id } = await context.params;
  const revokedAt = new Date().toISOString();
  const supabase = createSupabaseAdminClient();

  const { data, error } = await supabase
    .from("api_keys")
    .update({ revoked_at: revokedAt })
    .eq("id", id)
    .eq("user_id", actor.userId)
    .select("id, revoked_at")
    .single();

  if (error) {
    return Response.json({ error: "API key not found" }, { status: 404 });
  }

  return Response.json({
    id: data.id,
    revokedAt: data.revoked_at
  });
}

async function getSessionActor(request: Request) {
  const actor = await getApiActor(request);
  return actor?.authMode === "session" ? actor : null;
}
