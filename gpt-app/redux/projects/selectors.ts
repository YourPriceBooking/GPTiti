import type { RootState } from "../store";

export const selectProjectList = (state: RootState) => state.projects.list;
export const selectProjectsStatus = (state: RootState) => state.projects.status;
