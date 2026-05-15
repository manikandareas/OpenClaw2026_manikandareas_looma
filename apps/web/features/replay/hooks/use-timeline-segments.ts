"use client";

import { useMemo } from "react";
import type { ReplayEvent, TimelineSegment } from "../types/replay";
import { computeSegments } from "../utils/compute-segments";

export function useTimelineSegments(events: ReplayEvent[]): TimelineSegment[] {
  return useMemo(() => computeSegments(events), [events]);
}
