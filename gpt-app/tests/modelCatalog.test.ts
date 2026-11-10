import test from "node:test";
import assert from "node:assert/strict";
import {
  readModelCatalog,
  visibleModels,
  groupModels,
} from "../lib/models/catalog";
import {
  modelReducer,
  catalogLoaded,
  catalogFailed,
  restoreChatModel,
  setSelectedModel,
} from "../redux/model/slice";
import { getModelLimits } from "../config/modelLimits.config";
const limits = {
  maxImages: 2,
  maxImageSizeMb: 7,
  maxFiles: 4,
  maxFileSizeMb: 18,
  maxLinks: 6,
  maxTextChars: 45000,
};
const row = (modelId: string, extra = {}) => ({
  modelId,
  label: `Label ${modelId}`,
  enabled: true,
  type: "model",
  groupId: "New family",
  limits,
  order: 2,
  ...extra,
});
const read = (chatModels: unknown[]) =>
  readModelCatalog({ success: true, chatModels });
test("server catalog accepts new IDs without code changes, preserves metadata, filters disabled/tools and orders deterministically", () => {
  const models = read([
    row("future-b"),
    row("future-a", {
      order: 1,
      tokens: 321,
      content: { desc: "Server copy" },
    }),
    row("retired", { enabled: false }),
    row("tool", { type: "tool" }),
  ]);
  assert.deepEqual(
    models.map((m) => m.title),
    ["future-a", "future-b"],
  );
  assert.equal(models[0].label, "Label future-a");
  assert.equal(models[0].desc, "Server copy");
  assert.equal(models[0].tokens, 321);
  assert.equal(models[1].tokens, null);
  assert.equal(groupModels(models)["New family"].list.length, 2);
  assert.deepEqual(getModelLimits("future-a", models), limits);
});
test("invalid catalogs cannot silently create usable model defaults", () => {
  assert.throws(() => readModelCatalog({ success: false, chatModels: [] }));
  assert.throws(() => read([row("a"), row("a")]));
  assert.throws(() => read([row("a", { limits: null })]));
  assert.throws(() =>
    read([row("a", { limits: { ...limits, maxFiles: -1 } })]),
  );
  assert.equal(getModelLimits("unknown").maxImages, 0);
  assert.deepEqual(read([]), []);
});
test("role filtering, selection and refresh preserve an unavailable chat ID instead of silently switching its model", () => {
  const models = read([
    row("one", { default: true }),
    row("admin", { minRole: "admin" }),
    row("two"),
  ]);
  assert.deepEqual(
    visibleModels(models).map((m) => m.title),
    ["one", "two"],
  );
  assert.equal(visibleModels(models, "admin").length, 3);
  let state = modelReducer(undefined, catalogLoaded(models));
  assert.equal(state.selectedModel, "one");
  state = modelReducer(state, setSelectedModel("two"));
  assert.equal(state.selectedModel, "two");
  state = modelReducer(state, setSelectedModel("invented"));
  assert.equal(state.selectedModel, "two");
  state = modelReducer(state, catalogLoaded(read([row("one")])));
  assert.equal(state.selectedModel, "two");
  assert.equal(state.selectedModelGroup, "");
  state = modelReducer(state, catalogFailed());
  assert.equal(state.catalogStatus, "error");
  assert.equal(state.selectedModel, "two");
  state = modelReducer(state, restoreChatModel("retired-history"));
  assert.equal(state.selectedModel, "retired-history");
});
