import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CatalogModel } from "../../lib/models/catalog";
interface ModelState {
  selectedModel: string;
  selectedModelGroup: string;
  catalog: CatalogModel[];
  catalogStatus: "idle" | "loading" | "ready" | "error";
}
const initialState: ModelState = {
  selectedModel: "",
  selectedModelGroup: "",
  catalog: [],
  catalogStatus: "idle",
};
const slice = createSlice({
  name: "model",
  initialState,
  reducers: {
    setSelectedModel(state, { payload }: PayloadAction<string>) {
      const model = state.catalog.find((m) => m.title === payload);
      if (!model) return;
      state.selectedModel = payload;
      state.selectedModelGroup = model.groupId;
    },
    restoreChatModel(state, { payload }: PayloadAction<string>) {
      state.selectedModel = payload;
      state.selectedModelGroup =
        state.catalog.find((m) => m.title === payload)?.groupId || "";
    },
    setSelectedModelGroup(state, { payload }: PayloadAction<string>) {
      if (state.catalog.some((m) => m.groupId === payload))
        state.selectedModelGroup = payload;
    },
    catalogLoading(state) {
      state.catalogStatus = "loading";
    },
    catalogFailed(state) {
      state.catalogStatus = "error";
    },
    catalogLoaded(state, { payload }: PayloadAction<CatalogModel[]>) {
      state.catalog = payload;
      state.catalogStatus = "ready";
      if (!state.selectedModel) {
        const m =
          payload.find((m) => m.default && m.minRole === "user") ||
          payload.find((m) => m.minRole === "user");
        if (m) state.selectedModel = m.title;
      }
      state.selectedModelGroup =
        payload.find((m) => m.title === state.selectedModel)?.groupId || "";
    },
  },
});
export const {
  setSelectedModel,
  setSelectedModelGroup,
  restoreChatModel,
  catalogLoading,
  catalogFailed,
  catalogLoaded,
} = slice.actions;
export const modelReducer = slice.reducer;
