import type { ReplayEvent, TimelineSegment } from "../types/replay";
import { getDisplayPayload } from "./display-payload";

type SegmentColor = "green" | "yellow" | "red";

export function computeSegments(events: ReplayEvent[]): TimelineSegment[] {
  if (events.length < 2) return [];

  const segments: TimelineSegment[] = [];
  let segmentStart = 0;
  let currentColor: SegmentColor = "green";

  const failureWindow: { file: string | null; command: string | null; count: number }[] = [];

  for (let i = 0; i < events.length; i++) {
    const event = events[i];
    const color = classifyEvent(event, failureWindow);

    if (color !== currentColor && i > segmentStart) {
      segments.push({
        startIndex: segmentStart,
        endIndex: i - 1,
        startPercent: segmentStart / events.length,
        endPercent: i / events.length,
        color: currentColor,
      });
      segmentStart = i;
      currentColor = color;
    }

    trackFailures(event, failureWindow);
  }

  segments.push({
    startIndex: segmentStart,
    endIndex: events.length - 1,
    startPercent: segmentStart / events.length,
    endPercent: 1,
    color: currentColor,
  });

  return segments;
}

function classifyEvent(
  event: ReplayEvent,
  failureWindow: { file: string | null; command: string | null; count: number }[]
): SegmentColor {
  const recentFailures = failureWindow.filter((f) => f.count >= 3);
  if (recentFailures.length > 0) return "red";

  const retrySignals = failureWindow.filter((f) => f.count >= 1 && f.count < 3);
  if (retrySignals.length > 0 && isRetryEvent(event)) return "yellow";

  return "green";
}

function isRetryEvent(event: ReplayEvent): boolean {
  const retryTypes = ["test_result", "terminal_command", "file_write"];
  return retryTypes.includes(event.type);
}

function trackFailures(
  event: ReplayEvent,
  failureWindow: { file: string | null; command: string | null; count: number }[]
): void {
  const isFailure =
    event.type === "test_result" &&
    getDisplayPayload(event).status === "failed";

  const isRepeatedCommand =
    event.type === "terminal_command" && event.related_command !== null;

  if (isFailure || isRepeatedCommand) {
    const key = event.related_file ?? event.related_command ?? event.type;
    const existing = failureWindow.find(
      (f) => (f.file ?? f.command) === key
    );
    if (existing) {
      existing.count++;
    } else {
      failureWindow.push({
        file: event.related_file,
        command: event.related_command,
        count: 1,
      });
    }
  }

  // Reset on success
  if (
    event.type === "test_result" &&
    getDisplayPayload(event).status === "passed"
  ) {
    failureWindow.length = 0;
  }

  // Keep window bounded
  if (failureWindow.length > 10) {
    failureWindow.shift();
  }
}
