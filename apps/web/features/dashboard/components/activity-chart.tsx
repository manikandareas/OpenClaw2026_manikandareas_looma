"use client";

import { useRecentSessions } from "@/features/dashboard/api/get-recent-sessions";
import { useDashboardSessionFilters } from "@/features/dashboard/hooks/use-dashboard-session-filters";
import { Skeleton } from "@/components/ui/skeleton";
import type { SessionCard } from "@/types/session";
import { cn } from "@/lib/utils";
import { timeRangeToChartDays } from "@/features/dashboard/utils/dashboard-session-filters";

const DAY_MS = 86_400_000;

const COLORS = [
  "bg-[#2b9df1]/15 border border-[#2b9df1]/60 text-[#2b9df1]", // Blue
  "bg-[#34d399]/15 border border-[#34d399]/60 text-[#10b981]", // Teal/Green
  "bg-[#8b78e6]/15 border border-[#8b78e6]/60 text-[#8b78e6]", // Purple
  "bg-[#fbb03b]/15 border border-[#fbb03b]/60 text-[#f59e0b]", // Yellow/Orange
  "bg-[#f43f5e]/15 border border-[#f43f5e]/60 text-[#f43f5e]", // Red/Pink
];

function startOfDay(date: Date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function getTimelineDays(dayCount: number): Date[] {
  const today = startOfDay(new Date());
  return Array.from({ length: dayCount }, (_, index) => {
    const day = new Date(today);
    day.setDate(today.getDate() - (dayCount - 1 - index));
    return day;
  });
}

function formatDayLabel(date: Date) {
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
}

function getBarStyles(
  session: SessionCard,
  timelineStart: number,
  totalMs: number,
  timelineDays: number,
) {
  const start = new Date(session.startedAt || session.createdAt).getTime();
  // If no end time, assume it's ongoing or give it a default width (e.g., 12 hours)
  const end = session.endedAt
    ? new Date(session.endedAt).getTime()
    : (session.durationMs ? start + session.durationMs : start + 12 * 3600 * 1000);

  const clampedStart = Math.max(start, timelineStart);
  const clampedEnd = Math.min(end, timelineStart + totalMs);

  let leftPct = ((clampedStart - timelineStart) / totalMs) * 100;
  let widthPct = ((clampedEnd - clampedStart) / totalMs) * 100;
  const minBarPct = timelineDays <= 1 ? 8 : timelineDays <= 7 ? 18 : 6;
  if (widthPct < minBarPct) widthPct = minBarPct;
  // Adjust left if it overflows due to min-width
  if (leftPct + widthPct > 100) leftPct = 100 - widthPct;

  return {
    left: `${leftPct}%`,
    width: `${widthPct}%`
  };
}

export function ActivityChart() {
  const [{ time }] = useDashboardSessionFilters();
  const timelineDays = timeRangeToChartDays(time);
  const { data, isLoading } = useRecentSessions("20");

  if (isLoading) {
    return <Skeleton className="h-[320px] w-full rounded-2xl" />;
  }

  const sessions = data?.sessions ?? [];
  const days = getTimelineDays(timelineDays);

  const timelineStart = days[0].getTime();
  const timelineEnd = timelineStart + timelineDays * DAY_MS;
  const totalMs = timelineEnd - timelineStart;

  // Filter sessions that overlap with the visible window
  const visibleSessions = sessions.filter(s => {
    const start = new Date(s.startedAt || s.createdAt).getTime();
    const end = s.endedAt ? new Date(s.endedAt).getTime() : start + (s.durationMs || DAY_MS);
    return end > timelineStart && start < timelineEnd;
  }).slice(0, 5); // Limit to 5 for a clean Gantt look like the reference

  return (
    <div className="w-full overflow-x-auto">
      <div
        className="relative"
        style={{ minWidth: Math.max(280, timelineDays * 48) }}
      >
        {/* Background Grid Lines */}
        <div className="absolute inset-0 flex border-b border-border/40">
          {days.map((day, i) => (
            <div key={i} className="flex-1 border-r border-border/40 last:border-r-0" />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 pt-6 pb-2">
          {/* Rows */}
          <div className="flex flex-col">
            {visibleSessions.length === 0 ? (
              <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
                No sessions in this period.
              </div>
            ) : (
              visibleSessions.map((session, i) => (
                <div key={session.id} className="relative h-16 w-full">
                  <div
                    className={cn(
                      "absolute top-2 bottom-2 flex items-center overflow-hidden rounded-md px-4 text-xs font-medium transition-transform hover:scale-[1.02]",
                      COLORS[i % COLORS.length]
                    )}
                    style={getBarStyles(session, timelineStart, totalMs, timelineDays)}
                    title={`${session.name} (${session.status})`}
                  >
                    <span className="truncate">{session.name}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* X-Axis */}
        <div className="relative z-10 flex h-10 items-center">
          {days.map(day => (
            <div
              key={day.toISOString()}
              className="flex h-full flex-1 items-center justify-center text-[11px] font-medium text-muted-foreground"
            >
              <div className="relative flex w-full justify-center">
                {/* Tick mark */}
                <div className="absolute -top-3 h-1 w-px bg-border/40" />
                {formatDayLabel(day)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
