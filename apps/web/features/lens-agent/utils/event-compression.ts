import type { CompressedEvent, CompressedSession, LensEvent } from "@/features/lens-agent/types/lens-agent";

const MAX_SMALL_SESSION_EVENTS = 50;
const FIRST_LAST_KEEP_COUNT = 10;
const WINDOW_SIZE = 25;

export function compressEvents(events: LensEvent[]): CompressedSession {
  if (events.length === 0) {
    return {
      totalEvents: 0,
      includedEvents: 0,
      firstSeq: null,
      lastSeq: null,
      redactedEventCount: 0,
      timeline: [],
      windows: [],
    };
  }

  const summaries = events.map(toCompressedEvent);
  const mustKeepSeqs = new Set<number>();

  for (const event of summaries.slice(0, FIRST_LAST_KEEP_COUNT)) {
    mustKeepSeqs.add(event.seq);
  }
  for (const event of summaries.slice(-FIRST_LAST_KEEP_COUNT)) {
    mustKeepSeqs.add(event.seq);
  }
  for (const event of summaries) {
    if (event.flags.includes("error") || event.flags.includes("failure") || event.flags.includes("sensitive")) {
      mustKeepSeqs.add(event.seq);
    }
  }

  const timeline = events.length <= MAX_SMALL_SESSION_EVENTS
    ? summaries
    : summaries.filter((event, index) => mustKeepSeqs.has(event.seq) || index % 10 === 0);

  return {
    totalEvents: events.length,
    includedEvents: timeline.length,
    firstSeq: events[0]?.seq ?? null,
    lastSeq: events.at(-1)?.seq ?? null,
    redactedEventCount: events.filter((event) => event.redaction_applied).length,
    timeline,
    windows: buildWindows(summaries),
  };
}

export function toCompressedEvent(event: LensEvent): CompressedEvent {
  const payload = prunePayload(event.redacted_payload_json);
  const flags = detectFlags(event, payload);

  return {
    id: event.id,
    seq: event.seq,
    timestamp: event.timestamp,
    type: event.type,
    category: event.category,
    actor: event.actor,
    file: event.related_file ?? undefined,
    command: event.related_command ?? undefined,
    displayText: event.display_text ?? undefined,
    payload,
    flags,
  };
}

function buildWindows(events: CompressedEvent[]): CompressedSession["windows"] {
  const windows: CompressedSession["windows"] = [];

  for (let index = 0; index < events.length; index += WINDOW_SIZE) {
    const slice = events.slice(index, index + WINDOW_SIZE);
    if (slice.length === 0) continue;

    const categories: Record<string, number> = {};
    for (const event of slice) {
      categories[event.category] = (categories[event.category] ?? 0) + 1;
    }

    windows.push({
      startSeq: slice[0].seq,
      endSeq: slice.at(-1)?.seq ?? slice[0].seq,
      eventCount: slice.length,
      categories,
      notableEvents: slice.filter((event) => event.flags.length > 0).slice(0, 5),
    });
  }

  return windows;
}

function prunePayload(payload: Record<string, unknown>): Record<string, unknown> {
  const entries = Object.entries(payload).slice(0, 12).map(([key, value]) => {
    if (typeof value === "string") {
      return [key, truncate(value, 500)] as const;
    }
    if (Array.isArray(value)) {
      return [key, value.slice(0, 8)] as const;
    }
    return [key, value] as const;
  });

  return Object.fromEntries(entries);
}

function detectFlags(event: LensEvent, payload: Record<string, unknown>): string[] {
  const haystack = [
    event.type,
    event.category,
    event.display_text,
    event.related_file,
    event.related_command,
    JSON.stringify(payload),
  ].filter(Boolean).join("\n").toLowerCase();

  const flags: string[] = [];
  if (/error|exception|traceback|failed|failure|exit code [1-9]/.test(haystack)) flags.push("error");
  if (/failed|failure|exitcode":\s*[1-9]|"status":"failed"/.test(haystack)) flags.push("failure");
  if (/passed|success|ok|exitcode":\s*0|"status":"passed"/.test(haystack)) flags.push("success");
  if (/auth|security|secret|token|password|\.env|config/.test(haystack)) flags.push("sensitive");
  if (/install|npm i|npm install|pnpm add|bun add|yarn add|pip install/.test(haystack)) flags.push("dependency");
  if (event.redaction_applied) flags.push("redacted");

  return Array.from(new Set(flags));
}

function truncate(value: string, maxLength: number): string {
  return value.length > maxLength ? `${value.slice(0, maxLength - 3)}...` : value;
}
