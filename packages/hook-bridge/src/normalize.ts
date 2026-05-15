import type { NormalizedEventInput } from "@looma/shared";

type PartialEvent = Omit<NormalizedEventInput, "actor"> & { actor?: string };

const SKIP_TOOLS = new Set([
  "websearch", "webfetch", "web_search", "web_fetch",
  "agent", "todoread", "todowrite", "taskread", "taskcreate", "taskupdate", "tasklist"
]);

export function normalizeToolCall(
  toolName: string,
  toolInput: Record<string, unknown>,
  toolOutput: Record<string, unknown>
): PartialEvent | null {
  const normalized = toolName.toLowerCase().replace(/[-_]/g, "");

  if (SKIP_TOOLS.has(normalized)) return null;

  if (normalized === "bash" || normalized === "terminal" || normalized === "terminalcommand") {
    const command = String(toolInput.command ?? toolInput.cmd ?? "");
    return {
      type: "terminal_command",
      category: "execution",
      source: toolName,
      relatedCommand: truncate(command, 1200),
      payload: {
        command,
        exitCode: toolOutput.exitCode ?? toolOutput.exit_code,
        outputPreview: truncate(String(toolOutput.output ?? toolOutput.stdout ?? ""), 2000)
      },
      displayText: `$ ${truncate(command, 120)}`,
      sensitivity: "none"
    };
  }

  if (normalized === "read" || normalized === "readfile" || normalized === "cat") {
    const filePath = extractFilePath(toolInput);
    return {
      type: "file_read",
      category: "workspace",
      source: toolName,
      relatedFile: truncate(filePath, 600),
      payload: { path: filePath },
      displayText: `Read ${basename(filePath)}`,
      sensitivity: "none"
    };
  }

  if (normalized === "write" || normalized === "writefile" || normalized === "createfile") {
    const filePath = extractFilePath(toolInput);
    return {
      type: "file_write",
      category: "workspace",
      source: toolName,
      relatedFile: truncate(filePath, 600),
      payload: {
        path: filePath,
        contentLength: typeof toolInput.content === "string" ? toolInput.content.length : undefined
      },
      displayText: `Wrote ${basename(filePath)}`,
      sensitivity: "low"
    };
  }

  if (normalized === "edit" || normalized === "editfile" || normalized === "applydiff") {
    const filePath = extractFilePath(toolInput);
    return {
      type: "file_write",
      category: "workspace",
      source: toolName,
      relatedFile: truncate(filePath, 600),
      payload: { path: filePath, editType: "patch" },
      displayText: `Edited ${basename(filePath)}`,
      sensitivity: "low"
    };
  }

  if (normalized === "grep" || normalized === "glob" || normalized === "find" || normalized === "listfiles") {
    const pattern = String(toolInput.pattern ?? toolInput.query ?? toolInput.path ?? "");
    return {
      type: "file_read",
      category: "workspace",
      source: toolName,
      payload: { pattern, tool: toolName },
      displayText: `Search: ${truncate(pattern, 100)}`,
      sensitivity: "none"
    };
  }

  return {
    type: "tool_call",
    category: "system",
    source: toolName,
    payload: {
      tool: toolName,
      inputKeys: Object.keys(toolInput).slice(0, 10)
    },
    displayText: `Called ${toolName}`,
    sensitivity: "none"
  };
}

function extractFilePath(input: Record<string, unknown>): string {
  return String(input.file_path ?? input.filePath ?? input.path ?? "");
}

function truncate(str: string, max: number): string {
  return str.length > max ? str.slice(0, max - 3) + "..." : str;
}

function basename(filePath: string): string {
  const parts = filePath.split("/");
  return parts[parts.length - 1] || filePath;
}
