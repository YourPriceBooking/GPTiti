import { readFilePreparation, preparationErrorMessage, type FilePreparation } from './preparation';

export type BackgroundPreparation = FilePreparation | { status: 'not_started' } |
  { status: 'queued' | 'running'; attempts: number; pollAfterMs: number } |
  { status: 'failed' | 'cancelled'; attempts: number; retryable: boolean; error?: string };
export function readBackgroundPreparation(value: unknown): BackgroundPreparation {
  const data = value as { success?: unknown; processing?: Record<string, unknown> } | null;
  const p = data?.processing;
  if (data?.success !== true || !p) throw new Error('Invalid preparation status. Retry to check the saved job.');
  if (p.status === 'ready' || p.status === 'not_required') return readFilePreparation(value);
  if (p.status === 'not_started') return { status: 'not_started' };
  if (p.method !== 'local_ocr' || !Number.isInteger(p.attempts) || Number(p.attempts) < 0 || Number(p.attempts) > 3) throw new Error('Invalid preparation status.');
  const attempts = Number(p.attempts);
  if (p.status === 'queued' || p.status === 'running') {
    if (!Number.isInteger(p.pollAfterMs) || Number(p.pollAfterMs) < 2000 || Number(p.pollAfterMs) > 30000) throw new Error('Invalid preparation polling interval.');
    return { status: p.status, attempts, pollAfterMs: Number(p.pollAfterMs) };
  }
  if ((p.status === 'failed' || p.status === 'cancelled') && typeof p.retryable === 'boolean' &&
    (p.status === 'cancelled' || (typeof p.error === 'string' && /^[A-Z_]{1,80}$/.test(p.error)))) {
    return { status: p.status, attempts, retryable: p.retryable && attempts < 3, error: p.error as string | undefined };
  }
  throw new Error('Invalid preparation status.');
}
export function waitForPoll(ms: number, signal: AbortSignal): Promise<void> {
  signal.throwIfAborted();
  return new Promise((resolve, reject) => {
    const abort = () => { clearTimeout(timer); reject(signal.reason); };
    const timer = setTimeout(() => { signal.removeEventListener('abort', abort); resolve(); }, ms);
    signal.addEventListener('abort', abort, { once: true });
  });
}
export async function prepareInBackground(deps: {
  get: () => Promise<BackgroundPreparation>;
  start: (retry: boolean) => Promise<BackgroundPreparation>;
  progress: (phase: 'queued' | 'recognizing') => void;
  signal: AbortSignal;
  wait?: typeof waitForPoll;
}): Promise<FilePreparation> {
  // The caller is an explicit Send/Continue action. Never retry terminal jobs from the polling loop.
  let state = await deps.get();
  deps.signal.throwIfAborted();
  if (state.status === 'not_started') state = await deps.start(false);
  else if ((state.status === 'failed' || state.status === 'cancelled') && state.retryable) state = await deps.start(true);
  let polls = 0;
  while (state.status === 'queued' || state.status === 'running') {
    deps.signal.throwIfAborted();
    deps.progress(state.status === 'queued' ? 'queued' : 'recognizing');
    if (++polls > 450) throw new Error('Preparation is still pending on the server. Your files are saved; continue later to check again.');
    await (deps.wait ?? waitForPoll)(state.pollAfterMs, deps.signal);
    deps.signal.throwIfAborted();
    state = await deps.get();
  }
  deps.signal.throwIfAborted();
  if (state.status === 'ready' || state.status === 'not_required') return state;
  if (state.status === 'failed') {
    const message = preparationErrorMessage({ response: { data: { error: state.error } } });
    throw new Error(message + (state.retryable ? ' Send again to retry without uploading again.' : ' Automatic retries are unavailable. Choose another file or contact support.'));
  }
  if (state.status === 'cancelled') throw new Error(state.retryable ? 'Recognition was cancelled. Send again to restart using the saved file.' : 'Recognition was cancelled and the retry limit was reached.');
  throw new Error('Preparation needs to be restarted. Send again to check the saved file.');
}
