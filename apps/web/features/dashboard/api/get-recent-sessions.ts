import { useQuery } from "@tanstack/react-query";
import type { GetSessionsResponse } from "@/types/session";

async function fetchRecentSessions(): Promise<GetSessionsResponse> {
  const res = await fetch("/api/sessions?limit=5");
  if (!res.ok) throw new Error("Failed to fetch recent sessions");
  return res.json();
}

export function useRecentSessions() {
  return useQuery({
    queryKey: ["sessions", { limit: "5" }],
    queryFn: fetchRecentSessions,
  });
}
