import type { RootState } from "../store";

export const selectUser = (state: RootState) => state.auth.user;
export const selectAccessToken = (state: RootState) => state.auth.accessToken;
export const selectIsLoggedIn = (state: RootState) => state.auth.isLoggedIn;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectSessionExpired = (state: RootState) =>
  state.auth.sessionExpired;
