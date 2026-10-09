import {
  DictationError,
  IDLE_DICTATION,
  MAX_DICTATION_BYTES,
  dictationErrorMessage,
  type AudioCapture,
  type CaptureFactory,
  type DictationSnapshot,
  type TranscribeAudio,
  type VoiceRecording,
} from "./protocol";

/** One capture and one transcription per interaction; late results are ignored. */
export class DictationSession {
  private snapshot: DictationSnapshot = IDLE_DICTATION;
  private listeners = new Set<() => void>();
  private capture: AudioCapture | null = null;
  private abort: AbortController | null = null;
  private generation = 0;
  private finishing: Promise<string | null> | null = null;

  constructor(
    private readonly record: CaptureFactory,
    private readonly transcribe: TranscribeAudio,
  ) {}

  getSnapshot = () => this.snapshot;
  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };
  private publish(next: DictationSnapshot) {
    this.snapshot = next;
    this.listeners.forEach((listener) => listener());
  }

  start = async () => {
    if (
      this.snapshot.phase !== "idle" &&
      !(this.snapshot.phase === "error" && !this.snapshot.recording)
    )
      return;
    const generation = ++this.generation;
    this.abort = new AbortController();
    const signal = this.abort.signal;
    this.publish({ ...IDLE_DICTATION, phase: "requesting" });
    try {
      const capture = await this.record({
        signal,
        onError: (error) => {
          void this.interrupted(error, generation);
        },
      });
      if (generation !== this.generation) {
        capture.dispose();
        return;
      }
      this.capture = capture;
      this.publish({
        ...IDLE_DICTATION,
        phase: "recording",
        stream: capture.stream,
        startedAt: Date.now(),
      });
    } catch (error) {
      if (generation !== this.generation) return;
      this.abort?.abort();
      this.publish({
        ...IDLE_DICTATION,
        phase: "error",
        error: dictationErrorMessage(error),
      });
    }
  };

  finish = (): Promise<string | null> => {
    if (this.finishing) return this.finishing;
    const retained = this.snapshot.recording;
    if (!this.capture && !retained) return Promise.resolve(null);
    const generation = this.generation;
    const capture = this.capture;
    const abort = this.abort ?? new AbortController();
    this.abort = abort;
    this.publish({
      ...this.snapshot,
      phase: capture ? "stopping" : "transcribing",
      stream: null,
      error: null,
    });
    const task = (async () => {
      let recording: VoiceRecording | null = retained;
      try {
        recording = capture ? await capture.stop() : retained;
        if (generation !== this.generation || !recording) return null;
        this.capture = null;
        if (!recording.audio.size)
          throw new DictationError(
            "empty",
            "No audio was captured. Please record a new message.",
          );
        if (recording.audio.size > MAX_DICTATION_BYTES)
          throw new DictationError(
            "too-large",
            "Your recording is too large. Save it or record a shorter message.",
          );
        this.publish({ ...IDLE_DICTATION, phase: "transcribing", recording });
        const text = (await this.transcribe(recording, abort.signal)).trim();
        if (generation !== this.generation) return null;
        if (!text)
          throw new DictationError(
            "no-speech",
            "No speech was recognized. Try again or record a new message.",
          );
        this.publish(IDLE_DICTATION);
        return text;
      } catch (error) {
        if (generation !== this.generation) return null;
        this.capture = null;
        capture?.dispose();
        this.publish({
          ...IDLE_DICTATION,
          phase: "error",
          recording: recording?.audio.size ? recording : null,
          error: dictationErrorMessage(error),
        });
        return null;
      }
    })();
    this.finishing = task;
    void task.finally(() => {
      if (this.finishing === task) this.finishing = null;
    });
    return task;
  };

  private async interrupted(error: unknown, generation: number) {
    if (generation !== this.generation || !this.capture || this.finishing)
      return;
    const capture = this.capture;
    this.publish({ ...this.snapshot, phase: "stopping", stream: null });
    let recording: VoiceRecording | null = null;
    try {
      recording = await capture.stop();
    } catch {
      /* No finalized audio is available. */
    }
    if (generation !== this.generation) return;
    this.capture = null;
    capture.dispose();
    this.publish({
      ...IDLE_DICTATION,
      phase: "error",
      recording: recording?.audio.size ? recording : null,
      error: dictationErrorMessage(error),
    });
  }

  cancel = () => {
    ++this.generation;
    this.abort?.abort();
    this.abort = null;
    this.capture?.dispose();
    this.capture = null;
    this.finishing = null;
    this.publish(IDLE_DICTATION);
  };
}
