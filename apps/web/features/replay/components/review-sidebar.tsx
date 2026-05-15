"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileText,
  MessageSquare,
  ShieldAlert,
  Terminal,
  Bot,
  Eye,
  MousePointer2,
  Activity,
  Flag,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  BehaviorSummary,
  ReplayChapter,
  ReplayEvent,
  ReplayFinalOutput,
  ReplayMarker,
  ReplaySession,
} from "../types/replay";
import {
  REDACTED_PLACEHOLDER,
  getSafeDisplayText,
} from "../utils/display-payload";
import { FinalOutputPanel } from "./final-output-panel";

type ReviewSidebarProps = {
  session: ReplaySession;
  behaviorSummary: BehaviorSummary;
  markers: ReplayMarker[];
  chapters: ReplayChapter[];
  notes: string;
  finalOutput: ReplayFinalOutput | null;
  events: ReplayEvent[];
  currentIndex: number;
  currentEvent: ReplayEvent | null;
  redactionSummary: Record<string, unknown>;
  onSeekToEvent: (index: number) => void;
  activeMarkerSeq: number | null;
  /** `horizontal`: full-width band below the player; sections in a responsive row grid. */
  layout?: "sidebar" | "horizontal";
};

type TimelineItem =
  | { type: "chapter"; data: ReplayChapter; seq: number }
  | { type: "marker"; data: ReplayMarker; seq: number };

export function ReviewSidebar({
  session,
  behaviorSummary,
  markers,
  chapters,
  notes,
  finalOutput,
  events,
  currentIndex,
  currentEvent,
  redactionSummary,
  onSeekToEvent,
  activeMarkerSeq,
  layout = "sidebar",
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

  const timelineItems: TimelineItem[] = [
    ...chapters.map((c) => ({ type: "chapter" as const, data: c, seq: c.start_seq })),
    ...markers.map((m) => ({ type: "marker" as const, data: m, seq: m.seq })),
  ].sort((a, b) => a.seq - b.seq);

  const reviewMarkersCount = markers.filter((m) => m.needs_review).length;

  if (layout === "horizontal") {
    return (
      <div className="flex w-full flex-col gap-6 md:flex-row md:items-stretch lg:gap-8">
        {/* Left Column — Overall Session */}
        <aside className="flex w-full min-w-0 flex-1 flex-col gap-6">
          {notes ? (
            <ReviewCard icon={MessageSquare} title="AI Session Notes">
              <p className="max-h-40 overflow-y-auto text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
                {notes}
              </p>
            </ReviewCard>
          ) : null}

          <ReviewCard icon={FileText} title="Important context">
            <div className="space-y-4">
              <ContextList
                icon="file"
                items={asStringArray(behaviorSummary.important_files_json)}
                emptyLabel="No important files"
              />
              <ContextList
                icon="command"
                items={asStringArray(behaviorSummary.important_commands_json)}
                emptyLabel="No important commands"
              />
            </div>
          </ReviewCard>

          <ReviewCard icon={Activity} title="Session stats">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <StatCell label="Events" value={String(events.length)} />
                <StatCell label="Chapters" value={String(chapters.length)} />
                <StatCell label="Markers" value={String(markers.length)} />
                <StatCell
                  label="Needs review"
                  value={String(reviewMarkersCount)}
                  highlight={reviewMarkersCount > 0}
                />
              </div>
              <div className="pt-4 border-t border-border">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-2">
                  Agent activity
                </p>
                <div className="grid grid-cols-3 gap-x-3 gap-y-2 text-xs text-muted-foreground">
                  <span>Read {behaviorSummary.read_count}</span>
                  <span>Edit {behaviorSummary.edit_count}</span>
                  <span>Run {behaviorSummary.run_count}</span>
                  <span>Fail {behaviorSummary.fail_count}</span>
                  <span>Fix {behaviorSummary.fix_count}</span>
                  <span>Verify {behaviorSummary.verify_count}</span>
                  <span className="col-span-3">Review {behaviorSummary.review_count}</span>
                </div>
              </div>
              <div className="pt-4 border-t border-border">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground mb-1">
                  Agent
                </p>
                <p className="text-sm font-medium text-foreground truncate">
                  {session.agent_name ?? "—"}
                </p>
              </div>
            </div>
          </ReviewCard>
        </aside>

        {/* Right Column — Playback/Event */}
        <div className="flex w-full min-w-0 flex-1 flex-col items-stretch gap-6">
          <ReviewCard 
            icon={Clock} 
            title="Timeline" 
            subtitle="Chapters and markers in playback order — click to seek."
            noPadding
            rightElement={
              reviewMarkersCount > 0 ? (
                <Badge
                  variant="outline"
                  className="shrink-0 gap-1 text-[10px] font-normal text-orange-600 dark:text-orange-400 border-orange-500/40"
                >
                  <Flag className="h-3 w-3" />
                  {reviewMarkersCount} to review
                </Badge>
              ) : null
            }
          >
            <div className="p-3 space-y-3">
              {finalOutput && (
                <div className="p-1">
                  <FinalOutputPanel finalOutput={finalOutput} compact />
                </div>
              )}

              <div className={cn("px-1 pb-1", finalOutput && "border-t border-border pt-3")}>
                {timelineItems.length > 0 ? (
                  <div className="space-y-1">
                    {timelineItems.map((item, idx) => (
                      <TimelineListItem 
                        key={`${item.type}-${item.seq}-${idx}`} 
                        item={item} 
                        isActive={
                          item.type === "marker" 
                            ? isMarkerActive(item.data, events, currentIndex, activeMarkerSeq)
                            : false
                        }
                        onClick={() => {
                          if (item.type === "marker") handleMarkerClick(item.data);
                          else handleChapterClick(item.data);
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground p-4 text-center">No timeline events to display.</p>
                )}
              </div>
            </div>
          </ReviewCard>

          {currentEvent ? (
            <ReviewCard 
              icon={Terminal} 
              title="Current event"
              rightElement={
                <Badge
                  variant={sensitivityVariant(currentEvent.sensitivity)}
                  className="text-[10px] font-normal"
                >
                  {currentEvent.sensitivity}
                </Badge>
              }
            >
              <dl className="space-y-1.5 text-sm">
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
                <p className="mt-3 rounded-md bg-secondary/50 px-3 py-2 text-xs text-muted-foreground break-words">
                  {getSafeDisplayText(currentEvent)}
                </p>
              ) : null}
              {currentEvent.redaction_applied ? (
                <p className="mt-3 flex items-start gap-1.5 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                  <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  Sensitive fields use redacted replay data.
                </p>
              ) : null}
            </ReviewCard>
          ) : null}

          {hasRedactionSummary(redactionSummary) ? (
            <ReviewCard 
              icon={ShieldAlert} 
              title="Redaction notice" 
              variant="destructive"
            >
              <p className="text-xs text-destructive/90 leading-relaxed">
                This replay can include redacted event payloads. Renderers
                prefer redacted display data before any raw payload fallback.
              </p>
            </ReviewCard>
          ) : null}
        </div>
      </div>
    );
  }

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
    <aside className={cn("space-y-6 overflow-y-auto lg:max-h-[800px]")}>
      <ReviewCard 
        icon={Bot} 
        title={session.name || "Session"}
        rightElement={
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
        }
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3 shrink-0" />
            <span>
              {formatDurationHuman(session.duration_ms)} ·{" "}
              {formatDurationLabel(session.duration_ms)}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="bg-secondary text-secondary-foreground font-normal">{session.harness}</Badge>
            <Badge variant="outline" className="font-normal">{session.status}</Badge>
          </div>

          <div className="grid gap-2 text-xs">
            <div className="rounded-lg border border-border bg-secondary/40 px-3 py-2">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Started</p>
              <p className="text-sm font-medium text-foreground mt-0.5">{formatSessionDateTime(session.started_at)}</p>
            </div>
            {session.ended_at ? (
              <div className="rounded-lg border border-border bg-secondary/40 px-3 py-2">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Ended</p>
                <p className="text-sm font-medium text-foreground mt-0.5">{formatSessionDateTime(session.ended_at)}</p>
              </div>
            ) : null}
          </div>
        </div>
      </ReviewCard>

      {notes ? (
        <ReviewCard icon={MessageSquare} title="AI Session Notes">
          <p className="max-h-36 overflow-y-auto text-xs leading-relaxed text-muted-foreground whitespace-pre-wrap">
            {notes}
          </p>
        </ReviewCard>
      ) : null}

      <ReviewCard icon={FileText} title="Important context">
        <ContextList icon="file" items={asStringArray(behaviorSummary.important_files_json)} emptyLabel="No important files" />
        <div className="mt-3">
          <ContextList icon="command" items={asStringArray(behaviorSummary.important_commands_json)} emptyLabel="No important commands" />
        </div>
      </ReviewCard>

      <ReviewCard icon={Activity} title="Session stats">
        <div className="grid grid-cols-2 gap-2 text-xs">
          <StatCell label="Events" value={String(events.length)} />
          <StatCell label="Chapters" value={String(chapters.length)} />
          <StatCell label="Markers" value={String(markers.length)} />
          <StatCell
            label="Needs review"
            value={String(markers.filter((m) => m.needs_review).length)}
            highlight={markers.some((m) => m.needs_review)}
          />
        </div>
        <div className="pt-2 mt-2 border-t border-border grid grid-cols-3 gap-x-1 gap-y-0.5 text-[10px] text-muted-foreground">
          <span>R {behaviorSummary.read_count}</span>
          <span>E {behaviorSummary.edit_count}</span>
          <span>Run {behaviorSummary.run_count}</span>
          <span>F {behaviorSummary.fail_count}</span>
          <span>Fix {behaviorSummary.fix_count}</span>
          <span>V {behaviorSummary.verify_count}</span>
          <span className="col-span-3">Rev {behaviorSummary.review_count}</span>
        </div>
        <p className="text-[10px] text-muted-foreground pt-2 mt-2 border-t border-border">
          Agent: <span className="font-medium text-foreground">{session.agent_name ?? "—"}</span>
        </p>
      </ReviewCard>

      <ReviewCard 
        icon={Clock} 
        title="Timeline"
        noPadding
      >
        <div className="p-2 space-y-2">
          {finalOutput && (
            <div className="p-1">
              <FinalOutputPanel finalOutput={finalOutput} compact />
            </div>
          )}

          <div className={cn("px-1 pb-1", finalOutput && "border-t border-border pt-2")}>
            {timelineItems.length > 0 ? (
              <div className="space-y-0.5">
                {timelineItems.map((item, idx) => (
                  <TimelineListItem 
                    key={`${item.type}-${item.seq}-${idx}`} 
                    item={item} 
                    isActive={
                      item.type === "marker" 
                        ? isMarkerActive(item.data, events, currentIndex, activeMarkerSeq)
                        : false
                    }
                    onClick={() => {
                      if (item.type === "marker") handleMarkerClick(item.data);
                      else handleChapterClick(item.data);
                    }}
                  />
                ))}
              </div>
            ) : (
              <p className="text-[10px] text-muted-foreground p-2 text-center">No timeline events.</p>
            )}
          </div>
        </div>
      </ReviewCard>

      {currentEvent ? (
        <ReviewCard 
          icon={Terminal} 
          title="Current event"
          rightElement={
            <Badge variant={sensitivityVariant(currentEvent.sensitivity)} className="text-[10px] font-normal">
              {currentEvent.sensitivity}
            </Badge>
          }
        >
          <dl className="space-y-1 text-[10px]">
            <DetailRow label="Seq" value={`#${currentEvent.seq}`} />
            <DetailRow label="Type" value={currentEvent.type} />
            <DetailRow label="Actor" value={currentEvent.actor} />
            {currentEvent.related_file ? (
              <DetailRow label="File" value={currentEvent.related_file} />
            ) : null}
            {currentEvent.related_command ? (
              <DetailRow
                label="Cmd"
                value={currentEvent.redaction_applied ? REDACTED_PLACEHOLDER : currentEvent.related_command}
              />
            ) : null}
          </dl>
          {getSafeDisplayText(currentEvent) ? (
            <p className="mt-2 rounded-md bg-secondary px-2 py-1.5 text-[10px] text-muted-foreground break-words">
              {getSafeDisplayText(currentEvent)}
            </p>
          ) : null}
        </ReviewCard>
      ) : null}

      {hasRedactionSummary(redactionSummary) ? (
        <ReviewCard icon={ShieldAlert} title="Redaction notice" variant="warning">
          <p className="text-xs text-orange-600/90 dark:text-orange-400/90 leading-relaxed">
            This replay can include redacted event payloads. Renderers prefer
            redacted display data before any raw payload fallback.
          </p>
        </ReviewCard>
      ) : null}
    </aside>
  );
}

function ReviewCard({
  icon: Icon,
  title,
  subtitle,
  rightElement,
  children,
  variant = "default",
  noPadding = false,
  className,
}: {
  icon?: React.ElementType;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  rightElement?: React.ReactNode;
  children: React.ReactNode;
  variant?: "default" | "destructive" | "warning";
  noPadding?: boolean;
  className?: string;
}) {
  const isDestructive = variant === "destructive";
  const isWarning = variant === "warning";
  
  return (
    <div className={cn(
      "w-full rounded-xl border shadow-sm overflow-hidden",
      isDestructive ? "border-destructive/30 bg-destructive/5" : 
      isWarning ? "border-orange-500/30 bg-orange-500/5" : 
      "border-border bg-card",
      className
    )}>
      <div className={cn(
        "px-4 py-3 border-b flex items-start justify-between gap-3",
        isDestructive ? "border-destructive/20 bg-destructive/10" : 
        isWarning ? "border-orange-500/20 bg-orange-500/10" :
        "border-border bg-secondary/20"
      )}>
        <div>
          <h3 className={cn(
            "text-sm font-medium flex items-center gap-1.5",
            isDestructive ? "text-destructive" : 
            isWarning ? "text-orange-600 dark:text-orange-400" :
            "text-foreground"
          )}>
            {Icon && <Icon className="h-4 w-4" />}
            {title}
          </h3>
          {subtitle && (
            <p className={cn(
              "text-xs mt-0.5",
              isDestructive ? "text-destructive/80" :
              isWarning ? "text-orange-600/80 dark:text-orange-400/80" :
              "text-muted-foreground"
            )}>
              {subtitle}
            </p>
          )}
        </div>
        {rightElement && (
          <div className="shrink-0">{rightElement}</div>
        )}
      </div>
      <div className={cn(noPadding ? "" : "p-4")}>
        {children}
      </div>
    </div>
  );
}

function TimelineListItem({
  item,
  isActive,
  onClick,
}: {
  item: TimelineItem;
  isActive: boolean;
  onClick: () => void;
}) {
  if (item.type === "chapter") {
    const chapter = item.data;
    return (
      <button
        onClick={onClick}
        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors hover:bg-secondary/80"
      >
        <BookOpen className="h-4 w-4 shrink-0 text-foreground/70" />
        <div className="min-w-0 flex-1 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="truncate text-foreground font-medium">{chapter.title}</p>
            {chapter.summary && (
              <p className="truncate text-xs text-muted-foreground mt-0.5">
                {chapter.summary}
              </p>
            )}
          </div>
          <div className="shrink-0 text-xs text-muted-foreground whitespace-nowrap">
            Seq {chapter.start_seq}
          </div>
        </div>
      </button>
    );
  } else {
    const marker = item.data;
    const isReview = marker.needs_review;
    
    const iconClass = cn(
      "h-4 w-4 shrink-0",
      isReview ? "text-orange-500" : "text-foreground/70"
    );

    let IconElement;
    switch (marker.severity) {
      case "info":
        IconElement = <Eye className={iconClass} />;
        break;
      case "notice":
        IconElement = <MousePointer2 className={iconClass} />;
        break;
      case "important":
        IconElement = <AlertTriangle className={iconClass} />;
        break;
      case "sensitive":
        IconElement = <ShieldAlert className={iconClass} />;
        break;
      default:
        IconElement = <MessageSquare className={iconClass} />;
        break;
    }
    
    return (
      <button
        onClick={onClick}
        className={cn(
          "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors hover:bg-secondary/80",
          isActive && "bg-secondary ring-1 ring-border shadow-sm"
        )}
      >
        {IconElement}
        <div className="min-w-0 flex-1 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="truncate text-foreground">{marker.label}</p>
            {marker.reason && (
              <p className="truncate text-xs text-muted-foreground mt-0.5">
                {marker.reason}
              </p>
            )}
          </div>
          <div className="shrink-0 text-xs text-muted-foreground whitespace-nowrap">
            Seq {marker.seq}
          </div>
        </div>
      </button>
    );
  }
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

function StatCell({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-md border border-border bg-secondary/40 px-2 py-1.5",
        highlight && "border-orange-500/40 bg-orange-500/5",
      )}
    >
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}

function formatSessionDateTime(iso: string | null): string {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "—";
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(d);
  } catch {
    return "—";
  }
}

function formatDurationHuman(durationMs: number | null): string {
  if (!durationMs || durationMs <= 0) return "—";
  const s = Math.floor(durationMs / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  if (h > 0) return `${h}h ${m % 60}m`;
  if (m > 0) return `${m}m`;
  if (s >= 1) return `${s}s`;
  return "<1s";
}

function formatDurationLabel(durationMs: number | null): string {
  if (!durationMs || durationMs <= 0) return "0:00";

  const seconds = Math.floor(durationMs / 1000);
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${(seconds % 60).toString().padStart(2, "0")}`;
}

function sensitivityVariant(
  sensitivity: ReplayEvent["sensitivity"],
): "secondary" | "outline" | "destructive" {
  if (sensitivity === "high") return "destructive";
  if (sensitivity === "medium" || sensitivity === "low") return "outline";
  return "secondary";
}

function hasRedactionSummary(
  redactionSummary: Record<string, unknown>,
): boolean {
  return Object.keys(redactionSummary).length > 0;
}

function asStringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function isMarkerActive(
  marker: ReplayMarker,
  events: ReplayEvent[],
  currentIndex: number,
  activeMarkerSeq: number | null,
): boolean {
  if (activeMarkerSeq === marker.seq) return true;
  const currentEvent = events[currentIndex];
  if (!currentEvent) return false;
  return currentEvent.seq === marker.seq;
}
