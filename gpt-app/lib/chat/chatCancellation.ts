import type { PendingChatTurn } from "../../types/types";
import {
  CHAT_CANCEL_EVENT,
  CHAT_STATUS_EVENT,
  makeChatCancelEnvelope,
  makeChatStatusEnvelope,
  readChatCancelAck,
  type ChatTurnSnapshot,
} from "./chatProtocol";
import { matchesPendingTurnEvent } from "./chatDelivery";

export const STOP_UNCONFIRMED =
  "Could not confirm Stop. This request may still be running. Reconnect and try Stop again.";

export const isTerminalTurn = (turn: { status: string }) =>
  turn.status === "completed" || turn.status === "failed";

export const canStopTurn = (turn: PendingChatTurn) =>
  Boolean(turn.turnId) && !isTerminalTurn(turn);

export const selectStoppableTurn = (
  turns: Record<string, PendingChatTurn>,
  conversationId: string | null,
) => Object.values(turns).find(turn =>
  turn.conversationId === conversationId && canStopTurn(turn),
);

// Cancellation ACKs and polling can arrive behind streamed chunks or terminal events.
// Preserve newer text and a confirmed cancellation without reviving a finished attempt.
export function reconcileTurnSnapshot(
  turn: PendingChatTurn | undefined,
  snapshot: ChatTurnSnapshot,
): ChatTurnSnapshot | null {
  if (!turn || turn.clientMessageId !== snapshot.clientMessageId ||
      turn.conversationId !== snapshot.conversationId ||
      (turn.turnId && turn.turnId !== snapshot.turnId) ||
      turn.attempt > snapshot.attempt || turn.status === "completed") return null;
  const sameAttempt = turn.attempt === snapshot.attempt;
  if (sameAttempt && isTerminalTurn(turn) && !isTerminalTurn(snapshot)) return null;
  const staleText = sameAttempt && turn.lastAppliedSeq > snapshot.lastSeq;
  return {
    ...snapshot,
    status: sameAttempt && turn.status === "processing" && snapshot.status === "queued"
      ? "processing" : snapshot.status,
    lastSeq: sameAttempt ? Math.max(turn.lastAppliedSeq, snapshot.lastSeq) : snapshot.lastSeq,
    partialContent: staleText ? turn.partialContent : snapshot.partialContent,
    cancelRequested: Boolean(snapshot.cancelRequested || (sameAttempt && turn.cancelRequested)),
  };
}

type CancellationOptions = {
  getTurn: (turnId: string) => PendingChatTurn | undefined;
  connect: () => Promise<void>;
  send: (event: string, envelope: unknown) => Promise<unknown>;
  applySnapshot: (snapshot: ChatTurnSnapshot) => void;
  onBusy: (turnId: string, busy: boolean) => void;
  onUnconfirmed: (turnId: string) => void;
};

export function createTurnCanceller(options: CancellationOptions) {
  const inFlight = new Map<string, Promise<boolean>>();
  return (turnId: string): Promise<boolean> => {
    const running = inFlight.get(turnId);
    if (running) return running;
    const original = options.getTurn(turnId);
    if (!original || !canStopTurn(original)) return Promise.resolve(false);
    if (original.cancelRequested) return Promise.resolve(true);

    const settled = () => {
      const current = options.getTurn(turnId);
      return !current || !matchesPendingTurnEvent(current, { ...original, turnId }) ||
        isTerminalTurn(current) || Boolean(current.cancelRequested);
    };
    const accept = (raw: unknown) => {
      const ack = readChatCancelAck(raw);
      if (!ack?.ok || !matchesPendingTurnEvent(original, ack.turn)) return false;
      options.applySnapshot(ack.turn);
      return settled();
    };
    // Defer execution so the lock is installed before any callback can run again.
    const request = Promise.resolve().then(async () => {
      options.onBusy(turnId, true);
      try {
        await options.connect();
        if (settled()) return true;
        if (accept(await options.send(CHAT_CANCEL_EVENT, makeChatCancelEnvelope(turnId)))) return true;
      } catch { /* A lost ACK does not mean the server rejected cancellation. */ }
      if (settled()) return true;
      try {
        await options.connect();
        if (settled()) return true;
        if (accept(await options.send(CHAT_STATUS_EVENT, makeChatStatusEnvelope(turnId)))) return true;
      } catch { /* Keep tracking the original turn; never resend or create a retry. */ }
      if (settled()) return true;
      options.onUnconfirmed(turnId);
      return false;
    }).finally(() => {
      inFlight.delete(turnId);
      options.onBusy(turnId, false);
    });
    inFlight.set(turnId, request);
    return request;
  };
}
