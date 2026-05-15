"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useRecentSessions } from "@/features/dashboard/api/get-recent-sessions";
import { useDashboardSessionFilters } from "@/features/dashboard/hooks/use-dashboard-session-filters";
import { Skeleton } from "@/components/ui/skeleton";
import type { SessionCard as SessionCardType } from "@/types/session";
import { cn } from "@/lib/utils";

const SESSION_STATUS_LABELS: Record<SessionCardType["status"], string> = {
  recording: "Recording",
  processing: "Processing",
  replay_ready: "Ready",
  failed: "Failed",
  stopped: "Stopped",
};

export function RecentSessions() {
  const [{ time, status }] = useDashboardSessionFilters();
  const { data, isLoading, isError, error } = useRecentSessions();

  const hasFilters = time !== "All time" || status !== "all";

  if (isLoading) {
    return (
      <div className="rounded-2xl border bg-card p-5 shadow-sm">
        <Skeleton className="mb-4 h-5 w-32 rounded-md" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-10 rounded-md" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col rounded-2xl border border-destructive/30 bg-card p-5 shadow-sm">
        <h2 className="text-sm font-medium">Recent Sessions</h2>
        <p className="mt-3 text-sm text-destructive">
          {error instanceof Error ? error.message : "Could not load sessions."}
        </p>
      </div>
    );
  }

  const sessions = data?.sessions ?? [];

  return (
    <div className="flex flex-col rounded-2xl border bg-card shadow-sm">
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <h2 className="text-sm font-medium">Recent Sessions</h2>
        {sessions.length > 0 && (
          <Link
            href="/sessions"
            className="flex items-center text-xs text-muted-foreground hover:text-foreground"
          >
            Performance <ChevronRight className="ml-0.5 h-3.5 w-3.5" />
          </Link>
        )}
      </div>

      <div className="px-5 pb-5">
        {sessions.length === 0 ? (
          <div className="flex h-32 items-center justify-center px-2 text-center text-sm text-muted-foreground">
            {hasFilters
              ? 'No sessions match the current filters. Try widening time range or choosing "All sessions".'
              : "No sessions yet."}
          </div>
        ) : (
          <div className="space-y-1">
            <div className="grid grid-cols-[1fr_auto_auto] gap-4 px-2 pb-2 text-[11px] font-medium text-muted-foreground">
              <span>Session</span>
              <span className="w-20 text-right">Status</span>
              <span className="w-12 text-right">Markers</span>
            </div>
            {sessions.slice(0, 5).map((session, index) => (
              <SessionRow key={session.id} session={session} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SessionRow({
  session,
  index,
}: {
  session: SessionCardType;
  index: number;
}) {
  return (
    <Link
      href={`/session/${session.id}`}
      className="grid grid-cols-[1fr_auto_auto] items-center gap-4 rounded-md px-2 py-2 text-sm transition-colors hover:bg-muted/50"
    >
      <span className="flex min-w-0 items-center gap-2.5">
        <span
          className={cn(
            "h-1.5 w-1.5 shrink-0 rounded-full",
            index % 3 === 0
              ? "bg-primary"
              : index % 3 === 1
                ? "bg-muted-foreground"
                : "bg-destructive"
          )}
        />
        <span className="truncate font-medium text-foreground">{session.name}</span>
      </span>
      <span className="w-20 text-right text-xs text-muted-foreground">
        {SESSION_STATUS_LABELS[session.status]}
      </span>
      <span className="w-12 text-right text-xs text-muted-foreground">{session.markerCount}</span>
    </Link>
  );
}
