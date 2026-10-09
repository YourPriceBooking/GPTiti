export const MAX_DICTATION_MS = 5 * 60 * 1000;
export const MAX_DICTATION_BYTES = 20 * 1024 * 1024;

export type DictationPhase =
  "idle" | "requesting" | "recording" | "stopping" | "transcribing" | "error";

export interface VoiceRecording {
  audio: Blob;
  durationMs: number;
}

export interface AudioCapture {
  stream: MediaStream;
  stop(): Promise<VoiceRecording>;
  dispose(): void;
}

export type CaptureFactory = (options: {
  signal: AbortSignal;
  onError: (error: unknown) => void;
}) => Promise<AudioCapture>;

export type TranscribeAudio = (
  recording: VoiceRecording,
  signal: AbortSignal,
) => Promise<string>;

export interface DictationSnapshot {
  phase: DictationPhase;
  stream: MediaStream | null;
  startedAt: number | null;
  recording: VoiceRecording | null;
  error: string | null;
}

export const IDLE_DICTATION: DictationSnapshot = {
  phase: "idle",
  stream: null,
  startedAt: null,
  recording: null,
  error: null,
};

export class DictationError extends Error {
  constructor(
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = "DictationError";
  }
}

export function dictationErrorMessage(error: unknown): string {
  if (error instanceof DictationError) return error.message;
  if (error instanceof Error) {
    if (error.name === "NotAllowedError" || error.name === "SecurityError") {
      return "Allow microphone access in your browser's site settings, then tap the microphone again. If it is already allowed, check your device's microphone permissions.";
    }
    if (error.name === "NotFoundError") return "No microphone was found.";
    if (error.name === "NotReadableError") {
      return "Your microphone is busy. Close other recording apps and try again.";
    }
  }
  return "Could not transcribe this recording. Try again or save your audio.";
}

export function readTranscript(response: unknown): string {
  if (
    !response ||
    typeof response !== "object" ||
    !("text" in response) ||
    typeof response.text !== "string"
  ) {
    throw new DictationError(
      "invalid-response",
      "Could not read the transcript. Try again or save your audio.",
    );
  }
  const text = response.text.trim();
  if (!text)
    throw new DictationError(
      "no-speech",
      "No speech was recognized. Try again or record a new message.",
    );
  return text;
}

/** Relative API paths keep the existing authenticated client on our backend. */
export function transcriptionPath(value: string | undefined): string | null {
  const path = value?.trim();
  if (!path) return null;
  if (!path.startsWith("/") || path.startsWith("//") || /[\\\s?#]/.test(path)) {
    throw new DictationError(
      "configuration",
      "Voice transcription is not available yet. You can save your recording.",
    );
  }
  return path;
}

export interface DraftSelection {
  text: string;
  start: number;
  end: number;
}

/** Insert at the saved caret/selection without replacing the existing draft. */
export function insertDictation(draft: DraftSelection, transcript: string) {
  const start = Math.max(0, Math.min(draft.text.length, draft.start));
  const end = Math.max(start, Math.min(draft.text.length, draft.end));
  const before = draft.text.slice(0, start);
  const after = draft.text.slice(end);
  const words = transcript.trim();
  if (!words) return { text: draft.text, caret: end };
  const leading = before && !/\s$/.test(before) ? " " : "";
  const trailing = after && !/^\s|^[.,!?;:)]/.test(after) ? " " : "";
  const insertion = `${leading}${words}${trailing}`;
  return {
    text: before + insertion + after,
    caret: before.length + insertion.length,
  };
}
