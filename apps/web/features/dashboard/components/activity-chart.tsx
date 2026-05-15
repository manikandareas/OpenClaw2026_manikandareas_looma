"use client";

import { useRecentSessions } from "@/features/dashboard/api/get-recent-sessions";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function getLast7Days(): string[] {
  const days: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
}

function getDayLabel(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en", { weekday: "short" });
}

export function ActivityChart() {
  const { data, isLoading } = useRecentSessions();

  if (isLoading) {
    return <Skeleton className="h-[200px] rounded-lg" />;
  }

  const sessions = data?.sessions ?? [];
  const days = getLast7Days();

  const countsByDay: Record<string, number> = {};
  for (const day of days) {
    countsByDay[day] = 0;
  }
  for (const s of sessions) {
    const day = s.createdAt.slice(0, 10);
    if (countsByDay[day] !== undefined) {
      countsByDay[day]++;
    }
  }

  const maxCount = Math.max(1, ...Object.values(countsByDay));

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="mb-4 text-sm font-medium">Activity (7 days)</h3>
        <div className="flex items-end justify-between gap-1.5" style={{ height: 120 }}>
          {days.map((day) => {
            const count = countsByDay[day];
            const height = count > 0 ? Math.max(12, (count / maxCount) * 100) : 4;
            return (
              <div key={day} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className="w-full rounded-sm bg-primary/60 transition-all"
                  style={{ height: `${height}%` }}
                  title={`${count} session${count !== 1 ? "s" : ""}`}
                />
                <span className="text-[10px] text-muted-foreground">
                  {getDayLabel(day)}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
