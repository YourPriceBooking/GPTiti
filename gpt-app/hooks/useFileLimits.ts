"use client";
import { useEffect, useState } from 'react';
import { loadFileLimits } from '@/lib/files/api';
import type { FileLimits } from '@/lib/files/limits';
export function useFileLimits(modelId: string, owner?: string) {
  const [revision, setRevision] = useState(0);
  const [state, setState] = useState<{ key: string; limits: FileLimits | null; error: boolean } | null>(null);
  const key = JSON.stringify([owner, modelId, revision]);
  useEffect(() => {
    if (!owner || !modelId) return;
    const controller = new AbortController();
    loadFileLimits(modelId, controller.signal).then(limits => {
      if (!controller.signal.aborted) setState({ key, limits, error: false });
    }).catch(() => { if (!controller.signal.aborted) setState({ key, limits: null, error: true }); });
    return () => controller.abort();
  }, [owner, modelId, key]);
  return { limits: state?.key === key ? state.limits : null,
    status: !owner ? 'signed-out' : state?.key !== key ? 'loading' : state.error ? 'error' : 'ready',
    retry: () => setRevision(n => n + 1) };
}
