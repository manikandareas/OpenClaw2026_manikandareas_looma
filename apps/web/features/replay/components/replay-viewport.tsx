"use client";

import { AnimatePresence, motion } from "motion/react";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import type { PlaybackSpeed, ReplayEvent, ViewportMode } from "../types/replay";
import { getDisplayArray, getDisplayNumber, getDisplayString, getSafeDisplayText } from "../utils/display-payload";

const TerminalRenderer = dynamic(
  () => import("./terminal-renderer").then((m) => m.TerminalRenderer),
  { ssr: false, loading: () => <ViewportSkeleton /> }
);

const EditorRenderer = dynamic(
  () => import("./editor-renderer").then((m) => m.EditorRenderer),
  { ssr: false, loading: () => <ViewportSkeleton /> }
);

const DiffRenderer = dynamic(
  () => import("./diff-renderer").then((m) => m.DiffRenderer),
  { ssr: false, loading: () => <ViewportSkeleton /> }
);

function ViewportSkeleton() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <Skeleton className="h-4/5 w-11/12 rounded-md" />
    </div>
  );
}

type ReplayViewportProps = {
  mode: ViewportMode;
  event: ReplayEvent | null;
  speed: PlaybackSpeed;
};

export function ReplayViewport({ mode, event, speed }: ReplayViewportProps) {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {mode === "terminal" && <TerminalRenderer event={event} speed={speed} />}
          {mode === "editor" && <EditorRenderer event={event} speed={speed} />}
          {mode === "diff" && <DiffRenderer event={event} speed={speed} />}
          {mode === "test" && <TestResultRenderer event={event} />}
          {mode === "browser" && <BrowserPlaceholder />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function TestResultRenderer({ event }: { event: ReplayEvent | null }) {
  if (!event) return null;

  const tests = getDisplayArray(event, "tests", isTestResult);
  const summary = getDisplayString(event, "summary", getSafeDisplayText(event));
  const passed = getDisplayNumber(event, "passed") ?? tests.filter((t) => t.status === "passed").length;
  const failed = getDisplayNumber(event, "failed") ?? tests.filter((t) => t.status === "failed").length;
  const skipped = getDisplayNumber(event, "skipped") ?? tests.filter((t) => t.status === "skipped").length;

  return (
    <div className="flex h-full flex-col gap-3 overflow-auto p-4 font-mono text-sm">
      <div className="flex gap-4 border-b border-border pb-3">
        <span className="text-green-400">{passed} passed</span>
        {failed > 0 && <span className="text-red-400">{failed} failed</span>}
        {skipped > 0 && <span className="text-yellow-400">{skipped} skipped</span>}
      </div>
      <div className="space-y-2">
        {tests.map((test, i) => (
          <div key={i} className="flex items-start gap-2">
            <span
              className={
                test.status === "passed"
                  ? "text-green-400"
                  : test.status === "failed"
                    ? "text-red-400"
                    : "text-yellow-400"
              }
            >
              {test.status === "passed" ? "✓" : test.status === "failed" ? "✗" : "○"}
            </span>
            <div className="flex-1">
              <span className="text-foreground">{test.name}</span>
              {test.duration !== undefined && (
                <span className="ml-2 text-muted-foreground">({test.duration}ms)</span>
              )}
              {test.error && (
                <pre className="mt-1 text-xs text-red-400/80">{test.error}</pre>
              )}
            </div>
          </div>
        ))}
        {tests.length === 0 && summary && (
          <pre className="whitespace-pre-wrap text-foreground">{summary}</pre>
        )}
      </div>
    </div>
  );
}

type TestResult = { name: string; status: string; duration?: number; error?: string };

function isTestResult(value: unknown): value is TestResult {
  if (!value || typeof value !== "object") return false;

  const test = value as Record<string, unknown>;
  return typeof test.name === "string" && typeof test.status === "string";
}

function BrowserPlaceholder() {
  return (
    <div className="flex h-full items-center justify-center text-muted-foreground">
      <div className="text-center">
        <p className="text-sm">Browser snapshot</p>
        <p className="mt-1 text-xs opacity-60">Preview not available</p>
      </div>
    </div>
  );
}
