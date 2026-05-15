"use client";

import { Input } from "@/components/ui/input";
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
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <Input
        placeholder="Search sessions..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="sm:max-w-[240px]"
      />
      <Select value={status} onValueChange={setStatus}>
        <SelectTrigger className="sm:w-[160px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {STATUS_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
