import assert from "node:assert/strict";
import { test } from "node:test";
import type { PendingChatTurn } from "../types/types";
import {
  canStopTurn, createTurnCanceller, reconcileTurnSnapshot, selectStoppableTurn,
} from "../lib/chat/chatCancellation";
import {
  makeChatCancelEnvelope, readChatCancelAck, type ChatTurnSnapshot,
} from "../lib/chat/chatProtocol";

const turnId = "ab279fa8-b4d7-48a0-9230-43b52cf3073a";
const clientMessageId = "6a09b9b6-3daf-4c9f-a272-6b8c6813fd0b";
const conversationId = "66d19f77ed08f975db013421";
const pending = (overrides: Partial<PendingChatTurn> = {}): PendingChatTurn => ({
  turnId, clientMessageId, conversationId, modelId: "gpt-5.5", message: "Edit workbook",
  files: [], localFileFingerprints: [], status: "processing", attempt: 1,
  lastAppliedSeq: 2, partialContent: "Preparing copy", retryable: false,
  createdAt: "2026-11-14T10:00:00Z", ...overrides,
});
const snapshot = (overrides: Partial<ChatTurnSnapshot> = {}): ChatTurnSnapshot => ({
  turnId, clientMessageId, conversationId, status: "processing", attempt: 1, lastSeq: 2,
  partialContent: "Preparing copy", assistantMessage: null, billing: null, error: null,
  createdAt: "2026-11-14T10:00:00Z", updatedAt: "2026-11-14T10:00:01Z", ...overrides,
});
const ack = (overrides: Partial<ChatTurnSnapshot> = {}) => ({
  ok: true, protocolVersion: 2, turn: snapshot(overrides),
});
function harness(send: (event: string) => Promise<unknown>, initial = pending()) {
  let current: PendingChatTurn | undefined = initial;
  let connects = 0;
  const events: string[] = [];
  const applied: ChatTurnSnapshot[] = [];
  const busy: boolean[] = [];
  const warnings: string[] = [];
  const cancel = createTurnCanceller({
    getTurn: id => current?.turnId === id ? current : undefined,
    connect: async () => { connects++; },
    send: async (event, envelope) => {
      events.push(event);
      assert.deepEqual(envelope, { protocolVersion: 2, event, type: "request", payload: { turnId } });
      return send(event);
    },
    applySnapshot: raw => {
      const result = reconcileTurnSnapshot(current, raw);
      if (!result) return;
      applied.push(result);
      current = result.status === "completed" ? undefined : {
        ...current!, status: result.status, cancelRequested: result.cancelRequested,
        lastAppliedSeq: result.lastSeq, partialContent: result.partialContent,
      };
    },
    onBusy: (id, value) => { assert.equal(id, turnId); busy.push(value); },
    onUnconfirmed: id => warnings.push(id),
  });
  return { cancel, events, applied, busy, warnings, get current() { return current; },
    set current(value) { current = value; }, get connects() { return connects; } };
}

test("cancel uses the backend's exact V2 envelope and reads its cancellation flag", () => {
  assert.deepEqual(makeChatCancelEnvelope(turnId), {
    protocolVersion: 2, event: "chat:cancel", type: "request", payload: { turnId },
  });
  const result = readChatCancelAck(ack({ cancelRequested: true }));
  assert.ok(result?.ok && result.turn.cancelRequested);
  const absent = readChatCancelAck(ack());
  assert.ok(absent?.ok && !absent.turn.cancelRequested);
  const malformed = readChatCancelAck({ ...ack(), turn: { ...snapshot(), cancelRequested: "true" } });
  assert.ok(malformed?.ok && !malformed.turn.cancelRequested);
  assert.equal(readChatCancelAck({ ok: true, protocolVersion: 1 }), null);
});

test("queued cancellation is terminal and preserves USER_CANCELLED", async () => {
  const h = harness(async () => ack({ status: "failed", cancelRequested: true,
    error: { code: "USER_CANCELLED", message: "Request cancelled.", retryable: false },
  }), pending({ status: "queued" }));
  assert.equal(await h.cancel(turnId), true);
  assert.equal(h.current?.status, "failed");
  assert.equal(h.applied[0].error?.message, "Request cancelled.");
  assert.equal(h.applied[0].billing, null); // Release can arrive without a billing DTO.
  assert.equal(await h.cancel(turnId), false);
  assert.deepEqual(h.events, ["chat:cancel"]);
});

test("processing cancellation stays active until the worker confirms a terminal result", async () => {
  const h = harness(async () => ack({ cancelRequested: true }));
  assert.equal(await h.cancel(turnId), true);
  assert.equal(h.current?.status, "processing");
  assert.equal(h.current?.cancelRequested, true);
  assert.deepEqual(h.busy, [true, false]);
  await h.cancel(turnId);
  assert.deepEqual(h.events, ["chat:cancel"]);
});

test("double click shares one cancellation operation", async () => {
  let finish!: (value: unknown) => void;
  const response = new Promise(resolve => { finish = resolve; });
  const h = harness(async () => response);
  const first = h.cancel(turnId);
  const second = h.cancel(turnId);
  assert.equal(first, second);
  finish(ack({ cancelRequested: true }));
  assert.equal(await first, true);
  assert.deepEqual(h.events, ["chat:cancel"]);
});

test("lost cancellation ACK checks status only and recovers accepted cancellation", async () => {
  const h = harness(async event => {
    if (event === "chat:cancel") throw new Error("ACK timeout");
    return ack({ cancelRequested: true });
  });
  assert.equal(await h.cancel(turnId), true);
  assert.deepEqual(h.events, ["chat:cancel", "chat:status"]);
  assert.deepEqual(h.warnings, []);
});

test("uncertain cancellation leaves the original turn active and permits an explicit retry", async () => {
  let offline = true;
  const h = harness(async () => {
    if (offline) throw new Error("Disconnected");
    return ack({ cancelRequested: true });
  });
  assert.equal(await h.cancel(turnId), false);
  assert.equal(h.current?.status, "processing");
  assert.equal(h.current?.cancelRequested, undefined);
  assert.deepEqual(h.warnings, [turnId]);
  offline = false;
  assert.equal(await h.cancel(turnId), true);
  assert.deepEqual(h.events, ["chat:cancel", "chat:status", "chat:cancel"]);
});

test("rejected Stop is not reported as success while status says the request is running", async () => {
  const h = harness(async event => event === "chat:cancel"
    ? { ok: false, protocolVersion: 2, error: { code: "TURN_NOT_FOUND", message: "Not found", retryable: false } }
    : ack());
  assert.equal(await h.cancel(turnId), false);
  assert.equal(h.warnings.length, 1);
  assert.equal(h.current?.status, "processing");
});

test("wrong-turn and stale-attempt ACKs cannot cancel or replace the active turn", async () => {
  for (const change of [
    { turnId: "cb279fa8-b4d7-48a0-9230-43b52cf3073a" },
    { conversationId: "other-chat" },
    { attempt: 2 },
  ]) {
    const h = harness(async () => ack({ ...change, cancelRequested: true }));
    assert.equal(await h.cancel(turnId), false);
    assert.equal(h.applied.length, 0);
    assert.equal(h.current?.cancelRequested, undefined);
  }
});

test("normal completion wins a race with a delayed cancellation ACK", async () => {
  const h = harness(async () => {
    h.current = undefined; // chat:end was committed while chat:cancel was in flight.
    return ack({ cancelRequested: true });
  });
  assert.equal(await h.cancel(turnId), true);
  assert.equal(h.current, undefined);
  assert.equal(h.applied.length, 0);
  assert.deepEqual(h.warnings, []);
});

test("a finished response in the cancellation ACK is retained as a completed result", async () => {
  const assistantMessage = {
    id: "answer", role: "assistant" as const, content: "Edited Excel copy attached.",
    modelId: "gpt-5.5", tokens: 123, turnId,
    createdAt: "2026-11-14T10:00:00Z", updatedAt: "2026-11-14T10:00:02Z",
  };
  const h = harness(async () => ack({ status: "completed", assistantMessage,
    billing: { appTokensSpent: 123, totalTokens: 100, balance: 9000 },
  }));
  assert.equal(await h.cancel(turnId), true);
  assert.equal(h.applied[0].assistantMessage?.content, assistantMessage.content);
  assert.equal(h.applied[0].billing?.appTokensSpent, 123);
  assert.equal(h.current, undefined);
});

test("an old cancellation ACK cannot affect a new generation attempt", async () => {
  const h = harness(async () => {
    h.current = pending({ attempt: 2 });
    return ack({ cancelRequested: true });
  });
  assert.equal(await h.cancel(turnId), true);
  assert.equal(h.current?.attempt, 2);
  assert.equal(h.current?.cancelRequested, undefined);
  assert.equal(h.applied.length, 0);
});

test("completed while reconnecting does not emit a cancellation", async () => {
  const h = harness(async () => { throw new Error("Should not emit"); });
  const result = h.cancel(turnId);
  h.current = undefined;
  assert.equal(await result, true);
  assert.deepEqual(h.events, []);
});

test("Stop is scoped to the current chat, requires an accepted turn, and survives reload", async () => {
  assert.equal(canStopTurn(pending({ turnId: null, status: "awaiting_ack" })), false);
  assert.equal(canStopTurn(pending({ status: "failed" })), false);
  assert.equal(canStopTurn(pending({ status: "delivery_unknown" })), true);
  const restored = JSON.parse(JSON.stringify(pending({ cancelRequested: true })));
  assert.equal(selectStoppableTurn({ [clientMessageId]: restored }, "different-chat"), undefined);
  assert.equal(selectStoppableTurn({ [clientMessageId]: restored }, conversationId)?.cancelRequested, true);
  const h = harness(async () => { throw new Error("Must not resend"); }, restored);
  assert.equal(await h.cancel(turnId), true);
  assert.deepEqual(h.events, []);
});

test("a stale poll cannot remove accepted cancellation or streamed text", () => {
  const result = reconcileTurnSnapshot(pending({ lastAppliedSeq: 10, partialContent: "Newer text", cancelRequested: true }),
    snapshot({ lastSeq: 2, partialContent: "Old", cancelRequested: false, status: "queued" }));
  assert.equal(result?.cancelRequested, true);
  assert.equal(result?.partialContent, "Newer text");
  assert.equal(result?.lastSeq, 10);
  assert.equal(result?.status, "processing");
});

test("a cancellation ACK behind stream chunks still records the server cancellation flag", () => {
  const result = reconcileTurnSnapshot(pending({ lastAppliedSeq: 10, partialContent: "Newer text" }),
    snapshot({ lastSeq: 2, cancelRequested: true }));
  assert.equal(result?.cancelRequested, true);
  assert.equal(result?.partialContent, "Newer text");
});

test("terminal cancellation cannot be resurrected by late snapshots; new attempt clears old flag", () => {
  assert.equal(reconcileTurnSnapshot(pending({ status: "failed", cancelRequested: true }), snapshot()), null);
  assert.equal(reconcileTurnSnapshot(undefined, snapshot()), null);
  const next = reconcileTurnSnapshot(pending({ status: "failed", cancelRequested: true }), snapshot({ attempt: 2 }));
  assert.equal(next?.cancelRequested, false);
});

test("background XLSX cancellation preserves its partial result and known usage", async () => {
  const h = harness(async () => ack({ status: "completed", cancelRequested: true,
    assistantMessage: {
      id: "cancelled-document", role: "assistant", content: "",
      modelId: "gpt-5.5", tokens: 42, turnId,
      computation: { kind: "document", status: "partial", runs: 2, executionMs: 1500, reason: "USER_CANCELLED" },
      createdAt: "2026-11-14T10:00:00Z", updatedAt: "2026-11-14T10:00:02Z",
    },
    billing: { appTokensSpent: 42, totalTokens: 30, balance: 9958 },
  }));
  assert.equal(await h.cancel(turnId), true);
  assert.equal(h.applied[0].assistantMessage?.computation?.reason, "USER_CANCELLED");
  assert.equal(h.applied[0].assistantMessage?.computation?.status, "partial");
  assert.equal(h.applied[0].billing?.appTokensSpent, 42);
  assert.equal(h.current, undefined);
});

test("a disconnected socket that cannot reconnect keeps the turn and enables Stop retry", async () => {
  let attempts = 0;
  const warnings: string[] = [];
  const busy: boolean[] = [];
  const original = pending({ status: "syncing" });
  const cancel = createTurnCanceller({
    getTurn: () => original,
    connect: async () => { attempts++; throw new Error("Offline"); },
    send: async () => { assert.fail("Must not emit while offline"); },
    applySnapshot: () => assert.fail("Must not synthesize a server result"),
    onBusy: (_id, value) => busy.push(value),
    onUnconfirmed: id => warnings.push(id),
  });
  assert.equal(await cancel(turnId), false);
  assert.equal(attempts, 2);
  assert.deepEqual(busy, [true, false]);
  assert.deepEqual(warnings, [turnId]);
  assert.equal(original.status, "syncing");
  assert.equal(original.cancelRequested, undefined);
});
