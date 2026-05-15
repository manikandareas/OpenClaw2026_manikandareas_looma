import { describe, expect, test } from "bun:test";
import type { LensEvent } from "@/features/lens-agent/types/lens-agent";
import { compressEvents } from "@/features/lens-agent/utils/event-compression";
import {
  calculateBehaviorSummary,
  canPublishReplayMetadata,
  detectReviewMarkers,
  evaluateCompleteness,
  evaluatePublishReadiness,
  generateChapterSkeletons,
} from "@/features/lens-agent/utils/rule-analysis";

describe("lens-agent event compression", () => {
  test("preserves first, last, error events and uses redacted payloads", () => {
    const events = Array.from({ length: 75 }, (_, index) => makeEvent({
      id: `event-${index + 1}`,
      seq: index + 1,
      redacted_payload_json: { outputPreview: index === 40 ? "Error: [REDACTED]" : `ok-${index}` },
      display_text: index === 40 ? "Command failed" : `Event ${index + 1}`,
      redaction_applied: index === 40,
    }));

    const compressed = compressEvents(events);

    expect(compressed.totalEvents).toBe(75);
    expect(compressed.redactedEventCount).toBe(1);
    expect(compressed.timeline.some((event) => event.seq === 1)).toBe(true);
    expect(compressed.timeline.some((event) => event.seq === 75)).toBe(true);
    expect(compressed.timeline.some((event) => event.seq === 41)).toBe(true);
    expect(JSON.stringify(compressed.timeline)).not.toContain("sk-");
  });
});

describe("lens-agent marker detection", () => {
  test("catches install, sensitive file, repeated command, test fail, and pass-after-fail", () => {
    const events = [
      makeEvent({ seq: 1, related_command: "bun add ai @ai-sdk/openai", display_text: "$ bun add ai @ai-sdk/openai" }),
      makeEvent({ seq: 2, type: "file_write", related_file: "apps/web/lib/auth.ts", display_text: "Edited auth.ts" }),
      makeEvent({ seq: 3, related_command: "bun test", redacted_payload_json: { exitCode: 1, outputPreview: "failed" }, display_text: "Tests failed" }),
      makeEvent({ seq: 4, related_command: "bun test", redacted_payload_json: { exitCode: 1, outputPreview: "failed" }, display_text: "Tests failed" }),
      makeEvent({ seq: 5, related_command: "bun test", redacted_payload_json: { exitCode: 0, outputPreview: "passed" }, display_text: "Tests passed" }),
    ];

    const markers = detectReviewMarkers(events);
    const labels = markers.map((marker) => marker.label);

    expect(labels).toContain("Dependency installed");
    expect(labels).toContain("Sensitive area changed");
    expect(labels).toContain("Test or check failed");
    expect(labels).toContain("Passed after failure");
    expect(labels).toContain("Repeated command");
  });
});

describe("lens-agent behavior summary", () => {
  test("counts read, edit, run, fail, fix, verify, and review", () => {
    const events = [
      makeEvent({ seq: 1, type: "file_read", category: "workspace", related_file: "README.md", display_text: "Read README.md" }),
      makeEvent({ seq: 2, related_command: "bun test", redacted_payload_json: { exitCode: 1 }, display_text: "Tests failed" }),
      makeEvent({ seq: 3, type: "file_write", category: "workspace", related_file: "apps/web/page.tsx", display_text: "Edited page.tsx" }),
      makeEvent({ seq: 4, related_command: "bun test", redacted_payload_json: { exitCode: 0 }, display_text: "Tests passed" }),
    ];
    const markers = detectReviewMarkers(events);

    const summary = calculateBehaviorSummary(events, markers);

    expect(summary.read_count).toBe(1);
    expect(summary.edit_count).toBe(1);
    expect(summary.run_count).toBe(2);
    expect(summary.fail_count).toBe(1);
    expect(summary.fix_count).toBe(1);
    expect(summary.verify_count).toBe(2);
    expect(summary.review_count).toBeGreaterThanOrEqual(1);
  });
});

describe("lens-agent publish gating", () => {
  test("rejects publish until completeness has explicitly marked output ready", () => {
    const events = Array.from({ length: 24 }, (_, index) => makeEvent({
      seq: index + 1,
      type: index % 8 === 0 ? "file_write" : "terminal_command",
      related_command: index % 8 === 0 ? null : "bun test",
      display_text: index % 8 === 0 ? "Edited file" : "Tests passed",
      redacted_payload_json: index % 8 === 0 ? {} : { exitCode: 0 },
    }));
    const markers = detectReviewMarkers(events);
    const behaviorSummary = calculateBehaviorSummary(events, markers);
    const chapters = generateChapterSkeletons(events);
    const notes = "- Session completed with edits and verification.";
    const readiness = evaluatePublishReadiness({
      events,
      markers,
      chapters,
      behaviorSummary,
      notes,
    });

    expect(readiness.ready).toBe(true);
    expect(canPublishReplayMetadata({ readiness, completeness: null })).toBe(false);

    const completeness = evaluateCompleteness({
      events,
      markers,
      chapters,
      behaviorSummary,
      notes,
      published: false,
    });

    expect(completeness.readyToPublish).toBe(true);
    expect(canPublishReplayMetadata({ readiness, completeness })).toBe(true);
  });
});

function makeEvent(overrides: Partial<LensEvent>): LensEvent {
  const seq = overrides.seq ?? 1;

  return {
    id: overrides.id ?? `event-${seq}`,
    seq,
    timestamp: overrides.timestamp ?? "2026-05-15T00:00:00.000Z",
    type: overrides.type ?? "terminal_command",
    category: overrides.category ?? "execution",
    source: overrides.source ?? "test",
    actor: overrides.actor ?? "agent",
    workspace_path: overrides.workspace_path ?? null,
    related_file: overrides.related_file ?? null,
    related_command: overrides.related_command ?? null,
    redacted_payload_json: overrides.redacted_payload_json ?? {},
    display_text: overrides.display_text ?? null,
    sensitivity: overrides.sensitivity ?? "none",
    redaction_applied: overrides.redaction_applied ?? false,
  };
}
