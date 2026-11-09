import test from "node:test";
import assert from "node:assert/strict";
import {
  readLibraryPage,
  mergeLibraryFiles,
  attachmentReason,
  asUploadedFile,
  storageUploadError,
  type LibraryFile,
} from "../lib/files/library";
import {
  setLibraryOwner,
  writeLibraryDraft,
  readLibraryDraft,
  attachLibraryFiles,
  clearLibraryDraft,
  forgetLibraryFile,
  setLibraryTarget,
  getLibraryTarget,
  safeDraftPath,
} from "../lib/files/libraryDraft";
import type { FileLimits } from "../lib/files/limits";
const file: LibraryFile = {
  fileId: "111111111111111111111111",
  originalName: "report.txt",
  mimetype: "text/plain",
  size: 20,
  status: "ready",
  source: "upload",
  expiresAt: null,
};
const limits: FileLimits = {
  version: 1,
  storage: { maxBytes: 2e9, maxCount: 500 },
  upload: {
    maxBytes: 50e6,
    types: {
      text: { extensions: ["txt"], maxBytes: 1e6 },
      presentation: { extensions: ["pptx"], maxBytes: 25e6 },
    },
  },
  message: { maxAttachments: 2, maxBytes: 100, extractedTextBytes: 100 },
  processing: {
    text: { enabled: true, maxBytes: 100 },
    office: { enabled: true, maxBytes: 100 },
    pdf: { enabled: true, maxBytes: 100 },
    ocr: { enabled: true, maxBytes: 100, maxOcrPages: 10, maxTextBytes: 100 },
    zip: {
      enabled: false,
      inputBytes: 100,
      expandedBytes: 100,
      entryBytes: 100,
      entries: 10,
      records: 20,
      textBytes: 100,
      outputEntries: 10,
    },
  },
};
test("library boundaries reject malformed pages and preserve expiry without trusting URLs", () => {
  const raw = {
    files: [
      {
        ...file,
        url: "https://untrusted.invalid",
        createdAt: "2026-11-09T10:00:00Z",
      },
    ],
    quota: { bytes: 20, count: 1, maxBytes: 2e9, maxCount: 500 },
    nextCursor: null,
  };
  const parsed = readLibraryPage(raw);
  assert.equal(parsed.files[0].expiresAt, null);
  assert.equal("url" in parsed.files[0], false);
  assert.throws(() =>
    readLibraryPage({ ...raw, files: [{ ...file, fileId: "../foreign" }] }),
  );
  assert.throws(() => readLibraryPage({ ...raw, nextCursor: "bad" }));
  assert.throws(() =>
    readLibraryPage({ ...raw, quota: { ...raw.quota, bytes: -1 } }),
  );
  assert.equal(asUploadedFile(parsed.files[0]).url, "");
});
test("reuse is keyed by ID; storage support does not grant model support; aggregate limits include existing draft", () => {
  assert.equal(mergeLibraryFiles([file], [file]).length, 1);
  assert.equal(
    mergeLibraryFiles([file], [{ ...file, fileId: "222222222222222222222222" }])
      .length,
    2,
  );
  assert.equal(attachmentReason(file, limits), null);
  assert.match(
    attachmentReason(file, limits, [{ name: "a.txt", size: 90 }])!,
    /exceed/,
  );
  assert.match(
    attachmentReason({ ...file, status: "deleted" }, limits)!,
    /deleted/,
  );
  assert.match(
    attachmentReason({ ...file, expiresAt: "2000-01-01T00:00:00Z" }, limits)!,
    /expired/,
  );
  const pptx = { name: "slides.pptx", size: 200 };
  assert.equal(storageUploadError(pptx, limits), null);
  assert.match(
    attachmentReason({ ...file, originalName: pptx.name, size: 200 }, limits)!,
    /cannot be read/,
  );
  assert.match(attachmentReason(file, null)!, /unavailable/);
});
test("drafts survive navigation, are account-scoped and removal is independent of file storage", () => {
  setLibraryOwner("one");
  writeLibraryDraft("one", "/", { text: "Keep exact text" });
  attachLibraryFiles("one", "/", [file]);
  setLibraryTarget("one", "/");
  assert.equal(getLibraryTarget("one"), "/");
  assert.equal(readLibraryDraft("one", "/files").text, "");
  assert.equal(readLibraryDraft("one", "/").text, "Keep exact text");
  attachLibraryFiles("one", "/", [file]);
  assert.equal(readLibraryDraft("one", "/").files.length, 1);
  assert.equal(readLibraryDraft("two", "/").files.length, 0);
  attachLibraryFiles("one", "/chats/abc", [file]);
  forgetLibraryFile("one", file.fileId);
  assert.equal(readLibraryDraft("one", "/chats/abc").files.length, 0);
  assert.equal(readLibraryDraft("one", "/").text, "Keep exact text");
  clearLibraryDraft("one", "/");
  assert.equal(readLibraryDraft("one", "/").text, "");
  writeLibraryDraft("one", "/", { text: "Private" });
  setLibraryOwner("two");
  assert.equal(readLibraryDraft("two", "/").text, "");
  assert.equal(safeDraftPath("https://evil.invalid"), false);
  assert.equal(safeDraftPath("//evil.invalid"), false);
  setLibraryOwner(undefined);
});
test("blocked browser storage does not break drafts or logout", () => {
  Object.defineProperty(globalThis, "sessionStorage", {
    configurable: true,
    value: {
      getItem: () => {
        throw Error("blocked");
      },
      setItem: () => {
        throw Error("blocked");
      },
      removeItem: () => {
        throw Error("blocked");
      },
    },
  });
  setLibraryOwner("one");
  writeLibraryDraft("one", "/", { text: "Memory only" });
  assert.equal(readLibraryDraft("one", "/").text, "Memory only");
  assert.doesNotThrow(() => setLibraryOwner(undefined));
  Reflect.deleteProperty(globalThis, "sessionStorage");
});

test("successful upload cache survives navigation but is discarded on account switch", async () => {
  const { accountPreparation } = await import("../lib/files/preparation.js");
  const local = new File(["hello"], "hello.txt", { type: "text/plain" });
  let uploads = 0;
  const upload = async () => {
    uploads++;
    return asUploadedFile(file);
  };
  const signal = new AbortController().signal;
  await accountPreparation("one").uploadAll([local], upload, signal, () => {});
  await accountPreparation("one").uploadAll([local], upload, signal, () => {});
  assert.equal(uploads, 1);
  await accountPreparation("two").uploadAll([local], upload, signal, () => {});
  assert.equal(uploads, 2);
  accountPreparation(undefined);
});
