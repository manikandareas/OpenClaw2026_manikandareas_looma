export function getAppUrl() {
  const url = process.env.NEXT_PUBLIC_APP_URL;
  if (!url) {
    throw new Error("Missing NEXT_PUBLIC_APP_URL");
  }
  return url;
}

export function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !publishableKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
  }

  return { url, publishableKey };
}

export function getSupabaseServiceRoleKey() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) {
    throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");
  }
  return key;
}

export function getLensAgentEnv() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing OPENAI_API_KEY");
  }

  const maxSteps = Number(process.env.LOOMA_LENS_MAX_STEPS ?? "8");

  return {
    apiKey,
    model: process.env.LOOMA_OPENAI_MODEL ?? "gpt-4o-mini",
    maxSteps: Number.isFinite(maxSteps) && maxSteps > 0 ? Math.floor(maxSteps) : 8,
  };
}
