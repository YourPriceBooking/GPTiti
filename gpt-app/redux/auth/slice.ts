import { createSlice } from "@reduxjs/toolkit";
import { loginUser, logoutUser, refreshUser } from "./operations";
import type { AuthUser } from "@/types/google.types";

interface AuthState {
  user: AuthUser | null;
  accessTokenReady: boolean;
  isLoggedIn: boolean;
  error: string | null;
  sessionExpired: boolean;
}

const initialState: AuthState = {
  user: null,
  accessTokenReady: false,
  isLoggedIn: false,
  error: null,
  sessionExpired: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    refreshError(state) {
      state.user = null;
      state.accessTokenReady = false;
      state.isLoggedIn = false;
      state.sessionExpired = true;
    },
    clearSessionExpired(state) {
      state.sessionExpired = false;
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(loginUser.fulfilled, (state, { payload }) => {
        state.user = payload.user;
        state.accessTokenReady = true;
        state.isLoggedIn = true;
        state.error = null;
        state.sessionExpired = false;
      })
      .addCase(loginUser.rejected, (state, { payload }) => {
        state.error = payload ?? "Login failed";
      })
      .addCase(refreshUser.fulfilled, (state) => {
        state.accessTokenReady = true;
        state.isLoggedIn = true;
      })
      .addCase(refreshUser.rejected, (state) => {
        state.user = null;
        state.accessTokenReady = false;
        state.isLoggedIn = false;
        state.sessionExpired = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.accessTokenReady = false;
        state.isLoggedIn = false;
        state.error = null;
        state.sessionExpired = false;
      }),
});

export const { refreshError, clearSessionExpired } = authSlice.actions;
export const authReducer = authSlice.reducer;
