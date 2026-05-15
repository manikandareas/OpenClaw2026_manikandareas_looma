import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import type { LensPublishInput } from "@/features/lens-agent/types/lens-agent";

type PublishClient = SupabaseClient;

export async function publishReplayMetadata(supabase: PublishClient, input: LensPublishInput) {
  const { sessionId } = input;

  const deletes = await Promise.all([
    supabase.from("markers").delete().eq("session_id", sessionId),
    supabase.from("chapters").delete().eq("session_id", sessionId),
    supabase.from("session_notes").delete().eq("session_id", sessionId),
    supabase.from("behavior_summary").delete().eq("session_id", sessionId),
    supabase.from("replay_metadata").delete().eq("session_id", sessionId),
  ]);

  const deleteError = deletes.find((result) => result.error)?.error;
  if (deleteError) {
    throw new Error(deleteError.message);
  }

  if (input.markers.length > 0) {
    const { error } = await supabase.from("markers").insert(input.markers.map((marker) => ({
      session_id: sessionId,
      event_id: marker.eventId ?? null,
      seq: marker.seq,
      timestamp: marker.timestamp,
      label: marker.label,
      category: marker.category,
      reason: marker.reason,
      needs_review: marker.needsReview,
      severity: marker.severity,
    })));
    if (error) throw new Error(error.message);
  }

  if (input.chapters.length > 0) {
    const { error } = await supabase.from("chapters").insert(input.chapters.map((chapter) => ({
      session_id: sessionId,
      start_seq: chapter.startSeq,
      end_seq: chapter.endSeq,
      start_time_ms: chapter.startTimeMs,
      end_time_ms: chapter.endTimeMs,
      title: chapter.title,
      summary: chapter.summary,
    })));
    if (error) throw new Error(error.message);
  }

  if (input.notes.trim().length > 0) {
    const { error } = await supabase.from("session_notes").insert({
      session_id: sessionId,
      content: input.notes,
    });
    if (error) throw new Error(error.message);
  }

  const { error: behaviorError } = await supabase.from("behavior_summary").insert({
    session_id: sessionId,
    read_count: input.behaviorSummary.read_count,
    edit_count: input.behaviorSummary.edit_count,
    run_count: input.behaviorSummary.run_count,
    fail_count: input.behaviorSummary.fail_count,
    fix_count: input.behaviorSummary.fix_count,
    verify_count: input.behaviorSummary.verify_count,
    review_count: input.behaviorSummary.review_count,
    important_files_json: input.behaviorSummary.important_files_json,
    important_commands_json: input.behaviorSummary.important_commands_json,
  });
  if (behaviorError) throw new Error(behaviorError.message);

  const redactionSummary = {
    redactedEventCount: input.compressedSession.redactedEventCount,
    totalEvents: input.compressedSession.totalEvents,
    usesRedactedPayloads: true,
  };

  const { error: metadataError } = await supabase.from("replay_metadata").insert({
    session_id: sessionId,
    chapters_json: input.chapters,
    markers_json: input.markers,
    behavior_summary_json: input.behaviorSummary,
    notes: input.notes,
    redaction_summary_json: {
      ...redactionSummary,
      lensAgent: {
        compressedEventCount: input.compressedSession.includedEvents,
        decisionTrace: input.decisionTrace,
      },
    },
  });
  if (metadataError) throw new Error(metadataError.message);

  const { data, error: sessionError } = await supabase
    .from("sessions")
    .update({ status: "replay_ready", updated_at: new Date().toISOString() })
    .eq("id", sessionId)
    .select("id, status")
    .single();

  if (sessionError) throw new Error(sessionError.message);
  return data;
}
