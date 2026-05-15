import { describe, expect, test } from "bun:test";
import { selectInterestingMarker } from "./interesting-marker";
import { eventToFrame, eventToMode } from "./replay-frame";
import { buildEmbedSnippet } from "./share";
import type { ReplayEvent } from "../types/replay";

describe("replay interesting marker selection", () => {
  test("selects the highest severity review marker first, then earliest seq", () => {
    const selectedMarker = selectInterestingMarker([
      makeMarker({ seq: 4, severity: "important" }),
      makeMarker({ seq: 2, severity: "sensitive" }),
      makeMarker({ seq: 1, severity: "sensitive" }),
      makeMarker({ seq: 3, severity: "notice", needs_review: false }),
    ], 0);

    expect(selectedMarker?.seq).toBe(1);
  });

  test("cycles to the next review marker when currently on a review marker", () => {
    const markers = [
      makeMarker({ seq: 4, severity: "important" }),
      makeMarker({ seq: 10, severity: "sensitive" }),
      makeMarker({ seq: 22, severity: "notice" }),
    ];

    expect(selectInterestingMarker(markers, 10)?.seq).toBe(22);
    expect(selectInterestingMarker(markers, 22)?.seq).toBe(4);
  });

  test("returns null without review markers", () => {
    expect(selectInterestingMarker([makeMarker({ needs_review: false })], 0)).toBeNull();
  });
});

describe("replay share utilities", () => {
  test("escapes embed snippet attributes", () => {
    const snippet = buildEmbedSnippet({
      sessionId: "demo",
      title: "Aha \"Moment\" <Replay>",
      origin: "https://looma.test",
    });

    expect(snippet).toContain("https://looma.test/session/demo?embed=1");
    expect(snippet).toContain("Aha &quot;Moment&quot; &lt;Replay&gt; replay");
    expect(snippet).not.toContain("<Replay>");
  });
});

describe("replay frame resolver", () => {
  test("resolves terminal command frame with output preview", () => {
    const frame = eventToFrame(makeEvent({
      type: "terminal_command",
      related_command: "bun test",
      redacted_payload_json: {
        command: "bun test",
        outputPreview: "2 pass"
      }
    }));

    expect(frame).toMatchObject({
      mode: "terminal",
      command: "bun test",
      output: "2 pass",
      failed: false
    });
  });

  test("resolves failed command frame with error output", () => {
    const frame = eventToFrame(makeEvent({
      type: "terminal_command_failed",
      related_command: "bun lint",
      redacted_payload_json: {
        command: "bun lint",
        stderrPreview: "lint failed",
        exitCode: 1,
        failed: true
      }
    }));

    expect(frame).toMatchObject({
      mode: "terminal",
      command: "bun lint",
      output: "lint failed",
      failed: true,
      statusText: "exit 1"
    });
  });

  test("does not invent a command prompt for output-only terminal frames", () => {
    const frame = eventToFrame(makeEvent({
      type: "terminal_output",
      display_text: "TypeScript found a stale route prop contract.",
      redacted_payload_json: {
        output: "Expected params to be a Promise."
      }
    }));

    expect(frame).toMatchObject({
      mode: "terminal",
      command: "",
      output: "Expected params to be a Promise."
    });
  });

  test("resolves file read frame from content preview", () => {
    const frame = eventToFrame(makeEvent({
      type: "file_read",
      related_file: "apps/web/page.tsx",
      redacted_payload_json: {
        contentPreview: "export default function Page() {}",
        offset: 9,
        contentTruncated: true
      }
    }));

    expect(frame).toMatchObject({
      mode: "editor",
      path: "apps/web/page.tsx",
      content: "export default function Page() {}",
      line: 10,
      previewUnavailable: false,
      truncated: true
    });
  });

  test("resolves search frame as terminal-like result", () => {
    const frame = eventToFrame(makeEvent({
      type: "file_search",
      source: "Grep",
      redacted_payload_json: {
        pattern: "ReplayShell",
        path: "apps/web",
        resultPreview: "apps/web/features/replay/components/replay-shell.tsx"
      }
    }));

    expect(frame).toMatchObject({
      mode: "terminal",
      command: "rg ReplayShell apps/web",
      output: "apps/web/features/replay/components/replay-shell.tsx"
    });
  });

  test("resolves missing read preview as explicit unavailable state", () => {
    const frame = eventToFrame(makeEvent({
      type: "file_read",
      related_file: "apps/web/page.tsx",
      redacted_payload_json: {
        path: "apps/web/page.tsx",
        limit: 120
      }
    }));

    expect(frame).toMatchObject({
      mode: "editor",
      previewUnavailable: true
    });
    expect(frame.mode === "editor" ? frame.content : "").toContain("preview unavailable");
  });

  test("maps replay event failures to deterministic modes", () => {
    expect(eventToMode("terminal_command_failed")).toBe("terminal");
    expect(eventToMode("file_read_failed")).toBe("editor");
    expect(eventToMode("file_edit_failed")).toBe("diff");
    expect(eventToMode("search_failed")).toBe("terminal");
    expect(eventToMode("list_files_failed")).toBe("terminal");
  });
});

function makeMarker(overrides: {
  seq?: number;
  severity?: "info" | "notice" | "important" | "sensitive";
  needs_review?: boolean;
}) {
  return {
    seq: overrides.seq ?? 1,
    severity: overrides.severity ?? "info",
    needs_review: overrides.needs_review ?? true,
  };
}

function makeEvent(overrides: Partial<ReplayEvent>): ReplayEvent {
  return {
    id: "event-1",
    session_id: "session-1",
    seq: 1,
    timestamp: "2026-05-15T00:00:00.000Z",
    type: "terminal_command",
    category: "execution",
    source: "fixture",
    actor: "agent",
    workspace_path: null,
    related_file: null,
    related_command: null,
    payload_json: {},
    redacted_payload_json: {},
    display_text: null,
    sensitivity: "none",
    redaction_applied: false,
    ...overrides,
  };
}
