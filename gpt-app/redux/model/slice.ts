import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { modelConfig } from "@/config/models.config";
import type { ModelType } from "@/types/types";

interface ModelState {
  selectedModel: string;
  selectedModelGroup: ModelType;
}

const DEFAULT_GROUP: ModelType = "gpt-5.4";
const DEFAULT_MODEL = "gpt-5.4-mini";

const initialState: ModelState = {
  selectedModel: DEFAULT_MODEL,
  selectedModelGroup: DEFAULT_GROUP,
};

const isValidModel = (model: string) =>
  Object.values(modelConfig).some((cfg) =>
    cfg.list.some((item) => item.title === model),
  );

const isValidGroup = (group: string): group is ModelType =>
  group in modelConfig;

const modelSlice = createSlice({
  name: "model",
  initialState,
  reducers: {
    setSelectedModel(state, { payload }: PayloadAction<string>) {
      state.selectedModel = isValidModel(payload) ? payload : DEFAULT_MODEL;
    },
    setSelectedModelGroup(state, { payload }: PayloadAction<ModelType>) {
      state.selectedModelGroup = isValidGroup(payload) ? payload : DEFAULT_GROUP;
    },
  },
});

export const { setSelectedModel, setSelectedModelGroup } = modelSlice.actions;
export const modelReducer = modelSlice.reducer;
