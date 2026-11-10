import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { DEFAULT_MODEL, DEFAULT_MODEL_GROUP, isSelectableModel, modelConfig } from "@/config/models.config";
import type { ModelType } from "@/types/types";

interface ModelState {
  selectedModel: string;
  selectedModelGroup: ModelType;
}

const initialState: ModelState = {
  selectedModel: DEFAULT_MODEL,
  selectedModelGroup: DEFAULT_MODEL_GROUP,
};

const isValidGroup = (group: string): group is ModelType =>
  Object.hasOwn(modelConfig, group);

const modelSlice = createSlice({
  name: "model",
  initialState,
  reducers: {
    setSelectedModel(state, { payload }: PayloadAction<string>) {
      state.selectedModel = isSelectableModel(payload) ? payload : DEFAULT_MODEL;
    },
    setSelectedModelGroup(state, { payload }: PayloadAction<ModelType>) {
      state.selectedModelGroup = isValidGroup(payload) ? payload : DEFAULT_MODEL_GROUP;
    },
  },
});

export const { setSelectedModel, setSelectedModelGroup } = modelSlice.actions;
export const modelReducer = modelSlice.reducer;
