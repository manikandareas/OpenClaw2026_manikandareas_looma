import type { PlaybackSpeed } from "../types/replay";

const MAX_DELAY_MS = 3000;
const MIN_DELAY_MS = 100;
const FALLBACK_DELAY_MS = 800;

export function computeDelay(
  currentTimestamp: string | null,
  nextTimestamp: string | null,
  speed: PlaybackSpeed
): number {
  if (!currentTimestamp || !nextTimestamp) {
    return FALLBACK_DELAY_MS / speed;
  }

  const current = new Date(currentTimestamp).getTime();
  const next = new Date(nextTimestamp).getTime();
  const delta = next - current;

  if (delta <= 0 || Number.isNaN(delta)) {
    return FALLBACK_DELAY_MS / speed;
  }

  const capped = Math.min(delta, MAX_DELAY_MS);
  const scaled = capped / speed;
  return Math.max(scaled, MIN_DELAY_MS / speed);
}

export function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function computeElapsedMs(
  events: { timestamp: string }[],
  currentIndex: number
): number {
  if (events.length === 0 || currentIndex <= 0) return 0;

  const start = new Date(events[0].timestamp).getTime();
  const current = new Date(events[currentIndex].timestamp).getTime();
  const elapsed = current - start;

  return elapsed > 0 ? elapsed : currentIndex * FALLBACK_DELAY_MS;
}

export function computeTotalDurationMs(
  events: { timestamp: string }[],
  sessionDurationMs: number | null
): number {
  if (sessionDurationMs && sessionDurationMs > 0) return sessionDurationMs;
  if (events.length < 2) return 0;

  const start = new Date(events[0].timestamp).getTime();
  const end = new Date(events[events.length - 1].timestamp).getTime();
  const delta = end - start;

  return delta > 0 ? delta : events.length * FALLBACK_DELAY_MS;
}
