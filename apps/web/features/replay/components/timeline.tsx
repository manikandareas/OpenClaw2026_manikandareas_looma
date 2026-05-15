"use client";

import { useCallback, useRef } from "react";
import type { ReplayChapter, ReplayEvent, ReplayMarker, TimelineSegment } from "../types/replay";
import { formatDuration, computeTotalDurationMs, computeElapsedMs } from "../utils/timing";

type TimelineProps = {
  events: ReplayEvent[];
  markers: ReplayMarker[];
  chapters: ReplayChapter[];
  segments: TimelineSegment[];
  currentIndex: number;
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
  progress,
  totalDurationMs,
  onSeek,
}: TimelineProps) {
  const trackRef = useRef<HTMLDivElement>(null);

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
      {/* Chapter labels */}
      {chapters.length > 0 && (
        <div className="relative h-5 text-[10px] text-muted-foreground">
          {chapters.map((chapter) => {
            const startPercent =
              events.length > 0
                ? (events.findIndex((e) => e.seq >= chapter.start_seq) / events.length) * 100
                : 0;
            return (
              <span
                key={chapter.id}
                className="absolute truncate"
                style={{ left: `${startPercent}%`, maxWidth: "120px" }}
              >
                {chapter.title}
              </span>
            );
          })}
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
              className="absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-background"
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
