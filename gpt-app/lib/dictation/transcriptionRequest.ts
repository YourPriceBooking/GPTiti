import type { AxiosInstance } from "axios";
import { readTranscript, transcriptionPath, type TranscribeAudio } from "./protocol";

/** Use the authenticated client; an omitted language enables backend detection. */
export function createBackendTranscriber(
  client: Pick<AxiosInstance, "post">,
  configuredPath?: string,
): TranscribeAudio {
  return async (recording, signal) => {
    const path = transcriptionPath(configuredPath) ?? "/upload/transcriptions";
    const form = new FormData();
    const extension = recording.audio.type.includes("mp4")
      ? "m4a"
      : recording.audio.type.includes("ogg") ? "ogg" : "webm";
    form.append("file", recording.audio, `dictation.${extension}`);
    const response = await client.post<unknown>(path, form, {
      signal,
      // Allow the backend's 300-second recognition timeout plus transport time.
      timeout: 330_000,
      // Remove the client's JSON default; the browser supplies the boundary.
      headers: { "Content-Type": undefined },
    });
    return readTranscript(response.data);
  };
}
