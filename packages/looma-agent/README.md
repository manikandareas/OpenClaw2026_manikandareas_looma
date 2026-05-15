# looma-agent

Local Looma bridge for public beta users.

```bash
npm i -g looma-agent
looma setup claude-code --app-url https://your-looma-app.vercel.app --api-key looma_xxx
looma doctor
```

Bins:

- `looma` / `looma-agent` - setup, doctor, and command dispatcher.
- `looma-mcp` - stdio MCP server exposing `record_start`, `record_event`, and `record_stop`.
- `looma-hook` - Claude Code hook bridge that forwards tool events to the active Looma session.

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
