import test from 'node:test';
import assert from 'node:assert/strict';
import { inputKind, validateInputFiles, validateTextBytes, TEXT_FILE_BYTES, OFFICE_FILE_BYTES, PDF_FILE_BYTES, FILE_ACCEPT, IMAGE_ACCEPT } from '../lib/files/input';
const limits = { maxImages: 3, maxImageSizeMb: 5 };
const file = (name: string, size = 10) => ({ name, size });
test('mixed attachments accept supported extensions and reject unreadable documents', () => {
  assert.equal(validateInputFiles([file('notes.TXT'), file('photo.webp'), file('code.ts')], limits), null);
  for (const ext of ['doc','xls','docm','xlsm','svg','zip']) assert.ok(validateInputFiles([file('a.' + ext)], limits));
  assert.equal(inputKind(file('a.JSON')), 'text');
});
test('universal picker respects image model limits and combined attachment count', () => {
  assert.equal(validateInputFiles([file('a.png')], { ...limits, maxImages: 0 }), null);
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

test('Office files use their own 5 MiB limit and stay available on text-only models', () => {
  const textOnly = { maxImages: 0, maxImageSizeMb: 0 };
  assert.equal(inputKind(file('Report.DOCX')), 'office');
  assert.equal(inputKind(file('Book.xlsx')), 'office');
  assert.equal(validateInputFiles([file('a.docx', OFFICE_FILE_BYTES), file('b.xlsx', OFFICE_FILE_BYTES), file('c.txt', TEXT_FILE_BYTES)], textOnly), null);
  for (const ext of ['docx', 'xlsx']) {
    assert.ok(FILE_ACCEPT.split(',').includes('.' + ext));
    assert.ok(!IMAGE_ACCEPT.split(',').includes('.' + ext));
    assert.ok(validateInputFiles([file('a.' + ext, OFFICE_FILE_BYTES + 1)], limits));
    assert.ok(validateInputFiles([file('a.' + ext, 0)], limits));
  }
});
test('mixed Office attachments still share count, total-size and image restrictions', () => {
  assert.equal(validateInputFiles([file('a.docx'), file('b.xlsx'), file('c.csv'), file('d.png')], limits), null);
  assert.ok(validateInputFiles(Array.from({length: 11}, () => file('a.docx')), limits));
  assert.ok(validateInputFiles(Array.from({length: 6}, () => file('a.xlsx', OFFICE_FILE_BYTES)), limits));
  assert.equal(validateInputFiles([file('a.docx'), file('b.png')], {maxImages: 0, maxImageSizeMb: 0}), null);
});


test('PDF picker and validation accept exact size on text-only models without treating binary bytes as text', () => {
  const textOnly = { maxImages: 0, maxImageSizeMb: 0 };
  assert.equal(inputKind(file('Report.PDF')), 'pdf');
  assert.ok(FILE_ACCEPT.split(',').includes('.pdf'));
  assert.ok(!IMAGE_ACCEPT.split(',').includes('.pdf'));
  assert.equal(validateInputFiles([file('a.PDF', PDF_FILE_BYTES), file('b.docx'), file('c.xlsx'), file('d.txt')], textOnly), null);
  assert.match(validateInputFiles([file('a.pdf', PDF_FILE_BYTES + 1)], limits)!, /PDF.*5 MiB/);
  assert.match(validateInputFiles([file('a.pdf', 0)], limits)!, /empty/);
  assert.ok(validateInputFiles([file('a.pdf.exe')], limits));
});
test('PDF shares aggregate limits with documents and images', () => {
  assert.equal(validateInputFiles([file('a.pdf'), file('b.png'), file('c.csv')], limits), null);
  assert.equal(validateInputFiles([file('a.pdf'), file('b.png')], { maxImages: 0, maxImageSizeMb: 0 }), null);
  assert.ok(validateInputFiles(Array.from({length: 11}, () => file('a.pdf')), limits));
  assert.equal(validateInputFiles(Array.from({length: 5}, () => file('a.pdf', PDF_FILE_BYTES)), limits), null);
  assert.match(validateInputFiles([...Array.from({length: 5}, () => file('a.pdf', PDF_FILE_BYTES)), file('b.docx')], limits)!, /25 MiB/);
});

test('OCR images respect 5 MiB even when vision allows more, and are readable on text-only models', () => {
  for (const model of [{maxImages: 10,maxImageSizeMb: 20},{maxImages: 0,maxImageSizeMb: 0}]) {
    assert.equal(validateInputFiles([file('scan.png', PDF_FILE_BYTES)], model), null);
    assert.ok(validateInputFiles([file('scan.png', PDF_FILE_BYTES + 1)], model));
  }
});
