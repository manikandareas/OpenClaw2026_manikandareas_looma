import { cache } from "react";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { demoReplayData } from "../fixtures/demo-replay";

export type ReplayPreview = {
  sessionId: string;
  title: string;
  harness: string;
  eventCount: number;
  markerCount: number;
  firstReviewLabel: string | null;
};

export const getReplayPreview = cache(async (sessionId: string): Promise<ReplayPreview | null> => {
  if (sessionId === "demo") {
    return getDemoReplayPreview();
  }

  try {
    const supabase = createSupabaseAdminClient();

    const [sessionResult, eventsResult, markersResult] = await Promise.all([
      supabase.from("sessions").select("id,name,harness").eq("id", sessionId).single(),
      supabase
        .from("events")
        .select("id", { count: "exact", head: true })
        .eq("session_id", sessionId),
      supabase
        .from("markers")
        .select("id,label,needs_review,seq", { count: "exact" })
        .eq("session_id", sessionId)
        .eq("needs_review", true)
        .order("seq")
        .limit(1),
    ]);

    if (sessionResult.error || !sessionResult.data) {
      return null;
    }

    const firstReview = Array.isArray(markersResult.data) ? markersResult.data[0] : null;

    return {
      sessionId,
      title: sessionResult.data.name ?? "Looma replay",
      harness: sessionResult.data.harness ?? "agent",
      eventCount: eventsResult.count ?? 0,
      markerCount: markersResult.count ?? 0,
      firstReviewLabel: firstReview?.label ?? null,
    };
  } catch {
    return null;
  }
});

export function getDemoReplayPreview(): ReplayPreview {
  const firstReview = demoReplayData.markers
    .filter((marker) => marker.needs_review)
    .sort((a, b) => a.seq - b.seq)[0];

  return {
    sessionId: demoReplayData.session.id,
    title: demoReplayData.session.name,
    harness: demoReplayData.session.harness,
    eventCount: demoReplayData.events.length,
    markerCount: demoReplayData.markers.filter((marker) => marker.needs_review).length,
    firstReviewLabel: firstReview?.label ?? null,
  };
}
