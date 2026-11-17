import { createAsyncThunk } from "@reduxjs/toolkit";
import { AuthSessionChangedError, beginLogout, completeLogout, endLogout, getAuthGeneration, isCurrentAuthGeneration, isLogoutPending, runAuthRequest } from "@/lib/authSession";

import { axiosInstance } from "@/lib/axiosInstance";
import {
  clearAccessToken,
  storeAccessToken,
} from "@/lib/authTokenVault";
import type {
  AuthSession,
  BackendAuthResponse,
} from "@/types/google.types";

const AUTH_TIMEOUT = 15_000;
type AuthThunkConfig = { rejectValue: string; rejectedMeta: { sessionSuperseded?: boolean } };

export const loginUser = createAsyncThunk<
  AuthSession,
  string,
  AuthThunkConfig
>("auth/loginWithGoogle", async (idToken, thunkApi) => {
  const generation = getAuthGeneration();
  try {
    const { data } = await runAuthRequest(() => axiosInstance.post<BackendAuthResponse>(
      "/users/user", { idToken }, { timeout: AUTH_TIMEOUT },
    ));
    if (!isCurrentAuthGeneration(generation)) throw new AuthSessionChangedError();
    storeAccessToken(data.accessToken);
    return { user: data.user };
  } catch (e) {
    if (e instanceof AuthSessionChangedError) return thunkApi.rejectWithValue("Session changed", { sessionSuperseded: true });
    const err = e as { response?: { status?: number; data?: { message?: string } } };
    if (err.response?.status === 401) {
      return thunkApi.rejectWithValue("Invalid Google token", {});
    }
    if (err.response?.status === 500) {
      return thunkApi.rejectWithValue("Server error, please try again later", {});
    }
    return thunkApi.rejectWithValue(err.response?.data?.message || "Login failed", {});
  }
});

export const refreshUser = createAsyncThunk<
  void,
  void,
  AuthThunkConfig
>("auth/refresh", async (_, thunkApi) => {
  const generation = getAuthGeneration();
  try {
    const { data } = await runAuthRequest(() => axiosInstance.post<{ accessToken: string }>(
      "/users/refresh", undefined, { timeout: AUTH_TIMEOUT },
    ));
    if (!isCurrentAuthGeneration(generation)) throw new AuthSessionChangedError();
    storeAccessToken(data.accessToken);
  } catch (e) {
    if (e instanceof AuthSessionChangedError) return thunkApi.rejectWithValue("Session changed", { sessionSuperseded: true });
    clearAccessToken();
    const err = e as { response?: { status?: number } };
    if (err.response?.status === 403) {
      return thunkApi.rejectWithValue("Session expired, please login again", {});
    }
    return thunkApi.rejectWithValue("Failed to refresh token", {});
  }
});

export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  "auth/logout",
  async (_, thunkApi) => {
    await beginLogout();
    try {
      await axiosInstance.post("/users/logout", undefined, { timeout: AUTH_TIMEOUT });
      completeLogout();
      clearAccessToken();
    } catch {
      // Do not claim success when the HttpOnly cookie could not be cleared.
      // Keep the account/menu available so the user can retry.
      return thunkApi.rejectWithValue("Could not log out. Check your connection and try again.");
    } finally {
      endLogout();
    }
  },
  { condition: () => !isLogoutPending() },
);
