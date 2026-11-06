import { axiosInstance } from "@/lib/axiosInstance";
import { createBackendTranscriber } from "./transcriptionRequest";

export const transcribeDictation = createBackendTranscriber(
  axiosInstance,
  process.env.NEXT_PUBLIC_DICTATION_TRANSCRIBE_PATH,
);
