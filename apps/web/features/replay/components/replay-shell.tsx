"use client";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useReplay } from "../api/get-replay";
import { usePlaybackEngine } from "../hooks/use-playback-engine";
import { useTimelineSegments } from "../hooks/use-timeline-segments";
import { ReplayViewport } from "./replay-viewport";
import { ModeBadge } from "./mode-badge";
import { FileBreadcrumb } from "./file-breadcrumb";
import { Timeline } from "./timeline";
import { PlaybackControls } from "./playback-controls";
import { ReviewSidebar } from "./review-sidebar";
import { RecordingIndicator } from "./recording-indicator";
import { BehaviorMap } from "./behavior-map";

export function ReplayShell({ sessionId }: { sessionId: string }) {
  const { data, isLoading, error } = useReplay(sessionId);

  if (isLoading) return <ReplayLoadingSkeleton />;
  if (error || !data) {
    return (
      <div className="flex h-96 items-center justify-center text-muted-foreground">
        <p>Failed to load replay data.</p>
      </div>
    );
  }

  return <ReplayPlayer data={data} />;
}

function ReplayPlayer({ data }: { data: NonNullable<ReturnType<typeof useReplay>["data"]> }) {
  const { session, events, markers, chapters, behaviorSummary, notes, redactionSummary } = data;
  const { state, play, pause, seekTo, setSpeed, jumpToInteresting, currentEvent } =
    usePlaybackEngine(events);
  const segments = useTimelineSegments(events);

  const isLive = session.status === "recording";

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">{session.name}</h1>
            {isLive && <RecordingIndicator eventCount={events.length} />}
          </div>
          <div className="mt-1 flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {session.harness}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {session.workspace_name ?? "workspace"}
            </span>
          </div>
        </div>
        <Badge
          variant={isLive ? "destructive" : "secondary"}
          className="text-xs uppercase tracking-wider"
        >
          {session.status}
        </Badge>
      </div>

      {/* Behavior Map */}
      <BehaviorMap summary={behaviorSummary} />

      {/* Main Layout */}
      <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
        {/* Viewport Column */}
        <div className="space-y-3">
          {/* Viewport Chrome */}
          <div className="relative min-h-[500px] overflow-hidden rounded-xl border border-border bg-black">
            {/* Mode Badge */}
            <div className="absolute right-3 top-3 z-10">
              <ModeBadge mode={state.currentMode} />
            </div>

            {/* File Breadcrumb */}
            {(state.currentMode === "editor" || state.currentMode === "diff") && (
              <div className="absolute left-3 top-3 z-10">
                <FileBreadcrumb file={state.currentFile} />
              </div>
            )}

            {/* Viewport */}
            <div className="h-[500px]">
              <ReplayViewport
                mode={state.currentMode}
                event={currentEvent}
                speed={state.speed}
              />
            </div>
          </div>

          {/* Timeline */}
          <Timeline
            events={events}
            markers={markers}
            chapters={chapters}
            segments={segments}
            currentIndex={state.currentIndex}
            progress={state.progress}
            totalDurationMs={session.duration_ms}
            onSeek={seekTo}
          />

          {/* Playback Controls */}
          <PlaybackControls
            isPlaying={state.isPlaying}
            speed={state.speed}
            currentIndex={state.currentIndex}
            totalEvents={events.length}
            onPlay={play}
            onPause={pause}
            onSpeedChange={setSpeed}
            onJumpToInteresting={() => jumpToInteresting(markers)}
            hasReviewMarkers={markers.some((m) => m.needs_review)}
          />
        </div>

        {/* Sidebar */}
        <ReviewSidebar
          session={session}
          behaviorSummary={behaviorSummary}
          markers={markers}
          chapters={chapters}
          notes={notes}
          events={events}
          currentIndex={state.currentIndex}
          currentEvent={currentEvent}
          redactionSummary={redactionSummary}
          onSeekToEvent={seekTo}
        />
      </div>
    </div>
  );
}

function ReplayLoadingSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-6 w-20" />
      </div>
      <Skeleton className="h-[500px] w-full rounded-xl" />
      <Skeleton className="h-10 w-full rounded-md" />
      <Skeleton className="h-10 w-full rounded-md" />
    </div>
  );
}
