import test from "node:test";
import assert from "node:assert/strict";
import axios from "axios";
import { createBackendTranscriber } from "../lib/dictation/transcriptionRequest";

for (const [mime, extension] of [["audio/webm;codecs=opus", "webm"], ["audio/mp4", "m4a"], ["audio/ogg;codecs=opus", "ogg"]]) {
  test(`Whisper receives multipart file with ${mime} and authenticated client settings`, async () => {
    const signal = new AbortController().signal;
    const client = axios.create({
      baseURL: "https://gptiti.com/api", withCredentials: true,
      headers: { "Content-Type": "application/json", Authorization: "Bearer test" },
      adapter: async (config) => {
        assert.equal(config.url, "/upload/transcriptions");
        assert.equal(config.baseURL, "https://gptiti.com/api");
        assert.equal(config.withCredentials, true);
        assert.equal(config.headers.Authorization, "Bearer test");
        assert.notEqual(config.headers.getContentType(), "application/json");
        assert.equal(config.signal, signal);
        assert.equal(config.timeout, 330_000);
        assert.ok(config.data instanceof FormData);
        assert.deepEqual([...config.data.keys()], ["file"]);
        const file = config.data.get("file") as File;
        assert.equal(file.name, `dictation.${extension}`);
        assert.equal(file.type, mime);
        assert.equal(await file.text(), "audio fixture");
        return { data: { text: " Привіт! ", model: "Systran/faster-whisper-base" }, status: 200, statusText: "OK", headers: {}, config };
      },
    });
    assert.equal(await createBackendTranscriber(client)({ audio: new Blob(["audio fixture"], { type: mime }), durationMs: 1000 }, signal), "Привіт!");
  });
}

test("override is supported, invalid destinations rejected, empty transcript rejected", async () => {
  const client = axios.create({ adapter: async (config) => {
    assert.equal(config.url, "/custom/transcriptions");
    return { data: { text: " " }, status: 200, statusText: "OK", headers: {}, config };
  }});
  const recording = { audio: new Blob(["audio"]), durationMs: 10 };
  const signal = new AbortController().signal;
  await assert.rejects(createBackendTranscriber(client, "/custom/transcriptions")(recording, signal), /No speech/);
  await assert.rejects(createBackendTranscriber(client, "https://other.example/upload")(recording, signal), /not available/);
});

test("busy response propagates without retry; cancelled request never reaches adapter", async () => {
  let calls = 0;
  const busy = new Error("429 busy");
  const client = axios.create({ adapter: async () => { calls++; throw busy; } });
  const transcribe = createBackendTranscriber(client);
  const recording = { audio: new Blob(["audio"]), durationMs: 10 };
  await assert.rejects(transcribe(recording, new AbortController().signal), (error) => error === busy);
  assert.equal(calls, 1);
  const controller = new AbortController(); controller.abort();
  await assert.rejects(transcribe(recording, controller.signal), (error) => axios.isCancel(error));
  assert.equal(calls, 1);
});
