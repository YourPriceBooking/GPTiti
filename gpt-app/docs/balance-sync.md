# Live token balances

Deploy the matching backend first; it introduces authenticated `GET /users/balance`, `GET /users/token-operations/:id` and `balance.updated`/`balance.sync` over the existing Socket.IO connection. No frontend environment variables are added.

`BalanceSync` mounts once inside the chat layout's SocketProvider. It subscribes before the initial balance GET and refreshes on reconnect, focus, visibility and online recovery. A shared queue coalesces requests and performs a trailing GET when notified during an in-flight read. Visible/online clients use a repair GET every minute, or every 15 seconds if push is unavailable. Logout/account change cancels old reads. Redux accepts only the current account's snapshot and a nondecreasing `balanceVersion`.

The send modal uses that shared balance, so another incoming transfer changes its available amount and validation immediately. Sender responses can apply a versioned snapshot immediately; every successful transfer still triggers control GET, including idempotent replay. Unversioned responses from older servers cannot overwrite current state. Chat history and completion billing also trigger GET instead of assigning old receipt balances. Socket reconnection continues after temporary outages rather than stopping after three attempts.

Transfer receipts distinguish confirmed and pending operations; pending receipts poll operation status while open and keep the confirmed balance separate. Current Mongo backend commits successful operations as confirmed. Blockchain submission/watching and network finality policy are future backend work.

Validation: `npm test`, `npx tsc --noEmit`, and ESLint for changed files. Run `npm run build` with real deployment environment variables. A production build needs access to Google Fonts because the existing root layout imports Geist through `next/font/google`.

On the actual dev deployment, use two browser profiles A/B plus another B tab: transfer A → B, check all balances, keep B's transfer modal open during another credit, reconnect/reload B and complete a chat concurrently. Verify an uncertain transfer retry keeps its original UUID and does not debit twice. Production must also verify websocket proxying and sticky sessions if Socket.IO polling remains enabled.
