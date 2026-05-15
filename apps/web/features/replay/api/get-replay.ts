"use client";

import { useQuery } from "@tanstack/react-query";
import type { ReplayData } from "../types/replay";

async function fetchReplay(sessionId: string): Promise<ReplayData> {
  if (sessionId === "demo") {
    const { demoReplayData } = await import("../fixtures/demo-replay");
    return demoReplayData;
  }

  const res = await fetch(`/api/sessions/${sessionId}/replay`);
  if (!res.ok) throw new Error("Failed to fetch replay data");
  return res.json();
}

export function useReplay(sessionId: string) {
  return useQuery({
    queryKey: ["replay", sessionId],
    queryFn: () => fetchReplay(sessionId),
    staleTime: 10_000,
    refetchInterval: (query) => {
      const data = query.state.data as ReplayData | undefined;
      return data?.session.status === "recording" || data?.session.status === "processing"
        ? 2_000
        : false;
    },
    refetchOnWindowFocus: false,
  });
}
