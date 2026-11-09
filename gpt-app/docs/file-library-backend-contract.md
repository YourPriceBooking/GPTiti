# User file library — frontend integration and backend rollout

Frontend base: `ba3027811ceef0a9ac4508c2853632b67f9a3d7e`.
Backend reviewed: `74ef7f09d339f1626335aeaed785717e52f70431`.

## Enable only after retention is fixed

Build with `NEXT_PUBLIC_FILE_LIBRARY_ENABLED=true` to expose Files navigation, `/files`, and **Add from library**. Default is off. Existing chat uploads/previews remain available with the flag off. This PR does not change backend retention or migrate data. Do not enable it as a permanent library in production before the gates below pass. Feature flags are build-time Next.js public environment variables.

## Existing endpoints used (no new endpoint required for this frontend)

Paths are relative to the configured API base URL, not hardcoded to a production prefix. All requests use the existing authenticated Axios client.

| Method/path | Usage |
| --- | --- |
| GET `/files?limit=100&before=<id>` | Load every page, then search/filter/sort the complete list locally. Read `{files,nextCursor,quota:{bytes,count,maxBytes,maxCount}}`. Fail rather than present a partial list as complete. |
| POST `/files` | Multipart `file`, one upload per request. Storage-only admission on Files page; no model call. |
| GET `/files/:id` | Revalidate each selected ID before adding and before Send; metadata from the server is authoritative. |
| GET `/files/limits` | Storage admission independent of model. |
| GET `/files/limits?modelId=…` | Existing effective input/processing limits. |
| GET `/files/:id/preview` | Existing authenticated preview; no invented PDF renderer. Uploaded Office/PDF may show “download original”; Text shows saved OCR when available. |
| GET `/files/:id/download` | Existing authenticated blob download. |
| DELETE `/files/:id` | Explicit confirmed deletion; no delete on composer removal. |
| GET `/files/:id/ocr`, GET `/files/:id/ocr?download=1` | Existing saved extraction view/download. |
| POST `/files/:id/prepare` | Existing synchronous preparation fallback. |
| GET/POST `/files/:id/preparation` | Existing background preparation/recovery. |
| V2 `chat:send`, payload `files` | Existing canonical `fileId` references; selected saved files never re-uploaded. |

File DTO: existing `fileId, originalName, mimetype, size, source, status, expiresAt`. Optional `createdAt` is displayed when supplied; no fabricated dates. UI reuses the current file preview components. Existing successful generated files are discovered through GET `/files`, including after refresh. No provider inference occurs during browsing/selection/download.

## Required backend changes before production rollout

1. Make successfully completed user uploads persistent (`expiresAt:null`). Preserve separate TTL cleanup for incomplete uploads and internal temporary computation results. Do not disable cleanup globally.
2. Remove library-file deletion from conversation clear/remove cleanup. Archive, clearing and deleting a project/chat must not delete the user's saved originals or generated results.
3. Inventory/migrate available private files idempotently. Verify owner, bytes, checksum and quota; do not resurrect tombstones or silently import expired/missing files. Inventory legacy Cloudinary separately with verified ownership. Over-quota users keep access to existing files.
4. Coordinate deletion with running preparation/computation writes, atomically refund quota once, clear derived caches, prevent deleted-file resurrection. Keep message text/history and unavailable attachment markers.
5. Coordinate shared preparation across chats. While library mode is enabled, frontend Cancel stops waiting/sending; it does not globally DELETE a file's preparation job, because another chat may use that same job. Existing background work may complete. Resume remains explicit.
6. Validate ownership and selected model limits again at V2 admission, including duplicate IDs and aggregate limits. Never expose the whole library to the model. Existing `store.owned(user,id)` is the authority.

## Recommended additions (not needed to connect current UI)

- POST `/files/validate-selection` with `{modelId,fileIds}` and structured per-file and aggregate reasons. Current UI performs metadata/limits checks; content/page/encryption/context limits still fail explicitly at preparation/admission.
- Server search/source/type/sort and cursor pagination for larger libraries. Current UI loads the complete list, up to configured maximum supported by backend (10,000 files), before filtering.
- Return `createdAt`, `originalBytes`, `derivedBytes`, effective retention policy in list/limits DTOs.
- Idempotent upload key with retry returning the existing completed `fileId`. Frontend currently does not automatically retry a failed/unknown upload; it asks to refresh Files first. Generated result replay is already keyed server-side.

## Draft and upload behavior in this PR

- Text and saved file metadata are scoped by account and composer path; sessionStorage recovery expires after 24 hours. No credentials or file bytes are stored there. Logout/account switch clears in-memory data and that account's draft storage.
- Existing local image/document selections retain original File objects in memory across Files navigation, including image editing. Initial chat uploads still occur on Send, preserving the current workflow. F5 cannot restore never-uploaded local bytes: show an explicit “add them again” notice, preserving text and already-saved files. The existing OCR recovery card continues to recover successful uploads after Send.
- Files-page upload stores immediately, without OCR or sending. Successfully saved files remain listed even if a later file in a batch fails. Original and model-generated files share a single list.
- Composer removal only removes its draft reference. Explicit delete confirms unavailability across all chats. Historical text is not removed.
- Switching models in library mode does not silently clear/clip the text; input and server constraints are checked before Send.
- Attachment preparation reuses successful device uploads across Files navigation for the same account. Existing vision/image editing is retained.

## QA gates

Frontend verification: 143 delivery/unit tests pass; TypeScript and production build pass. Lint has no errors (one existing unused-metadata warning in the marketing model guide). Chromium with mocked authenticated API verified file-ID reuse without upload, navigation and F5 draft restoration, the + picker, disabled unsupported selection, Escape, explicit deletion, and 390px mobile layout without horizontal overflow. These checks do not establish backend retention or production account isolation.

Run `npm run test:delivery`, `npx tsc --noEmit`, `npm run lint`, `npm run build`.

Staging with the matching backend: reuse one file in two chats (same ID/quota), mixed local + saved + generated attachments, multiple selections/limits/model switch, saved file deleted in another tab, chat clear/archive, explicit delete idempotency, two-account 404 isolation, OCR cancel/F5/Continue, failed and interrupted upload, generated file after reconnect, library Back and F5 draft restoration, 390px/320px widths, keyboard/ESC/focus return, downloads/previews. Verify original chat behavior with the flag off. Local mocked API tests are not production backend verification.
