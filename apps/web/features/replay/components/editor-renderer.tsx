"use client";

import { useEffect, useRef } from "react";
import type { PlaybackSpeed, ReplayEvent } from "../types/replay";
import { eventToFrame } from "../utils/replay-frame";

type EditorRendererProps = {
  event: ReplayEvent | null;
  speed: PlaybackSpeed;
};

export function EditorRenderer({ event, speed }: EditorRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<import("@codemirror/view").EditorView | null>(null);
  const lastEventSeqRef = useRef<number>(-1);
  const latestEventRef = useRef<ReplayEvent | null>(event);

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
      renderEditorFrame(view, latestEventRef.current);
      lastEventSeqRef.current = latestEventRef.current?.seq ?? -1;
    }

    init();

    return () => {
      mounted = false;
      viewRef.current?.destroy();
      viewRef.current = null;
    };
  }, []);

  useEffect(() => {
    latestEventRef.current = event;
    if (!event || !viewRef.current) return;
    if (event.seq === lastEventSeqRef.current) return;
    lastEventSeqRef.current = event.seq;

    renderEditorFrame(viewRef.current, event);
  }, [event, speed]);

  return (
    <div ref={containerRef} className="h-full w-full overflow-hidden" />
  );
}

async function renderEditorFrame(
  view: import("@codemirror/view").EditorView,
  event: ReplayEvent | null
) {
  const frame = eventToFrame(event);
  if (frame.mode !== "editor") return;
  const targetLine = frame.line;

  view.dispatch({
    changes: { from: 0, to: view.state.doc.length, insert: frame.content },
    selection: { anchor: 0 },
  });

  const { EditorView } = await import("@codemirror/view");
  const lineInfo = view.state.doc.line(Math.min(targetLine, view.state.doc.lines));

  view.dispatch({
    selection: { anchor: lineInfo.from },
    effects: EditorView.scrollIntoView(lineInfo.from, { y: "center" }),
  });
}
