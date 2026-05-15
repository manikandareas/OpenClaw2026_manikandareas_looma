#!/usr/bin/env bun
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import {
  createSessionInputSchema,
  normalizedEventInputSchema,
  mcpRecordStopInputSchema
} from "@looma/shared";
import { LoomaApiClient } from "./client";
import { writeActiveSession, clearActiveSession, readActiveSession, ACTIVE_SESSION_PATH } from "./session-file";

const server = new McpServer({
  name: "looma",
  version: "0.1.0"
});

function jsonContent(value: unknown) {
  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(value, null, 2)
      }
    ]
  };
}

server.registerTool(
  "record_start",
  {
    title: "Start Looma recording",
    description:
      "Start conscious Looma recording for Claude Code. This creates a session, writes ~/.looma/active_session, and returns a /sessions/{sessionId} replay URL.",
    inputSchema: {
      name: z.string().min(1).max(160),
      harness: z.string().min(1).max(80).default("unknown"),
      agentName: z.string().max(120).optional(),
      workspaceName: z.string().max(160).optional()
    }
  },
  async (input) => {
    const client = new LoomaApiClient();
    const parsed = createSessionInputSchema.parse({
      ...input,
      sourceType: "mcp"
    });
    const result = await client.createSession(parsed);
    try {
      await writeActiveSession((result as { sessionId: string }).sessionId);
    } catch (err) {
      process.stderr.write(`[looma-mcp] failed to write active session: ${err}\n`);
    }
    return jsonContent(result);
  }
);

server.registerTool(
  "record_event",
  {
    title: "Record Looma event",
    description:
      "Append an optional manual event to the active Looma recording. Claude Code hooks capture tool calls automatically; use this for notable intent, review, or state events.",
    inputSchema: {
      sessionId: z.string().uuid().optional(),
      type: z.string().min(1).max(80),
      category: z.enum(["intent", "workspace", "execution", "review", "state", "system"]).default("system"),
      source: z.string().max(80).optional(),
      actor: z.string().max(80).default("agent"),
      workspacePath: z.string().max(600).optional(),
      relatedFile: z.string().max(600).optional(),
      relatedCommand: z.string().max(1200).optional(),
      payload: z.record(z.string(), z.unknown()).default({}),
      displayText: z.string().max(4000).optional(),
      sensitivity: z.enum(["none", "low", "medium", "high"]).default("none")
    }
  },
  async ({ sessionId, ...event }) => {
    const client = new LoomaApiClient();
    const resolvedSessionId = await resolveSessionId(sessionId);
    const parsed = normalizedEventInputSchema.parse(event);
    return jsonContent(await client.recordEvent(resolvedSessionId, parsed));
  }
);

server.registerTool(
  "record_stop",
  {
    title: "Stop Looma recording",
    description:
      "Stop the active Looma recording, trigger replay processing, clear ~/.looma/active_session, and return the /sessions/{sessionId} replay URL.",
    inputSchema: {
      sessionId: z.string().uuid().optional(),
      finalOutput: z.object({
        title: z.string().min(1).max(160).optional(),
        content: z.string().min(1).max(12000),
        format: z.enum(["text", "markdown", "json"]).default("markdown"),
        sensitivity: z.enum(["none", "low", "medium", "high"]).default("none")
      }).optional()
    }
  },
  async (input) => {
    const client = new LoomaApiClient();
    const parsed = mcpRecordStopInputSchema.parse(input);
    const sessionId = await resolveSessionId(parsed.sessionId);
    const result = await client.stopSession(sessionId, {
      finalOutput: parsed.finalOutput
    });
    try {
      await clearActiveSession();
    } catch (err) {
      process.stderr.write(`[looma-mcp] failed to clear active session: ${err}\n`);
    }
    return jsonContent(result);
  }
);

async function resolveSessionId(sessionId: string | undefined): Promise<string> {
  if (sessionId) return sessionId;

  const activeSessionId = await readActiveSession();
  if (activeSessionId) return activeSessionId;

  throw new Error(
    `No active Looma recording found. Call record_start first or pass sessionId explicitly. Expected active session file at ${ACTIVE_SESSION_PATH}.`
  );
}

const transport = new StdioServerTransport();
await server.connect(transport);
