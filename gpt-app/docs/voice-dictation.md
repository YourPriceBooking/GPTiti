# Voice dictation composer

Voice dictation is connected to the authenticated Whisper backend. No browser SpeechRecognition, third-party speech service, fake transcript, or voice-chat button is used.

## Interaction

- With an empty input, show the microphone only; remove the previous `ib-voice` button.
- Start: request microphone access and record through MediaRecorder. Once capture starts, smoothly show a live waveform, the breathing Stop button on the left, and the Send arrow on the right.
- Stop: finish the final audio chunk → transcribe → insert text at the saved caret/selection → focus the input for editing. Never send automatically.
- Send during recording: finish the final audio chunk → transcribe → insert into the existing draft → call the existing send handler once. On failed send, keep the transcript in the draft.
- Preserve pre-existing typed text and attachments. Text over the model limit stays available for editing and is not silently truncated or sent.
- Transcription failure: keep audio in this tab, offer retry, audio download and discard. Do not send a partial draft instead of the dictated message.
- Cancel / Escape / unmount / logout / change of chat, project or model: abort transcription, release capture, and ignore late results. Recordings are not stored in localStorage or uploaded before Stop/Send.
- Maximum recording: 5 minutes or 20 MiB. Reaching the duration stops into the edit workflow; reaching the size limit retains audio for recovery.

## Microphone permission

Clicking the microphone calls `getUserMedia` immediately. The browser requests permission if it has not already been granted or denied; the app does not grant itself permission or request it on page load. The frontend's `Permissions-Policy` must include `microphone=(self)` so its own origin can make that request. The previous `microphone=()` policy prevented any prompt and returned `NotAllowedError`, even when the user had allowed microphone access.

After updating `next.config.ts`, rebuild/restart the frontend and reload the page so the document receives the new header. If the reverse proxy/CDN also sets `Permissions-Policy`, its final response must not reintroduce `microphone=()` for this app. Check the final document response in DevTools → Network; a denied policy is distinct from a user-denied browser permission.

If the user already blocked the microphone, the website cannot force another native prompt. Allow it through the browser's site settings and click the microphone again; also check device-level microphone permission if needed. See [Chrome microphone permissions](https://support.google.com/chrome/answer/2693767) and [the microphone Permissions-Policy directive](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Permissions-Policy/microphone).

## Whisper backend integration

`lib/dictation/backendTranscriber.ts` uses the existing authenticated Axios client
and `transcriptionRequest.ts` to send `POST /upload/transcriptions` relative to
`NEXT_PUBLIC_BACKEND_API_URL` (normally `https://gptiti.com/api`). No new environment
variable is required. An existing `NEXT_PUBLIC_DICTATION_TRANSCRIBE_PATH` overrides
this default; remove any old placeholder value before rebuilding/deploying.

The multipart body contains `file` with the actual browser audio MIME type and a
matching filename (`dictation.webm`, `.m4a`, or `.ogg`). The browser supplies the
multipart boundary. The response's `text` is validated; `model` is informational.
We omit optional `language` so the backend delegates language detection to Whisper,
without forcing Russian or the interface language. Verify detection on real
Ukrainian, Russian and English recordings after deployment.

The request timeout is 330 seconds, allowing the backend's default 300-second
recognition timeout plus transport time. Cancel propagates AbortSignal to the
HTTP request and the existing session ignores late results. Client cancellation
does not guarantee that backend inference stops. Failed requests (including busy
429 responses) retain audio for the existing explicit retry/download/discard flow.
No automatic inference retries are introduced.

Stop transcribes into the editable draft; Send during recording transcribes and
then invokes the existing chat send flow. Existing draft text, attachments,
authentication/refresh and recording limits remain unchanged. Production speech
accuracy and Safari/iOS microphone behavior require real-device verification.

## Visuals and responsive behavior

- Use the existing `--flow-fill` for the waveform, both rings, Stop and Send. The project input's fixed blue override remains in force.
- Only the Stop halo animates: **1.8 seconds for one complete cycle**, 0.9 seconds expansion and 0.9 seconds contraction, `ease-in-out`, infinite while actually recording. The button body, white square and Send arrow remain still.
- Outer ring: same theme fill, opacity 0.08, radius 22.75. Inner: same theme fill, opacity 0.18, radius 19.75. Group scale 0.91 → 1.04 → 0.91; opacity 0.65 → 1 → 0.65.
- Waveform: 80 rounded SVG bars, real microphone levels from AnalyserNode, about 30 updates/second, height 2–34 px. Visualizer updates SVG refs rather than React state on each frame; no decorative speech simulation.
- Existing textarea stays mounted. While recording, the waveform covers its slot and the text is read-only/visually hidden; after transcription, restore the normal editable single/multiline layout.
- 44×44 px Stop/Send touch targets, 35 px core icons, bounded halo; waveform flexes down to the available width on mobile, including 320 px and project layouts. Status/recovery rows wrap below the composer.
- Respect `prefers-reduced-motion`: static halo and low waveform; clear focus rings, native button keyboard behavior, state announcements without reading the timer on each tick.

## Verification

Run `npm test`, `npx tsc --noEmit`, `npm run lint`, and `npm run build` with the app's required environment. Session tests cover final audio chunks, duplicate completion, retained recording retry, cancellation, late results, microphone errors, transcript validation and draft preservation. Browser checks should additionally cover microphone permission rejection, real recording, Stop vs Send, unavailable backend, failed send, mobile layout, theme changes and reduced motion.

Implemented validation: 39 Node tests pass (14 dictation/recorder checks plus 25 existing tests), TypeScript passes, changed files pass ESLint, and the production build passes. Chromium checks exercised the actual InputBar with MediaRecorder and an audio fixture, with the proposed transcription API mocked: 19 scenarios passed, including 320/390/768/1440 px chat/project layouts, final audio upload, Stop/edit/Send, failed send, cancellation, permission denial, recovery, model colors, reduced motion and AudioContext cleanup. Real backend recognition and Safari/iOS microphone behavior still require integration/device testing after the endpoint is available.

Full-repository ESLint currently reports 25 existing `react/no-unescaped-entities` errors in unchanged model guide, privacy and terms pages. In this environment Google Fonts needed `NEXT_TURBOPACK_EXPERIMENTAL_USE_SYSTEM_TLS_CERTS=1` for the existing Next.js font download; no font or environment-specific code was changed.

Reference APIs: [MediaRecorder](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder), [AnalyserNode.getByteTimeDomainData](https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode/getByteTimeDomainData).
