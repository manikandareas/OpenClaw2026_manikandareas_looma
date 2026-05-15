import { useQuery } from "@tanstack/react-query";
import type { GetSessionsParams, GetSessionsResponse } from "@/types/session";

async function fetchSessions(params?: GetSessionsParams): Promise<GetSessionsResponse> {
  const sp = new URLSearchParams();
  if (params?.status) sp.set("status", params.status);
  if (params?.limit) sp.set("limit", params.limit);
  if (params?.offset) sp.set("offset", params.offset);
  if (params?.search) sp.set("search", params.search);

  const res = await fetch(`/api/sessions?${sp.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch sessions");
  return res.json();
}

export function useSessions(params?: GetSessionsParams) {
  return useQuery({
    queryKey: ["sessions", params],
    queryFn: () => fetchSessions(params),
  });
}
