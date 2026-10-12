"use client";
import { useCallback, useEffect, useRef, useState } from "react";

type Page = { nextCursor: string | null };
/** Query/account keyed reads. A changed scope hides old data before effects run. */
export function useHistoryPages<T extends Page>(
  scope: string,
  enabled: boolean,
  load: (cursor: string | undefined, signal: AbortSignal) => Promise<T>,
) {
  const [revision, setRevision] = useState(0);
  const key = `${scope}:${revision}`;
  const [state, setState] = useState<{
    key: string;
    pages: T[];
    error?: string;
    moreError?: string;
    loadingMore?: boolean;
  }>({ key: "", pages: [] });
  const controllers = useRef(new Set<AbortController>());
  const inflight = useRef(new Set<string>());
  useEffect(() => {
    if (!enabled) return;
    const requests = controllers.current;
    const controller = new AbortController();
    requests.add(controller);
    load(undefined, controller.signal)
      .then((page) => {
        if (!controller.signal.aborted) setState({ key, pages: [page] });
      })
      .catch(() => {
        if (!controller.signal.aborted)
          setState({
            key,
            pages: [],
            error: "Could not load this activity. Please try again.",
          });
      })
      .finally(() => requests.delete(controller));
    return () => {
      for (const request of requests) request.abort();
      requests.clear();
    };
  }, [key, enabled, load]);
  const current = enabled && state.key === key ? state : null;
  const pages = current?.pages || [];
  const nextCursor = pages.at(-1)?.nextCursor || null;
  const loadMore = useCallback(async () => {
    if (!enabled || state.key !== key || !nextCursor) return;
    const requestKey = `${key}:${nextCursor}`;
    if (inflight.current.has(requestKey)) return;
    inflight.current.add(requestKey);
    const controller = new AbortController();
    controllers.current.add(controller);
    setState((previous) =>
      previous.key === key
        ? { ...previous, loadingMore: true, moreError: undefined }
        : previous,
    );
    try {
      const page = await load(nextCursor, controller.signal);
      if (!controller.signal.aborted)
        setState((previous) =>
          previous.key === key
            ? { key, pages: [...previous.pages, page] }
            : previous,
        );
    } catch {
      if (!controller.signal.aborted)
        setState((previous) =>
          previous.key === key
            ? {
                ...previous,
                loadingMore: false,
                moreError: "Could not load more activity. Please try again.",
              }
            : previous,
        );
    } finally {
      controllers.current.delete(controller);
      inflight.current.delete(requestKey);
    }
  }, [enabled, state.key, key, nextCursor, load]);
  return {
    pages,
    nextCursor,
    loadMore,
    loading: enabled && !current,
    error: current?.error,
    moreError: current?.moreError,
    loadingMore: current?.loadingMore || false,
    retry: useCallback(() => setRevision((value) => value + 1), []),
  };
}
