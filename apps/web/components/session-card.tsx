import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { SessionCard as SessionCardType } from "@/types/session";
import { cn } from "@/lib/utils";

const STATUS_META: Record<
  SessionCardType["status"],
  { label: string; stripe: string; badge: string; dot: string }
> = {
  recording: {
    label: "Recording",
    stripe: "border-l-[3px] border-l-red-500",
    badge: "border-red-500/35 bg-red-500/15 text-red-700 dark:text-red-300",
    dot: "bg-gradient-to-br from-red-400 via-red-500 to-rose-700 shadow-[0_0_0_3px_rgb(239_68_68/0.28)]",
  },
  processing: {
    label: "Processing",
    stripe: "border-l-[3px] border-l-amber-500",
    badge: "border-amber-500/35 bg-amber-500/15 text-amber-800 dark:text-amber-200",
    dot: "bg-gradient-to-br from-amber-300 via-amber-500 to-orange-700 shadow-[0_0_0_3px_rgb(245_158_11/0.28)]",
  },
  replay_ready: {
    label: "Completed",
    stripe: "border-l-[3px] border-l-emerald-500",
    badge: "border-emerald-500/35 bg-emerald-500/15 text-emerald-800 dark:text-emerald-200",
    dot: "bg-gradient-to-br from-emerald-400 via-teal-500 to-emerald-800 shadow-[0_0_0_3px_rgb(16_185_129/0.22)]",
  },
  failed: {
    label: "Failed",
    stripe: "border-l-[3px] border-l-destructive",
    badge: "border-destructive/40 bg-destructive/15 text-destructive",
    dot: "bg-gradient-to-br from-red-600 via-destructive to-rose-950 shadow-[0_0_0_3px_rgb(220_38_38/0.3)]",
  },
  stopped: {
    label: "Stopped",
    stripe: "border-l-[3px] border-l-muted-foreground",
    badge: "border-border bg-muted text-muted-foreground",
    dot: "bg-gradient-to-br from-stone-300 via-stone-500 to-stone-700 dark:from-stone-500 dark:via-stone-600 dark:to-stone-800 shadow-[0_0_0_3px_rgb(120_113_108/0.22)]",
  },
};

function formatDuration(ms: number | null): string | null {
  if (ms == null || ms <= 0) return null;
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  if (minutes === 0) return `${remainingSeconds}s`;
  return `${minutes}m ${remainingSeconds}s`;
}

function formatRelativeTimeShort(dateStr: string): string {
  const now = Date.now();
  const date = new Date(dateStr).getTime();
  const diffMs = now - date;
  const diffMin = Math.floor(diffMs / 60_000);
  if (diffMin < 1) return "now";
  if (diffMin < 60) return `${diffMin}m`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d`;
}

type Props = {
  session: SessionCardType;
};

export function SessionCard({ session }: Props) {
  const meta = STATUS_META[session.status] ?? STATUS_META.stopped;
  const timeLabel = formatRelativeTimeShort(session.createdAt);
  const durationLabel = formatDuration(session.durationMs);

  const ariaParts = [
    session.name,
    meta.label,
    session.harness,
    durationLabel,
    timeLabel,
  ].filter(Boolean) as string[];

  return (
    <Link href={`/session/${session.id}`} aria-label={ariaParts.join(", ")} className="group block">
      <Card
        className={cn(
          "overflow-hidden rounded-xl border border-border bg-transparent text-card-foreground shadow-none transition-colors hover:border-foreground/25",
          meta.stripe
        )}
      >
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <div className="flex min-w-0 flex-1 items-start gap-3">
            <span
              className={cn(
                "mt-0.5 h-9 w-9 shrink-0 rounded-full ring-1 ring-black/5 dark:ring-white/10",
                meta.dot,
                session.status === "recording" && "motion-safe:animate-pulse"
              )}
              aria-hidden
            />
            <div className="min-w-0 flex-1 space-y-1">
              <p className="truncate text-sm font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
                {session.name}
              </p>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                <span className="font-mono text-[11px] text-muted-foreground/90">
                  {session.harness}
                </span>
                {session.agentName ? (
                  <>
                    <span className="text-border" aria-hidden>
                      ·
                    </span>
                    <span className="truncate">{session.agentName}</span>
                  </>
                ) : null}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:justify-end sm:gap-3">
            <Badge variant="outline" className={cn("text-[11px] font-medium", meta.badge)}>
              {meta.label}
            </Badge>
            {durationLabel ? (
              <span className="rounded-md border border-border bg-muted/50 px-2 py-0.5 font-mono text-[11px] tabular-nums text-muted-foreground">
                {durationLabel}
              </span>
            ) : null}
            <span className="text-xs tabular-nums text-muted-foreground">{timeLabel}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
