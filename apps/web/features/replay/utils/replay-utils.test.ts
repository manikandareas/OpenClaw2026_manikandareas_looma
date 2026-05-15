import { describe, expect, test } from "bun:test";
import { selectInterestingMarker } from "./interesting-marker";
import { buildEmbedSnippet } from "./share";

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
