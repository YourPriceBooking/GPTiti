import {
  DictationError,
  MAX_DICTATION_BYTES,
  type AudioCapture,
  type CaptureFactory,
  type VoiceRecording,
} from "./protocol";

/** Capture only. Audio goes to our backend adapter after the user stops/sends. */
export const createBrowserCapture: CaptureFactory = async ({
  signal,
  onError,
}) => {
  if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) {
    throw new DictationError(
      "unsupported",
      "Microphone recording requires a supported browser and HTTPS.",
    );
  }
  if (typeof MediaRecorder === "undefined") {
    throw new DictationError(
      "unsupported",
      "Your browser does not support voice recording. Try another browser.",
    );
  }
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: {
      echoCancellation: true,
      noiseSuppression: true,
      autoGainControl: true,
    },
  });
  const releaseTracks = () =>
    stream.getTracks().forEach((track) => track.stop());
  if (signal.aborted) {
    releaseTracks();
    throw new DOMException("Cancelled", "AbortError");
  }
  const mimeType = [
    "audio/webm;codecs=opus",
    "audio/mp4",
    "audio/webm",
    "audio/ogg;codecs=opus",
  ].find((type) => MediaRecorder.isTypeSupported(type));
  let recorder: MediaRecorder;
  try {
    recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
  } catch (error) {
    releaseTracks();
    throw error;
  }
  const chunks: Blob[] = [];
  const startedAt = performance.now();
  let bytes = 0;
  let disposed = false;
  let stopping = false;
  let stopPromise: Promise<VoiceRecording> | null = null;
  let resolveStop: ((recording: VoiceRecording) => void) | null = null;
  let rejectStop: ((error: unknown) => void) | null = null;
  let finalRecording: VoiceRecording | null = null;
  let timeout: ReturnType<typeof setTimeout> | undefined;

  const interrupted = () => {
    if (!stopping && !disposed) {
      onError(
        new DictationError(
          "interrupted",
          "Microphone disconnected. Your captured audio is kept for retry or download.",
        ),
      );
    }
  };
  const removeListeners = () => {
    signal.removeEventListener("abort", dispose);
    stream
      .getAudioTracks()
      .forEach((track) => track.removeEventListener("ended", interrupted));
  };
  function dispose() {
    if (disposed) return;
    disposed = true;
    stopping = true;
    clearTimeout(timeout);
    removeListeners();
    recorder.ondataavailable = null;
    recorder.onstop = null;
    recorder.onerror = null;
    if (recorder.state !== "inactive") recorder.stop();
    releaseTracks();
    chunks.length = 0;
    rejectStop?.(new DOMException("Cancelled", "AbortError"));
  }
  recorder.ondataavailable = (event) => {
    if (!event.data.size || disposed) return;
    chunks.push(event.data);
    bytes += event.data.size;
    if (bytes > MAX_DICTATION_BYTES && !stopping) {
      onError(
        new DictationError(
          "too-large",
          "Your recording reached the size limit. Save it or record a shorter message.",
        ),
      );
    }
  };
  recorder.onstop = () => {
    const unexpected = !stopping;
    stopping = true;
    clearTimeout(timeout);
    releaseTracks();
    removeListeners();
    if (disposed) return;
    const audio = new Blob(chunks, {
      type: recorder.mimeType || mimeType || chunks[0]?.type || "audio/webm",
    });
    chunks.length = 0;
    finalRecording = {
      audio,
      durationMs: Math.max(0, performance.now() - startedAt),
    };
    resolveStop?.(finalRecording);
    if (unexpected)
      onError(
        new DictationError(
          "interrupted",
          "Recording stopped unexpectedly. Your audio is kept for retry or download.",
        ),
      );
  };
  recorder.onerror = () => {
    if (!disposed)
      onError(
        new DictationError(
          "recording",
          "Microphone recording failed. Try again or save your captured audio.",
        ),
      );
  };
  stream
    .getAudioTracks()
    .forEach((track) => track.addEventListener("ended", interrupted));
  signal.addEventListener("abort", dispose, { once: true });
  try {
    recorder.start(250);
  } catch (error) {
    dispose();
    throw error;
  }

  const capture: AudioCapture = {
    stream,
    stop() {
      if (stopPromise) return stopPromise;
      stopPromise = new Promise((resolve, reject) => {
        resolveStop = resolve;
        rejectStop = reject;
      });
      stopping = true;
      if (disposed) {
        rejectStop?.(new DOMException("Cancelled", "AbortError"));
      } else if (finalRecording) {
        resolveStop?.(finalRecording);
      } else {
        timeout = setTimeout(() => {
          rejectStop?.(
            new DictationError(
              "stop-timeout",
              "Could not finish this recording. Please try again.",
            ),
          );
          dispose();
        }, 5000);
        // The state can already be inactive while the final dataavailable/stop
        // events are still queued (e.g. after a microphone disconnect). Always
        // wait for the real stop event so the final audio chunk is not lost.
        if (recorder.state !== "inactive") {
          try {
            recorder.stop();
          } catch (error) {
            rejectStop?.(error);
            dispose();
          }
        }
      }
      return stopPromise;
    },
    dispose,
  };
  return capture;
};
