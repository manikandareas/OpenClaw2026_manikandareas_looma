import { redactString } from "./redaction";
import type { NormalizedEventInput } from "./schemas";

type PartialEvent = Omit<NormalizedEventInput, "actor"> & { actor?: string };

const TEXT_PREVIEW_LIMIT = 4_000;
const PATCH_PREVIEW_LIMIT = 6_000;
const COMMAND_PREVIEW_LIMIT = 1_200;

export type ClaudeHookInput = {
  session_id?: string;
  transcript_path?: string;
  cwd?: string;
  hook_event_name?: string;
  tool_name?: string;
  tool_input?: Record<string, unknown>;
  tool_response?: unknown;
  tool_use_id?: string;
  error?: string;
  is_interrupt?: boolean;
  duration_ms?: number;
};

const SKIP_TOOLS = new Set([
  "mcp__looma__record_start",
  "mcp__looma__record_event",
  "mcp__looma__record_stop",
  "agent",
  "todoread",
  "todowrite",
  "taskread",
  "taskcreate",
  "taskupdate",
  "tasklist",
  "websearch",
  "webfetch",
  "web_search",
  "web_fetch",
]);

export function normalizeClaudeHook(input: ClaudeHookInput): PartialEvent | null {
  const toolName = input.tool_name;
  const hookEventName = input.hook_event_name;

  if (!toolName || (hookEventName !== "PostToolUse" && hookEventName !== "PostToolUseFailure")) {
    return null;
  }

  if (SKIP_TOOLS.has(normalizeToolName(toolName))) return null;

  const toolInput = isRecord(input.tool_input) ? input.tool_input : {};
  const failed = hookEventName === "PostToolUseFailure";
  const basePayload = {
    claudeSessionId: input.session_id,
    transcriptPath: input.transcript_path,
    toolUseId: input.tool_use_id,
    durationMs: input.duration_ms,
    failed,
    error: failed ? truncate(input.error ?? "Tool execution failed", 1000) : undefined,
    isInterrupt: input.is_interrupt,
  };

  return normalizeToolCall({
    toolName,
    toolInput,
    toolResponse: input.tool_response,
    workspacePath: input.cwd,
    failed,
    basePayload,
  });
}

function normalizeToolCall({
  toolName,
  toolInput,
  toolResponse,
  workspacePath,
  failed,
  basePayload,
}: {
  toolName: string;
  toolInput: Record<string, unknown>;
  toolResponse: unknown;
  workspacePath: string | undefined;
  failed: boolean;
  basePayload: Record<string, unknown>;
}): PartialEvent {
  const normalized = normalizeToolName(toolName);

  if (normalized === "bash") {
    const command = String(toolInput.command ?? "");
    const commandPreview = previewText(command, COMMAND_PREVIEW_LIMIT).text ?? "";
    const responsePreview = previewToolResponse(toolResponse);
    return {
      type: failed ? "terminal_command_failed" : "terminal_command",
      category: "execution",
      source: toolName,
      workspacePath,
      relatedCommand: commandPreview,
      payload: {
        ...basePayload,
        command: commandPreview,
        description: stringOrUndefined(toolInput.description),
        outputPreview: responsePreview.text,
        stdoutPreview: responsePreview.stdout,
        stderrPreview: responsePreview.stderr,
        outputTruncated: responsePreview.truncated,
        exitCode: numberOrUndefinedFromRecord(toolResponse, "exitCode"),
        status: stringOrUndefinedFromRecord(toolResponse, "status"),
      },
      displayText: failed ? `Failed: ${truncate(commandPreview, 110)}` : `$ ${truncate(commandPreview, 120)}`,
      sensitivity: "none",
    };
  }

  if (normalized === "read") {
    const filePath = extractFilePath(toolInput);
    const responsePreview = previewToolResponse(toolResponse);
    const offset = numberOrUndefined(toolInput.offset);
    return {
      type: failed ? "file_read_failed" : "file_read",
      category: failed ? "review" : "workspace",
      source: toolName,
      workspacePath,
      relatedFile: truncate(filePath, 600),
      payload: {
        ...basePayload,
        path: filePath,
        limit: numberOrUndefined(toolInput.limit),
        offset,
        line: offset ? offset + 1 : undefined,
        contentPreview: responsePreview.text,
        contentLineCount: responsePreview.text ? responsePreview.text.split("\n").length : undefined,
        contentTruncated: responsePreview.truncated,
      },
      displayText: failed ? `Failed reading ${basename(filePath)}` : `Read ${basename(filePath)}`,
      sensitivity: "none",
    };
  }

  if (normalized === "write") {
    const filePath = extractFilePath(toolInput);
    const contentPreview = previewText(stringOrUndefined(toolInput.content), TEXT_PREVIEW_LIMIT);
    const responsePreview = previewToolResponse(toolResponse);
    return {
      type: failed ? "file_write_failed" : "file_write",
      category: failed ? "review" : "workspace",
      source: toolName,
      workspacePath,
      relatedFile: truncate(filePath, 600),
      payload: {
        ...basePayload,
        path: filePath,
        contentLength: typeof toolInput.content === "string" ? toolInput.content.length : undefined,
        contentPreview: contentPreview.text,
        contentTruncated: contentPreview.truncated,
        outputPreview: responsePreview.text,
      },
      displayText: failed ? `Failed writing ${basename(filePath)}` : `Wrote ${basename(filePath)}`,
      sensitivity: "low",
    };
  }

  if (normalized === "edit" || normalized === "multiedit" || normalized === "notebookedit") {
    const filePath = extractFilePath(toolInput);
    const editPreview = previewEdit(toolInput);
    const responsePreview = previewToolResponse(toolResponse);
    return {
      type: failed ? "file_edit_failed" : "file_diff",
      category: failed ? "review" : "workspace",
      source: toolName,
      workspacePath,
      relatedFile: truncate(filePath, 600),
      payload: {
        ...basePayload,
        path: filePath,
        editType: normalized,
        replacementLength: typeof toolInput.new_string === "string" ? toolInput.new_string.length : undefined,
        editCount: Array.isArray(toolInput.edits) ? toolInput.edits.length : undefined,
        oldStringPreview: editPreview.oldString,
        newStringPreview: editPreview.newString,
        patchPreview: editPreview.patch,
        patchTruncated: editPreview.truncated,
        outputPreview: responsePreview.text,
      },
      displayText: failed ? `Failed editing ${basename(filePath)}` : `Edited ${basename(filePath)}`,
      sensitivity: "low",
    };
  }

  if (normalized === "glob" || normalized === "grep") {
    const pattern = String(toolInput.pattern ?? "");
    const path = stringOrUndefined(toolInput.path);
    const responsePreview = previewToolResponse(toolResponse);
    return {
      type: failed ? "search_failed" : "file_search",
      category: failed ? "review" : "workspace",
      source: toolName,
      workspacePath,
      relatedFile: path ? truncate(path, 600) : undefined,
      payload: {
        ...basePayload,
        pattern,
        path,
        glob: stringOrUndefined(toolInput.glob),
        resultPreview: responsePreview.text,
        resultTruncated: responsePreview.truncated,
      },
      displayText: failed ? `Failed search: ${truncate(pattern, 90)}` : `Search: ${truncate(pattern, 100)}`,
      sensitivity: "none",
    };
  }

  if (normalized === "ls") {
    const path = extractFilePath(toolInput);
    const responsePreview = previewToolResponse(toolResponse);
    return {
      type: failed ? "list_files_failed" : "file_search",
      category: failed ? "review" : "workspace",
      source: toolName,
      workspacePath,
      relatedFile: truncate(path, 600),
      payload: {
        ...basePayload,
        path,
        resultPreview: responsePreview.text,
        resultTruncated: responsePreview.truncated,
      },
      displayText: failed ? `Failed listing ${basename(path)}` : `Listed ${basename(path)}`,
      sensitivity: "none",
    };
  }

  return {
    type: failed ? "tool_call_failed" : "tool_call",
    category: failed ? "review" : "system",
    source: toolName,
    workspacePath,
    payload: {
      ...basePayload,
      tool: toolName,
      inputKeys: Object.keys(toolInput).slice(0, 10),
      outputPreview: previewToolResponse(toolResponse).text,
    },
    displayText: failed ? `Failed ${toolName}` : `Called ${toolName}`,
    sensitivity: "none",
  };
}

function previewToolResponse(value: unknown): {
  text: string | undefined;
  stdout: string | undefined;
  stderr: string | undefined;
  truncated: boolean;
} {
  if (value == null) {
    return { text: undefined, stdout: undefined, stderr: undefined, truncated: false };
  }

  if (typeof value === "string") {
    const preview = previewText(value, TEXT_PREVIEW_LIMIT);
    return { text: preview.text, stdout: undefined, stderr: undefined, truncated: preview.truncated };
  }

  if (Array.isArray(value)) {
    const preview = previewText(JSON.stringify(value.slice(0, 20), null, 2), TEXT_PREVIEW_LIMIT);
    return { text: preview.text, stdout: undefined, stderr: undefined, truncated: preview.truncated || value.length > 20 };
  }

  if (isRecord(value)) {
    const stdout = stringOrUndefined(value.stdout);
    const stderr = stringOrUndefined(value.stderr);
    const text =
      stringOrUndefined(value.text) ??
      stringOrUndefined(value.output) ??
      stringOrUndefined(value.content) ??
      stringOrUndefined(value.result);
    const joined = [stdout, stderr, text].filter(Boolean).join("\n");
    const preview = previewText(joined || JSON.stringify(value, null, 2), TEXT_PREVIEW_LIMIT);

    return {
      text: preview.text,
      stdout: previewText(stdout, TEXT_PREVIEW_LIMIT).text,
      stderr: previewText(stderr, TEXT_PREVIEW_LIMIT).text,
      truncated: preview.truncated,
    };
  }

  const preview = previewText(String(value), TEXT_PREVIEW_LIMIT);
  return { text: preview.text, stdout: undefined, stderr: undefined, truncated: preview.truncated };
}

function normalizeToolName(toolName: string): string {
  return toolName.toLowerCase().replace(/[-\s]/g, "");
}

function extractFilePath(input: Record<string, unknown>): string {
  return String(input.file_path ?? input.filePath ?? input.path ?? input.notebook_path ?? "");
}

function stringOrUndefined(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function numberOrUndefined(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function numberOrUndefinedFromRecord(value: unknown, key: string): number | undefined {
  return isRecord(value) ? numberOrUndefined(value[key]) : undefined;
}

function stringOrUndefinedFromRecord(value: unknown, key: string): string | undefined {
  return isRecord(value) ? stringOrUndefined(value[key]) : undefined;
}

function previewText(value: string | undefined, max: number): { text: string | undefined; truncated: boolean } {
  if (!value) return { text: undefined, truncated: false };
  const redacted = redactString(value).value;
  return {
    text: truncate(redacted, max),
    truncated: redacted.length > max,
  };
}

function previewEdit(input: Record<string, unknown>): {
  oldString: string | undefined;
  newString: string | undefined;
  patch: string | undefined;
  truncated: boolean;
} {
  if (Array.isArray(input.edits)) {
    const chunks = input.edits
      .slice(0, 12)
      .filter(isRecord)
      .map((edit, index) => {
        const oldString = stringOrUndefined(edit.old_string) ?? "";
        const newString = stringOrUndefined(edit.new_string) ?? "";
        return [`# edit ${index + 1}`, "--- before", oldString, "+++ after", newString].join("\n");
      });
    const preview = previewText(chunks.join("\n\n"), PATCH_PREVIEW_LIMIT);
    return {
      oldString: undefined,
      newString: undefined,
      patch: preview.text,
      truncated: preview.truncated || input.edits.length > 12,
    };
  }

  const oldPreview = previewText(stringOrUndefined(input.old_string), TEXT_PREVIEW_LIMIT);
  const newPreview = previewText(stringOrUndefined(input.new_string), TEXT_PREVIEW_LIMIT);
  const patch = previewText(
    [oldPreview.text ? "--- before\n" + oldPreview.text : "", newPreview.text ? "+++ after\n" + newPreview.text : ""]
      .filter(Boolean)
      .join("\n"),
    PATCH_PREVIEW_LIMIT
  );

  return {
    oldString: oldPreview.text,
    newString: newPreview.text,
    patch: patch.text,
    truncated: oldPreview.truncated || newPreview.truncated || patch.truncated,
  };
}

function truncate(str: string, max: number): string {
  return str.length > max ? `${str.slice(0, max - 3)}...` : str;
}

function basename(filePath: string): string {
  const parts = filePath.split("/");
  return parts[parts.length - 1] || filePath || "workspace";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
