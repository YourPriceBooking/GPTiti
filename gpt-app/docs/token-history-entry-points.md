# Token history entry points

`TokenBalanceLink` opens `/token-history` from the sidebar, the top-up page,
and the balance portion of the model chooser. The model chooser closes only
on an actual client navigation; modified clicks retain normal link behavior.
Its independent **Top up tokens** link still opens the purchase page.

The shared component uses a single SVG history icon and three size variants.
Hover transitions take 150–180 ms; a press darkens the surface and moves its
contents down 1 px without moving the link itself. Hover styling and hints
are disabled for touch-only input, while keyboard focus remains visible.
Reduced-motion preferences disable transitions and hint animation.

The existing `ActionTooltip` now also supports links. The `plain` appearance
uses the approved borderless dark rounded rectangle with no triangle. Its
body portal escapes modal overflow and appears above the model chooser.
Placement prefers 8 px above the trigger, right edges aligned, and clamps
to the visible viewport with 8 px margins. Viewport clamping takes priority
when there is insufficient space for the preferred position.

The new destination is a **coming-soon page**, not a transaction feed.
It reads the current account balance from the existing balance store/sync
and shows it only after an account-scoped snapshot is ready. Signed-out
visitors see a sign-in prompt. No history endpoint, transaction rows,
operation status, or blockchain data is assumed or fabricated. The page is
marked noindex and excluded from the sitemap. Wire real ledger history into
`TokenHistoryPage` once the backend contract is available.

Visiting history captures the composer text and selection in memory, scoped
to account and source pathname. Returning restores that text once; sending,
clearing, signing out, or changing accounts prevents stale restoration.
The selected model remains in the existing model store. This is not general
draft persistence: reloads and media attachments keep their existing behavior.
