import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileLimits, usesBackgroundOcr, validateServerFiles, fileCeilings, formatLimit } from '../lib/files/limits';
const fixture = () => ({ version: 1, profile: 'stage-a-storage', units: { MB: 1e6, GB: 1e9 },
  storage: { maxBytes: 2e9, maxCount: 500 },
  upload: { maxBytes: 50e6, types: {
    document: { extensions: ['pdf','docx'], maxBytes: 25e6 }, spreadsheet: { extensions: ['xlsx','csv','tsv'], maxBytes: 20e6 },
    text: { extensions: ['txt','py'], maxBytes: 1e6 }, image: { extensions: ['png'], maxBytes: 15e6 }, archive: { extensions: ['zip'], maxBytes: 50e6 },
  } }, message: { maxAttachments: 10, maxBytes: 25 * 1024 ** 2, extractedTextBytes: 131072 },
  processing: { text: { enabled: true, maxBytes: 65536 }, office: { enabled: true, maxBytes: 5 * 1024 ** 2 }, pdf: { enabled: true, maxBytes: 5 * 1024 ** 2 },
    ocr: { enabled: true, maxBytes: 5 * 1024 ** 2, maxOcrPages: 10, maxTextBytes: 65536 },
    zip: { enabled: true, inputBytes: 10 * 1024 ** 2, expandedBytes: 25 * 1024 ** 2, entryBytes: 5 * 1024 ** 2, entries: 20, records: 100, textBytes: 131072, outputEntries: 10 } } });
const f = (name: string, size: number) => ({name, size});
test('reads stage A contract and keeps upload and reading bounds distinct', () => {
  const limits = readFileLimits(fixture());
  assert.equal(limits.storage.maxBytes, 2e9);
  assert.deepEqual(fileCeilings('FILE.ZIP', limits), {upload: 50e6, reading: 10*1024**2, enabled: true});
  assert.equal(validateServerFiles([f('a.zip', 10*1024**2)], limits), null);
  assert.match(validateServerFiles([f('a.zip', 10*1024**2+1)], limits)!, /storage accepts up to 50 MB.*10 MiB/);
  assert.match(validateServerFiles([f('a.zip', 50e6+1)], limits)!, /storage upload limit/);
  assert.equal(validateServerFiles([f('a.txt', 65536)], limits), null);
  assert.match(validateServerFiles([f('a.txt', 65537)], limits)!, /64 KiB/);
  assert.match(validateServerFiles([f('a.csv', 1e6)], limits)!, /20 MB.*64 KiB/);
});
test('server overrides control count, aggregate and reader opt-outs without model-name defaults', () => {
  const raw = fixture(); raw.message.maxAttachments = 2; raw.message.maxBytes = 100; raw.message.extractedTextBytes = 50;
  let limits = readFileLimits(raw);
  assert.match(validateServerFiles([f('a.txt', 26),f('b.txt',26)], limits)!, /50 bytes/);
  assert.match(validateServerFiles([f('a.pdf', 51),f('b.pdf',51)], limits)!, /100 bytes/);
  assert.match(validateServerFiles([f('a.txt', 1),f('b.txt',1),f('c.txt',1)], limits)!, /up to 2/);
  raw.processing.text.enabled = false; limits = readFileLimits(raw);
  assert.match(validateServerFiles([f('a.txt', 1)], limits)!, /disabled/);
  assert.equal(validateServerFiles([f('a.pdf', 1)], limits), null);
  raw.processing.pdf.enabled = false;
  assert.match(validateServerFiles([f('a.pdf', 1)], readFileLimits(raw))!, /disabled/);
});
test('missing or malformed profiles never authorize uploads or block text-only messages', () => {
  assert.equal(validateServerFiles([], null), null);
  assert.match(validateServerFiles([f('a.txt', 1)], null)!, /unavailable/);
  for (const data of [null, {}, {...fixture(), version: 2}, {...fixture(), units: {MB:1024**2, GB:1024**3}}]) assert.throws(() => readFileLimits(data));
  const bad = fixture(); bad.processing.text.maxBytes = NaN; assert.throws(() => readFileLimits(bad));
  const limits = readFileLimits(fixture());
  for (const size of [0,-1,NaN,Infinity]) assert.ok(validateServerFiles([f('a.txt',size)], limits));
  assert.ok(validateServerFiles([f('a.exe',1)], limits));
  assert.equal(formatLimit(2e9), '2 GB'); assert.equal(formatLimit(65536), '64 KiB');
});
test('upload overrides cap readers and OCR independently caps image bytes', () => {
  const raw = fixture(); raw.upload.maxBytes = 1024;
  const limits = readFileLimits(raw);
  assert.deepEqual(fileCeilings('a.png', limits), { upload: 1024, reading: 1024, enabled: true });
  assert.ok(validateServerFiles([f('a.png',1025)], limits));
  raw.upload.maxBytes = 50e6; raw.processing.ocr.maxBytes = 2048;
  assert.deepEqual(fileCeilings('a.pdf',readFileLimits(raw)), {upload:25e6,reading:2048,enabled:true});
  raw.processing.ocr.enabled = false;
  assert.equal(fileCeilings('a.png',readFileLimits(raw))?.reading,15e6);
});
test('background preparation is opt-in through a recognized server capability; old limits remain valid', () => {
  assert.equal(readFileLimits(fixture()).preparation,undefined);
  for (const preparation of [{version:1,async:false,kinds:['ocr']},{version:2,async:true,kinds:['ocr']},{version:1,async:true,kinds:['zip']}]) {
    assert.equal(readFileLimits({...fixture(),preparation}).preparation?.async,false);
  }
  assert.equal(readFileLimits({...fixture(),preparation:{version:1,async:true,kinds:['ocr']}}).preparation?.async,true);
});

test('model OCR opt-out keeps the vision/text-layer legacy path even with the queue enabled', () => {
  const raw = {...fixture(),preparation:{version:1,async:true,kinds:['ocr']}};
  assert.equal(usesBackgroundOcr(readFileLimits(raw)),true);
  raw.processing.ocr.enabled=false;
  assert.equal(usesBackgroundOcr(readFileLimits(raw)),false);
  assert.equal(usesBackgroundOcr(readFileLimits(fixture())),false);
});
