"use client";

import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useSyncExternalStore,
} from "react";
import { createBrowserCapture } from "@/lib/dictation/browserRecorder";
import { transcribeDictation } from "@/lib/dictation/backendTranscriber";
import { DictationSession } from "@/lib/dictation/dictationSession";
import { IDLE_DICTATION } from "@/lib/dictation/protocol";

export function useDictation(scope: string, enabled: boolean) {
  const session = useMemo(
    () => new DictationSession(createBrowserCapture, transcribeDictation),
    [],
  );
  const snapshot = useSyncExternalStore(
    session.subscribe,
    session.getSnapshot,
    () => IDLE_DICTATION,
  );

  // Cancel before paint on chat/project/model changes and logout. A late result
  // must never be inserted into another conversation's draft.
  useLayoutEffect(() => {
    session.cancel();
  }, [session, scope, enabled]);
  useEffect(() => () => session.cancel(), [session]);

  return {
    ...snapshot,
    start: session.start,
    finish: session.finish,
    cancel: session.cancel,
  };
}
