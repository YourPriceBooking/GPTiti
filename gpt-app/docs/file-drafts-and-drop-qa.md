# File errors, recovery and drag-and-drop

This frontend change follows backend patch 38. No backend deployment is required.

## Behavior

- Editing the message or removing an attachment clears the local attachment error. Sending still revalidates all files.
- Explicit New chat resets the composer even if the reducer reuses an empty local draft. Promotion of an existing draft to a server conversation still preserves its editor identity.
- A non-retryable preparation failure removes its recovery checkpoint. On reload, existing checkpoints are checked with status-only GETs before displaying Continue and send. No upload, retry, or model request is made by that check. Offline/unknown status and retryable cancellation preserve recovery.
- The file drop target uses the same `addAttachments` function as Add files. All type, byte, count, aggregate and text-encoding checks remain shared. Dropping does not upload or send automatically.
- Native file drops outside the composer are prevented from navigating the browser, but are not attached. Text and URL dragging is unaffected. Directories are rejected with guidance to use individual files or ZIP.
- The overlay follows the existing light composer style, has no layout footprint, and clears on leave, drop, Escape, dragend or window blur. Busy preparation and recording cannot receive another batch.

## Regression checklist

1. Attach PDF, send without text. Remove the PDF: the error disappears. Repeat and type a request: the error disappears; Send succeeds.
2. Trigger the same error in an empty draft, then New chat: the editor and attachments reset without F5. Also check a project chat.
3. Reject the 101-page PDF; F5 must not show Continue and send for that terminal failure. Repeat with 31 scanned pages. Previously saved rejected checkpoints are checked too.
4. Cancel a valid OCR job; F5 must still offer recovery. Continue must reuse file IDs. An offline status request must not delete the draft.
5. Drag one and several supported files over the composer. See the target, drop, review chips, then send explicitly.
6. Drop an executable, an oversized PDF, more than ten files, a folder, and invalid UTF-8 text: display the shared/actionable error; keep existing attachments.
7. Drop outside the composer: no browser file navigation and no added attachment. Drag ordinary text: native text behavior remains.
8. Escape/drag outside the target: hide the overlay. Drop while sending: no extra attachments. Existing OCR Cancel still keeps the draft.
9. Add the same formats through + → Add files; verify the same limits. Test at 390 px and on a touch device; the normal picker remains available.

## Validation performed

- Delivery suite: 128 tests passed; TypeScript passed.
- ESLint: no errors; existing unused metadata warning in ai-models-guide remains.
- Chromium component harness with the actual InputBar, actual Add files menu and actual validators; mocked account/limits/voice/send dependencies: multiple drops, empty-prompt error, removal, typing and resend, unsupported format, 25 MB limit, count limit, drop outside composer, Escape and native file chooser passed. No automatic send; no browser errors.
- At 390 px the tested composer with an attachment has no horizontal overflow. The right-hand tooltip was anchored inside the mobile viewport.
- Actual chat reducer checked: New chat reuses the empty draft ID but changes its composer key, without adding another empty chat.
- Authenticated production OCR and billing were not exercised by this frontend test. Repeat the live checklist after deployment.
- Production build attempted; Google Fonts fetching for Geist / Geist Mono is unavailable in this environment.

## Separate OCR finding

Backend inspected: `AlexRosly/GPT-titi` commit `63a0ca8da0362726ecad765723dbb775685c1f6a` (patch 38).

`src/services/files/ocrLanguages.js`, `select()`, adds Latin to a known script and deduplicates the list. Consequently an OSD detection of Latin produces only `[Latin]`; Cyrillic produces `[Cyrillic, Latin]`. This was verified by invoking the actual selector for both detections.

`ocrProcessWorker.js` uses that selection for primary recognition. The additional pass in `ocrIdentifiers.js` selects Cyrillic-looking identifiers with numeric suffixes and performs Latin-only recognition. It is not a secondary-script detector for Ukrainian sentences. `scriptQuality()` also has no Latin-to-secondary-Cyrillic recovery rule.

This explains why metadata `OCR MODELS: Latin; SCRIPT: Latin` is consistent with an omitted Ukrainian model on the reported page. It does not prove which other image/model factors contributed to each wrong character.

Recommended next backend scope: detect candidate lines containing a secondary writing system, run bounded recognition for those image regions, retain primary OCR and explicit alternatives, and measure mixed-script fixtures before enabling it. Do not globally combine every language model or transliterate the output as a correction. Include Latin-dominant Ukrainian/Polish documents, Cyrillic-dominant Latin codes, dates, sums, line order and recognition cost in that evaluation.
