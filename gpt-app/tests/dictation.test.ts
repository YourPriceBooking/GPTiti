import assert from "node:assert/strict";
import { test } from "node:test";
import { DictationSession } from "../lib/dictation/dictationSession.js";
import {
  DictationError,
  insertDictation,
  readTranscript,
  transcriptionPath,
  type AudioCapture,
  type CaptureFactory,
  type VoiceRecording,
} from "../lib/dictation/protocol.js";

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (error: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}
const audio: VoiceRecording = {
  audio: new Blob(["final audio"], { type: "audio/webm" }),
  durationMs: 1200,
};
function capture() {
  let stops = 0;
  let disposals = 0;
  const result: AudioCapture = {
    stream: {} as MediaStream,
    stop: async () => {
      ++stops;
      return audio;
    },
    dispose: () => {
      ++disposals;
    },
  };
  return { result, stops: () => stops, disposals: () => disposals };
}

test("finish waits for the recorder's final chunk before transcribing", async () => {
  const chunk = deferred<VoiceRecording>();
  let received: VoiceRecording | undefined;
  const session = new DictationSession(
    async () => ({ ...capture().result, stop: () => chunk.promise }),
    async (recording) => {
      received = recording;
      return "  final words  ";
    },
  );
  await session.start();
  assert.equal(session.getSnapshot().phase, "recording");
  const finishing = session.finish();
  assert.equal(session.getSnapshot().phase, "stopping");
  assert.equal(received, undefined);
  chunk.resolve(audio);
  assert.equal(await finishing, "final words");
  assert.equal(received, audio);
  assert.equal(session.getSnapshot().phase, "idle");
});

test("rapid Stop / Send calls share one recording stop and transcription", async () => {
  const cap = capture();
  const transcript = deferred<string>();
  let requests = 0;
  const session = new DictationSession(
    async () => cap.result,
    async () => {
      ++requests;
      return transcript.promise;
    },
  );
  await session.start();
  const first = session.finish();
  const second = session.finish();
  assert.equal(first, second);
  await Promise.resolve();
  assert.equal(cap.stops(), 1);
  assert.equal(requests, 1);
  transcript.resolve("once");
  assert.equal(await first, "once");
});

test("failed or unconfigured transcription retains audio for retry without recording again", async () => {
  const cap = capture();
  let attempts = 0;
  const session = new DictationSession(
    async () => cap.result,
    async () => {
      if (++attempts === 1)
        throw new DictationError("not-configured", "Coming soon");
      return "recovered";
    },
  );
  await session.start();
  assert.equal(await session.finish(), null);
  assert.equal(session.getSnapshot().phase, "error");
  assert.equal(session.getSnapshot().recording, audio);
  assert.equal(await session.finish(), "recovered");
  assert.equal(cap.stops(), 1);
  assert.equal(attempts, 2);
});

test("cancel while awaiting microphone permission disposes a late stream", async () => {
  const permission = deferred<AudioCapture>();
  const cap = capture();
  const session = new DictationSession(
    () => permission.promise,
    async () => "never",
  );
  const starting = session.start();
  session.cancel();
  permission.resolve(cap.result);
  await starting;
  assert.equal(cap.disposals(), 1);
  assert.equal(session.getSnapshot().phase, "idle");
  assert.equal(session.getSnapshot().stream, null);
});

test("a late transcript cannot overwrite a new chat's recording after cancellation", async () => {
  const oldTranscript = deferred<string>();
  const cap = capture();
  let signal: AbortSignal | undefined;
  const session = new DictationSession(
    async () => cap.result,
    async (_audio, currentSignal) => {
      signal = currentSignal;
      return oldTranscript.promise;
    },
  );
  await session.start();
  const stale = session.finish();
  await Promise.resolve();
  session.cancel();
  assert.equal(signal?.aborted, true);
  await session.start();
  oldTranscript.resolve("wrong conversation");
  assert.equal(await stale, null);
  assert.equal(session.getSnapshot().phase, "recording");
  session.cancel();
});

test("microphone interruption keeps captured audio and never automatically transcribes", async () => {
  let onError: ((error: unknown) => void) | undefined;
  let transcriptions = 0;
  const record: CaptureFactory = async (options) => {
    onError = options.onError;
    return capture().result;
  };
  const session = new DictationSession(record, async () => {
    ++transcriptions;
    return "unexpected";
  });
  await session.start();
  onError?.(new DictationError("interrupted", "Microphone disconnected"));
  await Promise.resolve();
  assert.equal(session.getSnapshot().phase, "error");
  assert.equal(session.getSnapshot().recording, audio);
  assert.equal(transcriptions, 0);
});

test("permission denial can be retried without an active microphone", async () => {
  let attempts = 0;
  const session = new DictationSession(
    async () => {
      if (++attempts === 1) throw new DOMException("Denied", "NotAllowedError");
      return capture().result;
    },
    async () => "ok",
  );
  await session.start();
  assert.match(session.getSnapshot().error ?? "", /Allow microphone/);
  assert.equal(session.getSnapshot().stream, null);
  await session.start();
  assert.equal(session.getSnapshot().phase, "recording");
  session.cancel();
});

test("empty final audio cannot produce a fake transcript or a send", async () => {
  let calls = 0;
  const session = new DictationSession(
    async () => ({
      ...capture().result,
      stop: async () => ({ audio: new Blob([]), durationMs: 0 }),
    }),
    async () => {
      ++calls;
      return "fake";
    },
  );
  await session.start();
  assert.equal(await session.finish(), null);
  assert.equal(calls, 0);
  assert.equal(session.getSnapshot().recording, null);
});

test("transcript response requires actual nonempty text", () => {
  assert.equal(readTranscript({ text: "  Hello  " }), "Hello");
  assert.throws(() => readTranscript({ text: 12 }), /read the transcript/);
  assert.throws(() => readTranscript({ text: " \n " }), /No speech/);
  assert.throws(
    () => readTranscript({ result: "unsupported contract" }),
    /read the transcript/,
  );
});

test("transcription paths stay on the existing authenticated backend", () => {
  assert.equal(transcriptionPath(undefined), null);
  assert.equal(transcriptionPath(" /voice/transcribe "), "/voice/transcribe");
  for (const path of [
    "https://third-party.example",
    "//third-party.example",
    "/\\third-party.example",
    "/voice?redirect=bad",
    "/voice path",
  ]) {
    assert.throws(() => transcriptionPath(path));
  }
});

test("dictation preserves text before/after a selected range and punctuation", () => {
  assert.deepEqual(
    insertDictation(
      { text: "Hello old text!", start: 6, end: 14 },
      "new words",
    ),
    { text: "Hello new words!", caret: 15 },
  );
  assert.equal(
    insertDictation({ text: "Typed", start: 5, end: 5 }, "spoken").text,
    "Typed spoken",
  );
  assert.equal(
    insertDictation({ text: "Typed\n", start: 6, end: 6 }, "spoken").text,
    "Typed\nspoken",
  );
  assert.equal(
    insertDictation({ text: "Keep me", start: 0, end: 7 }, " ").text,
    "Keep me",
  );
});

test("an oversized transcript is preserved for editing instead of silently truncated", () => {
  const text = "a".repeat(80001);
  assert.equal(
    insertDictation({ text: "", start: 0, end: 0 }, text).text.length,
    text.length,
  );
});
