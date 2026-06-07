import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "@/lib/axiosInstance";
import type { BackendAuthResponse } from "@/types/google.types";

export const loginUser = createAsyncThunk<
  BackendAuthResponse,
  string,
  { rejectValue: string }
>("auth/loginWithGoogle", async (idToken, thunkApi) => {
  try {
    const { data } = await axiosInstance.post<BackendAuthResponse>(
      "/users/user",
      { idToken },
    );
    return data;
  } catch (e) {
    const err = e as { response?: { status?: number; data?: { message?: string } } };
    if (err.response?.status === 401) {
      return thunkApi.rejectWithValue("Invalid Google token");
    }
    if (err.response?.status === 500) {
      return thunkApi.rejectWithValue("Server error, please try again later");
    }
    return thunkApi.rejectWithValue(err.response?.data?.message || "Login failed");
  }
});

export const refreshUser = createAsyncThunk<
  string,
  void,
  { rejectValue: string }
>("auth/refresh", async (_, thunkApi) => {
  try {
    const { data } = await axiosInstance.post<{ accessToken: string }>(
      "/users/refresh",
    );
    return data.accessToken;
  } catch (e) {
    const err = e as { response?: { status?: number } };
    if (err.response?.status === 403) {
      return thunkApi.rejectWithValue("Session expired, please login again");
    }
    return thunkApi.rejectWithValue("Failed to refresh token");
  }
});

export const logoutUser = createAsyncThunk<void, void>(
  "auth/logout",
  async () => {
    try {
      await axiosInstance.get("/users/logout");
    } catch {
      // ignore — logout still proceeds locally
    }
  },
);
