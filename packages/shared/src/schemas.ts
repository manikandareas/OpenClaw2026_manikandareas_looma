import { z } from "zod";

export const sessionStatusSchema = z.enum([
  "recording",
  "processing",
  "replay_ready",
  "failed",
  "stopped"
]);

export const sourceTypeSchema = z.enum([
  "mcp",
  "slash_command",
  "simulator",
  "json_import",
  "adapter"
]);

export const eventCategorySchema = z.enum([
  "intent",
  "workspace",
  "execution",
  "review",
  "state",
  "system"
]);

export const sensitivitySchema = z.enum(["none", "low", "medium", "high"]);

export const markerSeveritySchema = z.enum([
  "info",
  "notice",
  "important",
  "sensitive"
]);

export const createSessionInputSchema = z.object({
  name: z.string().min(1).max(160),
  harness: z.string().min(1).max(80).default("unknown"),
  agentName: z.string().max(120).optional(),
  workspaceName: z.string().max(160).optional(),
  sourceType: sourceTypeSchema.default("mcp")
});

export const normalizedEventInputSchema = z.object({
  seq: z.number().int().positive().optional(),
  timestamp: z.string().datetime().optional(),
  type: z.string().min(1).max(80),
  category: eventCategorySchema.default("system"),
  source: z.string().max(80).optional(),
  actor: z.string().max(80).default("agent"),
  workspacePath: z.string().max(600).optional(),
  relatedFile: z.string().max(600).optional().nullable(),
  relatedCommand: z.string().max(1200).optional().nullable(),
  payload: z.record(z.string(), z.unknown()).default({}),
  displayText: z.string().max(4000).optional(),
  sensitivity: sensitivitySchema.default("none")
});

export const stopSessionInputSchema = z.object({
  status: sessionStatusSchema.default("processing")
});

export const processSessionInputSchema = z.object({
  force: z.boolean().default(false)
});

export const importTranscriptInputSchema = z.object({
  name: z.string().min(1).max(160),
  harness: z.string().min(1).max(80).default("import"),
  transcript: z.string().min(1),
  workspaceName: z.string().max(160).optional()
});

export const replayMetadataSchema = z.object({
  chapters: z.array(z.record(z.string(), z.unknown())).default([]),
  markers: z.array(z.record(z.string(), z.unknown())).default([]),
  behaviorSummary: z.record(z.string(), z.unknown()).default({}),
  notes: z.string().default(""),
  redactionSummary: z.record(z.string(), z.unknown()).default({})
});

export const mcpRecordStartInputSchema = createSessionInputSchema.pick({
  name: true,
  harness: true,
  workspaceName: true
});

export const mcpRecordEventInputSchema = normalizedEventInputSchema.extend({
  sessionId: z.string().uuid().optional()
});

export const mcpRecordStopInputSchema = z.object({
  sessionId: z.string().uuid().optional()
});

export type CreateSessionInput = z.infer<typeof createSessionInputSchema>;
export type NormalizedEventInput = z.infer<typeof normalizedEventInputSchema>;
export type ImportTranscriptInput = z.infer<typeof importTranscriptInputSchema>;
export type ReplayMetadata = z.infer<typeof replayMetadataSchema>;
