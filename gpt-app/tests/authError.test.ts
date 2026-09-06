import assert from "node:assert/strict";
import { test } from "node:test";

import { isAuthExpiredError, isSocketAuthError } from "../lib/authError.js";

test("recognizes REST and structured Socket.IO token expiry", () => {
  assert.equal(isAuthExpiredError({ response: { status: 401 } }), true);
  assert.equal(isAuthExpiredError({ data: { code: "TOKEN_EXPIRED" } }), true);
  assert.equal(isAuthExpiredError(new Error("jwt expired")), true);
});

test("recognizes socket auth rejection without treating network errors as auth", () => {
  assert.equal(isSocketAuthError(new Error("Unauthorized")), true);
  assert.equal(
    isSocketAuthError({ data: { code: "AUTHENTICATION_ERROR" } }),
    true,
  );
  assert.equal(isSocketAuthError(new Error("websocket error")), false);
  assert.equal(isSocketAuthError(new Error("xhr poll error")), false);
});
