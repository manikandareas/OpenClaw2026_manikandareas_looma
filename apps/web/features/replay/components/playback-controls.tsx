"use client";

import { Button } from "@/components/ui/button";
import { Play, Pause, SkipForward } from "lucide-react";
import type { PlaybackSpeed } from "../types/replay";

const SPEEDS: PlaybackSpeed[] = [0.5, 1, 1.5, 2, 4];

type PlaybackControlsProps = {
  isPlaying: boolean;
  speed: PlaybackSpeed;
  currentIndex: number;
  totalEvents: number;
  onPlay: () => void;
  onPause: () => void;
  onSpeedChange: (speed: PlaybackSpeed) => void;
  onJumpToInteresting: () => void;
  hasReviewMarkers: boolean;
};

export function PlaybackControls({
  isPlaying,
  speed,
  currentIndex,
  totalEvents,
  onPlay,
  onPause,
  onSpeedChange,
  onJumpToInteresting,
  hasReviewMarkers,
}: PlaybackControlsProps) {
  const nextSpeed = () => {
    const currentIdx = SPEEDS.indexOf(speed);
    const nextIdx = (currentIdx + 1) % SPEEDS.length;
    onSpeedChange(SPEEDS[nextIdx]);
  };

  return (
    <div className="flex items-center gap-2">
      {/* Play/Pause */}
      <Button
        variant="secondary"
        size="sm"
        onClick={isPlaying ? onPause : onPlay}
        className="h-8 w-8 p-0"
      >
        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </Button>

      {/* Speed */}
      <Button
        variant="ghost"
        size="sm"
        onClick={nextSpeed}
        className="h-8 gap-1 px-2 text-xs font-mono text-muted-foreground"
      >
        {speed}x
      </Button>

      {/* Event counter */}
      <span className="text-xs text-muted-foreground">
        {currentIndex + 1} / {totalEvents} events
      </span>

      <div className="flex-1" />

      {/* Jump to Interesting */}
      {hasReviewMarkers && (
        <Button
          variant="secondary"
          size="sm"
          onClick={onJumpToInteresting}
          className="h-8 gap-1.5 text-xs"
        >
          <SkipForward className="h-3.5 w-3.5" />
          Jump to Interesting
        </Button>
      )}
    </div>
  );
}
