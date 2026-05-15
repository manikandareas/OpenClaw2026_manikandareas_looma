"use client";

import { useRecentSessions } from "@/features/dashboard/api/get-recent-sessions";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function DashboardStats() {
  const { data, isLoading } = useRecentSessions("50");

  if (isLoading) {
    return (
      <div className="flex items-center gap-12">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-24 rounded-lg" />
        ))}
      </div>
    );
  }

  const sessions = data?.sessions ?? [];
  const total = data?.total ?? 0;
  const recording = sessions.filter((s) => s.status === "recording").length;
  const replays = sessions.filter((s) => s.status === "replay_ready").length;
  const totalMarkers = sessions.reduce((sum, s) => sum + s.markerCount, 0);

  return (
    <div className="flex items-center gap-12">
      <Metric
        label="Sessions"
        value={total}
        change="+100%"
        trend="up"
        colorClass="bg-primary"
      />
      <Metric
        label="Replays"
        value={replays}
        change="+100%"
        trend="up"
        colorClass="bg-muted-foreground"
      />
      <Metric
        label="Recording"
        value={recording}
        change="+100%"
        trend="down"
        colorClass="bg-destructive"
      />
      <Metric
        label="Markers"
        value={totalMarkers}
        change="+100%"
        trend="up"
        colorClass="bg-primary"
      />
    </div>
  );
}

function Metric({
  label,
  value,
  change,
  trend,
  colorClass,
}: {
  label: string;
  value: number | string;
  change?: string;
  trend?: "up" | "down" | "neutral";
  colorClass?: string;
}) {
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <span>{label}</span>
        <div className={cn("h-1.5 w-1.5 rounded-full", colorClass)} />
      </div>
      <div className="mt-1 text-2xl font-semibold tracking-tight text-foreground">{value}</div>
      {change && (
        <div
          className={cn(
            "mt-1 text-[11px] font-medium",
            trend === "up" ? "text-emerald-500" : trend === "down" ? "text-destructive" : "text-muted-foreground"
          )}
        >
          {change}
        </div>
      )}
    </div>
  );
}
