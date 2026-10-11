import test from "node:test";
import assert from "node:assert/strict";
import {
  captureTokenHistoryDraft,
  clearTokenHistoryDraft,
  registerTokenHistoryDraft,
  takeTokenHistoryDraft,
} from "../lib/tokenHistoryDraft";

const draft = {
  ownerId: "account-a",
  pathname: "/chats/chat-a",
  text: "A draft with a selected range",
  selectionStart: 2,
  selectionEnd: 7,
};

test("a token-history round trip restores the original text and selection once", () => {
  clearTokenHistoryDraft();
  const unregister = registerTokenHistoryDraft(() => draft);
  captureTokenHistoryDraft();
  unregister();
  assert.deepEqual(takeTokenHistoryDraft(draft.ownerId, draft.pathname), draft);
  assert.equal(takeTokenHistoryDraft(draft.ownerId, draft.pathname), null);
});

test("visiting another chat does not consume or restore the original draft", () => {
  const unregister = registerTokenHistoryDraft(() => draft);
  captureTokenHistoryDraft();
  unregister();
  assert.equal(takeTokenHistoryDraft(draft.ownerId, "/chats/chat-b"), null);
  assert.deepEqual(takeTokenHistoryDraft(draft.ownerId, draft.pathname), draft);
});

test("switching accounts discards the previous account's token-history draft", () => {
  const unregister = registerTokenHistoryDraft(() => draft);
  captureTokenHistoryDraft();
  unregister();
  assert.equal(takeTokenHistoryDraft("account-b", draft.pathname), null);
  assert.equal(takeTokenHistoryDraft(draft.ownerId, draft.pathname), null);
});

test("cleanup from an older composer cannot unregister a newer composer", () => {
  const unregisterOld = registerTokenHistoryDraft(() => draft);
  const newer = { ...draft, text: "New composer" };
  const unregisterNew = registerTokenHistoryDraft(() => newer);
  unregisterOld();
  captureTokenHistoryDraft();
  unregisterNew();
  assert.deepEqual(takeTokenHistoryDraft(draft.ownerId, draft.pathname), newer);
});

test("clearing or sending a draft prevents a stale token-history restoration", () => {
  const unregister = registerTokenHistoryDraft(() => draft);
  captureTokenHistoryDraft();
  unregister();
  clearTokenHistoryDraft();
  assert.equal(takeTokenHistoryDraft(draft.ownerId, draft.pathname), null);
});
