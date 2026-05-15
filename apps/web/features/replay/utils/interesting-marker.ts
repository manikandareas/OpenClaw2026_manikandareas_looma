import type { ReplayMarker } from "../types/replay";

const SEVERITY_RANK: Record<ReplayMarker["severity"], number> = {
  info: 1,
  notice: 2,
  important: 3,
  sensitive: 4,
};

type ReviewMarkerInput = Pick<ReplayMarker, "needs_review" | "seq" | "severity">;

export function selectInterestingMarker<TMarker extends ReviewMarkerInput>(
  markers: TMarker[],
  currentSeq: number
): TMarker | null {
  const reviewMarkers = markers
    .filter((marker) => marker.needs_review)
    .sort((a, b) => a.seq - b.seq);

  if (reviewMarkers.length === 0) {
    return null;
  }

  const activeMarker = reviewMarkers.find((marker) => marker.seq === currentSeq);
  if (activeMarker) {
    const nextMarker = reviewMarkers.find((marker) => marker.seq > activeMarker.seq);
    return nextMarker ?? reviewMarkers[0];
  }

  return [...reviewMarkers].sort(compareBySeverityThenSeq)[0];
}

function compareBySeverityThenSeq<TMarker extends ReviewMarkerInput>(a: TMarker, b: TMarker) {
  const severityDelta = SEVERITY_RANK[b.severity] - SEVERITY_RANK[a.severity];
  return severityDelta === 0 ? a.seq - b.seq : severityDelta;
}
