import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { loginUser, logoutUser, refreshUser } from "./operations";

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  avatar?: string;
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoggedIn: boolean;
  error: string | null;
  sessionExpired: boolean;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isLoggedIn: false,
  error: null,
  sessionExpired: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetToken(state, { payload }: PayloadAction<string | null>) {
      state.accessToken = payload;
      state.isLoggedIn = Boolean(payload);
    },
    refreshError(state) {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
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
        state.accessToken = payload.accessToken;
        state.refreshToken = payload.refreshToken;
        state.isLoggedIn = true;
        state.error = null;
        state.sessionExpired = false;
      })
      .addCase(loginUser.rejected, (state, { payload }) => {
        state.error = payload ?? "Login failed";
      })
      .addCase(refreshUser.fulfilled, (state, { payload }) => {
        state.accessToken = payload;
        state.isLoggedIn = true;
      })
      .addCase(refreshUser.rejected, (state) => {
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isLoggedIn = false;
        state.sessionExpired = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isLoggedIn = false;
        state.error = null;
        state.sessionExpired = false;
      }),
});

export const { resetToken, refreshError, clearSessionExpired } =
  authSlice.actions;
export const authReducer = authSlice.reducer;
