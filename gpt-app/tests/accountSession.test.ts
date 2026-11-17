import assert from "node:assert/strict";
import { test } from "node:test";
import {
  AuthSessionChangedError, beginLogout, endLogout, runAuthRequest,
  runSingleFlightRefresh, isLogoutPending,
} from "../lib/authSession.js";
import { createAuthBoundaryMiddleware } from "../redux/authBoundaryMiddleware.js";
import { configureStore, createAsyncThunk } from "@reduxjs/toolkit";

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason: Error) => void;
  const promise = new Promise<T>((a, b) => { resolve = a; reject = b; });
  return { promise, resolve, reject };
}

test("logout drains a cookie-writing refresh and suppresses its late result", async () => {
  const response = deferred<string>();
  const request = runAuthRequest(() => response.promise);
  const stale = assert.rejects(request, AuthSessionChangedError);
  let drained = false;
  const logout = beginLogout().then(() => { drained = true; });
  try {
    await Promise.resolve();
    assert.equal(drained, false);
    assert.equal(isLogoutPending(), true);
    let called = false;
    await assert.rejects(runAuthRequest(async () => { called = true; }), AuthSessionChangedError);
    await assert.rejects(runSingleFlightRefresh(async () => { called = true; }), AuthSessionChangedError);
    assert.equal(called, false);
    response.resolve("late-access-token");
    await stale;
    await logout;
    assert.equal(drained, true);
  } finally { endLogout(); }
});

test("failed refresh does not block logout or replace it with session-expired UI", async () => {
  const response = deferred<void>();
  const request = runAuthRequest(() => response.promise);
  const stale = assert.rejects(request, AuthSessionChangedError);
  const logout = beginLogout();
  response.reject(new Error("HTTP 403"));
  try { await stale; await logout; }
  finally { endLogout(); }
  assert.equal(await runAuthRequest(async () => "new-session"), "new-session");
});

test("refresh remains single-flight and can be retried after failure", async () => {
  const response = deferred<void>();
  let calls = 0;
  const start = () => { calls += 1; return response.promise; };
  const first = runSingleFlightRefresh(start);
  const second = runSingleFlightRefresh(start);
  assert.equal(first, second);
  assert.equal(calls, 1);
  const rejected = assert.rejects(first, /network/);
  response.reject(new Error("network"));
  await rejected;
  await runSingleFlightRefresh(async () => { calls += 1; });
  assert.equal(calls, 2);
});

test("late chat data cannot repopulate a logged-out or different account", async () => {
  let generation = 0;
  const response = deferred<string>();
  const fetchChat = createAsyncThunk("chat/fetch", () => response.promise);
  const store = configureStore({
    reducer: (state = "empty", action) => fetchChat.fulfilled.match(action) ? action.payload : state,
    middleware: get => get().concat(createAuthBoundaryMiddleware(() => generation)),
  });
  const request = store.dispatch(fetchChat());
  generation += 1;
  response.resolve("private old account chat");
  await request;
  assert.equal(store.getState(), "empty");
});

test("failed logout preserves pending data and superseded auth errors are ignored", async () => {
  const response = deferred<string>();
  const fetchChat = createAsyncThunk("chat/fetch", () => response.promise);
  const store = configureStore({
    reducer: (state = "empty", action) => {
      if (fetchChat.fulfilled.match(action)) return action.payload;
      if (action.type === "auth/refresh/rejected") return "session expired";
      return state;
    },
    middleware: get => get().concat(createAuthBoundaryMiddleware(() => 0)),
  });
  const request = store.dispatch(fetchChat());
  response.resolve("current chat");
  await request;
  assert.equal(store.getState(), "current chat");
  store.dispatch({ type: "auth/refresh/rejected", meta: { requestId: "old", requestStatus: "rejected", sessionSuperseded: true } });
  assert.equal(store.getState(), "current chat");
});
