import { isAuthExpiredError } from "@/lib/authError";
import type { UploadedFile } from "@/types/api.types";

export const CHAT_SEND_EVENT = "chat:send" as const;

export const ChatServerEvent = {
  Stream: "chat:stream",
  End: "chat:end",
  Error: "chat:error",
} as const;
export type ChatServerEvent =
  (typeof ChatServerEvent)[keyof typeof ChatServerEvent];

export type ChatSendPayload = {
  message: string;
  conversationId: string;
  modelId: string;
  files?: UploadedFile[];
};

export type ChatSendEnvelope = {
  event: typeof CHAT_SEND_EVENT;
  type: "send-request";
  payload: ChatSendPayload;
};

export const makeChatSendEnvelope = (
  payload: ChatSendPayload,
): ChatSendEnvelope => ({
  event: CHAT_SEND_EVENT,
  type: "send-request",
  payload,
});

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const readEnvelopeField = (source: unknown, key: string): unknown => {
  if (!isRecord(source)) return undefined;
  if (source[key] !== undefined) return source[key];
  const { payload } = source;
  return isRecord(payload) ? payload[key] : undefined;
};

const readFiniteNumber = (value: unknown): number | null =>
  typeof value === "number" && Number.isFinite(value) ? value : null;

const readNonEmptyString = (value: unknown): string | null =>
  typeof value === "string" && value.trim().length > 0 ? value : null;

export const readStreamChunk = (raw: unknown): string | null => {
  const chunk = readEnvelopeField(raw, "chunk");
  return typeof chunk === "string" && chunk.length > 0 ? chunk : null;
};

export type ChatTurnCompletion = {
  tokensSpent: number | null;
  balance: number | null;
};

export const readTurnCompletion = (raw: unknown): ChatTurnCompletion => ({
  tokensSpent: readFiniteNumber(readEnvelopeField(raw, "appTokensSpent")),
  balance: readFiniteNumber(readEnvelopeField(raw, "balance")),
});

export const CHAT_ERROR_FALLBACK = "Couldn't get a response. Please try again.";

export const CHAT_CONNECTION_LOST =
  "Connection lost. Check your network and send the message again.";

export const readErrorMessage = (err: unknown, fallback: string): string => {
  if (typeof err === "string") return readNonEmptyString(err) ?? fallback;
  if (err instanceof Error) return readNonEmptyString(err.message) ?? fallback;
  if (!isRecord(err)) return fallback;

  const { response } = err;
  if (isRecord(response) && isRecord(response.data)) {
    const apiMessage = readNonEmptyString(response.data.message);
    if (apiMessage) return apiMessage;
  }

  return (
    readNonEmptyString(readEnvelopeField(err, "message")) ??
    readNonEmptyString(readEnvelopeField(err, "error")) ??
    fallback
  );
};

export type ChatTurnEnd =
  | ({ reason: "completed" } & ChatTurnCompletion)
  | { reason: "failed"; message: string }
  | { reason: "auth-expired" }
  | { reason: "disconnected" };

export const classifyChatError = (
  err: unknown,
): Extract<ChatTurnEnd, { reason: "failed" | "auth-expired" }> =>
  isAuthExpiredError(err)
    ? { reason: "auth-expired" }
    : { reason: "failed", message: readErrorMessage(err, CHAT_ERROR_FALLBACK) };

export const assertNever = (value: never): never => {
  throw new Error(`Unhandled case: ${JSON.stringify(value)}`);
};
