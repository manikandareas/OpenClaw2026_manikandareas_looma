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
import { ReplayActions } from "./replay-actions";

type ReplayShellProps = {
  sessionId: string;
  autoPlay?: boolean;
  embedded?: boolean;
};

export function ReplayShell({ sessionId, autoPlay = false, embedded = false }: ReplayShellProps) {
  const { data, isLoading, error } = useReplay(sessionId);

  if (isLoading) return <ReplayLoadingSkeleton />;
  if (error || !data) {
    return (
      <div className="flex h-96 items-center justify-center text-muted-foreground">
        <p>Failed to load replay data.</p>
      </div>
    );
  }

  return <ReplayPlayer data={data} autoPlay={autoPlay} embedded={embedded} />;
}

function ReplayPlayer({
  data,
  autoPlay,
  embedded,
}: {
  data: NonNullable<ReturnType<typeof useReplay>["data"]>;
  autoPlay: boolean;
  embedded: boolean;
}) {
  const { session, events, markers, chapters, behaviorSummary, notes, redactionSummary } = data;
  const { state, play, pause, seekTo, setSpeed, jumpToInteresting, currentEvent } =
    usePlaybackEngine(events, { autoPlay });
  const segments = useTimelineSegments(events);

  const isLive = session.status === "recording";
  const currentSeq = currentEvent?.seq ?? null;
  const stageHeightClass = embedded
    ? "min-h-[430px] sm:min-h-[470px]"
    : "min-h-[470px] sm:min-h-[560px] lg:min-h-[610px]";
  const stagePaddingClass = embedded ? "p-2 sm:p-4" : "p-2 sm:p-5 lg:p-8";
  const windowHeightClass = embedded
    ? "h-[360px] sm:h-[385px]"
    : "h-[400px] sm:h-[455px] lg:h-[500px]";

  return (
    <div className={embedded ? "space-y-3" : "space-y-4"}>
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
        <div className="flex flex-wrap items-center justify-end gap-2">
          {embedded ? null : <ReplayActions sessionId={session.id} title={session.name} />}
          <Badge
            variant={isLive ? "destructive" : "secondary"}
            className="text-xs uppercase tracking-wider"
          >
            {session.status}
          </Badge>
        </div>
      </div>

      {/* Behavior Map */}
      <BehaviorMap summary={behaviorSummary} />

      {/* Main Layout */}
      <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
        {/* Viewport Column */}
        <div className="space-y-3">
          {/* Viewport Chrome */}
          <div
            className={`relative flex items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-cover bg-center shadow-2xl ${stageHeightClass} ${stagePaddingClass}`}
            style={{ backgroundImage: "url('/replay-wallpapers/cottage-meadow.jpg')" }}
          >
            <div className="absolute inset-0 bg-black/35" />
            <div
              className={`relative z-10 flex w-full max-w-[1120px] flex-col overflow-hidden rounded-lg border border-white/15 bg-[#090b10]/95 shadow-[0_28px_90px_rgba(0,0,0,0.55)] backdrop-blur-sm sm:w-[92%] lg:w-[86%] ${windowHeightClass}`}
            >
              <div className="flex h-10 shrink-0 items-center justify-between gap-3 border-b border-white/10 bg-white/[0.06] px-3">
                <div className="flex min-w-0 items-center gap-2">
                  <div className="flex shrink-0 items-center gap-1.5" aria-hidden="true">
                    <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                    <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
                    <span className="h-3 w-3 rounded-full bg-[#28c840]" />
                  </div>
                  {(state.currentMode === "editor" || state.currentMode === "diff") && (
                    <div className="ml-1 hidden min-w-0 sm:block">
                      <FileBreadcrumb file={state.currentFile} />
                    </div>
                  )}
                </div>
                <div className="shrink-0">
                  <ModeBadge mode={state.currentMode} />
                </div>
              </div>

              <div className="min-h-0 flex-1">
                <ReplayViewport
                  mode={state.currentMode}
                  event={currentEvent}
                  speed={state.speed}
                />
              </div>
            </div>
          </div>

          {/* Timeline */}
          <Timeline
            events={events}
            markers={markers}
            chapters={chapters}
            segments={segments}
            currentIndex={state.currentIndex}
            activeMarkerSeq={currentSeq}
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
          activeMarkerSeq={currentSeq}
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
