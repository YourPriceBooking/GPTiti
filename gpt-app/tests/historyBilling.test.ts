import assert from 'node:assert/strict';
import { test } from 'node:test';
import { historyAppTokens } from '../lib/chat/historyBilling';

test('history keeps the settled 430 TITI rather than 174 provider tokens', () => {
  const message = { role: 'assistant', tokens: 174, billing: { appTokensSpent: 430 }, meta: { appTokens: 430 } };
  assert.equal(historyAppTokens(message), 430);
  assert.equal(historyAppTokens({ ...message, billing: undefined }), 430);
  assert.equal(historyAppTokens({ ...message, billing: { appTokensSpent: 0 } }), 0);
});

test('unknown or invalid costs are not inferred from provider tokens', () => {
  const legacy = { role: 'assistant', tokens: 174 };
  assert.equal(historyAppTokens(legacy), undefined);
  for (const value of [-1, NaN, Infinity, '430']) {
    assert.equal(historyAppTokens({ ...legacy, billing: { appTokensSpent: value } }), undefined);
  }
  assert.equal(historyAppTokens({ role: 'user', meta: { appTokens: 430 } }), undefined);
});
