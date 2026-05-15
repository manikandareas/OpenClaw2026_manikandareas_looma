"use client";

import { useEffect, useRef } from "react";
import type { PlaybackSpeed, ReplayEvent } from "../types/replay";
import { eventToFrame } from "../utils/replay-frame";

type TerminalRendererProps = {
  event: ReplayEvent | null;
  speed: PlaybackSpeed;
};

export function TerminalRenderer({ event, speed }: TerminalRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<import("@xterm/xterm").Terminal | null>(null);
  const fitAddonRef = useRef<import("@xterm/addon-fit").FitAddon | null>(null);
  const lastEventSeqRef = useRef<number>(-1);
  const latestEventRef = useRef<ReplayEvent | null>(event);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  useEffect(() => {
    let mounted = true;

    async function init() {
      if (!containerRef.current || terminalRef.current) return;

      const { Terminal } = await import("@xterm/xterm");
      const { FitAddon } = await import("@xterm/addon-fit");
      await import("@xterm/xterm/css/xterm.css");

      if (!mounted || !containerRef.current) return;

      const fitAddon = new FitAddon();
      const terminal = new Terminal({
        convertEol: true,
        cursorBlink: false,
        cursorStyle: "bar",
        disableStdin: true,
        fontSize: 13,
        fontFamily: "var(--font-mono), 'JetBrains Mono', 'Fira Code', monospace",
        lineHeight: 1.4,
        scrollback: 10_000,
        theme: {
          background: "#08090d",
          foreground: "#f7f7f8",
          cursor: "#22c55e",
          cursorAccent: "#08090d",
          selectionBackground: "#22c55e33",
          black: "#08090d",
          red: "#ef4444",
          green: "#22c55e",
          yellow: "#eab308",
          blue: "#3b82f6",
          magenta: "#a855f7",
          cyan: "#06b6d4",
          white: "#f7f7f8",
          brightBlack: "#6b7280",
          brightRed: "#f87171",
          brightGreen: "#4ade80",
          brightYellow: "#fde047",
          brightBlue: "#60a5fa",
          brightMagenta: "#c084fc",
          brightCyan: "#22d3ee",
          brightWhite: "#ffffff",
        },
      });

      terminal.loadAddon(fitAddon);
      terminal.open(containerRef.current);
      fitAddon.fit();
      resizeObserverRef.current = new ResizeObserver(() => fitAddon.fit());
      resizeObserverRef.current.observe(containerRef.current);

      terminalRef.current = terminal;
      fitAddonRef.current = fitAddon;

      renderFrame(terminal, latestEventRef.current);
      lastEventSeqRef.current = latestEventRef.current?.seq ?? -1;
    }

    init();

    return () => {
      mounted = false;
      resizeObserverRef.current?.disconnect();
      resizeObserverRef.current = null;
      terminalRef.current?.dispose();
      terminalRef.current = null;
    };
  }, []);

  useEffect(() => {
    const handleResize = () => fitAddonRef.current?.fit();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    latestEventRef.current = event;
    if (!event || !terminalRef.current) return;
    if (event.seq === lastEventSeqRef.current) return;
    lastEventSeqRef.current = event.seq;

    renderFrame(terminalRef.current, event, speed);
  }, [event, speed]);

  return (
    <div
      ref={containerRef}
      className="h-full w-full p-2"
      style={{ backgroundColor: "#08090d" }}
    />
  );
}

function renderFrame(
  terminal: import("@xterm/xterm").Terminal,
  event: ReplayEvent | null,
  speed: number = 1
) {
  const frame = eventToFrame(event);
  if (frame.mode !== "terminal") return;

  terminal.clear();
  terminal.reset();
  terminal.write("\x1b[2J\x1b[H");

  if (frame.command) {
    terminal.writeln(`${frame.failed ? "\x1b[31m" : "\x1b[32m"}$ \x1b[0m${frame.command}`);
  }

  if (frame.statusText) {
    terminal.writeln(`${frame.failed ? "\x1b[31m" : "\x1b[90m"}${frame.statusText}\x1b[0m`);
  }

  if (!frame.output) return;

  const chunks = chunkLines(frame.output, speed >= 4 ? 120 : 80);
  terminal.write(chunks[0] ?? "");

  for (const chunk of chunks.slice(1)) {
    terminal.write(chunk);
  }
}

function chunkLines(value: string, maxLines: number): string[] {
  const lines = value.split("\n");
  if (lines.length <= maxLines) return [value];

  return [
    lines.slice(0, maxLines).join("\n"),
    `\n\x1b[90m... ${lines.length - maxLines} more preview lines truncated in viewport\x1b[0m`
  ];
}
