# Looma

Looma is a replay-native review layer for autonomous coding agents.

## Stack

- Bun workspaces
- Next.js App Router in `apps/web`
- Supabase Auth and Postgres foundation
- Shared Zod schemas in `packages/shared`
- Local stdio MCP server in `packages/mcp-server`

## Setup

```bash
bun install
cp .env.example .env.local
bun run typecheck
bun run lint
bun run build
```

## Routes

- `/`
- `/login`
- `/signup`
- `/dashboard`
- `/sessions`
- `/import`
- `/session/[sessionId]`

The public read-only share route is `/session/[sessionId]`. Internal replay data is exposed by `GET /api/sessions/[sessionId]/replay`.

## MCP

```bash
LOOMA_API_URL=http://localhost:3000 LOOMA_API_KEY=... bun run mcp
```

Available tools:

- `record_start`
- `record_event`
- `record_stop`

MCP responses return share links in the `/session/{sessionId}` format.
