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
    description: "Starts a Looma recording session and returns a /session/{sessionId} replay URL.",
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
    return jsonContent(await client.createSession(parsed));
  }
);

server.registerTool(
  "record_event",
  {
    title: "Record Looma event",
    description: "Appends a normalized coding-agent event to an active Looma session.",
    inputSchema: {
      sessionId: z.string().uuid(),
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
    const parsed = normalizedEventInputSchema.parse(event);
    return jsonContent(await client.recordEvent(sessionId, parsed));
  }
);

server.registerTool(
  "record_stop",
  {
    title: "Stop Looma recording",
    description: "Stops a Looma recording session and returns its /session/{sessionId} replay URL.",
    inputSchema: {
      sessionId: z.string().uuid()
    }
  },
  async (input) => {
    const client = new LoomaApiClient();
    const parsed = mcpRecordStopInputSchema.parse(input);
    return jsonContent(await client.stopSession(parsed.sessionId));
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
