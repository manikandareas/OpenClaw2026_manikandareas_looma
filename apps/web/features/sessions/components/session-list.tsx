"use client";

import { useCallback, useState } from "react";
import { useSessions } from "@/features/sessions/api/get-sessions";
import { SessionFilters } from "@/features/sessions/components/session-filters";
import { SessionsEmptyState } from "@/features/sessions/components/sessions-empty-state";
import { SessionCard } from "@/components/session-card";
import { Skeleton } from "@/components/ui/skeleton";
import type { GetSessionsParams } from "@/types/session";

export function SessionList() {
  const [params, setParams] = useState<GetSessionsParams>({});
  const { data, isLoading } = useSessions(params);

  const handleFilterChange = useCallback((newParams: GetSessionsParams) => {
    setParams(newParams);
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <SessionFilters onFilterChange={handleFilterChange} />
        <div className="flex flex-col mt-4 space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[88px] w-full rounded-xl border border-border/60 bg-muted/20" />
          ))}
        </div>
      </div>
    );
  }

  const sessions = data?.sessions ?? [];

  return (
    <div className="space-y-4">
      <SessionFilters onFilterChange={handleFilterChange} />
      {sessions.length === 0 ? (
        <SessionsEmptyState />
      ) : (
        <div className="flex flex-col mt-4 space-y-2">
          {sessions.map((session) => (
            <SessionCard key={session.id} session={session} />
          ))}
        </div>
      )}
    </div>
  );
}
