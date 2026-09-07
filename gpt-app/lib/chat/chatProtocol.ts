import type { UploadedFile } from "@/types/api.types";

export const CHAT_PROTOCOL_VERSION = 2 as const;
export const CHAT_ACK_TIMEOUT_MS = 8_000;

export const CHAT_SEND_EVENT = "chat:send" as const;
export const CHAT_STATUS_EVENT = "chat:status" as const;
export const CHAT_RETRY_EVENT = "chat:retry" as const;

export const ChatServerEvent = {
  Stream: "chat:stream",
  End: "chat:end",
  Error: "chat:error",
} as const;

export type ChatServerEvent =
  (typeof ChatServerEvent)[keyof typeof ChatServerEvent];

export type ChatTurnStatus = "queued" | "processing" | "completed" | "failed";

export const CHAT_ERROR_CODES = [
  "INVALID_ENVELOPE",
  "INVALID_CLIENT_MESSAGE_ID",
  "INVALID_CONVERSATION_ID",
  "CONVERSATION_NOT_FOUND",
  "MODEL_NOT_AVAILABLE",
  "INSUFFICIENT_BALANCE",
  "IDEMPOTENCY_CONFLICT",
  "TURN_NOT_FOUND",
  "TURN_NOT_RETRYABLE",
  "TURN_ALREADY_PROCESSING",
  "PROVIDER_UNAVAILABLE",
  "PROCESS_INTERRUPTED",
  "INTERNAL_ERROR",
] as const;

export type ChatProtocolErrorCode = (typeof CHAT_ERROR_CODES)[number];

export type ChatProtocolError = {
  code: ChatProtocolErrorCode;
  message: string;
  retryable: boolean;
};

export type AssistantMessageDTO = {
  id: string;
  role: "assistant";
  content: string;
  modelId: string;
  tokens: number;
  turnId: string;
  createdAt: string;
  updatedAt: string;
};

export type BillingDTO = {
  appTokensSpent: number;
  totalTokens: number;
  balance: number;
};

export type ChatTurnSnapshot = {
  turnId: string;
  clientMessageId: string;
  conversationId: string;
  status: ChatTurnStatus;
  attempt: number;
  lastSeq: number;
  partialContent: string;
  assistantMessage: AssistantMessageDTO | null;
  billing: BillingDTO | null;
  error: ChatProtocolError | null;
  createdAt: string;
  updatedAt: string;
};

type ClientEnvelope<TEvent extends string, TPayload> = {
  protocolVersion: typeof CHAT_PROTOCOL_VERSION;
  event: TEvent;
  type: "request";
  payload: TPayload;
};

type ServerEnvelope<TEvent extends string, TType extends string, TPayload> = {
  protocolVersion: typeof CHAT_PROTOCOL_VERSION;
  event: TEvent;
  type: TType;
  turnId: string;
  clientMessageId: string;
  conversationId: string;
  attempt: number;
  payload: TPayload;
};

export type ChatSendPayload = {
  clientMessageId: string;
  conversationId: string;
  modelId: string;
  message: string;
  files?: UploadedFile[];
};

export type ChatSendEnvelope = ClientEnvelope<
  typeof CHAT_SEND_EVENT,
  ChatSendPayload
>;

export type ChatStatusEnvelope = ClientEnvelope<
  typeof CHAT_STATUS_EVENT,
  { turnId: string }
>;

export type ChatRetryEnvelope = ClientEnvelope<
  typeof CHAT_RETRY_EVENT,
  { turnId: string }
>;

export type ChatSendAck =
  | {
      ok: true;
      protocolVersion: typeof CHAT_PROTOCOL_VERSION;
      disposition: "accepted" | "duplicate";
      turn: ChatTurnSnapshot;
    }
  | {
      ok: false;
      protocolVersion: typeof CHAT_PROTOCOL_VERSION;
      error: ChatProtocolError;
    };

export type ChatStatusAck =
  | {
      ok: true;
      protocolVersion: typeof CHAT_PROTOCOL_VERSION;
      turn: ChatTurnSnapshot;
    }
  | {
      ok: false;
      protocolVersion: typeof CHAT_PROTOCOL_VERSION;
      error: ChatProtocolError;
    };

export type ChatRetryAck = ChatStatusAck;

export type ChatStreamEvent = ServerEnvelope<
  (typeof ChatServerEvent)["Stream"],
  "delta",
  { seq: number; chunk: string }
>;

export type ChatEndEvent = ServerEnvelope<
  (typeof ChatServerEvent)["End"],
  "completed",
  { assistantMessage: AssistantMessageDTO; billing: BillingDTO }
>;

export type ChatErrorEvent = ServerEnvelope<
  (typeof ChatServerEvent)["Error"],
  "failed",
  { error: ChatProtocolError }
>;

const UUID_V4_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const ERROR_CODES = new Set<string>(CHAT_ERROR_CODES);
const TURN_STATUSES = new Set<string>([
  "queued",
  "processing",
  "completed",
  "failed",
]);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const readString = (value: unknown): string | null =>
  typeof value === "string" ? value : null;

const readNonEmptyString = (value: unknown): string | null => {
  const text = readString(value);
  return text !== null && text.trim().length > 0 ? text : null;
};

const readFiniteNumber = (value: unknown): number | null =>
  typeof value === "number" && Number.isFinite(value) ? value : null;

const readNonNegativeInteger = (value: unknown): number | null =>
  typeof value === "number" && Number.isSafeInteger(value) && value >= 0
    ? value
    : null;

const readPositiveInteger = (value: unknown): number | null => {
  const integer = readNonNegativeInteger(value);
  return integer !== null && integer > 0 ? integer : null;
};

const readUuid = (value: unknown): string | null => {
  const text = readNonEmptyString(value);
  return text && UUID_V4_RE.test(text) ? text : null;
};

const readProtocolError = (value: unknown): ChatProtocolError | null => {
  if (!isRecord(value)) return null;
  const code = readNonEmptyString(value.code);
  const message = readNonEmptyString(value.message);
  if (!code || !ERROR_CODES.has(code) || !message) return null;
  if (typeof value.retryable !== "boolean") return null;
  return {
    code: code as ChatProtocolErrorCode,
    message,
    retryable: value.retryable,
  };
};

const readBilling = (value: unknown): BillingDTO | null => {
  if (!isRecord(value)) return null;
  const appTokensSpent = readFiniteNumber(value.appTokensSpent);
  const totalTokens = readFiniteNumber(value.totalTokens);
  const balance = readFiniteNumber(value.balance);
  if (appTokensSpent === null || totalTokens === null || balance === null) {
    return null;
  }
  return { appTokensSpent, totalTokens, balance };
};

const readAssistantMessage = (value: unknown): AssistantMessageDTO | null => {
  if (!isRecord(value) || value.role !== "assistant") return null;
  const id = readNonEmptyString(value.id);
  const content = readString(value.content);
  const modelId = readNonEmptyString(value.modelId);
  const tokens = readFiniteNumber(value.tokens);
  const turnId = readUuid(value.turnId);
  const createdAt = readNonEmptyString(value.createdAt);
  const updatedAt = readNonEmptyString(value.updatedAt);
  if (
    !id ||
    content === null ||
    !modelId ||
    tokens === null ||
    !turnId ||
    !createdAt ||
    !updatedAt
  ) {
    return null;
  }
  return {
    id,
    role: "assistant",
    content,
    modelId,
    tokens,
    turnId,
    createdAt,
    updatedAt,
  };
};

export const readChatTurnSnapshot = (
  value: unknown,
): ChatTurnSnapshot | null => {
  if (!isRecord(value)) return null;
  const turnId = readUuid(value.turnId);
  const clientMessageId = readUuid(value.clientMessageId);
  const conversationId = readNonEmptyString(value.conversationId);
  const status = readNonEmptyString(value.status);
  const attempt = readPositiveInteger(value.attempt);
  const lastSeq = readNonNegativeInteger(value.lastSeq);
  const partialContent = readString(value.partialContent);
  const createdAt = readNonEmptyString(value.createdAt);
  const updatedAt = readNonEmptyString(value.updatedAt);

  if (
    !turnId ||
    !clientMessageId ||
    !conversationId ||
    !status ||
    !TURN_STATUSES.has(status) ||
    attempt === null ||
    lastSeq === null ||
    partialContent === null ||
    !createdAt ||
    !updatedAt
  ) {
    return null;
  }

  const assistantMessage =
    value.assistantMessage === null
      ? null
      : readAssistantMessage(value.assistantMessage);
  const billing = value.billing === null ? null : readBilling(value.billing);
  const error = value.error === null ? null : readProtocolError(value.error);
  if (
    (value.assistantMessage !== null && !assistantMessage) ||
    (value.billing !== null && !billing) ||
    (value.error !== null && !error)
  ) {
    return null;
  }

  return {
    turnId,
    clientMessageId,
    conversationId,
    status: status as ChatTurnStatus,
    attempt,
    lastSeq,
    partialContent,
    assistantMessage,
    billing,
    error,
    createdAt,
    updatedAt,
  };
};

const hasProtocolVersion = (value: Record<string, unknown>) =>
  value.protocolVersion === CHAT_PROTOCOL_VERSION;

export const readChatSendAck = (value: unknown): ChatSendAck | null => {
  if (!isRecord(value) || !hasProtocolVersion(value)) return null;
  if (value.ok === false) {
    const error = readProtocolError(value.error);
    return error
      ? { ok: false, protocolVersion: CHAT_PROTOCOL_VERSION, error }
      : null;
  }
  if (value.ok !== true) return null;
  if (value.disposition !== "accepted" && value.disposition !== "duplicate") {
    return null;
  }
  const turn = readChatTurnSnapshot(value.turn);
  return turn
    ? {
        ok: true,
        protocolVersion: CHAT_PROTOCOL_VERSION,
        disposition: value.disposition,
        turn,
      }
    : null;
};

const readTurnAck = (value: unknown): ChatStatusAck | null => {
  if (!isRecord(value) || !hasProtocolVersion(value)) return null;
  if (value.ok === false) {
    const error = readProtocolError(value.error);
    return error
      ? { ok: false, protocolVersion: CHAT_PROTOCOL_VERSION, error }
      : null;
  }
  if (value.ok !== true) return null;
  const turn = readChatTurnSnapshot(value.turn);
  return turn
    ? { ok: true, protocolVersion: CHAT_PROTOCOL_VERSION, turn }
    : null;
};

export const readChatStatusAck = readTurnAck;
export const readChatRetryAck = readTurnAck;

type EventIdentity = {
  turnId: string;
  clientMessageId: string;
  conversationId: string;
  attempt: number;
};

const readEventIdentity = (
  value: Record<string, unknown>,
): EventIdentity | null => {
  if (!hasProtocolVersion(value)) return null;
  const turnId = readUuid(value.turnId);
  const clientMessageId = readUuid(value.clientMessageId);
  const conversationId = readNonEmptyString(value.conversationId);
  const attempt = readPositiveInteger(value.attempt);
  return turnId && clientMessageId && conversationId && attempt !== null
    ? { turnId, clientMessageId, conversationId, attempt }
    : null;
};

export const readChatStreamEvent = (value: unknown): ChatStreamEvent | null => {
  if (
    !isRecord(value) ||
    value.event !== ChatServerEvent.Stream ||
    value.type !== "delta" ||
    !isRecord(value.payload)
  ) {
    return null;
  }
  const identity = readEventIdentity(value);
  const seq = readPositiveInteger(value.payload.seq);
  const chunk = readString(value.payload.chunk);
  return identity && seq !== null && chunk !== null && chunk.length > 0
    ? {
        protocolVersion: CHAT_PROTOCOL_VERSION,
        event: ChatServerEvent.Stream,
        type: "delta",
        ...identity,
        payload: { seq, chunk },
      }
    : null;
};

export const readChatEndEvent = (value: unknown): ChatEndEvent | null => {
  if (
    !isRecord(value) ||
    value.event !== ChatServerEvent.End ||
    value.type !== "completed" ||
    !isRecord(value.payload)
  ) {
    return null;
  }
  const identity = readEventIdentity(value);
  const assistantMessage = readAssistantMessage(value.payload.assistantMessage);
  const billing = readBilling(value.payload.billing);
  if (!identity || !assistantMessage || !billing) return null;
  if (assistantMessage.turnId !== identity.turnId) return null;
  return {
    protocolVersion: CHAT_PROTOCOL_VERSION,
    event: ChatServerEvent.End,
    type: "completed",
    ...identity,
    payload: { assistantMessage, billing },
  };
};

export const readChatErrorEvent = (value: unknown): ChatErrorEvent | null => {
  if (
    !isRecord(value) ||
    value.event !== ChatServerEvent.Error ||
    value.type !== "failed" ||
    !isRecord(value.payload)
  ) {
    return null;
  }
  const identity = readEventIdentity(value);
  const error = readProtocolError(value.payload.error);
  return identity && error
    ? {
        protocolVersion: CHAT_PROTOCOL_VERSION,
        event: ChatServerEvent.Error,
        type: "failed",
        ...identity,
        payload: { error },
      }
    : null;
};

export const makeChatSendEnvelope = (
  payload: ChatSendPayload,
): ChatSendEnvelope => ({
  protocolVersion: CHAT_PROTOCOL_VERSION,
  event: CHAT_SEND_EVENT,
  type: "request",
  payload,
});

export const makeChatStatusEnvelope = (turnId: string): ChatStatusEnvelope => ({
  protocolVersion: CHAT_PROTOCOL_VERSION,
  event: CHAT_STATUS_EVENT,
  type: "request",
  payload: { turnId },
});

export const makeChatRetryEnvelope = (turnId: string): ChatRetryEnvelope => ({
  protocolVersion: CHAT_PROTOCOL_VERSION,
  event: CHAT_RETRY_EVENT,
  type: "request",
  payload: { turnId },
});

export const createClientMessageId = (): string => {
  if (typeof crypto === "undefined" || !("randomUUID" in crypto)) {
    throw new Error("This browser cannot create a secure chat message ID.");
  }
  return crypto.randomUUID();
};

export const CHAT_ERROR_FALLBACK = "Couldn't get a response. Please try again.";
export const CHAT_CONNECTION_LOST =
  "Connection lost. Check your network and try again.";
export const CHAT_DELIVERY_UNKNOWN =
  "Message delivery could not be confirmed. Retry will reuse the same message.";

const readUnknownErrorMessage = (value: unknown): string | null => {
  if (typeof value === "string") return readNonEmptyString(value);
  if (value instanceof Error) return readNonEmptyString(value.message);
  if (!isRecord(value)) return null;
  if (isRecord(value.response) && isRecord(value.response.data)) {
    const apiMessage = readNonEmptyString(value.response.data.message);
    if (apiMessage) return apiMessage;
  }
  return readNonEmptyString(value.message);
};

export const classifyChatError = (
  error: unknown,
): { reason: "auth-expired" } | { reason: "failed"; message: string } => {
  const message = readUnknownErrorMessage(error);
  const responseStatus =
    isRecord(error) && isRecord(error.response)
      ? readFiniteNumber(error.response.status)
      : null;
  if (responseStatus === 401 || message === "jwt expired") {
    return { reason: "auth-expired" };
  }
  return { reason: "failed", message: message ?? CHAT_ERROR_FALLBACK };
};
