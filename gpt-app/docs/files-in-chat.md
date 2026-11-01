# Files in chat (backend patches 01–03, 05, 06)

Users ask for a file in the normal composer. No format picker or `outputFile` is sent. Automatic generation requires `PRIVATE_FILES_ENABLED=true` and the selected real model in `FILE_OUTPUT_MODELS`; `FILE_OUTPUT_AUTO_ENABLED` must not be false.

## API wiring

All requests use the existing authenticated `axiosInstance`, its configured `NEXT_PUBLIC_BACKEND_API_URL`, credentials and refresh interceptor. Paths below are relative to that base (production: `https://gptiti.com/api/`).

| Operation | Endpoint | Response |
| --- | --- | --- |
| Existing image upload | POST `/files`, multipart field `file` | `{success, file}` with canonical `fileId` |
| Preview | GET `/files/:fileId/preview` | PNG/JPEG/WEBP/SVG bytes, or JSON `{kind: "text" | "unavailable", text, truncated}` |
| Download | GET `/files/:fileId/download` | Full bytes as forced download |
| History | GET `/conversations/:id/messages` | Messages including `attachments` and `fileResult` |
| Live/recovery | `chat:end`, `chat:status`/send ACK | `assistantMessage.attachments`, `assistantMessage.fileResult` |

Only canonical 24-hex file IDs build API paths. DTO URLs and model-generated links never receive credentials. Blob URLs are ephemeral display/download resources, never persisted in Redux. SVG is rendered as an image, never inserted as inline SVG/HTML, iframe or object. Downloaded code uses an octet-stream Blob and is never executed.

## UI

Light cards reuse the current assistant container. Files show name, type, size, Preview and Download. Desktop preview is a right panel; at 1100px and below it becomes a full-screen dialog. Escape/Close returns focus. On narrow screens focus stays inside preview. Switching chats unmounts the panel and aborts its pending preview request.

TXT/log: preformatted text. Markdown: sanitized existing Markdown renderer with remote images disabled. CSV/TSV: bounded table, respecting quoted/multiline cells (up to 200 rows, 50 columns). JSON: pretty-print complete previews; partial JSON remains plain code. Other code: escaped fenced text with existing Shiki highlighting. Server truncation at 64 KiB is disclosed; downloads always use the complete endpoint. Incomplete final CSV row is omitted when the server truncates bytes.

Deleted/expired attachments have no action buttons. Failed generation is explicit and never auto-retries a paid generation. Preview/download errors have readable auth/not-found/rate-limit/network messages. Thumbnails load only when visible; preview requests are aborted and Blob URLs revoked on cleanup.

The backend currently blocks document inputs. The composer now explains that limitation rather than accepting documents that its old send handler silently discarded. Supported image inputs remain enabled; generated TXT/MD/CSV/JSON/SVG/code outputs are independent of document input support. Existing public legacy image rendering is retained.

## Validation / deployment checks

- `npx tsc --noEmit`
- `npm test` (includes canonical file parsing, V2 completion/status, deleted history merge and CSV preview cases).
- Test with your real dev backend and approved model: request SVG and TXT without `outputFile`; check card, preview and download.
- Reload and reconnect: same file IDs and cards, no duplicate messages.
- Check CSV with quotes/newlines, Markdown with external images, JSON and code; scripts must never execute.
- Check files above 64 KiB: truncation notice, full download.
- Delete a file through the backend then reload history; check deleted state. Expired/other-owner URLs must not expose bytes.
- Check a regular question still streams, upload a supported image and verify it after reload.
- Check mobile, keyboard tabbing, Escape and chat switching while preview is loading.

No new dependencies. No backend changes or endpoint stubs are included in this PR. No automatic retry or extra provider call is added by the frontend.


## PDF / DOCX / XLSX (backend patch 07)

Requires backend patch 07 after patches 01–03, 05–06; optional 04 is not required.
No new frontend endpoint or dependency. Authenticated GET `/files/:id/preview`
adds `{kind:"document",title,blocks,truncated}` and
`{kind:"workbook",sheets:[{name,rows}],truncated}`. Download remains the full binary.
PDF/DOCX preview shows safely escaped headings, paragraphs, bullets and tables,
not exact page layout. XLSX provides sheet buttons, preserves numbers/booleans,
and displays at most 200 rows and 30 columns per sheet. Server also caps preview
JSON; the UI explains truncation. No Office ZIP parsing or active document content.
Existing uploads without generated previews remain downloadable with unavailable preview.

Smoke test: request each format naturally; open preview, switch XLSX sheets,
download and open in a document reader, refresh and reopen from history.
Verify partial preview notice with a large workbook, unavailable preview for
an older upload, and owner isolation/deleted-file errors. No format picker.


## Saved OCR preview (backend patch 16)
PDF and PNG/JPEG/WEBP previews offer File / Recognized text. GET /files/:id/ocr returns the existing owner-only cache; ?download=1 returns its exact UTF-8 bytes. Missing cache (409) never triggers recognition. Copy includes all notes and page markers; page view only groups existing markers and collapses leading notes. React renders plain text, including markup, without executing it. Abort on close/change; check again retries only the read. Original Download remains available.

Deploy backend patch 16 before merging. Manually verify mobile/desktop, keyboard focus/Escape, owner isolation, deleted files, absent cache, RTL text, clipboard failure, exact TXT and persistence after reload. This feature exposes saved extraction and does not improve OCR accuracy.


## Backend limits (patch 32)

The chat composer loads authenticated `GET /files/limits?modelId=...` through the
shared API client. Response version 1 (`stage-a-storage`) separates storage/upload
from processing and message budgets. The selected model's backend opt-outs apply;
local model-name image/file caps no longer determine V2 attachment admission.
The model guide's separate public marketing pages and text prompt caps are unchanged.

The existing Add files → ⓘ panel shows storage quota, per-format storage and chat
reading ceilings, combined request limits and refresh/retry. MB/GB are decimal;
MiB/KiB are binary. Storage accepts larger files than today's readers: e.g. 50 MB
ZIP storage versus 10 MiB ZIP reading. The chat picker rejects such a file before
upload with both numbers, rather than offering a storage-only upload as a chat attachment.

Limits are scoped to the signed-in account and selected model; old or aborted
responses cannot replace a new scope. No limits are persisted in localStorage.
Missing/malformed/unsupported responses block attachments but not text-only sends.
An actual new send fetches limits again before uploading/preparing, preserving the
existing preparation retry cache, draft, ACK correlation and recovery behavior.
An already pending delivery retains its existing protocol/idempotency path.

Manual checks after deployment:
1. Signed in, open Add files → ⓘ: verify quota and both columns against /files/limits.
2. Attach a small TXT, PDF, image and ZIP, send, reload and check saved files.
3. Attach TXT over 64 KiB or ZIP over 10 MiB but below the storage ceiling:
   explain the reading limit without uploading or clearing the draft.
4. Switch to a model with a reader opt-out: corresponding attachments are blocked.
5. Temporarily block /files/limits in DevTools, refresh limits: show retry;
   text-only send still works. Unblock and retry without reloading the page.
6. On mobile, open and pin ⓘ, scroll the guide: the table stays inside the panel.

Validation: TypeScript, delivery test suite (including malformed profiles, exact
boundaries, aggregate budgets, opt-outs, and API override precedence), targeted ESLint.
