#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { LoomaApiClient } from "./client";
import {
  createSessionInputSchema,
  mcpRecordStopInputSchema,
  normalizedEventInputSchema,
} from "./schemas";
import {
  ACTIVE_SESSION_PATH,
  clearActiveSession,
  readActiveSession,
  writeActiveSession,
} from "./session-file";

function jsonContent(value: unknown) {
  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(value, null, 2),
      },
    ],
  };
}

export async function runMcpServer() {
  const server = new McpServer({
    name: "looma",
    version: "0.1.0-beta.0",
  });

  server.registerTool(
    "record_start",
    {
      title: "Start Looma recording",
      description:
        "Start Looma recording for Claude Code. Creates a session, writes ~/.looma/active_session, and returns a /session/{sessionId} replay URL.",
      inputSchema: {
        name: z.string().min(1).max(160),
        harness: z.string().min(1).max(80).default("claude-code"),
        agentName: z.string().max(120).optional(),
        workspaceName: z.string().max(160).optional(),
      },
    },
    async (input) => {
      const client = new LoomaApiClient();
      const parsed = createSessionInputSchema.parse({
        ...input,
        sourceType: "mcp",
      });
      const result = await client.createSession(parsed);
      const sessionId = getSessionId(result);
      await writeActiveSession(sessionId);
      return jsonContent(result);
    }
  );

  server.registerTool(
    "record_event",
    {
      title: "Record Looma event",
      description:
        "Append an optional manual event to the active Looma recording. Claude Code hooks capture tool calls automatically.",
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
        sensitivity: z.enum(["none", "low", "medium", "high"]).default("none"),
      },
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
        "Stop the active Looma recording, trigger replay processing, clear ~/.looma/active_session, and return the /session/{sessionId} replay URL.",
      inputSchema: {
        sessionId: z.string().uuid().optional(),
        finalOutput: z.object({
          title: z.string().min(1).max(160).optional(),
          content: z.string().min(1).max(12000),
          format: z.enum(["text", "markdown", "json"]).default("markdown"),
          sensitivity: z.enum(["none", "low", "medium", "high"]).default("none"),
        }).optional(),
      },
    },
    async (input) => {
      const client = new LoomaApiClient();
      const parsed = mcpRecordStopInputSchema.parse(input);
      const sessionId = await resolveSessionId(parsed.sessionId);
      const result = await client.stopSession(sessionId, {
        finalOutput: parsed.finalOutput,
      });
      await clearActiveSession();
      return jsonContent(result);
    }
  );

  const transport = new StdioServerTransport();
  await server.connect(transport);
}

async function resolveSessionId(sessionId: string | undefined): Promise<string> {
  if (sessionId) return sessionId;

  const activeSessionId = await readActiveSession();
  if (activeSessionId) return activeSessionId;

  throw new Error(
    `No active Looma recording found. Call record_start first or pass sessionId explicitly. Expected active session file at ${ACTIVE_SESSION_PATH}.`
  );
}

function getSessionId(value: unknown): string {
  if (value && typeof value === "object" && "sessionId" in value && typeof value.sessionId === "string") {
    return value.sessionId;
  }

  throw new Error("Looma API did not return a sessionId");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  await runMcpServer();
}
