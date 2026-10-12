# Token history — live API integration

`/token-history` uses authenticated backend history. The preview switch, sample records, sample claim and sample transfer callbacks have been removed.

## Contract

- `GET /users/token-history`: General pages by local day, Detailed pages by operation. Mode, type, inclusive from/to and the browser's IANA time zone are sent to the server. Opaque cursors stay with the same query/account.
- `GET /users/token-history/summary`: full period Incoming / Outgoing / Net change. Its query ignores the activity filter and loaded page count. Loading/error totals display a dash rather than invented zero values.
- `GET /users/token-history/days/:day/charges`: lazy, separately paginated combined request+response TITI costs, appended inline beneath that day. Close details collapses locally; other days and operations remain. Expanded days are independent.
- General days with more than 100 nonusage records expose a separate continuation using the server-provided `activityQuery` and `nextActivityCursor`.

Current balance and bonus eligibility still use the existing versioned Redux balance flow. Historical `balanceAfter` receipts never update current balance. History and summaries reload when the balance version changes, after a claim or transfer modal closes. Initial reads, pagination and day reads abort on query/account change or unmount; data is scoped so stale/foreign responses never appear under a new query/account. Requests wait for authenticated access-token readiness. Failed pagination keeps earlier pages and retries the same cursor.

The weekly claim dispatches the existing `claimTokens` thunk, disables duplicate submissions, reads next eligibility from the server and shows the actual server outcome. Send TITI opens the existing real transfer modal with recipient lookup, confirmation, idempotent send and receipt handling; zero/unavailable balances disable it. Top up keeps the existing checkout route.

Payments display the actual currency and Stripe minor-unit amount, including ISK/UGX compatibility units (https://docs.stripe.com/currencies#special-cases). Missing amount/currency is not replaced with a fake dollar amount. Refund and adjustment types have separate rows/filters. Refund rows show the actual TITI effect, without presenting the original purchase price as a cash-refund amount. Welcome bonuses and weekly bonuses use the server reason. A row expands to show the real operation ID and historical balance. Real conversation IDs link to the existing `/chats/:id` route; unavailable model/chat metadata remains explicitly unknown.

The footer reflects journal coverage; it does not imply pre-ledger activity was reconstructed. No historical payment collection is merged client-side, which would risk duplicate purchases and inaccurate totals.

The approved balance hierarchy, English date calendar, consistent hover/pressed colors and mobile layout remain. Async states include signing in, loading, empty/filtered activity, initial errors, summary errors, detail errors and pagination retry. All labels are English.

Period labels show All time for unbounded dates, the exact range for two boundaries, or From … onwards / Until … for one-sided filters. Both calendars highlight the selected interval and its endpoints. The manual Refresh activity button is removed; automatic reads and error retries remain.
