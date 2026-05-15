# Claude Code Integration

This is the current end-to-end setup for recording real Claude Code sessions in Looma.

## 1. Start Looma

```bash
bun install
bun dev
```

Open `http://localhost:3000/dashboard`, sign in, and use **Start Recording** to generate a Looma API key. The token is shown once. Do not commit it.

## 2. Add the MCP server

Use a local or user-scoped Claude Code MCP config so the token stays private:

```bash
claude mcp add --transport stdio --env LOOMA_API_URL=http://localhost:3000 --env LOOMA_API_KEY=<token> looma -- bun /abs/path/packages/mcp-server/src/index.ts
```

Then run `/mcp` in Claude Code and confirm the `looma` server exposes:

- `record_start`
- `record_event`
- `record_stop`

`record_start` writes the active session ID to `~/.looma/active_session`. `record_event` and `record_stop` can use that active session automatically, so `sessionId` is optional after start.

## 3. Build the hook bridge

```bash
bun run hook-bridge:build
```

## 4. Add Claude Code hooks

Add this to `.claude/settings.local.json` in the project where Claude Code will run. This file is local-only and should not be committed.

```json
{
  "env": {
    "LOOMA_API_URL": "http://localhost:3000",
    "LOOMA_API_KEY": "<token>"
  },
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": "node",
            "args": ["/abs/path/packages/hook-bridge/dist/index.js"],
            "async": true,
            "timeout": 30
          }
        ]
      }
    ],
    "PostToolUseFailure": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": "node",
            "args": ["/abs/path/packages/hook-bridge/dist/index.js"],
            "async": true,
            "timeout": 30
          }
        ]
      }
    ]
  }
}
```

Claude Code command hooks send hook input as JSON on stdin. The bridge records `PostToolUse` and `PostToolUseFailure` for `Bash`, `Read`, `Write`, `Edit`, `MultiEdit`, `Glob`, `Grep`, `LS`, and `NotebookEdit`.

## 5. Optional slash command

Create `.claude/commands/record.md` in the Claude Code project:

```md
---
description: Start or stop a Looma recording through MCP.
---

Use the Looma MCP tools for recording.

- If the user says `/record start <name>`, call `record_start` with that name, `harness: "claude-code"`, and the current workspace name.
- If the user says `/record stop`, call `record_stop` without `sessionId`; Looma reads `~/.looma/active_session`.
- Do not send secrets or full file contents through `record_event`.

User arguments: $ARGUMENTS
```

This is only a UX wrapper. MCP tools and hooks remain the source of truth.

## 6. Manual E2E

1. Run `/record start "Claude Code smoke test"` or ask Claude to call `record_start`.
2. Let Claude run a harmless `Read`, `Bash`, and edit in a throwaway workspace.
3. Open the returned `/session/<sessionId>` URL and confirm the recording indicator and event count update while the session is active.
4. Run `/record stop` or call `record_stop`.
5. Confirm the session moves through `processing` and reaches the replay page with events, markers, chapters, notes, and behavior summary.
