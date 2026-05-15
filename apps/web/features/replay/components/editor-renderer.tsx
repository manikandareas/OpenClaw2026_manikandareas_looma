"use client";

import { useCallback, useEffect, useRef } from "react";
import type { PlaybackSpeed, ReplayEvent } from "../types/replay";
import { getDisplayNumber, getDisplayString, getSafeDisplayText } from "../utils/display-payload";

type EditorRendererProps = {
  event: ReplayEvent | null;
  speed: PlaybackSpeed;
};

export function EditorRenderer({ event, speed }: EditorRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<import("@codemirror/view").EditorView | null>(null);
  const lastEventSeqRef = useRef<number>(-1);
  const animationRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const cancelAnimations = useCallback(() => {
    animationRef.current.forEach(clearTimeout);
    animationRef.current = [];
  }, []);

  useEffect(() => {
    let mounted = true;

    async function init() {
      if (!containerRef.current || viewRef.current) return;

      const { EditorView, lineNumbers, highlightActiveLine } = await import("@codemirror/view");
      const { EditorState } = await import("@codemirror/state");
      const { oneDark } = await import("@codemirror/theme-one-dark");

      if (!mounted || !containerRef.current) return;

      const state = EditorState.create({
        doc: "// Waiting for events...",
        extensions: [
          oneDark,
          lineNumbers(),
          highlightActiveLine(),
          EditorView.editable.of(false),
          EditorState.readOnly.of(true),
          EditorView.theme({
            "&": { height: "100%", backgroundColor: "#0d1117" },
            ".cm-scroller": { overflow: "auto", fontFamily: "var(--font-mono), monospace", fontSize: "13px" },
            ".cm-gutters": { backgroundColor: "#0d1117", border: "none" },
            ".cm-activeLineGutter": { backgroundColor: "#1c2128" },
          }),
        ],
      });

      const view = new EditorView({ state, parent: containerRef.current });
      viewRef.current = view;
    }

    init();

    return () => {
      mounted = false;
      cancelAnimations();
      viewRef.current?.destroy();
      viewRef.current = null;
    };
  }, [cancelAnimations]);

  useEffect(() => {
    if (!event || !viewRef.current) return;
    if (event.seq === lastEventSeqRef.current) return;
    lastEventSeqRef.current = event.seq;

    cancelAnimations();
    const view = viewRef.current;
    const content =
      getDisplayString(event, "content", getSafeDisplayText(event)) ||
      `// ${event.related_file ?? "file"}`;
    const targetLine = Math.max(1, Math.floor(getDisplayNumber(event, "line") ?? 1));

    view.dispatch({
      changes: { from: 0, to: view.state.doc.length, insert: "" },
      selection: { anchor: 0 },
    });

    const lines = content.split("\n");
    const linesPerStep = Math.max(1, Math.ceil(lines.length / 48));
    const stepDelay = Math.max(24, 70 / speed);
    let revealedLines = 0;
    let didFocusTargetLine = false;

    async function focusTargetLine() {
      if (!viewRef.current) return;

      const { EditorView } = await import("@codemirror/view");
      const activeView = viewRef.current;
      const lineInfo = activeView.state.doc.line(
        Math.min(targetLine, activeView.state.doc.lines)
      );

      activeView.dispatch({
        selection: { anchor: lineInfo.from },
        effects: EditorView.scrollIntoView(lineInfo.from, { y: "center" }),
      });
      activeView.focus();
    }

    function revealNextBatch() {
      if (!viewRef.current) return;

      revealedLines = Math.min(lines.length, revealedLines + linesPerStep);
      const visibleContent = lines.slice(0, revealedLines).join("\n");

      viewRef.current.dispatch({
        changes: {
          from: 0,
          to: viewRef.current.state.doc.length,
          insert: visibleContent,
        },
      });

      if (!didFocusTargetLine && revealedLines >= Math.min(targetLine, lines.length)) {
        didFocusTargetLine = true;
        void focusTargetLine();
      }

      if (revealedLines < lines.length) {
        const timer = setTimeout(revealNextBatch, stepDelay);
        animationRef.current.push(timer);
      } else if (!didFocusTargetLine) {
        didFocusTargetLine = true;
        void focusTargetLine();
      }
    }

    revealNextBatch();
  }, [event, speed, cancelAnimations]);

  return (
    <div ref={containerRef} className="h-full w-full overflow-hidden" />
  );
}
