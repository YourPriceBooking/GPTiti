import { axiosInstance } from "@/lib/axiosInstance";
import {
  DictationError,
  readTranscript,
  transcriptionPath,
  type TranscribeAudio,
} from "./protocol";

/** The only integration point to change when the backend contract is ready. */
export const transcribeDictation: TranscribeAudio = async (
  recording,
  signal,
) => {
  const path = transcriptionPath(
    process.env.NEXT_PUBLIC_DICTATION_TRANSCRIBE_PATH,
  );
  if (!path) {
    throw new DictationError(
      "not-configured",
      "Voice transcription is coming soon. You can type your message or save your recording.",
    );
  }
  const form = new FormData();
  const extension = recording.audio.type.includes("mp4")
    ? "m4a"
    : recording.audio.type.includes("ogg")
      ? "ogg"
      : "webm";
  form.append("audio", recording.audio, `dictation.${extension}`);
  form.append("durationMs", String(Math.round(recording.durationMs)));
  const response = await axiosInstance.post<unknown>(path, form, {
    signal,
    timeout: 60_000,
    // Override the client's JSON default; Axios/browser supplies the boundary.
    headers: { "Content-Type": "multipart/form-data" },
  });
  return readTranscript(response.data);
};
