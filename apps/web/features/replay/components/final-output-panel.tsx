"use client";

import { CheckCircle2, FileText, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ReplayFinalOutput } from "../types/replay";

type FinalOutputPanelProps = {
  finalOutput: ReplayFinalOutput | null;
  compact?: boolean;
  className?: string;
};

export function FinalOutputPanel({ finalOutput, compact = false, className }: FinalOutputPanelProps) {
  if (!finalOutput) {
    return (
      <section className={cn("rounded-lg border border-dashed border-border bg-background/40 p-3", className)}>
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-medium text-foreground">Final Output</h3>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          No final output has been captured for this session yet.
        </p>
      </section>
    );
  }

  return (
    <section className={cn("rounded-lg border border-border/80 bg-background/50 p-3", className)}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="flex min-w-0 items-center gap-2 text-sm font-medium text-foreground">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
            <span className="truncate">Final Output</span>
          </h3>
          <p className="mt-1 truncate text-xs text-muted-foreground">{finalOutput.title}</p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-1.5">
          <Badge variant={finalOutput.isExplicit ? "secondary" : "outline"} className="text-[10px]">
            {finalOutput.isExplicit ? "captured" : "inferred"}
          </Badge>
          <Badge variant="outline" className="text-[10px]">
            {finalOutput.format}
          </Badge>
        </div>
      </div>

      <pre
        className={cn(
          "mt-3 max-h-72 overflow-auto whitespace-pre-wrap rounded-md bg-secondary/70 p-3 font-sans text-xs leading-relaxed text-foreground",
          compact ? "max-h-48" : "sm:text-sm"
        )}
      >
        {finalOutput.content}
      </pre>

      {finalOutput.redactionApplied ? (
        <p className="mt-2 flex items-start gap-1.5 rounded-md border border-red-500/30 bg-red-500/10 px-2 py-1.5 text-xs text-red-200">
          <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          Sensitive fields in this final output were redacted before display.
        </p>
      ) : null}

      {finalOutput.seq ? (
        <p className="mt-2 text-[11px] text-muted-foreground">Captured at event #{finalOutput.seq}</p>
      ) : null}
    </section>
  );
}
