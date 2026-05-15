"use client";

import type { BehaviorSummary } from "../types/replay";
import { BookOpen, Pencil, Play, XCircle, Wrench, CheckCircle, AlertTriangle } from "lucide-react";

const METRICS = [
  { key: "read_count", label: "Read", icon: BookOpen, color: "text-blue-400" },
  { key: "edit_count", label: "Edit", icon: Pencil, color: "text-green-400" },
  { key: "run_count", label: "Run", icon: Play, color: "text-purple-400" },
  { key: "fail_count", label: "Fail", icon: XCircle, color: "text-red-400" },
  { key: "fix_count", label: "Fix", icon: Wrench, color: "text-yellow-400" },
  { key: "verify_count", label: "Verify", icon: CheckCircle, color: "text-emerald-400" },
  { key: "review_count", label: "Review", icon: AlertTriangle, color: "text-orange-400" },
] as const;

export function BehaviorMap({ summary }: { summary: BehaviorSummary }) {
  return (
    <div className="flex flex-wrap gap-3">
      {METRICS.map(({ key, label, icon: Icon, color }) => {
        const value = summary[key] ?? 0;
        if (value === 0) return null;
        return (
          <div
            key={key}
            className="flex items-center gap-1.5 rounded-md bg-secondary px-2.5 py-1"
          >
            <Icon className={`h-3.5 w-3.5 ${color}`} />
            <span className="text-xs font-medium text-foreground">{value}</span>
            <span className="text-xs text-muted-foreground">{label}</span>
          </div>
        );
      })}
    </div>
  );
}
