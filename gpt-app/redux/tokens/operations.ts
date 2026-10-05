import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/helpers/api";
import type { RootState, AppDispatch } from "../store";
import { requestBalance } from "@/lib/balance/balanceRequests";
import type { BalanceSnapshot } from "@/lib/balance/balanceProtocol";
import type { ClaimTokenResponse } from "@/types/api.types";

/** Claim the weekly bonus tokens (claimTokens.md: POST /users/claim-token). */
export const claimTokens = createAsyncThunk<
  ClaimTokenResponse,
  void,
  { rejectValue: string }
>("tokens/claim", async (_, thunkApi) => {
  try {
    const result = await api.claimToken();
    (thunkApi.dispatch as AppDispatch)(refreshCurrentBalance());
    return result;
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


export const refreshBalance = createAsyncThunk<BalanceSnapshot, { userId: string }, { state: RootState }>(
  "tokens/refreshBalance", async ({ userId }, { getState }) => {
    const snapshot = await requestBalance(userId);
    const auth = getState().auth;
    if (auth.user?.id !== userId || !auth.isLoggedIn || !auth.accessTokenReady) {
      throw new Error("Balance refresh cancelled");
    }
    return snapshot;
  },
  { condition: ({ userId }, { getState }) => {
    const auth = getState().auth;
    return auth.user?.id === userId && auth.isLoggedIn && auth.accessTokenReady;
  } },
);

export const refreshCurrentBalance = () => (dispatch: AppDispatch, getState: () => RootState) => {
  const userId = getState().auth.user?.id;
  return userId ? dispatch(refreshBalance({ userId })) : undefined;
};
