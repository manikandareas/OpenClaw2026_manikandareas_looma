"use client";

import { useEffect, useRef, useCallback } from "react";
import type { PlaybackSpeed, ReplayEvent } from "../types/replay";
import { getDisplayString } from "../utils/display-payload";

type TerminalRendererProps = {
  event: ReplayEvent | null;
  speed: PlaybackSpeed;
};

export function TerminalRenderer({ event, speed }: TerminalRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<import("@xterm/xterm").Terminal | null>(null);
  const fitAddonRef = useRef<import("@xterm/addon-fit").FitAddon | null>(null);
  const animationRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const lastEventSeqRef = useRef<number>(-1);

  const cancelAnimations = useCallback(() => {
    animationRef.current.forEach(clearTimeout);
    animationRef.current = [];
  }, []);

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
        cursorBlink: true,
        fontSize: 13,
        fontFamily: "var(--font-mono), 'JetBrains Mono', 'Fira Code', monospace",
        lineHeight: 1.4,
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

      terminalRef.current = terminal;
      fitAddonRef.current = fitAddon;

      terminal.writeln("\x1b[32m$\x1b[0m Waiting for events...");
    }

    init();

    return () => {
      mounted = false;
      cancelAnimations();
      terminalRef.current?.dispose();
      terminalRef.current = null;
    };
  }, [cancelAnimations]);

  useEffect(() => {
    const handleResize = () => fitAddonRef.current?.fit();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!event || !terminalRef.current) return;
    if (event.seq === lastEventSeqRef.current) return;
    lastEventSeqRef.current = event.seq;

    cancelAnimations();
    const terminal = terminalRef.current;

    if (event.type === "terminal_command") {
      const command = getDisplayString(event, "command", event.related_command ?? event.display_text);

      typeCommand(terminal, command, speed, animationRef.current);
    } else if (event.type === "terminal_output") {
      const output =
        getDisplayString(event, "output") ||
        getDisplayString(event, "outputPreview", event.display_text);

      streamOutput(terminal, output, speed, animationRef.current);
    }
  }, [event, speed, cancelAnimations]);

  return (
    <div
      ref={containerRef}
      className="h-full w-full p-2"
      style={{ backgroundColor: "#08090d" }}
    />
  );
}

function typeCommand(
  terminal: import("@xterm/xterm").Terminal,
  command: string,
  speed: number,
  timers: ReturnType<typeof setTimeout>[]
) {
  terminal.write("\r\n\x1b[32m$ \x1b[0m");
  const charDelay = 30 / speed;

  for (let i = 0; i < command.length; i++) {
    const timer = setTimeout(() => {
      terminal.write(command[i]);
    }, i * charDelay);
    timers.push(timer);
  }

  const finalTimer = setTimeout(() => {
    terminal.write("\r\n");
  }, command.length * charDelay + 50);
  timers.push(finalTimer);
}

function streamOutput(
  terminal: import("@xterm/xterm").Terminal,
  output: string,
  speed: number,
  timers: ReturnType<typeof setTimeout>[]
) {
  const lines = output.split("\n");
  const lineDelay = 50 / speed;

  for (let i = 0; i < lines.length; i++) {
    const timer = setTimeout(() => {
      terminal.writeln(lines[i]);
    }, i * lineDelay);
    timers.push(timer);
  }
}
