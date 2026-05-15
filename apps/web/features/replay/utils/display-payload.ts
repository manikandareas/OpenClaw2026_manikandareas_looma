import type { ReplayEvent } from "../types/replay";

export const REDACTED_PLACEHOLDER = "[redacted]";

type DisplayPayload = Record<string, unknown>;

export function getDisplayPayload(event: ReplayEvent): DisplayPayload {
  if (hasPayload(event.redacted_payload_json)) {
    return event.redacted_payload_json;
  }

  if (event.redaction_applied === false) {
    return event.payload_json;
  }

  return {};
}

export function getDisplayString(
  event: ReplayEvent,
  key: string,
  fallback?: string | null
): string {
  const payload = getDisplayPayload(event);
  const value = payload[key];

  if (typeof value === "string" && value.length > 0) {
    return value;
  }

  if (event.redaction_applied) {
    return REDACTED_PLACEHOLDER;
  }

  return fallback ?? "";
}

export function getSafeDisplayText(event: ReplayEvent): string {
  if (event.redaction_applied) {
    return REDACTED_PLACEHOLDER;
  }

  return event.display_text ?? "";
}

export function getDisplayNumber(event: ReplayEvent, key: string): number | null {
  const payload = getDisplayPayload(event);
  const value = payload[key];

  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

export function getDisplayArray<T>(
  event: ReplayEvent,
  key: string,
  guard: (value: unknown) => value is T
): T[] {
  const value = getDisplayPayload(event)[key];

  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(guard);
}

function hasPayload(payload: DisplayPayload): boolean {
  return Object.keys(payload).length > 0;
}
