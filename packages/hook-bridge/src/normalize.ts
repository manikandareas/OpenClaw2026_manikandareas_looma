import type { NormalizedEventInput } from "@looma/shared";

type PartialEvent = Omit<NormalizedEventInput, "actor"> & { actor?: string };

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
  "web_fetch"
]);

export function normalizeClaudeHook(input: ClaudeHookInput): PartialEvent | null {
  const toolName = input.tool_name;
  const hookEventName = input.hook_event_name;

  if (
    !toolName ||
    (hookEventName !== "PostToolUse" && hookEventName !== "PostToolUseFailure")
  ) {
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
    isInterrupt: input.is_interrupt
  };

  return normalizeToolCall({
    toolName,
    toolInput,
    toolResponse: input.tool_response,
    workspacePath: input.cwd,
    failed,
    basePayload
  });
}

function normalizeToolCall({
  toolName,
  toolInput,
  toolResponse,
  workspacePath,
  failed,
  basePayload
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
    return {
      type: failed ? "terminal_command_failed" : "terminal_command",
      category: "execution",
      source: toolName,
      workspacePath,
      relatedCommand: truncate(command, 1200),
      payload: {
        ...basePayload,
        command,
        description: stringOrUndefined(toolInput.description),
        outputPreview: previewToolResponse(toolResponse)
      },
      displayText: failed ? `Failed: ${truncate(command, 110)}` : `$ ${truncate(command, 120)}`,
      sensitivity: "none"
    };
  }

  if (normalized === "read") {
    const filePath = extractFilePath(toolInput);
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
        offset: numberOrUndefined(toolInput.offset)
      },
      displayText: failed ? `Failed reading ${basename(filePath)}` : `Read ${basename(filePath)}`,
      sensitivity: "none"
    };
  }

  if (normalized === "write") {
    const filePath = extractFilePath(toolInput);
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
        outputPreview: previewToolResponse(toolResponse)
      },
      displayText: failed ? `Failed writing ${basename(filePath)}` : `Wrote ${basename(filePath)}`,
      sensitivity: "low"
    };
  }

  if (normalized === "edit" || normalized === "multiedit" || normalized === "notebookedit") {
    const filePath = extractFilePath(toolInput);
    return {
      type: failed ? "file_edit_failed" : "file_write",
      category: failed ? "review" : "workspace",
      source: toolName,
      workspacePath,
      relatedFile: truncate(filePath, 600),
      payload: {
        ...basePayload,
        path: filePath,
        editType: normalized,
        replacementLength:
          typeof toolInput.new_string === "string" ? toolInput.new_string.length : undefined,
        editCount: Array.isArray(toolInput.edits) ? toolInput.edits.length : undefined,
        outputPreview: previewToolResponse(toolResponse)
      },
      displayText: failed ? `Failed editing ${basename(filePath)}` : `Edited ${basename(filePath)}`,
      sensitivity: "low"
    };
  }

  if (normalized === "glob" || normalized === "grep") {
    const pattern = String(toolInput.pattern ?? "");
    const path = stringOrUndefined(toolInput.path);
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
        outputPreview: previewToolResponse(toolResponse)
      },
      displayText: failed ? `Failed search: ${truncate(pattern, 90)}` : `Search: ${truncate(pattern, 100)}`,
      sensitivity: "none"
    };
  }

  if (normalized === "ls") {
    const path = extractFilePath(toolInput);
    return {
      type: failed ? "list_files_failed" : "file_search",
      category: failed ? "review" : "workspace",
      source: toolName,
      workspacePath,
      relatedFile: truncate(path, 600),
      payload: {
        ...basePayload,
        path,
        outputPreview: previewToolResponse(toolResponse)
      },
      displayText: failed ? `Failed listing ${basename(path)}` : `Listed ${basename(path)}`,
      sensitivity: "none"
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
      outputPreview: previewToolResponse(toolResponse)
    },
    displayText: failed ? `Failed ${toolName}` : `Called ${toolName}`,
    sensitivity: "none"
  };
}

function normalizeToolName(toolName: string): string {
  return toolName.toLowerCase().replace(/[-\s]/g, "");
}

function extractFilePath(input: Record<string, unknown>): string {
  return String(input.file_path ?? input.filePath ?? input.path ?? input.notebook_path ?? "");
}

function previewToolResponse(value: unknown): string | undefined {
  if (value == null) return undefined;

  if (typeof value === "string") {
    return truncate(value, 1200);
  }

  if (Array.isArray(value)) {
    return truncate(JSON.stringify(value.slice(0, 3)), 1200);
  }

  if (isRecord(value)) {
    const stdout = stringOrUndefined(value.stdout);
    const stderr = stringOrUndefined(value.stderr);
    const text = stringOrUndefined(value.text) ?? stringOrUndefined(value.output);
    return truncate([stdout, stderr, text].filter(Boolean).join("\n"), 1200) || undefined;
  }

  return truncate(String(value), 1200);
}

function stringOrUndefined(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function numberOrUndefined(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
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
