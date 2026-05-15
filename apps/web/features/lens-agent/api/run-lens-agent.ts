import "server-only";

import { openai } from "@ai-sdk/openai";
import { hasToolCall, stepCountIs, ToolLoopAgent, tool } from "ai";
import { z } from "zod";
import { getLensAgentEnv } from "@/lib/env";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { publishReplayMetadata } from "@/features/lens-agent/api/publish-replay-metadata";
import type {
  LensBehaviorSummary,
  LensChapter,
  LensDecisionTrace,
  LensEvent,
  LensMarker,
  LensPatternAnalysis,
  RunLensAgentResult,
} from "@/features/lens-agent/types/lens-agent";
import { compressEvents } from "@/features/lens-agent/utils/event-compression";
import {
  analyzeEventPatterns,
  calculateBehaviorSummary,
  canPublishReplayMetadata,
  detectReviewMarkers,
  evaluateCompleteness,
  evaluatePublishReadiness,
  generateChapterSkeletons,
} from "@/features/lens-agent/utils/rule-analysis";

type RunLensAgentInput = {
  sessionId: string;
  userId: string;
  force?: boolean;
};

const chapterDraftSchema = z.object({
  startSeq: z.number().int().positive(),
  title: z.string().min(1).max(120),
  summary: z.string().min(1).max(500),
});

const reasonSchema = {
  reason: z.string().min(1).max(240).optional(),
};

type LensAgentState = {
  patterns: LensPatternAnalysis | null;
  markers: LensMarker[];
  chapters: LensChapter[];
  behaviorSummary: LensBehaviorSummary | null;
  notes: string;
  completeness: ReturnType<typeof evaluateCompleteness> | null;
  published: boolean;
};

type LensAgentToolName =
  | "analyze_event_patterns"
  | "detect_review_markers"
  | "calculate_behavior_summary"
  | "generate_chapters"
  | "generate_session_notes"
  | "evaluate_completeness"
  | "publish_replay_metadata";

export async function runLensAgent(input: RunLensAgentInput): Promise<RunLensAgentResult> {
  const supabase = createSupabaseAdminClient();
  const trace: LensDecisionTrace[] = [];

  try {
    const { data: session, error: sessionError } = await supabase
      .from("sessions")
      .select("id, status, user_id")
      .eq("id", input.sessionId)
      .eq("user_id", input.userId)
      .single();

    if (sessionError || !session) {
      throw new Error("Session not found");
    }

    if (session.status === "replay_ready" && !input.force) {
      return {
        sessionId: input.sessionId,
        status: "replay_ready",
        eventCount: 0,
        markerCount: 0,
        chapterCount: 0,
        trace,
      };
    }

    const { data: eventsData, error: eventsError } = await supabase
      .from("events")
      .select("id, seq, timestamp, type, category, source, actor, workspace_path, related_file, related_command, redacted_payload_json, display_text, sensitivity, redaction_applied")
      .eq("session_id", input.sessionId)
      .order("seq");

    if (eventsError) throw new Error(eventsError.message);

    const events = normalizeEvents(eventsData ?? []);
    const compressedSession = compressEvents(events);

    if (events.length === 0) {
      const emptyBehavior: LensBehaviorSummary = {
        read_count: 0,
        edit_count: 0,
        run_count: 0,
        fail_count: 0,
        fix_count: 0,
        verify_count: 0,
        review_count: 0,
        important_files_json: [],
        important_commands_json: [],
      };
      await publishReplayMetadata(supabase, {
        sessionId: input.sessionId,
        chapters: [],
        markers: [],
        behaviorSummary: emptyBehavior,
        notes: "",
        compressedSession,
        decisionTrace: trace,
      });

      return {
        sessionId: input.sessionId,
        status: "replay_ready",
        eventCount: 0,
        markerCount: 0,
        chapterCount: 0,
        trace,
      };
    }

    const env = getLensAgentEnv();
    const state: LensAgentState = {
      patterns: null,
      markers: [],
      chapters: [],
      behaviorSummary: null,
      notes: "",
      completeness: null,
      published: false,
    };

    const runTool = async <TInput, TOutput>(
      toolName: string,
      toolInput: TInput,
      fn: () => Promise<TOutput> | TOutput,
      status: LensDecisionTrace["status"] = "success"
    ): Promise<TOutput> => {
      const start = Date.now();
      const step = trace.length + 1;
      try {
        const output = await fn();
        trace.push({
          step,
          toolName,
          inputSummary: summarizeUnknown(toolInput),
          outputSummary: summarizeUnknown(output),
          durationMs: Date.now() - start,
          status,
          timestamp: new Date().toISOString(),
          visibleReasonSummary: visibleReasonFromInput(toolInput),
        });
        return output;
      } catch (error) {
        trace.push({
          step,
          toolName,
          inputSummary: summarizeUnknown(toolInput),
          outputSummary: error instanceof Error ? error.message : "Unknown error",
          durationMs: Date.now() - start,
          status: "error",
          timestamp: new Date().toISOString(),
          visibleReasonSummary: visibleReasonFromInput(toolInput),
        });
        throw error;
      }
    };

    const agent = new ToolLoopAgent({
      model: openai(env.model),
      instructions: [
        "You are Looma lens-agent, an internal replay navigation agent.",
        "Use the available tools dynamically; do not judge whether the coding work is correct.",
        "Use only the compressed redacted event context provided in the prompt.",
        "Create navigation metadata: review markers, chapters, behavior summary, and concise session notes.",
        "You must call tools until the metadata is ready, then call publish_replay_metadata exactly once.",
        "Do not invent raw event content. Use visible reason fields to explain tool selection when useful.",
        "Keep notes factual and short. Do not reveal hidden reasoning.",
      ].join("\n"),
      toolChoice: "required",
      stopWhen: [hasToolCall("publish_replay_metadata"), stepCountIs(env.maxSteps)],
      prepareStep: () => ({
        activeTools: activeToolsForState(state, events.length),
      }),
      tools: {
        analyze_event_patterns: tool({
          description: "Rule-based scan for loops, retries, failures, phase hints, and repeated commands.",
          inputSchema: z.object(reasonSchema),
          execute: async (toolInput) => runTool("analyze_event_patterns", toolInput, () => {
            state.patterns = analyzeEventPatterns(events);
            return state.patterns;
          }),
        }),
        detect_review_markers: tool({
          description: "Rule-based detection for Needs Review markers such as dependency installs, sensitive files, repeated commands, and failures.",
          inputSchema: z.object(reasonSchema),
          execute: async (toolInput) => runTool("detect_review_markers", toolInput, () => {
            state.markers = detectReviewMarkers(events);
            return { markers: state.markers };
          }),
        }),
        calculate_behavior_summary: tool({
          description: "Rule-based count of read, edit, run, fail, fix, verify, review metrics.",
          inputSchema: z.object(reasonSchema),
          execute: async (toolInput) => runTool("calculate_behavior_summary", toolInput, () => {
            if (state.markers.length === 0) state.markers = detectReviewMarkers(events);
            state.behaviorSummary = calculateBehaviorSummary(events, state.markers);
            return state.behaviorSummary;
          }),
        }),
        generate_chapters: tool({
          description: "Draft chapter titles and summaries. Provide natural labels for the rule-based phase boundaries.",
          inputSchema: z.object({
            ...reasonSchema,
            chapters: z.array(chapterDraftSchema).min(1).max(6).optional(),
          }),
          execute: async (toolInput) => runTool("generate_chapters", toolInput, () => {
            state.chapters = generateChapterSkeletons(events, toolInput.chapters ?? []);
            return { chapters: state.chapters };
          }),
        }),
        generate_session_notes: tool({
          description: "Draft concise 3-5 bullet notes for the replay using only redacted session facts.",
          inputSchema: z.object({
            ...reasonSchema,
            notes: z.string().min(1).max(2000),
          }),
          execute: async (toolInput) => runTool("generate_session_notes", toolInput, () => {
            state.notes = toolInput.notes.trim();
            return { notes: state.notes };
          }),
        }),
        evaluate_completeness: tool({
          description: "Check whether markers, chapters, behavior summary, notes, and publishing are complete.",
          inputSchema: z.object(reasonSchema),
          execute: async (toolInput) => runTool("evaluate_completeness", toolInput, () => {
            state.completeness = evaluateCompleteness({
              events,
              markers: state.markers,
              chapters: state.chapters,
              behaviorSummary: state.behaviorSummary,
              notes: state.notes,
              published: state.published,
            });
            return state.completeness;
          }),
        }),
        publish_replay_metadata: tool({
          description: "Publish the final replay metadata to Supabase. Call this only when metadata is ready.",
          inputSchema: z.object({
            ...reasonSchema,
            notes: z.string().max(2000).optional(),
            chapters: z.array(chapterDraftSchema).max(6).optional(),
          }),
          execute: async (toolInput) => runTool("publish_replay_metadata", toolInput, async () => {
            if (toolInput.chapters) {
              state.chapters = generateChapterSkeletons(events, toolInput.chapters);
            }
            if (toolInput.notes !== undefined) {
              state.notes = toolInput.notes.trim();
            }

            const readiness = evaluatePublishReadiness({
              events,
              markers: state.markers,
              chapters: state.chapters,
              behaviorSummary: state.behaviorSummary,
              notes: state.notes,
            });
            if (!canPublishReplayMetadata({ readiness, completeness: state.completeness })) {
              return runTool("publish_replay_metadata:not_ready", {
                gaps: readiness.gaps,
                completeness: state.completeness,
              }, () => ({
                status: "not_ready",
                gaps: readiness.gaps,
                completenessReadyToPublish: state.completeness?.readyToPublish ?? false,
              }), "skipped");
            }

            const behaviorSummary = state.behaviorSummary;
            if (!behaviorSummary) {
              throw new Error("publish_replay_metadata called without behavior summary");
            }

            await publishReplayMetadata(supabase, {
              sessionId: input.sessionId,
              chapters: state.chapters,
              markers: state.markers,
              behaviorSummary,
              notes: state.notes,
              compressedSession,
              decisionTrace: trace,
            });
            state.published = true;
            return {
              status: "replay_ready",
              markerCount: state.markers.length,
              chapterCount: state.chapters.length,
            };
          }),
        }),
      },
      maxOutputTokens: 1200,
    });

    await agent.generate({
      prompt: [
        `Session ID: ${input.sessionId}`,
        "Compressed redacted event context:",
        JSON.stringify(compressedSession),
        "Your task: autonomously choose tools, build complete replay metadata, evaluate completeness, and publish it.",
      ].join("\n\n"),
    });

    if (!state.published) {
      throw new Error(`Lens agent finished without publish_replay_metadata within ${env.maxSteps} steps`);
    }

    await syncDecisionTrace(supabase, input.sessionId, trace);

    return {
      sessionId: input.sessionId,
      status: "replay_ready",
      eventCount: events.length,
      markerCount: state.markers.length,
      chapterCount: state.chapters.length,
      trace,
    };
  } catch (error) {
    await supabase
      .from("sessions")
      .update({ status: "failed", updated_at: new Date().toISOString() })
      .eq("id", input.sessionId)
      .eq("user_id", input.userId);

    throw error;
  }
}

function normalizeEvents(rows: unknown[]): LensEvent[] {
  return rows.map((row) => {
    const record = isRecord(row) ? row : {};
    return {
      id: stringValue(record.id),
      seq: numberValue(record.seq),
      timestamp: stringValue(record.timestamp),
      type: stringValue(record.type),
      category: stringValue(record.category),
      source: nullableStringValue(record.source),
      actor: stringValue(record.actor),
      workspace_path: nullableStringValue(record.workspace_path),
      related_file: nullableStringValue(record.related_file),
      related_command: nullableStringValue(record.related_command),
      redacted_payload_json: isRecord(record.redacted_payload_json) ? record.redacted_payload_json : {},
      display_text: nullableStringValue(record.display_text),
      sensitivity: stringValue(record.sensitivity),
      redaction_applied: Boolean(record.redaction_applied),
    };
  });
}

function summarizeUnknown(value: unknown): string {
  const text = typeof value === "string" ? value : JSON.stringify(value);
  if (!text) return "";
  return text.length > 700 ? `${text.slice(0, 697)}...` : text;
}

function visibleReasonFromInput(value: unknown): string | undefined {
  if (!isRecord(value) || typeof value.reason !== "string") return undefined;
  return value.reason.length > 240 ? `${value.reason.slice(0, 237)}...` : value.reason;
}

function activeToolsForState(state: LensAgentState, eventCount: number): LensAgentToolName[] {
  const readiness = evaluatePublishReadiness({
    events: Array.from({ length: eventCount }, (_, index) => ({ seq: index + 1 }) as LensEvent),
    markers: state.markers,
    chapters: state.chapters,
    behaviorSummary: state.behaviorSummary,
    notes: state.notes,
  });

  if (canPublishReplayMetadata({ readiness, completeness: state.completeness })) {
    return ["publish_replay_metadata"];
  }

  const activeTools: LensAgentToolName[] = [
    "analyze_event_patterns",
    "detect_review_markers",
    "calculate_behavior_summary",
    "generate_chapters",
    "generate_session_notes",
    "evaluate_completeness",
  ];

  return activeTools;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function stringValue(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function nullableStringValue(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function numberValue(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

async function syncDecisionTrace(
  supabase: ReturnType<typeof createSupabaseAdminClient>,
  sessionId: string,
  trace: LensDecisionTrace[]
) {
  const { data, error } = await supabase
    .from("replay_metadata")
    .select("redaction_summary_json")
    .eq("session_id", sessionId)
    .maybeSingle();

  if (error) throw new Error(error.message);

  const redactionSummary = isRecord(data?.redaction_summary_json)
    ? data.redaction_summary_json
    : {};
  const lensAgent = isRecord(redactionSummary.lensAgent)
    ? redactionSummary.lensAgent
    : {};

  const { error: updateError } = await supabase
    .from("replay_metadata")
    .update({
      redaction_summary_json: {
        ...redactionSummary,
        lensAgent: {
          ...lensAgent,
          decisionTrace: trace,
        },
      },
      updated_at: new Date().toISOString(),
    })
    .eq("session_id", sessionId);

  if (updateError) throw new Error(updateError.message);
}
