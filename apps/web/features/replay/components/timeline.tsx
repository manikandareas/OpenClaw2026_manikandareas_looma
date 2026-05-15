"use client";

import { useCallback, useMemo, useRef } from "react";
import type { ReplayChapter, ReplayEvent, ReplayMarker, TimelineSegment } from "../types/replay";
import { formatDuration, computeTotalDurationMs, computeElapsedMs } from "../utils/timing";

function computeChapterCells(chapters: ReplayChapter[], events: ReplayEvent[]) {
  if (chapters.length === 0 || events.length === 0) return [];

  const sorted = [...chapters].sort((a, b) => a.start_seq - b.start_seq);
  const cells: { id: string; title: string; flexWeight: number }[] = [];

  for (let i = 0; i < sorted.length; i++) {
    const chapter = sorted[i]!;
    const startIdx = events.findIndex((e) => e.seq >= chapter.start_seq);
    if (startIdx < 0) continue;

    let endIdx: number;
    if (chapter.end_seq != null) {
      const endSeq = chapter.end_seq;
      const afterEnd = events.findIndex((e) => e.seq > endSeq);
      endIdx = afterEnd === -1 ? events.length - 1 : afterEnd - 1;
    } else if (sorted[i + 1]) {
      const nextStart = events.findIndex((e) => e.seq >= sorted[i + 1]!.start_seq);
      endIdx =
        nextStart === -1 ? events.length - 1 : Math.max(startIdx, nextStart - 1);
    } else {
      endIdx = events.length - 1;
    }

    endIdx = Math.min(Math.max(endIdx, startIdx), events.length - 1);
    const flexWeight = endIdx - startIdx + 1;
    cells.push({ id: chapter.id, title: chapter.title, flexWeight });
  }

  return cells;
}

type TimelineProps = {
  events: ReplayEvent[];
  markers: ReplayMarker[];
  chapters: ReplayChapter[];
  segments: TimelineSegment[];
  currentIndex: number;
  activeMarkerSeq: number | null;
  progress: number;
  totalDurationMs: number | null;
  onSeek: (index: number) => void;
};

export function Timeline({
  events,
  markers,
  chapters,
  segments,
  currentIndex,
  activeMarkerSeq,
  progress,
  totalDurationMs,
  onSeek,
}: TimelineProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  const chapterCells = useMemo(() => computeChapterCells(chapters, events), [chapters, events]);

  const totalMs = computeTotalDurationMs(events, totalDurationMs);
  const elapsedMs = computeElapsedMs(events, currentIndex);

  const handleTrackClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const track = trackRef.current;
      if (!track || events.length === 0) return;

      const rect = track.getBoundingClientRect();
      const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const targetIndex = Math.round(percent * (events.length - 1));
      onSeek(targetIndex);
    },
    [events, onSeek]
  );

  const handleDrag = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const track = trackRef.current;
      if (!track || events.length === 0) return;

      e.currentTarget.setPointerCapture(e.pointerId);

      const onMove = (moveEvent: PointerEvent) => {
        const rect = track.getBoundingClientRect();
        const percent = Math.max(0, Math.min(1, (moveEvent.clientX - rect.left) / rect.width));
        const targetIndex = Math.round(percent * (events.length - 1));
        onSeek(targetIndex);
      };

      const onUp = () => {
        document.removeEventListener("pointermove", onMove);
        document.removeEventListener("pointerup", onUp);
      };

      document.addEventListener("pointermove", onMove);
      document.addEventListener("pointerup", onUp);
    },
    [events, onSeek]
  );

  return (
    <div className="space-y-1.5">
      {/* Chapter strip: flex widths match event span so labels do not overlap */}
      {chapterCells.length > 0 && (
        <div
          className="hidden w-full rounded-md border border-border/50 bg-muted/25 sm:block"
          role="list"
          aria-label="Session chapters"
        >
          <div className="flex min-h-9 divide-x divide-border/50">
            {chapterCells.map((cell) => (
              <div
                key={cell.id}
                role="listitem"
                className="min-w-0 px-1.5 py-1.5 first:pl-2 last:pr-2"
                style={{ flex: `${cell.flexWeight} 1 0%` }}
                title={cell.title}
              >
                <p className="line-clamp-2 text-left text-[10px] leading-snug tracking-tight text-muted-foreground">
                  {cell.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Track */}
      <div
        ref={trackRef}
        className="relative h-8 cursor-pointer rounded-md bg-secondary"
        onClick={handleTrackClick}
        onPointerDown={handleDrag}
      >
        {/* Colored segments */}
        {segments.map((segment, i) => (
          <div
            key={i}
            className="absolute top-0 h-full rounded-sm opacity-60"
            style={{
              left: `${segment.startPercent * 100}%`,
              width: `${(segment.endPercent - segment.startPercent) * 100}%`,
              backgroundColor:
                segment.color === "green"
                  ? "#22c55e"
                  : segment.color === "yellow"
                    ? "#eab308"
                    : "#ef4444",
            }}
          />
        ))}

        {/* Marker dots */}
        {markers.map((marker) => {
          const markerIndex = events.findIndex((e) => e.seq >= marker.seq);
          if (markerIndex < 0) return null;
          const percent = (markerIndex / Math.max(events.length - 1, 1)) * 100;
          return (
            <div
              key={marker.id}
              className={`absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-background transition-all ${
                activeMarkerSeq === marker.seq
                  ? "h-4 w-4 ring-2 ring-foreground/70"
                  : "h-2.5 w-2.5"
              }`}
              style={{
                left: `${percent}%`,
                backgroundColor: marker.needs_review ? "#ef4444" : "#a1a1aa",
              }}
              title={marker.label}
            />
          );
        })}

        {/* Playhead */}
        <div
          className="absolute top-0 h-full w-0.5 bg-foreground shadow-sm transition-[left] duration-75"
          style={{ left: `${progress * 100}%` }}
        >
          <div className="absolute -left-1.5 -top-1 h-3 w-3.5 rounded-sm bg-foreground" />
        </div>
      </div>

      {/* Time display */}
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{formatDuration(elapsedMs)}</span>
        <span>{formatDuration(totalMs)}</span>
      </div>
    </div>
  );
}
