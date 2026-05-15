"use client";

import { useQuery } from "@tanstack/react-query";
import type { ReplayData } from "../types/replay";

async function fetchReplay(sessionId: string): Promise<ReplayData> {
  const res = await fetch(`/api/sessions/${sessionId}/replay`);
  if (!res.ok) throw new Error("Failed to fetch replay data");
  return res.json();
}

export function useReplay(sessionId: string) {
  return useQuery({
    queryKey: ["replay", sessionId],
    queryFn: () => fetchReplay(sessionId),
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  });
}
