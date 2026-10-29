import test from "node:test";
import assert from "node:assert/strict";
import axios from "axios";
import { resolveBackendConfig } from "../config/backend.config";

test("production API paths keep exactly one api prefix; sockets use the origin", () => {
  const config = resolveBackendConfig();
  const client = axios.create({ baseURL: config.backendApiUrl });
  for (const path of ["/users/refresh", "/upload", "/files/id/download", "/files/id/preview", "/conversations", "/chat/history"]) {
    assert.equal(client.getUri({ url: path }), `https://gptiti.com/api${path}`);
  }
  assert.equal(config.socketUrl, "https://gptiti.com");
  assert.equal(config.socketPath, "/socket.io");
});

test("blank config uses production defaults; local/staging overrides remain explicit", () => {
  assert.deepEqual(resolveBackendConfig(" ", " ", " "), resolveBackendConfig());
  assert.deepEqual(resolveBackendConfig(" http://localhost:7000/gpt-titi/api/// "), {
    backendApiUrl: "http://localhost:7000/gpt-titi/api/",
    socketUrl: "http://localhost:7000",
    socketPath: "/socket.io",
  });
  assert.deepEqual(resolveBackendConfig(undefined, " https://socket.example.test ", " /custom/socket.io "), {
    backendApiUrl: "https://gptiti.com/api/",
    socketUrl: "https://socket.example.test",
    socketPath: "/custom/socket.io",
  });
});
