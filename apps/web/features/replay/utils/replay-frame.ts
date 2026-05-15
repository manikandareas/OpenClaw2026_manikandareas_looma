import type { ReplayEvent, ViewportMode } from "../types/replay";
import {
  getDisplayNumber,
  getDisplayPayload,
  getDisplayString,
  getSafeDisplayText
} from "./display-payload";

export type ReplayFrame =
  | {
      mode: "terminal";
      title: string;
      command: string;
      output: string;
      failed: boolean;
      statusText: string | null;
    }
  | {
      mode: "editor";
      title: string;
      path: string | null;
      content: string;
      line: number;
      previewUnavailable: boolean;
      truncated: boolean;
    }
  | {
      mode: "diff";
      title: string;
      path: string | null;
      oldValue: string;
      newValue: string;
      patchPreview: string;
      previewUnavailable: boolean;
      truncated: boolean;
    }
  | {
      mode: "test";
      title: string;
    }
  | {
      mode: "browser";
      title: string;
    };

export function eventToFrame(event: ReplayEvent | null): ReplayFrame {
  if (!event) {
    return {
      mode: "terminal",
      title: "Waiting for events",
      command: "",
      output: "Waiting for events...",
      failed: false,
      statusText: null
    };
  }

  if (isTerminalLike(event)) return terminalFrame(event);
  if (isDiffLike(event)) return diffFrame(event);
  if (isEditorLike(event)) return editorFrame(event);
  if (event.type === "browser_snapshot") return { mode: "browser", title: "Browser snapshot" };
  if (event.type === "test_result" || event.type === "build_result" || event.type === "lint_result") {
    return { mode: "test", title: event.display_text ?? event.type };
  }

  return terminalFrame(event);
}

export function eventToMode(type: string): ViewportMode | null {
  if (TERMINAL_TYPES.has(type)) return "terminal";
  if (EDITOR_TYPES.has(type)) return "editor";
  if (DIFF_TYPES.has(type)) return "diff";
  if (type === "test_result" || type === "build_result" || type === "lint_result") return "test";
  if (type === "browser_snapshot") return "browser";
  return null;
}

function terminalFrame(event: ReplayEvent): Extract<ReplayFrame, { mode: "terminal" }> {
  const payload = getDisplayPayload(event);
  const command = getTerminalCommand(event);
  const output =
    getDisplayString(event, "output") ||
    getDisplayString(event, "outputPreview") ||
    getDisplayString(event, "resultPreview") ||
    getDisplayString(event, "stderrPreview") ||
    getDisplayString(event, "stdoutPreview") ||
    getSafeDisplayText(event);
  const failed = Boolean(payload.failed) || event.type.endsWith("_failed");
  const exitCode = getDisplayNumber(event, "exitCode");
  const status = getDisplayString(event, "status");

  return {
    mode: "terminal",
    title: event.display_text ?? event.type,
    command,
    output: output || (failed ? "Tool failed without an output preview." : ""),
    failed,
    statusText: exitCode !== null ? `exit ${exitCode}` : status || null
  };
}

function getTerminalCommand(event: ReplayEvent): string {
  const command = getDisplayString(event, "command") || event.related_command || getSearchCommand(event);

  if (command) return command;
  if (event.type === "terminal_output") return "";

  return getToolCommand(event);
}

function editorFrame(event: ReplayEvent): Extract<ReplayFrame, { mode: "editor" }> {
  const path = event.related_file ?? getDisplayString(event, "path") ?? null;
  const content =
    getDisplayString(event, "contentPreview") ||
    getDisplayString(event, "content") ||
    getDisplayString(event, "outputPreview");
  const line =
    getDisplayNumber(event, "line") ??
    ((getDisplayNumber(event, "offset") ?? 0) + 1);
  const truncated = Boolean(getDisplayPayload(event).contentTruncated);

  return {
    mode: "editor",
    title: event.display_text ?? (path ? `Read ${path}` : "File preview"),
    path,
    content:
      content ||
      [
        "// preview unavailable",
        path ? `// path: ${path}` : "// path: unavailable",
        metadataComment(event)
      ].filter(Boolean).join("\n"),
    line: Math.max(1, Math.floor(line)),
    previewUnavailable: !content,
    truncated
  };
}

function diffFrame(event: ReplayEvent): Extract<ReplayFrame, { mode: "diff" }> {
  const payload = getDisplayPayload(event);
  const path = event.related_file ?? getDisplayString(event, "path") ?? null;
  const oldValue =
    stringValue(payload.oldStringPreview) ||
    stringValue(payload.before) ||
    stringValue(payload.oldValue);
  const newValue =
    stringValue(payload.newStringPreview) ||
    stringValue(payload.after) ||
    stringValue(payload.newValue);
  const patchPreview =
    stringValue(payload.patchPreview) ||
    stringValue(payload.diff) ||
    getDisplayString(event, "outputPreview");
  const previewUnavailable = !oldValue && !newValue && !patchPreview;

  return {
    mode: "diff",
    title: event.display_text ?? (path ? `Edited ${path}` : "Edit preview"),
    path,
    oldValue: oldValue || (previewUnavailable ? "preview unavailable" : patchPreview),
    newValue: newValue || (previewUnavailable ? "preview unavailable" : patchPreview),
    patchPreview,
    previewUnavailable,
    truncated: Boolean(payload.patchTruncated)
  };
}

function getSearchCommand(event: ReplayEvent): string {
  const source = event.source?.toLowerCase();
  const pattern = getDisplayString(event, "pattern");
  const path = getDisplayString(event, "path");
  const glob = getDisplayString(event, "glob");

  if (source === "grep") return ["rg", pattern, glob, path].filter(Boolean).join(" ");
  if (source === "glob") return ["glob", pattern, path].filter(Boolean).join(" ");
  if (source === "ls") return ["ls", path || event.related_file].filter(Boolean).join(" ");
  return "";
}

function getToolCommand(event: ReplayEvent): string {
  return event.display_text ?? event.source ?? event.type;
}

function metadataComment(event: ReplayEvent): string {
  const limit = getDisplayNumber(event, "limit");
  const offset = getDisplayNumber(event, "offset");
  const parts = [
    limit !== null ? `limit: ${limit}` : null,
    offset !== null ? `offset: ${offset}` : null
  ].filter(Boolean);

  return parts.length > 0 ? `// ${parts.join(", ")}` : "";
}

function stringValue(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function isTerminalLike(event: ReplayEvent): boolean {
  return TERMINAL_TYPES.has(event.type);
}

function isEditorLike(event: ReplayEvent): boolean {
  return EDITOR_TYPES.has(event.type);
}

function isDiffLike(event: ReplayEvent): boolean {
  return DIFF_TYPES.has(event.type);
}

const TERMINAL_TYPES = new Set([
  "terminal_command",
  "terminal_command_failed",
  "terminal_output",
  "file_search",
  "search_failed",
  "list_files_failed",
  "tool_call",
  "tool_call_failed"
]);

const EDITOR_TYPES = new Set([
  "file_read",
  "file_read_failed",
  "file_snapshot",
  "file_write",
  "file_write_failed"
]);

const DIFF_TYPES = new Set(["file_diff", "file_edit_failed"]);
