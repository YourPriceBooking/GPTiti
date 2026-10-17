import test from 'node:test';
import assert from 'node:assert/strict';
import { inputKind, validateInputFiles, validateTextBytes, TEXT_FILE_BYTES } from '../lib/files/input';
const limits = { maxImages: 3, maxImageSizeMb: 5 };
const file = (name: string, size = 10) => ({ name, size });
test('mixed attachments accept supported extensions and reject unreadable documents', () => {
  assert.equal(validateInputFiles([file('notes.TXT'), file('photo.webp'), file('code.ts')], limits), null);
  for (const ext of ['pdf','docx','xlsx','svg','zip']) assert.ok(validateInputFiles([file('a.' + ext)], limits));
  assert.equal(inputKind(file('a.JSON')), 'text');
});
test('universal picker respects image model limits and combined attachment count', () => {
  assert.ok(validateInputFiles([file('a.png')], { ...limits, maxImages: 0 }));
  assert.ok(validateInputFiles(Array.from({length: 4}, () => file('a.png')), limits));
  assert.ok(validateInputFiles(Array.from({length: 11}, () => file('a.txt')), limits));
  assert.ok(validateInputFiles([file('a.png', 6 * 1024 * 1024)], limits));
});
test('text limits allow exact boundary and reject excess or empty files', () => {
  assert.equal(validateInputFiles([file('a.txt', TEXT_FILE_BYTES), file('b.txt', TEXT_FILE_BYTES)], limits), null);
  assert.ok(validateInputFiles([file('a.txt', TEXT_FILE_BYTES + 1)], limits));
  assert.ok(validateInputFiles([file('a.txt', TEXT_FILE_BYTES), file('b.txt', TEXT_FILE_BYTES), file('c.txt', 1)], limits));
  assert.ok(validateInputFiles([file('a.txt', 0)], limits));
  assert.ok(validateInputFiles([file('a.png', 14*1024*1024), file('b.png', 14*1024*1024)], {maxImages: 5,maxImageSizeMb: 20}));
});
test('UTF-8 validation preserves Cyrillic, multiline text and code but rejects binary data', () => {
  const bytes = (s: string) => new TextEncoder().encode(s).buffer as ArrayBuffer;
  assert.equal(validateTextBytes(bytes('Привіт\nname,value\r\n\t<script>text</script>')), null);
  assert.ok(validateTextBytes(new Uint8Array([0xff, 0xfe]).buffer));
  assert.ok(validateTextBytes(bytes('a\u0000b')));
});
