import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/helpers/api";
import type { ClaimTokenResponse } from "@/types/api.types";

/** Claim the weekly bonus tokens (claimTokens.md: POST /users/claim-token). */
export const claimTokens = createAsyncThunk<
  ClaimTokenResponse,
  void,
  { rejectValue: string }
>("tokens/claim", async (_, thunkApi) => {
  try {
    return await api.claimToken();
  } catch (e) {
    const err = e as {
      response?: { status?: number; data?: { message?: string } };
    };
    if (err.response?.status === 429) {
      return thunkApi.rejectWithValue("Too many requests, try later");
    }
    return thunkApi.rejectWithValue(
      err.response?.data?.message ?? "Failed to claim tokens",
    );
  }
});
