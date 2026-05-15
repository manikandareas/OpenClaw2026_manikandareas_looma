"use client";

export function RecordingIndicator({ eventCount }: { eventCount: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
      </span>
      <span className="text-xs font-medium uppercase tracking-wider text-red-400">
        Recording
      </span>
      <span className="text-xs text-muted-foreground">{eventCount} events</span>
    </div>
  );
}
