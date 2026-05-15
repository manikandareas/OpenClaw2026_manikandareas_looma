"use client";

import { Input } from "@/components/ui/input";
import { Search, ListFilter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import type { GetSessionsParams, SessionStatus } from "@/types/session";

type Props = {
  onFilterChange: (params: GetSessionsParams) => void;
};

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "recording", label: "Recording" },
  { value: "processing", label: "Processing" },
  { value: "replay_ready", label: "Completed" },
  { value: "failed", label: "Failed" },
  { value: "stopped", label: "Stopped" },
];

export function SessionFilters({ onFilterChange }: Props) {
  const [status, setStatus] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const params: GetSessionsParams = {};
    if (status !== "all") params.status = status as SessionStatus;
    if (debouncedSearch) params.search = debouncedSearch;
    onFilterChange(params);
  }, [status, debouncedSearch, onFilterChange]);

  return (
    <div className="flex items-center justify-between pb-4 border-b border-border/40">
      <div className="flex items-center">
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="h-8 rounded-full border-transparent bg-muted/50 px-3 text-xs font-medium hover:bg-muted focus:ring-0 focus:ring-offset-0 shadow-none">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {STATUS_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value} className="rounded-lg text-xs">
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 w-[100px] sm:w-[140px] rounded-full border-transparent bg-muted/50 pl-8 text-xs hover:bg-muted focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none transition-all focus-visible:w-[180px]"
          />
        </div>
        <button className="flex h-8 w-8 items-center justify-center rounded-full bg-muted/50 text-muted-foreground hover:bg-muted transition-colors">
          <ListFilter className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
