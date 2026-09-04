import type { PendingChatTurn } from "@/types/types";

export const CHAT_TRANSPORT_RETRY_DELAYS_MS = [0, 2_000, 5_000] as const;

export type AckSocket = {
  timeout: (timeoutMs: number) => {
    emit: (
      event: string,
      payload: unknown,
      callback: (error: Error | null, response?: unknown) => void,
    ) => void;
  };
};

export const emitWithAck = <T>(
  socket: AckSocket,
  event: string,
  payload: unknown,
  timeoutMs: number,
): Promise<T> =>
  new Promise((resolve, reject) => {
    socket.timeout(timeoutMs).emit(event, payload, (error, response) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(response as T);
    });
  });

type RetryOptions<T> = {
  attempt: (attemptNumber: number) => Promise<T>;
  delaysMs?: readonly number[];
  wait?: (delayMs: number) => Promise<void>;
};

const defaultWait = (delayMs: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, delayMs));

export const runTransportRetries = async <T>({
  attempt,
  delaysMs = CHAT_TRANSPORT_RETRY_DELAYS_MS,
  wait = defaultWait,
}: RetryOptions<T>): Promise<T> => {
  if (delaysMs.length === 0) {
    throw new Error("At least one transport attempt is required.");
  }

  let lastError: unknown = new Error("Chat delivery failed.");
  for (let index = 0; index < delaysMs.length; index += 1) {
    const delayMs = delaysMs[index];
    if (delayMs > 0) await wait(delayMs);
    try {
      return await attempt(index + 1);
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
};

type LocalFileIdentity = Pick<File, "name" | "size" | "type" | "lastModified">;

export const fingerprintLocalFiles = (
  files: readonly LocalFileIdentity[],
): string[] =>
  files.map(
    (file) => `${file.name}\u0000${file.size}\u0000${file.type}\u0000${file.lastModified}`,
  );

export const isSamePendingRequest = (
  turn: PendingChatTurn,
  candidate: {
    conversationId: string;
    modelId: string;
    message: string;
    localFileFingerprints: readonly string[];
  },
): boolean =>
  turn.conversationId === candidate.conversationId &&
  turn.modelId === candidate.modelId &&
  turn.message === candidate.message &&
  turn.localFileFingerprints.length === candidate.localFileFingerprints.length &&
  turn.localFileFingerprints.every(
    (fingerprint, index) => fingerprint === candidate.localFileFingerprints[index],
  );

export type StreamSequenceDecision = "next" | "duplicate" | "gap" | "stale";

export const classifyStreamSequence = (
  current: { attempt: number; lastSeq: number },
  incoming: { attempt: number; seq: number },
): StreamSequenceDecision => {
  if (incoming.attempt !== current.attempt) return "stale";
  if (incoming.seq <= current.lastSeq) return "duplicate";
  return incoming.seq === current.lastSeq + 1 ? "next" : "gap";
};
