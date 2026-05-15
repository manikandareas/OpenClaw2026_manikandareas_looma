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
      <div className="space-y-6">
        <SessionFilters onFilterChange={handleFilterChange} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[120px] rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  const sessions = data?.sessions ?? [];

  return (
    <div className="space-y-6">
      <SessionFilters onFilterChange={handleFilterChange} />
      {sessions.length === 0 ? (
        <SessionsEmptyState />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sessions.map((session) => (
            <SessionCard key={session.id} session={session} />
          ))}
        </div>
      )}
    </div>
  );
}
