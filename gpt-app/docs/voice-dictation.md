# Voice dictation composer

This is a frontend implementation prepared for **our future backend**. No browser SpeechRecognition, third-party speech service, fake transcript, or voice-chat button is used.

## Interaction

- With an empty input, show the microphone only; remove the previous `ib-voice` button.
- Start: request microphone access and record through MediaRecorder. Once capture starts, smoothly show a live waveform, the breathing Stop button on the left, and the Send arrow on the right.
- Stop: finish the final audio chunk → transcribe → insert text at the saved caret/selection → focus the input for editing. Never send automatically.
- Send during recording: finish the final audio chunk → transcribe → insert into the existing draft → call the existing send handler once. On failed send, keep the transcript in the draft.
- Preserve pre-existing typed text and attachments. Text over the model limit stays available for editing and is not silently truncated or sent.
- Transcription failure: keep audio in this tab, offer retry, audio download and discard. Do not send a partial draft instead of the dictated message.
- Cancel / Escape / unmount / logout / change of chat, project or model: abort transcription, release capture, and ignore late results. Recordings are not stored in localStorage or uploaded before Stop/Send.
- Maximum recording: 5 minutes or 20 MiB. Reaching the duration stops into the edit workflow; reaching the size limit retains audio for recovery.

## Connect the backend later

The **only API integration point** is `lib/dictation/backendTranscriber.ts`. The rest of the UI consumes `TranscribeAudio(recording, signal): Promise<string>`.

Set this public build-time variable after the endpoint exists:

```dotenv
NEXT_PUBLIC_DICTATION_TRANSCRIBE_PATH=/your/actual/transcription/path
```

It is a **relative path under the existing `NEXT_PUBLIC_BACKEND_API_URL`**, not a third-party URL. The existing Axios client supplies authentication and refresh behavior. Rebuild/restart the frontend after changing a `NEXT_PUBLIC_*` variable.

Without this variable, microphone capture and its visuals work; Stop/Send display “Voice transcription is coming soon…” with audio recovery actions. **No request to an invented endpoint is made and no chat message is sent.** Full transcript/Stop/Send behavior becomes functional once the backend is connected.

### Proposed contract — adapt when the real backend is ready

This contract is a proposal, not an existing backend endpoint:

```text
POST <NEXT_PUBLIC_DICTATION_TRANSCRIBE_PATH>
Authorization: existing authenticated API session
Content-Type: multipart/form-data (browser creates boundary)
audio: binary file (dictation.webm, dictation.m4a, or dictation.ogg)
durationMs: captured duration

200 application/json
{ "text": "Recognized words" }
```

Prefer auto-detection of the spoken language on the backend. Support the real browser MIME type: Opus/WebM, MP4/AAC for Safari, and Ogg if emitted by the browser; do not assume every recording is WebM. Validate auth, duration, size and decodability server-side. An empty/invalid transcript is surfaced as an error. Request timeout is 60 seconds, and Cancel propagates AbortSignal. If the backend uses different form fields or response shape, adapt just `backendTranscriber.ts`; no composer redesign is needed.

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
