import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { claimTokens } from "./operations";
import { loginUser, logoutUser } from "../auth/operations";

interface TokensState {
  balance: number;
  /** ISO string so persist stays serialisable */
  nextClaimTime: string | null;
  countdown: string;
  claiming: boolean;
  claimError: string | null;
}

const initialState: TokensState = {
  balance: 10000,
  nextClaimTime: null,
  countdown: "Available now",
  claiming: false,
  claimError: null,
};

const tokensSlice = createSlice({
  name: "tokens",
  initialState,
  reducers: {
    setCountdown(state, { payload }: PayloadAction<string>) {
      state.countdown = payload;
    },
    setBalance(state, { payload }: PayloadAction<number>) {
      state.balance = payload;
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(loginUser.fulfilled, (state, { payload }) => {
        if (typeof payload.user.appTokens === "number") {
          state.balance = payload.user.appTokens;
        }
        state.nextClaimTime = payload.user.nextClaimDate ?? null;
        state.claimError = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.balance = initialState.balance;
        state.nextClaimTime = null;
        state.claimError = null;
      })
      .addCase(claimTokens.pending, (state) => {
        state.claiming = true;
        state.claimError = null;
      })
      .addCase(claimTokens.fulfilled, (state, { payload }) => {
        state.claiming = false;
        state.balance = payload.appTokens;
        state.nextClaimTime = payload.nextClaimDate;
      })
      .addCase(claimTokens.rejected, (state, { payload }) => {
        state.claiming = false;
        state.claimError = payload ?? "Failed to claim tokens";
      }),
});

export const { setCountdown, setBalance } = tokensSlice.actions;
export const tokensReducer = tokensSlice.reducer;
