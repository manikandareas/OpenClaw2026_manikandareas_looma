import { z } from "zod";

export const createSessionInputSchema = z.object({
  name: z.string().min(1).max(160),
  harness: z.string().min(1).max(80).default("unknown"),
  agentName: z.string().max(120).optional(),
  workspaceName: z.string().max(160).optional(),
  sourceType: z.enum(["mcp", "slash_command", "simulator", "json_import", "adapter"]).default("mcp"),
});

export const normalizedEventInputSchema = z.object({
  seq: z.number().int().positive().optional(),
  timestamp: z.string().datetime().optional(),
  type: z.string().min(1).max(80),
  category: z.enum(["intent", "workspace", "execution", "review", "state", "system"]).default("system"),
  source: z.string().max(80).optional(),
  actor: z.string().max(80).default("agent"),
  workspacePath: z.string().max(600).optional(),
  relatedFile: z.string().max(600).optional().nullable(),
  relatedCommand: z.string().max(1200).optional().nullable(),
  payload: z.record(z.string(), z.unknown()).default({}),
  displayText: z.string().max(4000).optional(),
  sensitivity: z.enum(["none", "low", "medium", "high"]).default("none"),
});

export const finalOutputInputSchema = z.object({
  title: z.string().min(1).max(160).optional(),
  content: z.string().min(1).max(12000),
  format: z.enum(["text", "markdown", "json"]).default("markdown"),
  sensitivity: z.enum(["none", "low", "medium", "high"]).default("none"),
});

export const mcpRecordStopInputSchema = z.object({
  sessionId: z.string().uuid().optional(),
  finalOutput: finalOutputInputSchema.optional(),
});

export type CreateSessionInput = z.infer<typeof createSessionInputSchema>;
export type NormalizedEventInput = z.infer<typeof normalizedEventInputSchema>;
export type FinalOutputInput = z.infer<typeof finalOutputInputSchema>;
