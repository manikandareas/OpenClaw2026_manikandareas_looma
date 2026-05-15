"use client";

import type { PlaybackSpeed, ReplayEvent } from "../types/replay";
import { eventToFrame } from "../utils/replay-frame";

type TerminalRendererProps = {
  event: ReplayEvent | null;
  speed: PlaybackSpeed;
};

export function TerminalRenderer({ event, speed }: TerminalRendererProps) {
  const frame = eventToFrame(event);

  if (frame.mode !== "terminal") {
    return null;
  }

  const output = formatTerminalOutput(frame.output, speed);

  return (
    <div className="h-full w-full overflow-auto bg-[#08090d] px-3 py-3 font-mono text-[12px] leading-[1.45] text-[#f4f4f5] sm:px-4 sm:py-4 sm:text-[13px]">
      <div className="space-y-3">
        {frame.command ? (
          <div className="rounded-md border border-white/10 bg-white/[0.035] px-3 py-2">
            <div className="mb-1 flex items-center justify-between gap-3 text-[10px] uppercase tracking-[0.14em] text-zinc-500">
              <span>Command</span>
              {frame.statusText ? (
                <span className={frame.failed ? "text-red-300" : "text-zinc-500"}>
                  {frame.statusText}
                </span>
              ) : null}
            </div>
            <pre className="whitespace-pre-wrap break-words text-zinc-100">
              <span className={frame.failed ? "text-red-300" : "text-emerald-300"}>$</span>{" "}
              {stripAnsi(frame.command)}
            </pre>
          </div>
        ) : null}

        {!frame.command && frame.statusText ? (
          <div className={frame.failed ? "text-red-300" : "text-zinc-500"}>{frame.statusText}</div>
        ) : null}

        {output.visible.length > 0 ? (
          <div className="rounded-md border border-white/10 bg-black/25">
            <div className="border-b border-white/10 px-3 py-2 text-[10px] uppercase tracking-[0.14em] text-zinc-500">
              Output
            </div>
            <pre className="whitespace-pre-wrap break-words px-3 py-3 text-zinc-200">
              {output.visible.join("\n")}
            </pre>
            {output.hiddenLineCount > 0 ? (
              <div className="border-t border-white/10 px-3 py-2 text-xs text-zinc-500">
                ... {output.hiddenLineCount} more preview lines truncated
              </div>
            ) : null}
          </div>
        ) : (
          <div className="rounded-md border border-dashed border-white/10 px-3 py-3 text-zinc-500">
            No terminal output preview for this event.
          </div>
        )}
      </div>
    </div>
  );
}

function formatTerminalOutput(value: string, speed: PlaybackSpeed) {
  const maxLines = speed >= 4 ? 120 : 80;
  const lines = stripAnsi(value).replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");

  return {
    visible: lines.slice(0, maxLines),
    hiddenLineCount: Math.max(0, lines.length - maxLines),
  };
}

function stripAnsi(value: string): string {
  return value.replace(
    /[\u001B\u009B][[\]()#;?]*(?:(?:(?:[a-zA-Z\d]*(?:;[a-zA-Z\d]*)*)?\u0007)|(?:(?:\d{1,4}(?:;\d{0,4})*)?[\dA-PR-TZcf-nq-uy=><~]))/g,
    ""
  );
}
