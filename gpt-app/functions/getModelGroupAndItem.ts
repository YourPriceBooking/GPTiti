import type { CatalogModel } from "../lib/models/catalog";
export const getModelGroupAndItem = (
  selectedModel: string,
  catalog: CatalogModel[],
) => {
  const model = catalog.find((m) => m.title === selectedModel);
  return model ? { group: model.groupId, model } : null;
};
