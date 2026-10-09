import assert from "node:assert/strict";
import { test } from "node:test";
import { createBrowserCapture } from "../lib/dictation/browserRecorder.js";

class AudioTrack extends EventTarget {
  stopped = false;
  stop() {
    this.stopped = true;
  }
}
class Recorder {
  static current: Recorder;
  static isTypeSupported() {
    return true;
  }
  state: "inactive" | "recording" = "inactive";
  mimeType = "audio/webm;codecs=opus";
  ondataavailable: ((event: BlobEvent) => void) | null = null;
  onstop: (() => void) | null = null;
  onerror: (() => void) | null = null;
  stops = 0;
  constructor() {
    Recorder.current = this;
  }
  start() {
    this.state = "recording";
  }
  stop() {
    ++this.stops;
    this.state = "inactive";
  }
  chunk(text: string) {
    this.ondataavailable?.({ data: new Blob([text]) } as BlobEvent);
  }
}

function browser(getUserMedia: () => Promise<MediaStream>) {
  const properties = {
    window: { isSecureContext: true },
    navigator: { mediaDevices: { getUserMedia } },
    MediaRecorder: Recorder,
  };
  const descriptors = new Map<string, PropertyDescriptor | undefined>();
  for (const [name, value] of Object.entries(properties)) {
    descriptors.set(name, Object.getOwnPropertyDescriptor(globalThis, name));
    Object.defineProperty(globalThis, name, { configurable: true, value });
  }
  return () => {
    for (const [name, descriptor] of descriptors) {
      if (descriptor) Object.defineProperty(globalThis, name, descriptor);
      else Reflect.deleteProperty(globalThis, name);
    }
  };
}
function stream(track: AudioTrack) {
  return {
    getTracks: () => [track],
    getAudioTracks: () => [track],
  } as unknown as MediaStream;
}

test("an inactive recorder still waits for queued final dataavailable and stop events", async () => {
  const track = new AudioTrack();
  const restore = browser(async () => stream(track));
  let capture: Awaited<ReturnType<typeof createBrowserCapture>> | undefined;
  try {
    capture = await createBrowserCapture({
      signal: new AbortController().signal,
      onError: () => {},
    });
    const recorder = Recorder.current;
    recorder.chunk("first ");
    recorder.state = "inactive";
    let finished = false;
    const stopping = capture.stop();
    void stopping.then(() => {
      finished = true;
    });
    await Promise.resolve();
    assert.equal(finished, false);
    assert.equal(recorder.stops, 0);
    recorder.chunk("final");
    recorder.onstop?.();
    const recording = await stopping;
    assert.equal(await recording.audio.text(), "first final");
    assert.equal(track.stopped, true);
  } finally {
    capture?.dispose();
    restore();
  }
});

test("cancelling a pending microphone prompt releases a stream granted later", async () => {
  const track = new AudioTrack();
  let grant!: (stream: MediaStream) => void;
  const permission = new Promise<MediaStream>((resolve) => {
    grant = resolve;
  });
  const restore = browser(() => permission);
  try {
    const abort = new AbortController();
    const capture = createBrowserCapture({
      signal: abort.signal,
      onError: () => {},
    });
    abort.abort();
    grant(stream(track));
    await assert.rejects(capture, { name: "AbortError" });
    assert.equal(track.stopped, true);
  } finally {
    restore();
  }
});
