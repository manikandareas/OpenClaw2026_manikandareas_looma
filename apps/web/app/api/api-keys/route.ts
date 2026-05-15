import { createHash, randomBytes } from "node:crypto";
import { z } from "zod";
import { getApiActor, unauthorized } from "@/lib/api/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

const createApiKeySchema = z.object({
  name: z.string().trim().min(1).max(120)
});

export async function GET(request: Request) {
  const actor = await getSessionActor(request);
  if (!actor) return unauthorized();

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("api_keys")
    .select("id, name, created_at, last_used_at, revoked_at")
    .eq("user_id", actor.userId)
    .order("created_at", { ascending: false });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({
    keys: (data ?? []).map((key) => ({
      id: key.id,
      name: key.name,
      createdAt: key.created_at,
      lastUsedAt: key.last_used_at,
      revokedAt: key.revoked_at
    }))
  });
}

export async function POST(request: Request) {
  const actor = await getSessionActor(request);
  if (!actor) return unauthorized();

  const input = createApiKeySchema.parse(await request.json());
  const token = `looma_${randomBytes(32).toString("base64url")}`;
  const keyHash = createHash("sha256").update(token).digest("hex");
  const supabase = createSupabaseAdminClient();

  const { data, error } = await supabase
    .from("api_keys")
    .insert({
      user_id: actor.userId,
      name: input.name,
      key_hash: keyHash
    })
    .select("id, name, created_at")
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({
    id: data.id,
    name: data.name,
    token,
    createdAt: data.created_at
  });
}

async function getSessionActor(request: Request) {
  const actor = await getApiActor(request);
  return actor?.authMode === "session" ? actor : null;
}
