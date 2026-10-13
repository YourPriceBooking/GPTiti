import test from "node:test";
import assert from "node:assert/strict";
import { readBalanceSnapshot, canApplyBalance } from "../lib/balance/balanceProtocol.js";
import { createRefreshQueue } from "../lib/balance/refreshQueue.js";

test("balances are scoped to an account and never regress to an older receipt", () => {
  const latest = { userId: "recipient", appTokens: 130, balanceVersion: 4 };
  assert.equal(canApplyBalance("recipient", 3, latest), true);
  assert.equal(canApplyBalance("recipient", 4, { ...latest, balanceVersion: 3 }), false);
  assert.equal(canApplyBalance("sender", 1, latest), false);
  assert.equal(readBalanceSnapshot({ appTokens: 100 }), null);
  assert.equal(readBalanceSnapshot({ ...latest, balanceVersion: -1 }), null);
  assert.equal(readBalanceSnapshot({ ...latest, appTokens: 1.5 }), null);
  assert.deepEqual(readBalanceSnapshot({ ...latest, appTokens: -1000 }), { ...latest, appTokens: -1000 });
});

test("an invalidation during GET forces a trailing read for all callers", async () => {
  let release!: (value: number) => void;
  let calls = 0;
  const queue = createRefreshQueue(async () => {
    calls += 1;
    return calls === 1 ? new Promise<number>((resolve) => { release = resolve; }) : 130;
  });
  const first = queue.request();
  const second = queue.request();
  release(100);
  assert.deepEqual(await Promise.all([first, second]), [130, 130]);
  assert.equal(calls, 2);
});

test("logout cancels an old read even when the transport completes late", async () => {
  let release!: (value: number) => void;
  let signal!: AbortSignal;
  const queue = createRefreshQueue((value) => {
    signal = value;
    return new Promise<number>((resolve) => { release = resolve; });
  });
  const result = queue.request();
  queue.cancel();
  assert.equal(signal.aborted, true);
  release(100);
  await assert.rejects(result, /cancelled/);
  await assert.rejects(queue.request(), /cancelled/);
});

test("a temporary GET failure permits a later retry", async () => {
  let calls = 0;
  const queue = createRefreshQueue(async () => {
    if (++calls === 1) throw new Error("offline");
    return 130;
  });
  await assert.rejects(queue.request(), /offline/);
  assert.equal(await queue.request(), 130);
});

test("reservation snapshots preserve holds and zero transfer availability in debt", () => {
  const held = { userId: "user", appTokens: 100, reservedAppTokens: 30, availableTokens: 70, maxTransferTokens: 70, balanceVersion: 2 };
  assert.deepEqual(readBalanceSnapshot(held), held);
  const debt = { ...held, appTokens: -1200, reservedAppTokens: 0, availableTokens: -1200, maxTransferTokens: 0, balanceVersion: 3 };
  assert.deepEqual(readBalanceSnapshot(debt), debt);
  assert.equal(canApplyBalance("user", 3, held), false);
  assert.equal(canApplyBalance("another-user", 0, debt), false);
});

test("partial or inconsistent reservation fields cannot increase transfer allowance", () => {
  const base = { userId: "user", appTokens: 100, balanceVersion: 1 };
  for (const fields of [
    { reservedAppTokens: 30 },
    { reservedAppTokens: -1, availableTokens: 101, maxTransferTokens: 101 },
    { reservedAppTokens: 30, availableTokens: 100, maxTransferTokens: 100 },
    { reservedAppTokens: 30, availableTokens: 70, maxTransferTokens: 100 },
    { reservedAppTokens: NaN, availableTokens: 70, maxTransferTokens: 70 },
  ]) assert.equal(readBalanceSnapshot({ ...base, ...fields }), null);
});

test("release at a newer version removes the reservation without changing the total", () => {
  const released = { userId: "user", appTokens: 100, reservedAppTokens: 0, availableTokens: 100, maxTransferTokens: 100, balanceVersion: 3 };
  assert.deepEqual(readBalanceSnapshot(released), released);
  assert.equal(canApplyBalance("user", 2, released), true);
});
