"use client";

import { useMemo } from "react";
import type { ReplayEvent, ViewportMode } from "../types/replay";
import { eventToMode } from "../utils/event-to-mode";

export function useModeResolver(event: ReplayEvent | null, fallback: ViewportMode): ViewportMode {
  return useMemo(() => {
    if (!event) return fallback;
    return eventToMode(event.type) ?? fallback;
  }, [event, fallback]);
}
