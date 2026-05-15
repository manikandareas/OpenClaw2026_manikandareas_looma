import { createHash } from "node:crypto";
import { createSupabaseAdminClient, createSupabaseServerClient } from "@/lib/supabase/server";

export type ApiActor = {
  userId: string;
  authMode: "session" | "api_key";
};

export async function getApiActor(request: Request): Promise<ApiActor | null> {
  const authorization = request.headers.get("authorization");

  if (authorization?.startsWith("Bearer ")) {
    const token = authorization.slice("Bearer ".length).trim();
    const keyHash = createHash("sha256").update(token).digest("hex");
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("api_keys")
      .select("user_id, revoked_at")
      .eq("key_hash", keyHash)
      .maybeSingle();

    if (!error && data && !data.revoked_at) {
      return { userId: data.user_id as string, authMode: "api_key" };
    }
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  return user ? { userId: user.id, authMode: "session" } : null;
}

export function unauthorized() {
  return Response.json({ error: "Unauthorized" }, { status: 401 });
}
