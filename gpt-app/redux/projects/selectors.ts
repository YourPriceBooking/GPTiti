import type { RootState } from "../store";

export const selectProjectList = (state: RootState) => state.projects.list;
