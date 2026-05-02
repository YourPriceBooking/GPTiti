import type { RootState } from "../store";

export const selectSelectedModel = (state: RootState) =>
  state.model.selectedModel;
export const selectSelectedModelGroup = (state: RootState) =>
  state.model.selectedModelGroup;
