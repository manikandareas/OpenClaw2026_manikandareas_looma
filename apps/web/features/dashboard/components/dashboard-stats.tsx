"use client";

import { useRecentSessions } from "@/features/dashboard/api/get-recent-sessions";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Activity, FileText, Radio } from "lucide-react";

export function DashboardStats() {
  const { data, isLoading } = useRecentSessions();

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-[88px] rounded-lg" />
        ))}
      </div>
    );
  }

  const sessions = data?.sessions ?? [];
  const total = data?.total ?? 0;
  const recording = sessions.filter((s) => s.status === "recording").length;
  const totalMarkers = sessions.reduce((sum, s) => sum + s.markerCount, 0);

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Card>
        <CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-md bg-muted p-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
          </div>
          <div>
            <p className="text-2xl font-semibold">{total}</p>
            <p className="text-xs text-muted-foreground">Total Sessions</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-md bg-red-500/10 p-2">
            <Radio className="h-4 w-4 text-red-400" />
          </div>
          <div>
            <p className="text-2xl font-semibold">{recording}</p>
            <p className="text-xs text-muted-foreground">Recording</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex items-center gap-3 p-4">
          <div className="rounded-md bg-yellow-500/10 p-2">
            <Activity className="h-4 w-4 text-yellow-400" />
          </div>
          <div>
            <p className="text-2xl font-semibold">{totalMarkers}</p>
            <p className="text-xs text-muted-foreground">Review Markers</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
