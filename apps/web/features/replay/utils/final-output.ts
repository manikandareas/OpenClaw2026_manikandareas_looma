import type { ReplayEvent, ReplayFinalOutput } from "../types/replay";
import { getDisplayPayload, getDisplayString, getSafeDisplayText } from "./display-payload";

const FINAL_OUTPUT_TYPES = new Set([
  "final_output",
  "final_response",
  "agent_final_response",
  "assistant_final_response",
  "session_final_output",
]);

export function resolveFinalOutput(events: ReplayEvent[]): ReplayFinalOutput | null {
  const explicitEvent = findLastEvent(events, (event) => FINAL_OUTPUT_TYPES.has(event.type));

  if (explicitEvent) {
    return finalOutputFromEvent(explicitEvent, true);
  }

  const inferredEvent = findLastEvent(events, (event) => {
    const type = event.type.toLowerCase();
    return event.actor === "agent" && (type.includes("response") || type.includes("message"));
  });

  return inferredEvent ? finalOutputFromEvent(inferredEvent, false) : null;
}

function findLastEvent(
  events: ReplayEvent[],
  predicate: (event: ReplayEvent) => boolean
): ReplayEvent | null {
  for (let index = events.length - 1; index >= 0; index -= 1) {
    const event = events[index];
    if (event && predicate(event)) {
      return event;
    }
  }

  return null;
}

function finalOutputFromEvent(event: ReplayEvent, isExplicit: boolean): ReplayFinalOutput | null {
  const payload = getDisplayPayload(event);
  const content = extractContent(event, payload);

  if (!content.trim()) {
    return null;
  }

  return {
    title: extractTitle(event, payload),
    content,
    format: extractFormat(payload),
    sourceEventId: event.id,
    seq: event.seq,
    timestamp: event.timestamp,
    sensitivity: event.sensitivity,
    redactionApplied: event.redaction_applied,
    isExplicit,
  };
}

function extractTitle(event: ReplayEvent, payload: Record<string, unknown>): string {
  const title = payload.title;

  if (typeof title === "string" && title.trim()) {
    return title.trim();
  }

  return event.display_text?.trim() || "Final output";
}

function extractContent(event: ReplayEvent, payload: Record<string, unknown>): string {
  const nested = payload.finalOutput;
  if (isRecord(nested)) {
    const nestedContent = stringFromKeys(nested, ["content", "markdown", "text", "response", "answer"]);
    if (nestedContent) return nestedContent;
  }

  return (
    stringFromKeys(payload, ["content", "markdown", "text", "response", "answer", "output", "summary"]) ||
    getDisplayString(event, "content") ||
    getDisplayString(event, "response") ||
    getDisplayString(event, "answer") ||
    getSafeDisplayText(event)
  );
}

function extractFormat(payload: Record<string, unknown>): ReplayFinalOutput["format"] {
  const format = payload.format;

  if (format === "text" || format === "markdown" || format === "json") {
    return format;
  }

  return "markdown";
}

function stringFromKeys(payload: Record<string, unknown>, keys: string[]): string {
  for (const key of keys) {
    const value = payload[key];
    if (typeof value === "string" && value.trim()) {
      return value;
    }
  }

  return "";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
