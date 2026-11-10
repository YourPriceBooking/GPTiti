import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { visibleModels, groupModels } from "../../lib/models/catalog";
export const selectSelectedModel = (s: RootState) => s.model.selectedModel;
export const selectSelectedModelGroup = (s: RootState) =>
  s.model.selectedModelGroup;
export const selectCatalogStatus = (s: RootState) => s.model.catalogStatus;
export const selectCatalog = createSelector(
  [
    (s: RootState) => s.model.catalog,
    (s: RootState) => s.auth.user?.role || "user",
  ],
  visibleModels,
);
export const selectModelConfig = createSelector([selectCatalog], groupModels);
export const selectModelAvailable = createSelector(
  [selectCatalog, selectSelectedModel, selectCatalogStatus],
  (models, id, status) =>
    status === "ready" && models.some((m) => m.title === id),
);
