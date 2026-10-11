# TITI history frontend preview

`/token-history` now provides the approved light layout with General and Detailed views. General is the default. All values use the TITI name and ticker.

## Preview behavior

- Each visit starts with empty preview activity. The main **Current balance** value uses the existing authenticated Redux balance synchronization and never reads its value from demo fixtures. In / Out and the smaller Net change show sample activity for the selected local date range; the activity-type filter does not alter period totals. Signed-out visitors cannot see a cached account balance.
- **Switch preview** toggles empty/sample states. Sample mode contains 40 operations across two local calendar days: two purchases (illustrative USD amounts), two incoming transfers, two outgoing transfers, two bonuses, and 32 combined request + response charges across seven model labels. Sample model labels and prices are illustrative, not a pricing catalog.
- **Claim 10,000 TITI** only adds a local sample bonus and shows the next sample date seven days later. No claim API is called. Reloading resets it.
- **Send TITI** is disabled when the current account balance is zero, unavailable, or signed out. In the populated preview it displays a sample-only confirmation; it never invokes the existing real transfer flow.
- **Top up** navigates to the existing top-up page.
- General preserves purchases, bonuses and transfers and aggregates only model charges, once per local calendar day. **View charges** opens Detailed filtered to that day's model usage.
- Activity type and inclusive local date filters work in both modes. Reset clears all filters. Rows expand to show exact local timestamps and operation IDs. Sample chat names have no fake chat links.
- `formatActivity` is reused for relative time on timestamp titles. Exact local timestamps remain visible in the expanded row. Time zone is initialized after mounting to avoid hydration differences.
- Buttons, links, selectors and rows have 170 ms hover/pressed transitions, keyboard focus, and reduced-motion support. The layout adapts down to 320 px.

## Backend integration seam

Fixtures and local day grouping are isolated in `lib/tokenHistoryPreview.ts`. Replace the local preview source with authenticated history data, remove Switch preview and sample actions, and retain the real balance in the main balance card. Replace the demo claim/transfer callbacks with the agreed backend contract once available. Keep demo records out of account state and persistence. Real chat links require genuine conversation identifiers; weekly eligibility must come from the server. Daily grouping must use the user's time zone consistently with server pagination/aggregation.

No new backend endpoints or real financial mutations are added in this PR.

## Interaction corrections

Date filters use an English calendar (English month/week labels and `DD / MM / YYYY` placeholder) rather than browser-native date inputs whose placeholder follows operating-system language. Dates are stored as local ISO calendar days. Primary button states animate a consistent background-color; no gradient-to-solid background-image switch occurs on hover. Each Detailed model-usage entry is one combined request + response cost. General groups these combined costs by local day.

Chat usage badges now render whenever a non-error assistant message has a recorded token amount, including restored conversations before a new request is sent. The existing billing total is displayed directly as TITI; request/response amounts are not added again. Missing billing values are not invented.
