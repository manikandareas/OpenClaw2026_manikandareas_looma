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
        outputPreview: "pass",
        stdoutPreview: "pass"
      }
    });
  });

  test("captures Bash failure output preview with exit metadata", () => {
    const event = normalizeClaudeHook({
      hook_event_name: "PostToolUseFailure",
      tool_name: "Bash",
      tool_input: { command: "bun lint" },
      tool_response: {
        stdout: "",
        stderr: "error: no lint script",
        exitCode: 1,
        status: "failed"
      },
      error: "Command exited with non-zero status code 1"
    });

    expect(event).toMatchObject({
      type: "terminal_command_failed",
      payload: {
        command: "bun lint",
        outputPreview: "error: no lint script",
        stderrPreview: "error: no lint script",
        exitCode: 1,
        status: "failed",
        failed: true
      }
    });
  });

  test("captures Read content preview and truncation metadata", () => {
    const longContent = `${"line\n".repeat(900)}secret=sk-test1234567890`;
    const event = normalizeClaudeHook({
      hook_event_name: "PostToolUse",
      tool_name: "Read",
      tool_input: { file_path: "/workspace/app/a.ts", offset: 9, limit: 20 },
      tool_response: longContent
    });

    expect(event).toMatchObject({
      type: "file_read",
      relatedFile: "/workspace/app/a.ts",
      payload: {
        path: "/workspace/app/a.ts",
        offset: 9,
        limit: 20,
        line: 10,
        contentTruncated: true
      }
    });
    expect(String(event?.payload.contentPreview).length).toBeLessThanOrEqual(4000);
    expect(String(event?.payload.contentPreview)).not.toContain("sk-test1234567890");
  });

  test("captures Grep, Glob, and LS result previews", () => {
    for (const [toolName, toolInput] of [
      ["Grep", { pattern: "ReplayShell", path: "/workspace/app" }],
      ["Glob", { pattern: "**/*.tsx", path: "/workspace/app" }],
      ["LS", { path: "/workspace/app" }]
    ] satisfies Array<[string, Record<string, unknown>]>) {
      const event = normalizeClaudeHook({
        hook_event_name: "PostToolUse",
        tool_name: toolName,
        tool_input: toolInput,
        tool_response: "apps/web/features/replay/components/replay-shell.tsx"
      });

      expect(event).toMatchObject({
        type: "file_search",
        payload: {
          resultPreview: "apps/web/features/replay/components/replay-shell.tsx",
          resultTruncated: false
        }
      });
    }
  });

  test("captures edit patch preview for diff replay", () => {
    const event = normalizeClaudeHook({
      hook_event_name: "PostToolUse",
      tool_name: "Edit",
      tool_input: {
        file_path: "/workspace/app/a.ts",
        old_string: "const label = 'old';",
        new_string: "const label = 'new';"
      },
      tool_response: "updated"
    });

    expect(event).toMatchObject({
      type: "file_diff",
      payload: {
        oldStringPreview: "const label = 'old';",
        newStringPreview: "const label = 'new';",
        patchPreview: "--- before\nconst label = 'old';\n+++ after\nconst label = 'new';"
      }
    });
  });

  const toolCases: Array<[string, Record<string, unknown>, string]> = [
    ["Read", { file_path: "/workspace/app/package.json" }, "file_read"],
    ["Write", { file_path: "/workspace/app/a.ts", content: "export {}" }, "file_write"],
    ["Edit", { file_path: "/workspace/app/a.ts", old_string: "a", new_string: "b" }, "file_diff"],
    ["MultiEdit", { file_path: "/workspace/app/a.ts", edits: [{ old_string: "a", new_string: "b" }] }, "file_diff"],
    ["Glob", { pattern: "**/*.ts", path: "/workspace/app" }, "file_search"],
    ["Grep", { pattern: "useReplay", path: "/workspace/app" }, "file_search"],
    ["LS", { path: "/workspace/app" }, "file_search"],
    ["NotebookEdit", { notebook_path: "/workspace/app/demo.ipynb", new_string: "print(1)" }, "file_diff"]
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
