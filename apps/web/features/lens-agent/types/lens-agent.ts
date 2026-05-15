export type LensEvent = {
  id: string;
  seq: number;
  timestamp: string;
  type: string;
  category: string;
  source: string | null;
  actor: string;
  workspace_path: string | null;
  related_file: string | null;
  related_command: string | null;
  redacted_payload_json: Record<string, unknown>;
  display_text: string | null;
  sensitivity: string;
  redaction_applied: boolean;
};

export type CompressedEvent = {
  id: string;
  seq: number;
  timestamp: string;
  type: string;
  category: string;
  actor: string;
  file?: string;
  command?: string;
  displayText?: string;
  payload: Record<string, unknown>;
  flags: string[];
};

export type CompressedSession = {
  totalEvents: number;
  includedEvents: number;
  firstSeq: number | null;
  lastSeq: number | null;
  redactedEventCount: number;
  timeline: CompressedEvent[];
  windows: Array<{
    startSeq: number;
    endSeq: number;
    eventCount: number;
    categories: Record<string, number>;
    notableEvents: CompressedEvent[];
  }>;
};

export type LensMarker = {
  eventId?: string;
  seq: number;
  timestamp: string;
  label: string;
  category: string;
  reason: string;
  needsReview: boolean;
  severity: "info" | "notice" | "important" | "sensitive";
};

export type LensChapter = {
  startSeq: number;
  endSeq: number | null;
  startTimeMs: number | null;
  endTimeMs: number | null;
  title: string;
  summary: string;
};

export type LensBehaviorSummary = {
  read_count: number;
  edit_count: number;
  run_count: number;
  fail_count: number;
  fix_count: number;
  verify_count: number;
  review_count: number;
  important_files_json: string[];
  important_commands_json: string[];
};

export type LensPatternAnalysis = {
  eventCount: number;
  commandCount: number;
  editCount: number;
  failureCount: number;
  repeatedCommands: Array<{ command: string; count: number; seqs: number[] }>;
  repeatedErrors: Array<{ signature: string; count: number; seqs: number[] }>;
  lowProgressLoopSeqs: number[];
  phaseHints: Array<{ seq: number; label: string }>;
};

export type LensDecisionTrace = {
  step: number;
  toolName: string;
  inputSummary: string;
  outputSummary: string;
  durationMs: number;
  status: "success" | "error" | "skipped";
  timestamp: string;
  visibleReasonSummary?: string;
};

export type LensPublishInput = {
  sessionId: string;
  chapters: LensChapter[];
  markers: LensMarker[];
  behaviorSummary: LensBehaviorSummary;
  notes: string;
  compressedSession: CompressedSession;
  decisionTrace: LensDecisionTrace[];
};

export type RunLensAgentResult = {
  sessionId: string;
  status: "replay_ready" | "failed";
  eventCount: number;
  markerCount: number;
  chapterCount: number;
  trace: LensDecisionTrace[];
};
