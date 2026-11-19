import test from 'node:test';
import assert from 'node:assert/strict';
import { pastedFiles } from '../lib/files/paste';

const fileItem = (file: File | null, directory = false) => ({
  kind: 'file', type: file?.type ?? '', getAsFile: () => file,
  webkitGetAsEntry: () => directory ? { isDirectory: true } : null,
});
const textItem = { kind: 'string', type: 'text/plain' };
const clipboard = (files: File[], items: unknown[], types: string[] = []) =>
  ({ files, items, types } as unknown as DataTransfer);

test('pasting mixed files keeps the original objects and order without double attaching', () => {
  const files = [
    new File(['1'], 'same.pdf'), new File(['2'], 'same.pdf'),
    new File(['table'], 'prices.xlsx'), new File(['notes'], 'notes.docx'),
    new File(['scan'], 'image.png', { type: 'image/png' }),
  ];
  const read = pastedFiles(clipboard(files, [textItem, ...files.map(f => fileItem(f))], ['text/plain', 'Files']));
  assert.equal(read?.length, files.length);
  files.forEach((file, i) => assert.equal(read?.[i], file));
  assert.equal(pastedFiles(clipboard([files[0]], []))?.[0], files[0]);
});

test('items-only paste works for screenshots and documents without a MIME type', () => {
  const a = new File(['a'], 'notes.docx');
  const b = new File(['b'], 'image.png', { type: 'image/png' });
  const read = pastedFiles(clipboard([], [textItem, fileItem(a), fileItem(b)]));
  assert.equal(read?.[0], a);
  assert.equal(read?.[1], b);
});

test('text, rich text, URLs and paths are left to native paste', () => {
  for (const types of [[], ['text/plain'], ['text/html', 'text/plain'], ['text/uri-list']]) {
    assert.equal(pastedFiles(clipboard([], [textItem], types)), null);
  }
});

test('report folders and unreadable clipboard files instead of dropping part of a batch', () => {
  const f = new File(['x'], 'note.txt');
  assert.throws(() => pastedFiles(clipboard([f], [fileItem(f, true)])), /Folders/);
  assert.throws(() => pastedFiles(clipboard([], [fileItem(f), fileItem(null)])), /readable/);
  assert.throws(() => pastedFiles(clipboard([], [], ['Files'])), /readable/);
});
