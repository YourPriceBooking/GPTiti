import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFiles, readFileResult, tablePreview } from '../lib/files/types.js';
import { readChatEndEvent, readChatTurnSnapshot } from '../lib/chat/chatProtocol.js';
import { mergeServerMessages } from '../lib/chat/chatState.js';
const file = { fileId: '0123456789abcdef01234567', originalName: 'cat.svg', mimetype: 'image/svg+xml', size: 3405, status: 'ready' };
const turnId = 'ab279fa8-b4d7-48a0-9230-43b52cf3073a';
const clientMessageId = '6a09b9b6-3daf-4c9f-a272-6b8c6813fd0b';
const assistant = { id: 'message', role: 'assistant', content: '', modelId: 'model', tokens: 42, turnId, createdAt: '2026-10-16', updatedAt: '2026-10-16', attachments: [file], fileResult: { status: 'ready', filename: 'cat.svg', fileId: file.fileId } };
const billing = { appTokensSpent: 42, totalTokens: 100, balance: 958 };
test('file-only V2 end and restored snapshot retain canonical attachments', () => {
  const event = readChatEndEvent({ protocolVersion: 2, event: 'chat:end', type: 'completed', turnId, clientMessageId, conversationId: 'chat', attempt: 1, payload: { assistantMessage: assistant, billing } });
  assert.equal(event?.payload.assistantMessage.attachments?.[0].fileId, file.fileId);
  assert.equal(event?.payload.assistantMessage.fileResult?.status, 'ready');
  const restored = readChatTurnSnapshot({ turnId, clientMessageId, conversationId: 'chat', status: 'completed', attempt: 1, lastSeq: 0, partialContent: '', assistantMessage: assistant, billing, error: null, createdAt: 'today', updatedAt: 'today' });
  assert.deepEqual(restored?.assistantMessage?.attachments, event?.payload.assistantMessage.attachments);
});
test('history replaces old file metadata without duplicating an assistant', () => {
  const local = { id: 'message', role: 'assistant' as const, content: 'Ready', turnId, attachments: readFiles([file]) };
  const history = { ...local, attachments: readFiles([{ ...file, status: 'deleted' }]) };
  const merged = mergeServerMessages([local], [history]);
  assert.equal(merged.length, 1); assert.equal(merged[0].attachments[0].status, 'deleted');
});
test('file parser discards untrusted URLs and malformed identifiers', () => {
  const [safe] = readFiles([{ ...file, previewUrl: 'https://evil.test', downloadUrl: 'javascript:alert(1)' }]);
  assert.equal('previewUrl' in safe, false);
  assert.deepEqual(readFiles([{ ...file, fileId: '../users' }, { ...file, size: Infinity }]), []);
  assert.equal(readFileResult({ status: 'failed', filename: 'result.json', error: 'INVALID_JSON' })?.error, 'INVALID_JSON');
});
test('table preview respects quotes, multiline fields, truncation and limits', () => {
  assert.deepEqual(tablePreview('name,value\r\n"a,b","two\nlines"\r\n"say ""hi""",42', ','), [['name', 'value'], ['a,b', 'two\nlines'], ['say "hi"', '42']]);
  assert.deepEqual(tablePreview('a\tb\n1\t2', '\t'), [['a', 'b'], ['1', '2']]);
  assert.deepEqual(tablePreview('a,b\n"incomplete', ',', true), [['a', 'b']]);
  assert.equal(tablePreview('a,b\n'.repeat(300), ',').length, 200);
  assert.equal(tablePreview(Array(100).fill('a').join(','), ',')[0].length, 50);
});
