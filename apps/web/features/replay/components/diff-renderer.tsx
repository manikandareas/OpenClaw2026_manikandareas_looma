"use client";

import ReactDiffViewer, { DiffMethod } from "react-diff-viewer-continued";
import type { PlaybackSpeed, ReplayEvent } from "../types/replay";
import { getDisplayPayload, getDisplayString } from "../utils/display-payload";

type DiffRendererProps = {
  event: ReplayEvent | null;
  speed: PlaybackSpeed;
};

const darkStyles = {
  variables: {
    dark: {
      diffViewerBackground: "#0d1117",
      diffViewerColor: "#f7f7f8",
      addedBackground: "#12261e",
      addedColor: "#4ade80",
      removedBackground: "#2d1215",
      removedColor: "#f87171",
      wordAddedBackground: "#1a4d2e",
      wordRemovedBackground: "#4d1f23",
      addedGutterBackground: "#0f2d1a",
      removedGutterBackground: "#2a1012",
      gutterBackground: "#0d1117",
      gutterBackgroundDark: "#0a0e14",
      highlightBackground: "#1c2128",
      highlightGutterBackground: "#1c2128",
      codeFoldGutterBackground: "#0d1117",
      codeFoldBackground: "#1c2128",
      emptyLineBackground: "#0d1117",
      gutterColor: "#6b7280",
      addedGutterColor: "#4ade80",
      removedGutterColor: "#f87171",
      codeFoldContentColor: "#a1a1aa",
      diffViewerTitleBackground: "#161b22",
      diffViewerTitleColor: "#f7f7f8",
      diffViewerTitleBorderColor: "#27272a",
    },
  },
  line: {
    padding: "4px 8px",
    fontSize: "13px",
    fontFamily: "var(--font-mono), monospace",
  },
};

export function DiffRenderer({ event }: DiffRendererProps) {
  if (!event) return null;

  const payload = getDisplayPayload(event);

  const oldValue =
    getString(payload.before) ||
    getString(payload.oldValue) ||
    getDisplayString(event, "before");
  const newValue =
    getString(payload.after) ||
    getString(payload.newValue) ||
    getString(payload.diff) ||
    getDisplayString(event, "after");

  return (
    <div className="h-full overflow-auto">
      <ReactDiffViewer
        oldValue={oldValue}
        newValue={newValue}
        splitView={true}
        useDarkTheme={true}
        compareMethod={DiffMethod.WORDS}
        styles={darkStyles}
        hideLineNumbers={false}
      />
    </div>
  );
}

function getString(value: unknown): string {
  return typeof value === "string" ? value : "";
}
