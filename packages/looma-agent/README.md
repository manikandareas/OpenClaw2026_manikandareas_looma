# looma-agent

Local Looma bridge for public beta users.

Links:

- Live app: <https://looma-gold.vercel.app>
- Demo replay: <https://looma-gold.vercel.app/sessions/demo>
- NPM package: <https://www.npmjs.com/package/looma-agent>

```bash
npm i -g looma-agent@beta
looma setup claude-code --app-url https://looma-gold.vercel.app --api-key looma_xxx
looma doctor
looma doctor --e2e
```

The public beta app URL is `https://looma-gold.vercel.app`. If `LOOMA_API_URL` and `NEXT_PUBLIC_APP_URL` are not set, the agent bridge falls back to that domain.

Bins:

- `looma` / `looma-agent` - setup, doctor, and command dispatcher.
- `looma-mcp` - stdio MCP server exposing `record_start`, `record_event`, and `record_stop`.
- `looma-hook` - Claude Code hook bridge that forwards tool events to the active Looma session.

`looma setup claude-code` writes deterministic Claude Code config:

- `.mcp.json` starts Looma through the installed CLI entrypoint with an absolute path.
- `.claude/settings.local.json` installs async `PostToolUse` and `PostToolUseFailure` hooks with the same absolute entrypoint.
- `LOOMA_API_URL` and `LOOMA_API_KEY` are scoped to the generated project config. For public beta installs, use `https://looma-gold.vercel.app` as the app URL.

`looma doctor` verifies local config and API authentication. `looma doctor --e2e` additionally creates a recording, writes a test event, stops the recording, and prints the replay URL.

`record_stop` accepts optional `finalOutput`:

```json
{
  "finalOutput": {
    "title": "Final answer",
    "content": "Implemented the requested change and verified it.",
    "format": "markdown"
  }
}
```
