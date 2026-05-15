import type {
  LensBehaviorSummary,
  LensChapter,
  LensEvent,
  LensMarker,
  LensPatternAnalysis,
} from "@/features/lens-agent/types/lens-agent";

const INSTALL_COMMAND_RE = /\b(bun|npm|pnpm|yarn)\s+(add|install|i)\b|\bpip\s+install\b|\bcargo\s+add\b/i;
const TEST_COMMAND_RE = /\b(test|vitest|jest|playwright|typecheck|lint|tsc|build)\b/i;
const SENSITIVE_FILE_RE = /(^|\/)(\.env|middleware|auth|security|config|supabase|login|password|token|secret)|auth|security|config|\.env/i;
const DESTRUCTIVE_COMMAND_RE = /\brm\s+-rf\b|\bgit\s+reset\s+--hard\b|\bgit\s+clean\s+-fd\b/i;

export function analyzeEventPatterns(events: LensEvent[]): LensPatternAnalysis {
  const commandMap = new Map<string, { command: string; count: number; seqs: number[] }>();
  const errorMap = new Map<string, { signature: string; count: number; seqs: number[] }>();
  const phaseHints: LensPatternAnalysis["phaseHints"] = [];
  let commandCount = 0;
  let editCount = 0;
  let failureCount = 0;

  for (const event of events) {
    if (event.related_command) {
      commandCount += 1;
      const normalized = normalizeCommand(event.related_command);
      const current = commandMap.get(normalized) ?? { command: event.related_command, count: 0, seqs: [] };
      current.count += 1;
      current.seqs.push(event.seq);
      commandMap.set(normalized, current);
    }

    if (isEditEvent(event)) {
      editCount += 1;
    }

    if (isFailureEvent(event)) {
      failureCount += 1;
      const signature = errorSignature(event);
      if (signature) {
        const current = errorMap.get(signature) ?? { signature, count: 0, seqs: [] };
        current.count += 1;
        current.seqs.push(event.seq);
        errorMap.set(signature, current);
      }
    }

    const phaseHint = phaseHintForEvent(event);
    if (phaseHint) {
      phaseHints.push({ seq: event.seq, label: phaseHint });
    }
  }

  const repeatedCommands = Array.from(commandMap.values())
    .filter((item) => item.count >= 3)
    .sort((a, b) => b.count - a.count);
  const repeatedErrors = Array.from(errorMap.values())
    .filter((item) => item.count >= 2)
    .sort((a, b) => b.count - a.count);

  return {
    eventCount: events.length,
    commandCount,
    editCount,
    failureCount,
    repeatedCommands,
    repeatedErrors,
    lowProgressLoopSeqs: Array.from(new Set([
      ...repeatedCommands.flatMap((item) => item.seqs),
      ...repeatedErrors.flatMap((item) => item.seqs),
    ])).sort((a, b) => a - b),
    phaseHints,
  };
}

export function detectReviewMarkers(events: LensEvent[]): LensMarker[] {
  const markers: LensMarker[] = [];
  const seenLabelsBySeq = new Set<string>();
  const failedTestCommands = new Set<string>();
  const commandCounts = new Map<string, LensEvent[]>();
  const errorCounts = new Map<string, LensEvent[]>();

  for (const event of events) {
    const command = event.related_command ?? "";
    if (command) {
      const normalized = normalizeCommand(command);
      commandCounts.set(normalized, [...(commandCounts.get(normalized) ?? []), event]);
    }

    const signature = errorSignature(event);
    if (signature) {
      errorCounts.set(signature, [...(errorCounts.get(signature) ?? []), event]);
    }

    if (INSTALL_COMMAND_RE.test(command)) {
      pushMarker(markers, seenLabelsBySeq, event, {
        label: "Dependency installed",
        category: "dependency",
        reason: "The session changed project dependencies.",
        needsReview: true,
        severity: "important",
      });
    }

    if (DESTRUCTIVE_COMMAND_RE.test(command)) {
      pushMarker(markers, seenLabelsBySeq, event, {
        label: "Destructive command",
        category: "command",
        reason: "The command can remove files or rewrite local history.",
        needsReview: true,
        severity: "sensitive",
      });
    }

    if (isEditEvent(event) && event.related_file && SENSITIVE_FILE_RE.test(event.related_file)) {
      pushMarker(markers, seenLabelsBySeq, event, {
        label: "Sensitive area changed",
        category: "sensitive_change",
        reason: "The edit touched auth, security, configuration, Supabase, or environment-related files.",
        needsReview: true,
        severity: "sensitive",
      });
    }

    if (isLargeDiffEvent(event)) {
      pushMarker(markers, seenLabelsBySeq, event, {
        label: "Large diff",
        category: "large_change",
        reason: "The event reports a large patch or content change that deserves focused review.",
        needsReview: true,
        severity: "important",
      });
    }

    if (TEST_COMMAND_RE.test(command) && isFailureEvent(event)) {
      failedTestCommands.add(normalizeCommand(command));
      pushMarker(markers, seenLabelsBySeq, event, {
        label: "Test or check failed",
        category: "verification",
        reason: "A test, lint, typecheck, or build command failed.",
        needsReview: true,
        severity: "important",
      });
    }

    if (TEST_COMMAND_RE.test(command) && isSuccessEvent(event) && failedTestCommands.has(normalizeCommand(command))) {
      pushMarker(markers, seenLabelsBySeq, event, {
        label: "Passed after failure",
        category: "verification",
        reason: "A previously failing check passed later in the session.",
        needsReview: false,
        severity: "notice",
      });
    }
  }

  for (const repeated of commandCounts.values()) {
    if (repeated.length >= 3) {
      const event = repeated.at(-1);
      if (event) {
        pushMarker(markers, seenLabelsBySeq, event, {
          label: "Repeated command",
          category: "loop",
          reason: "The same command was run at least three times.",
          needsReview: true,
          severity: "notice",
        });
      }
    }
  }

  for (const repeated of errorCounts.values()) {
    if (repeated.length >= 2) {
      const event = repeated.at(-1);
      if (event) {
        pushMarker(markers, seenLabelsBySeq, event, {
          label: "Repeated error",
          category: "loop",
          reason: "Similar failure output appeared multiple times.",
          needsReview: true,
          severity: "important",
        });
      }
    }
  }

  const lowProgressLoopEvent = findLowProgressLoop(events);
  if (lowProgressLoopEvent) {
    pushMarker(markers, seenLabelsBySeq, lowProgressLoopEvent, {
      label: "Possible low-progress loop",
      category: "loop",
      reason: "The agent retried similar commands or errors with limited observable progress.",
      needsReview: true,
      severity: "important",
    });
  }

  return markers.sort((a, b) => a.seq - b.seq);
}

export function calculateBehaviorSummary(events: LensEvent[], markers: LensMarker[] = []): LensBehaviorSummary {
  let readCount = 0;
  let editCount = 0;
  let runCount = 0;
  let failCount = 0;
  let fixCount = 0;
  let verifyCount = 0;
  let sawFailure = false;
  const files = new Map<string, number>();
  const commands = new Map<string, number>();

  for (const event of events) {
    if (isReadEvent(event)) readCount += 1;
    if (isEditEvent(event)) {
      editCount += 1;
      if (sawFailure) fixCount += 1;
    }
    if (event.related_command || event.category === "execution") runCount += 1;
    if (isFailureEvent(event)) {
      failCount += 1;
      sawFailure = true;
    }
    if (isVerificationEvent(event)) verifyCount += 1;

    if (event.related_file) {
      increment(files, event.related_file);
    }
    if (event.related_command) {
      increment(commands, event.related_command);
    }
  }

  return {
    read_count: readCount,
    edit_count: editCount,
    run_count: runCount,
    fail_count: failCount,
    fix_count: fixCount,
    verify_count: verifyCount,
    review_count: markers.filter((marker) => marker.needsReview).length,
    important_files_json: topKeys(files, 8),
    important_commands_json: topKeys(commands, 8),
  };
}

export function generateChapterSkeletons(events: LensEvent[], titleDrafts: Array<Partial<LensChapter>> = []): LensChapter[] {
  if (events.length === 0) return [];

  const targetCount = events.length >= 20 ? 3 : 1;
  const boundaries = new Set<number>([events[0].seq]);
  const hints = analyzeEventPatterns(events).phaseHints;

  for (const hint of hints) {
    boundaries.add(hint.seq);
  }

  while (boundaries.size < targetCount) {
    const nextIndex = Math.floor((events.length / targetCount) * boundaries.size);
    boundaries.add(events[Math.min(nextIndex, events.length - 1)].seq);
  }

  const starts = Array.from(boundaries).sort((a, b) => a - b).slice(0, Math.max(targetCount, Math.min(5, boundaries.size)));
  const chapters = starts.map((startSeq, index): LensChapter => {
    const nextStart = starts[index + 1];
    const chapterEvents = events.filter((event) => event.seq >= startSeq && (!nextStart || event.seq < nextStart));
    const first = chapterEvents[0] ?? events[0];
    const last = chapterEvents.at(-1) ?? first;
    const draft = titleDrafts.find((item) => typeof item.startSeq === "number" && item.startSeq === startSeq) ?? titleDrafts[index];

    return {
      startSeq,
      endSeq: last.seq,
      startTimeMs: null,
      endTimeMs: null,
      title: cleanText(draft?.title, fallbackChapterTitle(chapterEvents, index)),
      summary: cleanText(draft?.summary, fallbackChapterSummary(chapterEvents)),
    };
  });

  return chapters;
}

export function createDefaultNotes(events: LensEvent[], markers: LensMarker[], behaviorSummary: LensBehaviorSummary): string {
  if (events.length === 0) {
    return "";
  }

  const bullets = [
    `Processed ${events.length} events with ${behaviorSummary.edit_count} edits and ${behaviorSummary.run_count} command executions.`,
    `${behaviorSummary.fail_count} failing checks or error events were observed; ${behaviorSummary.verify_count} verification events were captured.`,
    `${markers.filter((marker) => marker.needsReview).length} moments were marked for review.`,
  ];

  if (behaviorSummary.important_files_json[0]) {
    bullets.push(`Most referenced file: ${behaviorSummary.important_files_json[0]}.`);
  }

  return bullets.map((bullet) => `- ${bullet}`).join("\n");
}

export function evaluateCompleteness(input: {
  events: LensEvent[];
  markers: LensMarker[];
  chapters: LensChapter[];
  behaviorSummary: LensBehaviorSummary | null;
  notes: string;
  published: boolean;
}) {
  const readiness = evaluatePublishReadiness(input);
  const gaps = [...readiness.gaps];
  if (!input.published) gaps.push("not_published");

  return {
    score: Math.max(0, 100 - gaps.length * 20),
    complete: gaps.length === 0,
    readyToPublish: readiness.ready,
    gaps,
  };
}

export function evaluatePublishReadiness(input: {
  events: LensEvent[];
  markers: LensMarker[];
  chapters: LensChapter[];
  behaviorSummary: LensBehaviorSummary | null;
  notes: string;
}) {
  const gaps: string[] = [];

  if (input.events.length > 0 && input.chapters.length === 0) gaps.push("chapters_missing");
  if (input.events.length >= 20 && input.chapters.length < 3) gaps.push("minimum_three_chapters_missing");
  if (!input.behaviorSummary) gaps.push("behavior_summary_missing");
  if (input.events.length > 0 && input.notes.trim().length === 0) gaps.push("notes_missing");

  return {
    ready: gaps.length === 0,
    gaps,
  };
}

export function canPublishReplayMetadata(input: {
  readiness: ReturnType<typeof evaluatePublishReadiness>;
  completeness: ReturnType<typeof evaluateCompleteness> | null;
}) {
  return input.readiness.ready && input.completeness?.readyToPublish === true;
}

function pushMarker(
  markers: LensMarker[],
  seen: Set<string>,
  event: LensEvent,
  marker: Omit<LensMarker, "eventId" | "seq" | "timestamp">
) {
  const key = `${event.seq}:${marker.label}`;
  if (seen.has(key)) return;
  seen.add(key);
  markers.push({
    eventId: event.id,
    seq: event.seq,
    timestamp: event.timestamp,
    ...marker,
  });
}

function isReadEvent(event: LensEvent): boolean {
  return /read|search|grep|find|list/i.test(event.type) || /read|search/i.test(event.display_text ?? "");
}

function isEditEvent(event: LensEvent): boolean {
  return /write|edit|patch|diff|apply/i.test(event.type) || /wrote|edited|patched/i.test(event.display_text ?? "");
}

function isVerificationEvent(event: LensEvent): boolean {
  return TEST_COMMAND_RE.test(event.related_command ?? "") || /test|lint|typecheck|build|verification/i.test(event.type);
}

function isFailureEvent(event: LensEvent): boolean {
  const haystack = eventHaystack(event);
  return /"status"\s*:\s*"failed"|failed|failure|error|exception|traceback|"exitCode"\s*:\s*[1-9]|"exit_code"\s*:\s*[1-9]/i.test(haystack);
}

function isSuccessEvent(event: LensEvent): boolean {
  const haystack = eventHaystack(event);
  return /"status"\s*:\s*"passed"|passed|success|ok|"exitCode"\s*:\s*0|"exit_code"\s*:\s*0/i.test(haystack);
}

function isLargeDiffEvent(event: LensEvent): boolean {
  const payload = event.redacted_payload_json;
  const additions = numberValue(payload.additions);
  const deletions = numberValue(payload.deletions);
  const contentLength = numberValue(payload.contentLength) ?? numberValue(payload.content_length);

  return (additions ?? 0) + (deletions ?? 0) >= 200 || (contentLength ?? 0) >= 10_000;
}

function findLowProgressLoop(events: LensEvent[]): LensEvent | null {
  const recentFailures = events.filter(isFailureEvent).slice(-5);
  if (recentFailures.length < 3) return null;

  const signatures = new Set(recentFailures.map(errorSignature).filter(Boolean));
  return signatures.size <= 2 ? recentFailures.at(-1) ?? null : null;
}

function phaseHintForEvent(event: LensEvent): string | null {
  if (/task|prompt|intent|start/i.test(event.type) || event.category === "intent") return "Understanding task";
  if (isReadEvent(event)) return "Exploring code";
  if (isEditEvent(event)) return "Implementing changes";
  if (isFailureEvent(event)) return "Debugging failures";
  if (isVerificationEvent(event) && isSuccessEvent(event)) return "Final verification";
  return null;
}

function fallbackChapterTitle(events: LensEvent[], index: number): string {
  const labels = events.map(phaseHintForEvent).filter((label): label is string => Boolean(label));
  return labels[0] ?? `Session phase ${index + 1}`;
}

function fallbackChapterSummary(events: LensEvent[]): string {
  if (events.length === 0) return "No events in this phase.";
  const first = events[0];
  const last = events.at(-1) ?? first;
  return `Events ${first.seq}-${last.seq}: ${first.display_text ?? first.type} through ${last.display_text ?? last.type}.`;
}

function eventHaystack(event: LensEvent): string {
  return [
    event.type,
    event.category,
    event.display_text,
    event.related_file,
    event.related_command,
    JSON.stringify(event.redacted_payload_json),
  ].filter(Boolean).join("\n");
}

function errorSignature(event: LensEvent): string | null {
  if (!isFailureEvent(event)) return null;
  const haystack = eventHaystack(event)
    .replace(/[0-9a-f]{8,}/gi, "<hash>")
    .replace(/\d+/g, "<n>")
    .slice(0, 240)
    .toLowerCase();
  return haystack || null;
}

function normalizeCommand(command: string): string {
  return command.trim().replace(/\s+/g, " ").replace(/--watch\b/g, "").toLowerCase();
}

function numberValue(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function increment(map: Map<string, number>, key: string) {
  map.set(key, (map.get(key) ?? 0) + 1);
}

function topKeys(map: Map<string, number>, limit: number): string[] {
  return Array.from(map.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([key]) => key);
}

function cleanText(value: unknown, fallback: string): string {
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed.slice(0, 500) : fallback;
}

export const lensRuleInternals = {
  isFailureEvent,
  isSuccessEvent,
  isEditEvent,
  normalizeCommand,
};
