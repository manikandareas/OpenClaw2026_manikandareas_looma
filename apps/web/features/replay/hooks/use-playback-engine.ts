"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type {
  PlaybackSpeed,
  PlaybackState,
  ReplayEvent,
  ReplayMarker,
  ViewportMode,
} from "../types/replay";
import { eventToMode } from "../utils/event-to-mode";
import { selectInterestingMarker } from "../utils/interesting-marker";
import { computeDelay } from "../utils/timing";

const INITIAL_STATE: PlaybackState = {
  currentIndex: 0,
  isPlaying: false,
  speed: 1,
  currentMode: "terminal",
  currentFile: null,
  progress: 0,
};

export function usePlaybackEngine(
  events: ReplayEvent[],
  { autoPlay = false }: { autoPlay?: boolean } = {}
) {
  const [state, setState] = useState<PlaybackState>(() => getInitialState(events));
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stateRef = useRef(state);
  const eventsRef = useRef(events);

  useEffect(() => {
    stateRef.current = state;
  });

  useEffect(() => {
    eventsRef.current = events;
  }, [events]);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const resolveMode = useCallback(
    (index: number, fallback: ViewportMode): { mode: ViewportMode; file: string | null } => {
      const event = eventsRef.current[index];
      if (!event) return { mode: fallback, file: null };
      const resolved = eventToMode(event.type);
      return { mode: resolved ?? fallback, file: event.related_file ?? null };
    },
    []
  );

  const scheduleNextRef = useRef<() => void>(() => {});

  useEffect(() => {
    clearTimer();
    const nextState = getInitialState(events, stateRef.current.speed);
    stateRef.current = nextState;
    setState(nextState);
  }, [clearTimer, events]);

  useEffect(() => {
    scheduleNextRef.current = () => {
      const { currentIndex, speed } = stateRef.current;
      const evts = eventsRef.current;
      const nextIndex = currentIndex + 1;

      if (nextIndex >= evts.length) {
        stateRef.current = { ...stateRef.current, isPlaying: false };
        setState(stateRef.current);
        return;
      }

      const delay = computeDelay(
        evts[currentIndex]?.timestamp ?? null,
        evts[nextIndex]?.timestamp ?? null,
        speed
      );

      timerRef.current = setTimeout(() => {
        timerRef.current = null;
        const { currentMode } = stateRef.current;
        const { mode, file } = resolveMode(nextIndex, currentMode);
        const nextState = {
          ...stateRef.current,
          currentIndex: nextIndex,
          currentMode: mode,
          currentFile: file,
          progress: evts.length > 1 ? nextIndex / (evts.length - 1) : 0,
        };

        stateRef.current = nextState;
        setState(nextState);

        scheduleNextRef.current();
      }, delay);
    };
  }, [resolveMode]);

  const play = useCallback(() => {
    if (eventsRef.current.length === 0) return;
    if (stateRef.current.isPlaying && timerRef.current !== null) return;

    clearTimer();
    const { currentIndex, speed } = stateRef.current;
    const evts = eventsRef.current;

    if (currentIndex >= evts.length - 1) {
      const initial = getInitialState(evts, speed);
      stateRef.current = { ...initial, isPlaying: true };
      setState(stateRef.current);
    } else {
      stateRef.current = { ...stateRef.current, isPlaying: true };
      setState(stateRef.current);
    }

    scheduleNextRef.current();
  }, [clearTimer]);

  useEffect(() => {
    if (!autoPlay || events.length === 0) return;
    play();
  }, [autoPlay, events.length, play]);

  const pause = useCallback(() => {
    clearTimer();
    stateRef.current = { ...stateRef.current, isPlaying: false };
    setState(stateRef.current);
  }, [clearTimer]);

  const seekTo = useCallback(
    (index: number) => {
      clearTimer();
      const evts = eventsRef.current;
      const clampedIndex = Math.max(0, Math.min(index, evts.length - 1));
      const { mode, file } = resolveMode(clampedIndex, stateRef.current.currentMode);
      const wasPlaying = stateRef.current.isPlaying;
      const nextState = {
        ...stateRef.current,
        currentIndex: clampedIndex,
        currentMode: mode,
        currentFile: file,
        progress: evts.length > 1 ? clampedIndex / (evts.length - 1) : 0,
      };

      stateRef.current = nextState;
      setState(nextState);

      if (wasPlaying) {
        scheduleNextRef.current();
      }
    },
    [clearTimer, resolveMode]
  );

  const setSpeed = useCallback(
    (speed: PlaybackSpeed) => {
      const wasPlaying = stateRef.current.isPlaying;
      const nextState = { ...stateRef.current, speed };
      stateRef.current = nextState;
      setState(nextState);
      if (wasPlaying) {
        clearTimer();
        scheduleNextRef.current();
      }
    },
    [clearTimer]
  );

  const jumpToInteresting = useCallback(
    (markers: Pick<ReplayMarker, "seq" | "needs_review" | "severity">[]) => {
      const evts = eventsRef.current;
      const { currentIndex } = stateRef.current;
      const currentSeq = evts[currentIndex]?.seq ?? 0;
      const target = selectInterestingMarker(markers, currentSeq);

      if (target) {
        const targetIndex = evts.findIndex((e) => e.seq >= target.seq);
        if (targetIndex >= 0) seekTo(targetIndex);
      }
    },
    [seekTo]
  );

  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  return {
    state,
    play,
    pause,
    seekTo,
    setSpeed,
    jumpToInteresting,
    currentEvent: events[state.currentIndex] ?? null,
  };
}

function getInitialState(
  events: ReplayEvent[],
  speed: PlaybackSpeed = INITIAL_STATE.speed
): PlaybackState {
  const firstEvent = events[0];
  const currentMode = firstEvent ? eventToMode(firstEvent.type) ?? "terminal" : "terminal";

  return {
    ...INITIAL_STATE,
    speed,
    currentMode,
    currentFile: firstEvent?.related_file ?? null,
  };
}
