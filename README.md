# Looma

Looma is the Loom for autonomous coding agents: a replay-native review layer that records long-running agent work and turns it into a shareable replay artifact.

Autonomous coding agents can read files, run commands, edit code, fail tests, retry, install dependencies, and eventually hand back a final answer. The raw logs behind that process are hard to review, hard to trust, and hard to share. Looma turns the run into one replay page with a synchronized timeline, terminal output, diffs, snapshots, test results, chapters, AI notes, and Needs Review markers.

> Development status: Looma is under active development. This README describes the PRD target and MVP behavior; some implementation details are still evolving.

## Overview

Looma is built for developers, tech leads, reviewers, and tool builders who use autonomous coding agents such as Claude Code, Codex, OpenCode, OpenClaw, Cline, Aider, or custom harnesses.

The goal is not to judge whether the agent was correct. Looma helps humans answer the practical review questions:

- What did the agent do?
- Which files did it read or change?
- Which commands and tests ran?
- Did it fail, retry, and recover?
- Which parts should be reviewed first?
- Can this session be shared with another developer?

The public replay route is:

```text
/sessions/{sessionId}
```

Replay data is served internally by:

```text
GET /api/sessions/{sessionId}/replay
```

## Key Features

- **Shareable replay artifact**: one compact page for the full agent session.
- **Video-like timeline**: play, pause, scrub, jump to markers, and inspect colored progress segments.
- **MCP integration**: `record_start`, `record_event`, and `record_stop` tools for agent harnesses that support Model Context Protocol.
- **Hook bridge**: captures agent tool calls implicitly while a recording is active.
- **Transcript import**: JSON/JSONL import path for existing agent logs.
- **Normalized event capture**: converts mixed harness events into Looma's coding-native schema.
- **Redaction**: masks secrets, tokens, passwords, and sensitive env values before replay.
- **lens-agent processing**: intended post-processing layer for chapters, Needs Review markers, behavior summary, and AI session notes.
- **Shareable replay link**: completed sessions return a `/sessions/{sessionId}` URL.

## Architecture

```mermaid
flowchart LR
  A[Agent Harness] --> B[MCP Tools]
  A --> C[Hook Bridge]
  A --> D[Transcript Import]
  B --> E[Looma API]
  C --> E
  D --> E
  E --> F[(Supabase Postgres)]
  F --> G[lens-agent Processing]
  G --> F
  F --> H[Replay Page /sessions/{sessionId}]
```

PRD-level flow:

1. The agent or user starts recording through MCP, `/record`, hooks, or transcript import.
2. Looma creates a session and captures normalized events such as `terminal_command`, `file_diff`, `test_result`, and `session_stop`.
3. Sensitive payload fields are redacted before review data is exposed.
4. Processing generates chapters, Needs Review markers, behavior summary, and session notes.
5. The replay page renders the session as a shareable artifact.

## Installation

Requirements:

- Bun `1.3.10` or newer compatible with the repo lockfile.
- A Supabase project for Auth and Postgres.

Install dependencies:

```bash
bun install
cp .env.example .env.local
```

Set the values in `.env.local`, then apply the database foundation migration from:

```text
supabase/migrations/20260514150000_looma_foundation.sql
```

Use your Supabase workflow for migrations, for example Supabase CLI `db push` against the linked project or the SQL editor for local development.

## Running Locally

Start the web app:

```bash
bun run dev
```

For public beta installs, use the packaged agent bridge instead of repo-local paths:

```bash
npm i -g looma-agent
looma setup claude-code --app-url http://localhost:3000 --api-key <token>
LOOMA_API_URL=http://localhost:3000 LOOMA_API_KEY=<token> looma doctor
```

Generate `LOOMA_API_KEY` from the authenticated dashboard setup panel. Looma shows the token once and stores only a SHA-256 hash in `api_keys`.

Verification commands:

```bash
bun run typecheck
bun run lint
bun run build
```

## Environment Variables

| Variable | Scope | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_APP_URL` | Public | Base URL used to build replay links, usually `http://localhost:3000` locally. |
| `NEXT_PUBLIC_SUPABASE_URL` | Public | Supabase project URL used by the web app. |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Public | Supabase publishable key used by browser and SSR clients. |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only | Service role key used by server routes for privileged session/event access. Do not expose this to the browser. |
| `LOOMA_API_URL` | Server/tooling | Base Looma web URL for MCP and hook bridge calls, usually `http://localhost:3000`. |
| `LOOMA_API_KEY` | Server/tooling | Bearer token used by MCP and hook bridge requests to Looma API routes. |

## Demo Flow

Two-minute judge-friendly path:

1. Start the web app and open the dashboard.
2. Open **Start Recording** and generate a Looma API key.
3. Install `looma-agent` and run the setup command from the setup panel.
4. Verify `/mcp` shows Looma tools.
5. Start a recording from the agent harness with `record_start` or `/record start`.
6. Let the agent run; hooks capture `Bash`, `Read`, `Write`, `Edit`, `MultiEdit`, `Glob`, `Grep`, `LS`, and failures.
7. Show normalized events appearing in Looma.
8. Stop the recording with `record_stop` or `/record stop`.
6. Open the returned `/sessions/{sessionId}` replay link.
7. Review the timeline, terminal output, diffs, test results, chapters, AI notes, and Needs Review markers.

## Example Input/Output

### `record_start`

Input:

```json
{
  "name": "Add JWT auth with refresh token",
  "harness": "claude-code",
  "agentName": "Claude",
  "workspaceName": "api-service"
}
```

Output:

```json
{
  "sessionId": "2c0e9a50-9f8d-4e74-9cf8-4cb4c9b678e1",
  "status": "recording",
  "replayUrl": "http://localhost:3000/sessions/2c0e9a50-9f8d-4e74-9cf8-4cb4c9b678e1"
}
```

### `record_event`

Input:

```json
{
  "sessionId": "2c0e9a50-9f8d-4e74-9cf8-4cb4c9b678e1",
  "type": "terminal_command",
  "category": "execution",
  "source": "hook",
  "actor": "agent",
  "workspacePath": "/workspace/api-service",
  "relatedCommand": "bun test auth",
  "payload": {
    "command": "bun test auth",
    "exitCode": 1
  },
  "displayText": "Agent ran auth tests and saw one failure.",
  "sensitivity": "none"
}
```

Output:

```json
{
  "eventId": "9ee86542-9499-4da3-a72f-5c3a3c54dfb4",
  "seq": 12,
  "redactionApplied": false
}
```

### `record_stop`

Input:

```json
{
  "sessionId": "2c0e9a50-9f8d-4e74-9cf8-4cb4c9b678e1"
}
```

Output:

```json
{
  "sessionId": "2c0e9a50-9f8d-4e74-9cf8-4cb4c9b678e1",
  "status": "processing",
  "replayUrl": "http://localhost:3000/sessions/2c0e9a50-9f8d-4e74-9cf8-4cb4c9b678e1"
}
```

### Replay Response Shape

```json
{
  "session": {
    "id": "2c0e9a50-9f8d-4e74-9cf8-4cb4c9b678e1",
    "name": "Add JWT auth with refresh token",
    "status": "replay_ready",
    "harness": "claude-code"
  },
  "events": [],
  "markers": [],
  "chapters": [],
  "behaviorSummary": {},
  "notes": "The agent implemented auth changes, ran tests, fixed a failure, and produced a replay-ready session.",
  "redactionSummary": {}
}
```

## Project Structure

```text
apps/web/                         Next.js 16 App Router web app
apps/web/app/api/sessions/        Recording, event, stop, process, and replay API routes
apps/web/app/sessions/[sessionId]/ Public replay page route
packages/shared/                  Shared Zod schemas, event contracts, and redaction helpers
packages/looma-agent/             Publishable CLI package with looma, looma-mcp, and looma-hook bins
packages/mcp-server/              Local stdio MCP server exposing record_start/event/stop
packages/hook-bridge/             Agent hook bridge for implicit tool-call capture
supabase/migrations/              Supabase Postgres schema migrations
samples/transcripts/              Sample transcript input for import/demo flows
looma_docs/PRD.md                 Product source of truth
looma_docs/TECHNICAL_GUIDELINES.md Technical guidance and implementation notes
```

## Workspace Commands

```bash
bun run dev          # next dev in apps/web
bun run build        # build all workspaces
bun run lint         # lint/type lint all workspaces
bun run typecheck    # tsc --noEmit all workspaces
bun run mcp          # start packages/mcp-server
```
