import assert from 'node:assert/strict';
import { test } from 'node:test';
import { composerIdentity, isUnsentPromotedDraft } from '../lib/chat/composerIdentity';
import { AttachmentPreparation } from '../lib/files/preparation';

test('draft promotion preserves the editor key and welcome composer until admission', () => {
  const local = { id: 'draft:one', messages: [] };
  const promoted = { ...local, id: 'server-one', composerKey: local.id };
  assert.equal(composerIdentity(local), composerIdentity(promoted));
  assert.equal(isUnsentPromotedDraft(promoted), true);
  assert.equal(isUnsentPromotedDraft({ ...promoted, messages: [{ role: 'user', content: 'send' }] }), false);
  assert.notEqual(composerIdentity(promoted), composerIdentity({ id: 'server-two' }));
  assert.notEqual(composerIdentity(promoted), composerIdentity({ id: 'draft:two' }));
  assert.equal(isUnsentPromotedDraft({ messages: [] }), false);
});

test('Cancel during preparation keeps the same File identity and reuses its uploaded ID on Send', async () => {
  const preparation = new AttachmentPreparation();
  const file = new File(['scan'], 'scan.pdf', { type: 'application/pdf' });
  const controller = new AbortController();
  let uploads = 0;
  const uploaded = { fileId: '123456789012345678901234', url: '', originalName: file.name, mimetype: file.type, size: file.size, expiresAt: null };
  const upload = async () => { uploads++; controller.abort(); return uploaded; };
  await assert.rejects(preparation.uploadAll([file], upload, controller.signal, () => {}));
  const result = await preparation.uploadAll([file], upload, new AbortController().signal, () => {});
  assert.equal(uploads, 1);
  assert.equal(result[0].fileId, uploaded.fileId);
});
