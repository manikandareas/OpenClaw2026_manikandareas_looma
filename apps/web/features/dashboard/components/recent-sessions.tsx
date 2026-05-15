"use client";

import Link from "next/link";
import { useRecentSessions } from "@/features/dashboard/api/get-recent-sessions";
import { SessionCard } from "@/components/session-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export function RecentSessions() {
  const { data, isLoading } = useRecentSessions();

  if (isLoading) {
    return (
      <div className="space-y-3">
        <h2 className="text-lg font-medium">Recent Sessions</h2>
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-[100px] rounded-lg" />
        ))}
      </div>
    );
  }

  const sessions = data?.sessions ?? [];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Recent Sessions</h2>
        {sessions.length > 0 && (
          <Button asChild variant="ghost" size="sm">
            <Link href="/sessions">View all</Link>
          </Button>
        )}
      </div>
      {sessions.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          No sessions yet. Start recording or import a transcript.
        </p>
      ) : (
        <div className="grid gap-3">
          {sessions.map((session) => (
            <SessionCard key={session.id} session={session} />
          ))}
        </div>
      )}
    </div>
  );
}
