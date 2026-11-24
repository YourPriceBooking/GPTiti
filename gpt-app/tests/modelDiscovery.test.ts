import assert from "node:assert/strict";
import test from "node:test";
import { enabledChatIds, modelCards, findModelCard } from "../config/modelDiscovery";
import { modelConfig, isSelectableModel } from "../config/models.config";
import { getEstimatedTokens } from "../config/modelPricing.config";

test("catalog uses explicitly enabled chat IDs, not presence, labels or preview entries", () => {
  const rows = [
    { modelId: "gpt-5.4-mini", enabled: true },
    { modelId: "gpt-6.2-sol", enabled: true }, { modelId: "gpt-6.2-sol", enabled: true },
    { modelId: "gpt-6.2-astra", enabled: false }, { modelId: "gpt-6.1-sol" },
    { label: "gpt-6-luna", enabled: true }, { modelId: "gpt-4o", enabled: true },
    { modelId: "dictation", enabled: true }, { modelId: "preview-image", enabled: true }, null,
  ];
  assert.deepEqual(enabledChatIds({ success: true, chatModels: rows.reverse() }), ["gpt-5.4-mini", "gpt-6.2-sol"]);
  assert.deepEqual(enabledChatIds({ success: true, chatModels: [] }), []);
  assert.throws(() => enabledChatIds({ chatModels: [] }));
});

test("every model has a distinct accent visible against a light composer and white arrow", () => {
  assert.equal(new Set(modelCards.map(c => c.accent)).size, modelCards.length);
  for (const card of modelCards) {
    const linear = (at: number) => { const s = parseInt(card.accent.slice(at, at + 2), 16) / 255;
      return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; };
    const l = linear(1) * 0.2126 + linear(3) * 0.7152 + linear(5) * 0.0722;
    assert.ok(1.05 / (l + 0.05) >= 4.5, card.id);
    assert.equal(isSelectableModel(card.id), card.group === "Chat");
  }
});

test("illustrative averages never replace the actual draft estimate", () => {
  assert.equal(getEstimatedTokens("gpt-5.4-mini", 4, 0), 136);
  assert.equal(getEstimatedTokens("gpt-5.4-mini", 4, 1), 183);
  assert.equal(getEstimatedTokens("gpt-5.4-mini", 0, 0), null);
  assert.equal(getEstimatedTokens("gpt-6.2-sol", 4, 1), null);
  assert.equal(findModelCard("gpt-6.2-sol")?.demoTokens, 750);
  assert.equal(modelConfig["gpt-5.4"].list.find(m => m.title === "gpt-5.4-mini")?.tokens, 200);
});
