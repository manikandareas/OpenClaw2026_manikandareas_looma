"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, BookOpen, ChevronLeft, ChevronRight, Clock, FileText, MessageSquare, ShieldAlert, Terminal } from "lucide-react";
import type { BehaviorSummary, ReplayChapter, ReplayEvent, ReplayMarker, ReplaySession } from "../types/replay";
import { REDACTED_PLACEHOLDER, getSafeDisplayText } from "../utils/display-payload";

type ReviewSidebarProps = {
  session: ReplaySession;
  behaviorSummary: BehaviorSummary;
  markers: ReplayMarker[];
  chapters: ReplayChapter[];
  notes: string;
  events: ReplayEvent[];
  currentIndex: number;
  currentEvent: ReplayEvent | null;
  redactionSummary: Record<string, unknown>;
  onSeekToEvent: (index: number) => void;
};

export function ReviewSidebar({
  session,
  behaviorSummary,
  markers,
  chapters,
  notes,
  events,
  currentIndex,
  currentEvent,
  redactionSummary,
  onSeekToEvent,
}: ReviewSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleMarkerClick = (marker: ReplayMarker) => {
    const targetIndex = events.findIndex((e) => e.seq >= marker.seq);
    if (targetIndex >= 0) onSeekToEvent(targetIndex);
  };

  const handleChapterClick = (chapter: ReplayChapter) => {
    const targetIndex = events.findIndex((e) => e.seq >= chapter.start_seq);
    if (targetIndex >= 0) onSeekToEvent(targetIndex);
  };

  const reviewMarkers = markers.filter((m) => m.needs_review);
  const infoMarkers = markers.filter((m) => !m.needs_review);

  if (isCollapsed) {
    return (
      <aside className="flex justify-end lg:block">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setIsCollapsed(false)}
          aria-label="Show review sidebar"
          className="lg:w-full"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="lg:hidden">Show review context</span>
        </Button>
      </aside>
    );
  }

  return (
    <aside className="space-y-4 overflow-y-auto rounded-lg border border-border bg-card p-3 lg:max-h-[680px]">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-foreground">Review Context</h2>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(true)}
          aria-label="Hide review sidebar"
          className="h-7 w-7"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <section className="space-y-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge variant="secondary">{session.harness}</Badge>
          <Badge variant="outline">{session.status}</Badge>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <InfoStat label="Events" value={events.length.toString()} />
          <InfoStat label="Duration" value={formatDurationLabel(session.duration_ms)} />
          <InfoStat label="Agent" value={session.agent_name ?? "agent"} />
          <InfoStat label="Workspace" value={session.workspace_name ?? "workspace"} />
        </div>
      </section>

      <section>
        <Separator className="mb-3" />
        <h3 className="text-sm font-medium text-foreground">Important Context</h3>
        <ContextList
          icon="file"
          items={asStringArray(behaviorSummary.important_files_json)}
          emptyLabel="No important files yet"
        />
        <ContextList
          icon="command"
          items={asStringArray(behaviorSummary.important_commands_json)}
          emptyLabel="No important commands yet"
        />
      </section>

      {currentEvent && (
        <section>
          <Separator className="mb-3" />
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-medium text-foreground">Current Event</h3>
            <Badge variant={sensitivityVariant(currentEvent.sensitivity)}>
              {currentEvent.sensitivity}
            </Badge>
          </div>
          <dl className="mt-2 space-y-1.5 text-xs">
            <DetailRow label="Seq" value={`#${currentEvent.seq}`} />
            <DetailRow label="Type" value={currentEvent.type} />
            <DetailRow label="Actor" value={currentEvent.actor} />
            {currentEvent.related_file ? (
              <DetailRow label="File" value={currentEvent.related_file} />
            ) : null}
            {currentEvent.related_command ? (
              <DetailRow
                label="Command"
                value={
                  currentEvent.redaction_applied
                    ? REDACTED_PLACEHOLDER
                    : currentEvent.related_command
                }
              />
            ) : null}
          </dl>
          {getSafeDisplayText(currentEvent) ? (
            <p className="mt-2 rounded-md bg-secondary px-2 py-1.5 text-xs text-muted-foreground">
              {getSafeDisplayText(currentEvent)}
            </p>
          ) : null}
          {currentEvent.redaction_applied ? (
            <p className="mt-2 flex items-start gap-1.5 rounded-md border border-red-500/30 bg-red-500/10 px-2 py-1.5 text-xs text-red-200">
              <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              Sensitive payload fields are shown from redacted replay data.
            </p>
          ) : null}
        </section>
      )}

      {hasRedactionSummary(redactionSummary) ? (
        <section>
          <Separator className="mb-3" />
          <h3 className="text-sm font-medium text-foreground">Redaction Notice</h3>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            This replay can include redacted event payloads. Renderers prefer redacted display
            data before any raw payload fallback.
          </p>
        </section>
      ) : null}

      {/* Needs Review */}
      {reviewMarkers.length > 0 && (
        <section>
          <h3 className="flex items-center gap-1.5 text-sm font-medium text-foreground">
            <AlertTriangle className="h-3.5 w-3.5 text-orange-400" />
            Needs Review ({reviewMarkers.length})
          </h3>
          <div className="mt-2 space-y-1.5">
            {reviewMarkers.map((marker) => (
              <MarkerItem
                key={marker.id}
                marker={marker}
                isActive={isMarkerActive(marker, events, currentIndex)}
                onClick={() => handleMarkerClick(marker)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Chapters */}
      {chapters.length > 0 && (
        <section>
          <Separator className="mb-3" />
          <h3 className="flex items-center gap-1.5 text-sm font-medium text-foreground">
            <BookOpen className="h-3.5 w-3.5 text-blue-400" />
            Chapters ({chapters.length})
          </h3>
          <div className="mt-2 space-y-1">
            {chapters.map((chapter) => (
              <button
                key={chapter.id}
                onClick={() => handleChapterClick(chapter)}
                className="flex w-full items-start gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-secondary"
              >
                <Clock className="mt-0.5 h-3 w-3 shrink-0 text-muted-foreground" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-foreground">{chapter.title}</p>
                  {chapter.summary && (
                    <p className="truncate text-xs text-muted-foreground">{chapter.summary}</p>
                  )}
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Info Markers */}
      {infoMarkers.length > 0 && (
        <section>
          <Separator className="mb-3" />
          <h3 className="text-sm font-medium text-foreground">
            Events ({infoMarkers.length})
          </h3>
          <div className="mt-2 space-y-1.5">
            {infoMarkers.slice(0, 20).map((marker) => (
              <MarkerItem
                key={marker.id}
                marker={marker}
                isActive={isMarkerActive(marker, events, currentIndex)}
                onClick={() => handleMarkerClick(marker)}
              />
            ))}
            {infoMarkers.length > 20 && (
              <p className="px-2 text-xs text-muted-foreground">
                +{infoMarkers.length - 20} more
              </p>
            )}
          </div>
        </section>
      )}

      {/* AI Notes */}
      {notes && (
        <section>
          <Separator className="mb-3" />
          <h3 className="flex items-center gap-1.5 text-sm font-medium text-foreground">
            <MessageSquare className="h-3.5 w-3.5 text-purple-400" />
            AI Session Notes
          </h3>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{notes}</p>
        </section>
      )}
    </aside>
  );
}

function InfoStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-md bg-secondary px-2 py-1.5">
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="truncate text-foreground">{value}</p>
    </div>
  );
}

function ContextList({
  icon,
  items,
  emptyLabel,
}: {
  icon: "file" | "command";
  items: string[];
  emptyLabel: string;
}) {
  const visibleItems = items.slice(0, 6);
  const Icon = icon === "file" ? FileText : Terminal;

  return (
    <div className="mt-2 space-y-1">
      {visibleItems.length > 0 ? (
        visibleItems.map((item) => (
          <div
            key={item}
            className="flex min-w-0 items-start gap-2 rounded-md bg-secondary/60 px-2 py-1.5 text-xs"
          >
            <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
            <span className="truncate text-foreground">{item}</span>
          </div>
        ))
      ) : (
        <p className="rounded-md bg-secondary/50 px-2 py-1.5 text-xs text-muted-foreground">
          {emptyLabel}
        </p>
      )}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[72px_1fr] gap-2">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="min-w-0 truncate text-foreground">{value}</dd>
    </div>
  );
}

function formatDurationLabel(durationMs: number | null): string {
  if (!durationMs || durationMs <= 0) return "0:00";

  const seconds = Math.floor(durationMs / 1000);
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${(seconds % 60).toString().padStart(2, "0")}`;
}

function sensitivityVariant(
  sensitivity: ReplayEvent["sensitivity"]
): "secondary" | "outline" | "destructive" {
  if (sensitivity === "high") return "destructive";
  if (sensitivity === "medium" || sensitivity === "low") return "outline";
  return "secondary";
}

function hasRedactionSummary(redactionSummary: Record<string, unknown>): boolean {
  return Object.keys(redactionSummary).length > 0;
}

function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function MarkerItem({
  marker,
  isActive,
  onClick,
}: {
  marker: ReplayMarker;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-start gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-secondary ${
        isActive ? "bg-secondary/80 ring-1 ring-accent/30" : ""
      }`}
    >
      <SeverityDot severity={marker.severity} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-foreground">{marker.label}</p>
        {marker.reason && (
          <p className="truncate text-xs text-muted-foreground">{marker.reason}</p>
        )}
      </div>
    </button>
  );
}

function SeverityDot({ severity }: { severity: ReplayMarker["severity"] }) {
  const colors: Record<string, string> = {
    info: "bg-blue-400",
    notice: "bg-yellow-400",
    important: "bg-orange-400",
    sensitive: "bg-red-400",
  };

  return (
    <span
      className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${colors[severity] ?? "bg-muted-foreground"}`}
    />
  );
}

function isMarkerActive(
  marker: ReplayMarker,
  events: ReplayEvent[],
  currentIndex: number
): boolean {
  const currentEvent = events[currentIndex];
  if (!currentEvent) return false;
  return currentEvent.seq === marker.seq;
}
