export type ViewportMode = "terminal" | "editor" | "diff" | "test" | "browser";

export type PlaybackSpeed = 0.5 | 1 | 1.5 | 2 | 4;

export type PlaybackMode = "live" | "playing" | "paused" | "scrubbed";

export type PlaybackState = {
  currentIndex: number;
  isPlaying: boolean;
  playbackMode: PlaybackMode;
  speed: PlaybackSpeed;
  currentMode: ViewportMode;
  currentFile: string | null;
  progress: number;
};

export type ReplayEvent = {
  id: string;
  session_id: string;
  seq: number;
  timestamp: string;
  type: string;
  category: string;
  source: string | null;
  actor: string;
  workspace_path: string | null;
  related_file: string | null;
  related_command: string | null;
  payload_json: Record<string, unknown>;
  redacted_payload_json: Record<string, unknown>;
  display_text: string | null;
  sensitivity: "none" | "low" | "medium" | "high";
  redaction_applied: boolean;
};

export type ReplayMarker = {
  id: string;
  session_id: string;
  event_id: string | null;
  seq: number;
  timestamp: string;
  label: string;
  category: string;
  reason: string | null;
  needs_review: boolean;
  severity: "info" | "notice" | "important" | "sensitive";
};

export type ReplayChapter = {
  id: string;
  session_id: string;
  start_seq: number;
  end_seq: number | null;
  start_time_ms: number | null;
  end_time_ms: number | null;
  title: string;
  summary: string | null;
};

export type BehaviorSummary = {
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

export type ReplaySession = {
  id: string;
  name: string;
  status: string;
  harness: string;
  agent_name: string | null;
  workspace_name: string | null;
  source_type: string;
  duration_ms: number | null;
  started_at: string;
  ended_at: string | null;
  created_at: string;
};

export type ReplayFinalOutput = {
  title: string;
  content: string;
  format: "text" | "markdown" | "json";
  sourceEventId: string | null;
  seq: number | null;
  timestamp: string | null;
  sensitivity: ReplayEvent["sensitivity"];
  redactionApplied: boolean;
  isExplicit: boolean;
};

export type ReplayData = {
  session: ReplaySession;
  events: ReplayEvent[];
  markers: ReplayMarker[];
  chapters: ReplayChapter[];
  behaviorSummary: BehaviorSummary;
  notes: string;
  finalOutput: ReplayFinalOutput | null;
  redactionSummary: Record<string, unknown>;
};

export type TimelineSegment = {
  startIndex: number;
  endIndex: number;
  startPercent: number;
  endPercent: number;
  color: "green" | "yellow" | "red";
  label?: string;
};
