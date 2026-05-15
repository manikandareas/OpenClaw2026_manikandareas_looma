"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import type {
  BehaviorSummary,
  ReplayChapter,
  ReplayData,
  ReplayEvent,
  ReplayMarker,
  ReplaySession,
} from "../types/replay";

type RealtimePayload<T> = {
  new: T;
};

export function useLiveReplay(sessionId: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (sessionId === "demo") return;

    const supabase = createClient();
    const queryKey = ["replay", sessionId] as const;
    const channel = supabase
      .channel(`replay:${sessionId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "events", filter: `session_id=eq.${sessionId}` },
        (payload: RealtimePayload<ReplayEvent>) => {
          queryClient.setQueryData<ReplayData>(queryKey, (current) => {
            if (!current) return current;
            return { ...current, events: upsertById(current.events, payload.new).sort(sortBySeq) };
          });
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "sessions", filter: `id=eq.${sessionId}` },
        (payload: RealtimePayload<ReplaySession>) => {
          queryClient.setQueryData<ReplayData>(queryKey, (current) => {
            if (!current) return current;
            return { ...current, session: { ...current.session, ...payload.new } };
          });
        }
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "markers", filter: `session_id=eq.${sessionId}` },
        (payload: RealtimePayload<ReplayMarker>) => {
          queryClient.setQueryData<ReplayData>(queryKey, (current) => {
            if (!current) return current;
            return { ...current, markers: upsertById(current.markers, payload.new).sort(sortBySeq) };
          });
        }
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chapters", filter: `session_id=eq.${sessionId}` },
        (payload: RealtimePayload<ReplayChapter>) => {
          queryClient.setQueryData<ReplayData>(queryKey, (current) => {
            if (!current) return current;
            return {
              ...current,
              chapters: upsertById(current.chapters, payload.new).sort(
                (a, b) => a.start_seq - b.start_seq
              ),
            };
          });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "behavior_summary",
          filter: `session_id=eq.${sessionId}`,
        },
        (payload: RealtimePayload<BehaviorSummary>) => {
          queryClient.setQueryData<ReplayData>(queryKey, (current) => updateBehaviorSummary(current, payload.new));
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "behavior_summary",
          filter: `session_id=eq.${sessionId}`,
        },
        (payload: RealtimePayload<BehaviorSummary>) => {
          queryClient.setQueryData<ReplayData>(queryKey, (current) => {
            return updateBehaviorSummary(current, payload.new);
          });
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [queryClient, sessionId]);
}

function upsertById<T extends { id: string }>(items: T[], item: T): T[] {
  const existingIndex = items.findIndex((candidate) => candidate.id === item.id);
  if (existingIndex === -1) return [...items, item];

  return items.map((candidate, index) => (index === existingIndex ? item : candidate));
}

function sortBySeq<T extends { seq: number }>(a: T, b: T): number {
  return a.seq - b.seq;
}

function updateBehaviorSummary(
  current: ReplayData | undefined,
  value: BehaviorSummary
): ReplayData | undefined {
  if (!current) return current;
  return { ...current, behaviorSummary: normalizeBehaviorSummary(value) };
}

function normalizeBehaviorSummary(value: BehaviorSummary): BehaviorSummary {
  return {
    read_count: value.read_count ?? 0,
    edit_count: value.edit_count ?? 0,
    run_count: value.run_count ?? 0,
    fail_count: value.fail_count ?? 0,
    fix_count: value.fix_count ?? 0,
    verify_count: value.verify_count ?? 0,
    review_count: value.review_count ?? 0,
    important_files_json: Array.isArray(value.important_files_json) ? value.important_files_json : [],
    important_commands_json: Array.isArray(value.important_commands_json)
      ? value.important_commands_json
      : [],
  };
}
