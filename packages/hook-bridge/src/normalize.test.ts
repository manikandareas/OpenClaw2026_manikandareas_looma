import { describe, expect, test } from "bun:test";
import { normalizeClaudeHook } from "./normalize";

describe("normalizeClaudeHook", () => {
  test("normalizes Claude Code Bash PostToolUse input", () => {
    const event = normalizeClaudeHook({
      session_id: "claude-session",
      transcript_path: "/tmp/transcript.jsonl",
      cwd: "/workspace/app",
      hook_event_name: "PostToolUse",
      tool_name: "Bash",
      tool_use_id: "toolu_123",
      tool_input: {
        command: "bun test",
        description: "Run tests"
      },
      tool_response: {
        stdout: "pass",
        stderr: "",
        interrupted: false,
        isImage: false
      },
      duration_ms: 410
    });

    expect(event).toMatchObject({
      type: "terminal_command",
      category: "execution",
      source: "Bash",
      workspacePath: "/workspace/app",
      relatedCommand: "bun test",
      displayText: "$ bun test",
      payload: {
        claudeSessionId: "claude-session",
        transcriptPath: "/tmp/transcript.jsonl",
        toolUseId: "toolu_123",
        durationMs: 410,
        command: "bun test",
        outputPreview: "pass"
      }
    });
  });

  const toolCases: Array<[string, Record<string, unknown>, string]> = [
    ["Read", { file_path: "/workspace/app/package.json" }, "file_read"],
    ["Write", { file_path: "/workspace/app/a.ts", content: "export {}" }, "file_write"],
    ["Edit", { file_path: "/workspace/app/a.ts", old_string: "a", new_string: "b" }, "file_write"],
    ["MultiEdit", { file_path: "/workspace/app/a.ts", edits: [{ old_string: "a", new_string: "b" }] }, "file_write"],
    ["Glob", { pattern: "**/*.ts", path: "/workspace/app" }, "file_search"],
    ["Grep", { pattern: "useReplay", path: "/workspace/app" }, "file_search"],
    ["LS", { path: "/workspace/app" }, "file_search"],
    ["NotebookEdit", { notebook_path: "/workspace/app/demo.ipynb", new_string: "print(1)" }, "file_write"]
  ];

  for (const [toolName, toolInput, expectedType] of toolCases) {
    test(`normalizes ${toolName}`, () => {
      const event = normalizeClaudeHook({
        hook_event_name: "PostToolUse",
        tool_name: toolName,
        tool_input: toolInput
      });

      expect(event?.type).toBe(expectedType);
      expect(event?.source).toBe(toolName);
    });
  }

  test("normalizes Claude Code PostToolUseFailure input", () => {
    const event = normalizeClaudeHook({
      hook_event_name: "PostToolUseFailure",
      tool_name: "Bash",
      tool_input: { command: "bun lint" },
      tool_use_id: "toolu_fail",
      error: "Command exited with non-zero status code 1",
      duration_ms: 1000
    });

    expect(event).toMatchObject({
      type: "terminal_command_failed",
      category: "execution",
      source: "Bash",
      relatedCommand: "bun lint",
      displayText: "Failed: bun lint",
      payload: {
        failed: true,
        error: "Command exited with non-zero status code 1",
        toolUseId: "toolu_fail",
        durationMs: 1000
      }
    });
  });

  test("ignores unsupported hook events and Looma MCP self-calls", () => {
    expect(
      normalizeClaudeHook({
        hook_event_name: "PreToolUse",
        tool_name: "Bash",
        tool_input: { command: "pwd" }
      })
    ).toBeNull();

    expect(
      normalizeClaudeHook({
        hook_event_name: "PostToolUse",
        tool_name: "mcp__looma__record_event",
        tool_input: {}
      })
    ).toBeNull();
  });
});
