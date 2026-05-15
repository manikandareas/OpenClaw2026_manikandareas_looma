import type { ReplayChapter, ReplayData, ReplayEvent, ReplayMarker } from "../types/replay";

const SESSION_ID = "demo";
const STARTED_AT = "2026-05-15T01:00:00.000Z";

const events = [
  makeEvent(1, "terminal_command", {
    related_command: "bun typecheck",
    display_text: "$ bun typecheck",
    redacted_payload_json: { command: "bun typecheck" },
  }),
  makeEvent(2, "terminal_output", {
    display_text: "TypeScript found a stale route prop contract.",
    redacted_payload_json: {
      output:
        "app/session/[sessionId]/page.tsx: Type '{ params: { sessionId: string } }' does not satisfy Next.js 16 route props.\nExpected params to be a Promise.",
    },
  }),
  makeEvent(3, "file_read", {
    related_file: "apps/web/app/session/[sessionId]/page.tsx",
    display_text: "Read session route page.",
    redacted_payload_json: {
      content:
        "import { ReplayShell } from '@/features/replay/components/replay-shell';\n\nexport default async function ReplayPage({ params }) {\n  const { sessionId } = await params;\n  return <ReplayShell sessionId={sessionId} />;\n}",
      line: 4,
    },
  }),
  makeEvent(4, "file_read", {
    related_file: "apps/web/features/replay/components/replay-shell.tsx",
    display_text: "Inspected replay shell composition.",
    redacted_payload_json: {
      content:
        "export function ReplayShell({ sessionId }: { sessionId: string }) {\n  const { data, isLoading, error } = useReplay(sessionId);\n  if (isLoading) return <ReplayLoadingSkeleton />;\n  return <ReplayPlayer data={data} />;\n}",
      line: 2,
    },
  }),
  makeEvent(5, "terminal_command", {
    related_command: "rg -n \"use client|useReplay|Jump to Interesting\" apps/web/features/replay",
    display_text: "$ rg replay controls",
    redacted_payload_json: {
      command: "rg -n \"use client|useReplay|Jump to Interesting\" apps/web/features/replay",
    },
  }),
  makeEvent(6, "terminal_output", {
    display_text: "Found current Jump to Interesting logic in playback hook.",
    redacted_payload_json: {
      output:
        "use-playback-engine.ts: jumpToInteresting(markers)\nplayback-controls.tsx: Jump to Interesting\nreview-sidebar.tsx: Needs Review",
    },
  }),
  makeEvent(7, "file_diff", {
    related_file: "apps/web/features/replay/hooks/use-playback-engine.ts",
    display_text: "Changed marker selection to severity-first.",
    redacted_payload_json: {
      before:
        "const nextMarker = markers.find((m) => m.needs_review && m.seq > currentSeq);\nconst target = nextMarker ?? markers.find((m) => m.needs_review);",
      after:
        "const target = selectInterestingMarker(markers, currentSeq);\nif (target) seekToEventSeq(target.seq);",
    },
  }),
  makeEvent(8, "file_write", {
    related_file: "apps/web/features/replay/utils/interesting-marker.ts",
    display_text: "Added pure marker target utility.",
    redacted_payload_json: {
      content:
        "const SEVERITY_RANK = { info: 1, notice: 2, important: 3, sensitive: 4 };\n\nexport function selectInterestingMarker(markers, currentSeq) {\n  const reviewMarkers = markers.filter((marker) => marker.needs_review);\n  const active = reviewMarkers.find((marker) => marker.seq === currentSeq);\n  return active ? getNextBySeq(reviewMarkers, active.seq) : getHighestSeverity(reviewMarkers);\n}",
      line: 3,
    },
  }),
  makeEvent(9, "file_write", {
    related_file: "apps/web/features/replay/components/replay-actions.tsx",
    display_text: "Added copy link and embed controls.",
    redacted_payload_json: {
      content:
        "export function ReplayActions({ sessionId, title }) {\n  const copyLink = () => copyText(buildSessionUrl(sessionId));\n  const copyEmbed = () => copyText(buildEmbedSnippet({ sessionId, title }));\n  return <div />;\n}",
      line: 1,
    },
  }),
  makeEvent(10, "file_diff", {
    related_file: "apps/web/app/session/[sessionId]/page.tsx",
    display_text: "Added embed mode without touching landing page.",
    redacted_payload_json: {
      before: "<AppNav />\n<main className=\"mx-auto max-w-7xl px-4 py-6\">",
      after:
        "{embedded ? null : <AppNav />}\n<main className={embedded ? 'px-3 py-3' : 'mx-auto max-w-7xl px-4 py-6'}>",
    },
  }),
  makeEvent(11, "test_result", {
    related_command: "bun test apps/web/features/replay/utils/interesting-marker.test.ts",
    display_text: "Replay utility tests failed on initial cycle expectation.",
    redacted_payload_json: {
      summary: "1 failed, 3 passed",
      passed: 3,
      failed: 1,
      tests: [
        { name: "selects highest severity first", status: "passed", duration: 3 },
        { name: "cycles to next review marker", status: "failed", duration: 2, error: "expected seq 22, got 4" },
      ],
    },
  }),
  makeEvent(12, "file_diff", {
    related_file: "apps/web/features/replay/utils/interesting-marker.ts",
    display_text: "Fixed cycle ordering after active marker.",
    redacted_payload_json: {
      before: "return getHighestSeverity(reviewMarkers);",
      after:
        "if (active) return getNextBySeq(reviewMarkers, active.seq);\nreturn getHighestSeverity(reviewMarkers);",
    },
  }),
  makeEvent(13, "test_result", {
    related_command: "bun test apps/web/features/replay/utils/interesting-marker.test.ts",
    display_text: "Replay utility tests passed.",
    redacted_payload_json: {
      summary: "4 passed",
      passed: 4,
      failed: 0,
      tests: [
        { name: "selects highest severity first", status: "passed", duration: 2 },
        { name: "cycles to next review marker", status: "passed", duration: 2 },
        { name: "escapes embed attributes", status: "passed", duration: 1 },
      ],
    },
  }),
  makeEvent(14, "file_read", {
    related_file: "apps/web/app/layout.tsx",
    display_text: "Checked root metadata and app URL handling.",
    redacted_payload_json: {
      content:
        "export const metadata = {\n  title: 'Looma',\n  description: 'Replay-native review layer for autonomous coding agents.'\n};",
      line: 11,
    },
  }),
  makeEvent(15, "file_write", {
    related_file: "apps/web/features/replay/api/get-replay-preview.ts",
    display_text: "Added minimal metadata preview query.",
    redacted_payload_json: {
      content:
        "export async function getReplayPreview(sessionId) {\n  if (sessionId === 'demo') return getDemoReplayPreview();\n  return getSupabaseReplayPreview(sessionId);\n}",
      line: 1,
    },
  }),
  makeEvent(16, "file_diff", {
    related_file: "apps/web/app/session/[sessionId]/page.tsx",
    display_text: "Generated replay-specific Open Graph metadata.",
    redacted_payload_json: {
      before: "export default async function ReplayPage({ params }) {",
      after:
        "export async function generateMetadata({ params }) {\n  const preview = await getReplayPreview((await params).sessionId);\n  return buildReplayMetadata(preview);\n}\n\nexport default async function ReplayPage({ params, searchParams }) {",
    },
  }),
  makeEvent(17, "terminal_command", {
    related_command: "bun typecheck",
    display_text: "$ bun typecheck",
    redacted_payload_json: { command: "bun typecheck" },
  }),
  makeEvent(18, "terminal_output", {
    display_text: "Typecheck failed: route searchParams needs Promise type.",
    redacted_payload_json: {
      output:
        "app/session/[sessionId]/page.tsx: Type '{ searchParams?: { embed?: string } }' does not satisfy PageProps.\nNext.js 16 expects searchParams?: Promise<Record<string, string | string[] | undefined>>.",
    },
  }),
  makeEvent(19, "file_diff", {
    related_file: "apps/web/app/session/[sessionId]/page.tsx",
    display_text: "Fixed Next.js 16 searchParams typing.",
    redacted_payload_json: {
      before: "searchParams?: { embed?: string };",
      after: "searchParams: Promise<{ embed?: string | string[] }>;",
    },
  }),
  makeEvent(20, "terminal_command", {
    related_command: "bun lint",
    display_text: "$ bun lint",
    redacted_payload_json: { command: "bun lint" },
  }),
  makeEvent(21, "terminal_output", {
    display_text: "Lint passed.",
    redacted_payload_json: { output: "✔ No ESLint warnings or errors" },
  }),
  makeEvent(22, "test_result", {
    related_command: "bun test",
    display_text: "Full test suite passed.",
    redacted_payload_json: {
      summary: "12 passed",
      passed: 12,
      failed: 0,
      tests: [
        { name: "lens-agent event compression", status: "passed", duration: 4 },
        { name: "lens-agent marker detection", status: "passed", duration: 3 },
        { name: "replay interesting marker selection", status: "passed", duration: 2 },
        { name: "replay embed snippet escaping", status: "passed", duration: 1 },
      ],
    },
  }),
  makeEvent(23, "browser_snapshot", {
    display_text: "/session/demo smoke opened with autoplay and embedded mode available.",
    redacted_payload_json: {
      summary:
        "Demo replay loaded publicly, controls are visible, app nav is hidden for ?embed=1, and metadata tags include replay title.",
    },
  }),
  makeEvent(24, "terminal_command", {
    related_command: "bun build",
    display_text: "$ bun build",
    redacted_payload_json: { command: "bun build" },
  }),
  makeEvent(25, "terminal_output", {
    display_text: "Production build completed.",
    redacted_payload_json: {
      output:
        "Route (app)\n/session/[sessionId]\n/session/[sessionId]/opengraph-image\n/api/sessions/[sessionId]/replay",
    },
  }),
] satisfies ReplayEvent[];

const markers = [
  makeMarker("marker-type-contract", 2, "Next.js route prop mismatch", "Typecheck failed before route typing was updated.", "important"),
  makeMarker("marker-behavior-change", 7, "Jump target behavior changed", "Review marker selection because it changes playback navigation semantics.", "notice"),
  makeMarker("marker-share-surface", 9, "Public share controls added", "Copy link and iframe embed become externally visible replay affordances.", "info"),
  makeMarker("marker-failing-test", 11, "Utility test failed first", "Cycle behavior needed a red-green pass before wiring UI controls.", "important"),
  makeMarker("marker-metadata", 16, "Share metadata added", "Social preview now reads replay-specific title and review context.", "notice"),
  makeMarker("marker-public-demo", 23, "Public demo route smoke", "Demo route is intentionally unauthenticated and should stay fixture-backed.", "sensitive"),
] satisfies ReplayMarker[];

const chapters = [
  makeChapter("chapter-setup", 1, 6, "Find the replay surface", "Checked route, shell, and existing playback controls."),
  makeChapter("chapter-aha", 7, 16, "Make the replay shareable", "Added better review jumps, share actions, embed mode, and metadata preview."),
  makeChapter("chapter-verify", 17, 25, "Tighten and verify", "Fixed route typing, reran checks, and smoked the public demo route."),
] satisfies ReplayChapter[];

export const demoReplayData = {
  session: {
    id: SESSION_ID,
    name: "Demo: Aha Moment Replay",
    status: "completed",
    harness: "codex",
    agent_name: "Looma Lens",
    workspace_name: "looma",
    source_type: "fixture",
    duration_ms: 420_000,
    started_at: STARTED_AT,
    ended_at: "2026-05-15T01:07:00.000Z",
    created_at: STARTED_AT,
  },
  events,
  markers,
  chapters,
  behaviorSummary: {
    read_count: 5,
    edit_count: 8,
    run_count: 8,
    fail_count: 3,
    fix_count: 4,
    verify_count: 5,
    review_count: 6,
    important_files_json: [
      "apps/web/features/replay/hooks/use-playback-engine.ts",
      "apps/web/features/replay/components/replay-shell.tsx",
      "apps/web/app/session/[sessionId]/page.tsx",
      "apps/web/app/api/sessions/[sessionId]/replay/route.ts",
      "apps/web/features/replay/utils/interesting-marker.ts",
    ],
    important_commands_json: [
      "bun test apps/web/features/replay/utils/interesting-marker.test.ts",
      "bun typecheck",
      "bun lint",
      "bun build",
    ],
  },
  notes:
    "The useful aha moment was not a new landing page. It was the first replay screen feeling immediately alive: autoplay for the canonical demo, review jumps that land on meaningful moments, and share metadata that makes the replay understandable before opening it.",
  redactionSummary: {
    applied: true,
    policy: "demo-fixture-light",
    redactedFields: ["absolutePaths", "environmentValues", "privateOutput"],
  },
} satisfies ReplayData;

function makeEvent(
  seq: number,
  type: ReplayEvent["type"],
  overrides: Partial<ReplayEvent>
): ReplayEvent {
  const timestamp = new Date(new Date(STARTED_AT).getTime() + (seq - 1) * 17_500).toISOString();

  return {
    id: `demo-event-${seq.toString().padStart(2, "0")}`,
    session_id: SESSION_ID,
    seq,
    timestamp,
    type,
    category: inferCategory(type),
    source: "fixture",
    actor: seq % 5 === 0 ? "human" : "agent",
    workspace_path: "/Users/example/Development/project/looma",
    related_file: null,
    related_command: null,
    payload_json: overrides.redacted_payload_json ?? {},
    redacted_payload_json: {},
    display_text: null,
    sensitivity: "none",
    redaction_applied: false,
    ...overrides,
  };
}

function makeMarker(
  id: string,
  seq: number,
  label: string,
  reason: string,
  severity: ReplayMarker["severity"]
): ReplayMarker {
  return {
    id,
    session_id: SESSION_ID,
    event_id: `demo-event-${seq.toString().padStart(2, "0")}`,
    seq,
    timestamp: events[seq - 1]?.timestamp ?? STARTED_AT,
    label,
    category: "review",
    reason,
    needs_review: true,
    severity,
  };
}

function makeChapter(
  id: string,
  startSeq: number,
  endSeq: number,
  title: string,
  summary: string
): ReplayChapter {
  return {
    id,
    session_id: SESSION_ID,
    start_seq: startSeq,
    end_seq: endSeq,
    start_time_ms: (startSeq - 1) * 17_500,
    end_time_ms: endSeq * 17_500,
    title,
    summary,
  };
}

function inferCategory(type: string): ReplayEvent["category"] {
  if (type.startsWith("terminal")) return "execution";
  if (type.startsWith("file")) return "workspace";
  if (type.includes("result")) return "verification";
  return "review";
}
