import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { SessionCard as SessionCardType } from "@/types/session";

const STATUS_VARIANTS: Record<string, { label: string; className: string }> = {
  recording: { label: "Recording", className: "bg-red-500/20 text-red-400 border-red-500/30" },
  processing: { label: "Processing", className: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
  replay_ready: { label: "Completed", className: "bg-green-500/20 text-green-400 border-green-500/30" },
  failed: { label: "Failed", className: "bg-red-500/20 text-red-300 border-red-500/30" },
  stopped: { label: "Stopped", className: "bg-muted text-muted-foreground border-border" },
};

function formatDuration(ms: number | null): string {
  if (!ms) return "—";
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  if (minutes === 0) return `${remainingSeconds}s`;
  return `${minutes}m ${remainingSeconds}s`;
}

function formatRelativeTime(dateStr: string): string {
  const now = Date.now();
  const date = new Date(dateStr).getTime();
  const diffMs = now - date;
  const diffMin = Math.floor(diffMs / 60_000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

type Props = {
  session: SessionCardType;
};

export function SessionCard({ session }: Props) {
  const statusInfo = STATUS_VARIANTS[session.status] || STATUS_VARIANTS.stopped;

  return (
    <Link href={`/session/${session.id}`}>
      <Card className="transition-colors hover:bg-muted/50">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="truncate text-sm font-medium">{session.name}</h3>
            <Badge variant="outline" className={statusInfo.className}>
              {statusInfo.label}
            </Badge>
          </div>
          <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="rounded bg-muted px-1.5 py-0.5 font-mono">
              {session.harness}
            </span>
            <span>{formatDuration(session.durationMs)}</span>
            {session.markerCount > 0 && (
              <span>{session.markerCount} markers</span>
            )}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {formatRelativeTime(session.createdAt)}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
