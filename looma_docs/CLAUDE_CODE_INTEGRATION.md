# Claude Code Integration

This is the current end-to-end setup for recording real Claude Code sessions in Looma.

## 1. Start Looma

```bash
bun install
bun dev
```

Open `http://localhost:3000/dashboard`, sign in, and use **Start Recording** to generate a Looma API key. The token is shown once. Do not commit it.

## 2. Install and connect the Looma agent

Use the public beta package so Claude Code does not depend on this repo's local checkout path:

```bash
npm i -g looma-agent
looma setup claude-code --app-url http://localhost:3000 --api-key <token>
LOOMA_API_URL=http://localhost:3000 LOOMA_API_KEY=<token> looma doctor
```

Then run `/mcp` in Claude Code and confirm the `looma` server exposes:

- `record_start`
- `record_event`
- `record_stop`

`record_start` writes the active session ID to `~/.looma/active_session`. `record_event` and `record_stop` can use that active session automatically, so `sessionId` is optional after start. Pass `finalOutput` to `record_stop` when the agent has a final answer; Looma stores it as a replay event and shows it on `/session/<sessionId>`.

`looma setup claude-code` writes `.mcp.json` and `.claude/settings.local.json` in the current project. Claude Code command hooks send hook input as JSON on stdin. The bridge records `PostToolUse` and `PostToolUseFailure` for `Bash`, `Read`, `Write`, `Edit`, `MultiEdit`, `Glob`, `Grep`, `LS`, and `NotebookEdit`.

## 3. Optional slash command

Create `.claude/commands/record.md` in the Claude Code project:

```md
---
description: Start or stop a Looma recording through MCP.
---

Use the Looma MCP tools for recording.

- If the user says `/record start <name>`, call `record_start` with that name, `harness: "claude-code"`, and the current workspace name.
- If the user says `/record stop`, call `record_stop` without `sessionId`; include `finalOutput` when there is a final answer to preserve.
- Do not send secrets or full file contents through `record_event`.

User arguments: $ARGUMENTS
```

This is only a UX wrapper. MCP tools and hooks remain the source of truth.

## 4. Manual E2E

1. Run `/record start "Claude Code smoke test"` or ask Claude to call `record_start`.
2. Let Claude run a harmless `Read`, `Bash`, and edit in a throwaway workspace.
3. Open the returned `/session/<sessionId>` URL and confirm the recording indicator and event count update while the session is active.
4. Run `/record stop` or call `record_stop`.
5. Confirm the session moves through `processing` and reaches the replay page with events, final output when provided, markers, chapters, notes, and behavior summary.
