"use client";

import { ChevronDown, Filter } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDashboardSessionFilters } from "@/features/dashboard/hooks/use-dashboard-session-filters";
import type {
  DashboardStatusFilter,
  DashboardTimeRange,
} from "@/features/dashboard/utils/dashboard-query-params";

const STATUS_LABELS: Record<DashboardStatusFilter, string> = {
  active: "Active Sessions",
  completed: "Completed Sessions",
  failed: "Failed Sessions",
  all: "All Sessions",
};

export function DashboardControls() {
  const [{ time, status }, setFilters] = useDashboardSessionFilters();

  const updateTimeRange = (value: DashboardTimeRange) => {
    void setFilters({ time: value });
  };

  const updateStatus = (value: DashboardStatusFilter) => {
    void setFilters({ status: value });
  };

  return (
    <div className="flex items-center justify-between">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="inline-flex h-8 items-center gap-1.5 rounded-full border bg-card px-3 text-xs font-medium shadow-sm hover:bg-muted/50">
            {time}
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-40 rounded-xl">
          <DropdownMenuItem onClick={() => updateTimeRange("Today")}>
            Today
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => updateTimeRange("Last 7 days")}>
            Last 7 days
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => updateTimeRange("Last 30 days")}>
            Last 30 days
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => updateTimeRange("All time")}>
            All time
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="inline-flex h-8 w-8 items-center justify-center rounded-full border bg-card shadow-sm hover:bg-muted/50">
            <Filter className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="sr-only">{STATUS_LABELS[status]}</span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40 rounded-xl">
          <DropdownMenuItem onClick={() => updateStatus("active")}>
            Active Sessions
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => updateStatus("completed")}>
            Completed Sessions
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => updateStatus("failed")}>
            Failed Sessions
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => updateStatus("all")}>
            All Sessions
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
