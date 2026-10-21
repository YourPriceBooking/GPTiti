# Website reading UI

Uses existing V2 `assistantMessage.webSources`, history `webSources`, and `turn.webStatus`; no backend changes or model-name allowlist.

- Light source cards show title, hostname and read/partial/failed state. Exact repeated URLs are grouped as observations, not counted as distinct pages.
- The exact server-generated footer is hidden only when all normalized metadata reconstructs its suffix. Older responses without metadata keep their original text. Copy response preserves the original source links.
- Expandable, keyboard-accessible information explains public-link reading, bounded navigation, partial content and model-call cost. No remote favicons are fetched.
- While an accepted request has no text stream, status is polled every four seconds in visible connected tabs. Requests are deduplicated; background failures are silent; stale responses cannot overwrite a newer attempt/sequence or terminal turn. Polling never resends a chat request.
- Status labels describe actual backend stages without a fictitious progress percentage. Unknown optional metadata does not invalidate the chat envelope.

Validation: 90 delivery/protocol tests, TypeScript noEmit and ESLint passed. Browser visual verification was blocked because the local Chromium download returned an invalid archive.

After deployment:
1. Ask to open a supplied URL and follow an article. Observe status then source cards with working links.
2. Open the information disclosure using keyboard and on mobile. Check long titles and partial/failed sources.
3. Reload the conversation: same source cards, no duplicate footer. Confirm file cards and ordinary responses remain unchanged.
4. During browsing disconnect/reconnect, then confirm recovery; no duplicate send or response.
5. Check repeated visits display observations, not separate pages. A legacy message lacking metadata must retain its footer.
