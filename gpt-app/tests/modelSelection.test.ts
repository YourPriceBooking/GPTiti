import assert from "node:assert/strict";
import test from "node:test";
import { migrateModelSelection } from "../redux/model/migrate";
import { isSelectableModel } from "../config/models.config";

const removedModels = [
  "o1", "o3-mini", "gpt-4o", "gpt-4o-mini", "gpt-5.1",
  "o1-mini", "gpt-5.1-mini", "gpt-5.1-realtime", "gpt-4o-realtime",
  "Smart Search", "Image → Create HD", "Image → Create Fast", "Voice → Text", "Text → Voice",
];

test("removed model preferences cannot return through persisted state", async () => {
  for (const model of removedModels) {
    const saved = { selectedModel: model, selectedModelGroup: "AI tools", _persist: { version: -1, rehydrated: true } };
    const migrated = await migrateModelSelection(saved);
    assert.deepEqual(migrated, { ...saved, selectedModel: "gpt-5.4-mini", selectedModelGroup: "gpt-5.4" });
    assert.equal(saved.selectedModel, model, "migration must not mutate its input");
    assert.equal(isSelectableModel(model), false);
  }
});

test("active selections survive migration and stale groups are repaired", async () => {
  for (const [model, group] of [["gpt-5.4-mini", "gpt-5.4"], ["gpt-5.4", "gpt-5.4"], ["gpt-5.5", "gpt-5.5"]]) {
    const saved = { selectedModel: model, selectedModelGroup: "0-Series", _persist: { version: 1, rehydrated: true } };
    const migrated = await migrateModelSelection(saved);
    assert.deepEqual(migrated, { ...saved, selectedModelGroup: group });
    assert.equal(isSelectableModel(model), true);
    assert.deepEqual(await migrateModelSelection(migrated), migrated);
  }
});

test("first visit and invalid persisted model values are safe", async () => {
  assert.equal(await migrateModelSelection(undefined), undefined);
  for (const model of [undefined, null, 42, {}, "unknown", "toString"]) {
    const saved = { selectedModel: model, _persist: { version: -1, rehydrated: true } };
    assert.deepEqual(await migrateModelSelection(saved), { ...saved, selectedModel: "gpt-5.4-mini", selectedModelGroup: "gpt-5.4" });
  }
});
