# Balance notifications: frontend-first rollout

No new endpoint is required. Existing V2 send/retry/status acknowledgements and
chat:error events keep their envelopes. Their error object supports:

```json
{
  "code": "INSUFFICIENT_BALANCE",
  "message": "Not enough available tokens",
  "retryable": false,
  "details": {
    "balance": 500,
    "availableTokens": 250,
    "estimatedTokens": 400
  }
}
```

All amounts are application tokens (TITI), not provider tokens. Details are
optional. Available means total balance minus active reservations. Old servers
returning INSUFFICIENT_BALANCE without details show the dialog without amounts.
Missing/invalid amounts are omitted, never inferred from cached client balances.

The upcoming backend should return BALANCE_LIMIT_EXCEEDED when the balance is
strictly below -1000, with details.balance when available. That dialog offers
only top-up and dismissal. The insufficiency dialog also hides model selection
when the server explicitly reports availableTokens <= 0.

Only a rejected chat:send acknowledgement shows “Your request hasn’t been sent.”
A failed accepted turn (event or recovered snapshot) does not make that claim.
Top-up opens the existing /top-up-your-tokens page; model selection opens the
existing model picker, without automatically sending a paid request. Switching
models in an existing conversation retains the existing new-chat behavior but
preserves the text draft for this recovery flow. Top-up captures the text draft
in the existing in-memory, owner/path-scoped draft facility; returning to the
same chat restores it. File attachments are not persisted across navigation.

This PR changes presentation only. It does not implement reservations, enforce
balances, change billing, disable backend legacy routes or alter worker limits.
The backend must enforce these rules independently in the next PR.

Verification scenarios: old error without details; amounts with zero/negative
values; negative-limit error; rejection before send vs failure after acceptance;
retry and reconnect snapshot; close/Escape/keyboard focus; model picker;
top-up navigation and text restoration; narrow viewport. No automatic resend.
