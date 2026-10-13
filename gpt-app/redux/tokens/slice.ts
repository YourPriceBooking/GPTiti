import { createSlice, isAnyOf, type PayloadAction } from "@reduxjs/toolkit";
import { claimTokens, refreshBalance } from "./operations";
import { loginUser, logoutUser, refreshUser } from "../auth/operations";
import { refreshError } from "../auth/slice";
import { canApplyBalance, readBalanceSnapshot, type BalanceSnapshot } from "@/lib/balance/balanceProtocol";

interface TokensState {
  balance: number;
  reservedTokens: number | null;
  availableTokens: number;
  maxTransferTokens: number;
  ownerId: string | null;
  balanceVersion: number;
  balanceReady: boolean;
  nextClaimTime: string | null;
  countdown: string;
  claiming: boolean;
  claimError: string | null;
}
const initialState: TokensState = {
  balance: 0, reservedTokens: null, availableTokens: 0, maxTransferTokens: 0, ownerId: null, balanceVersion: -1, balanceReady: false,
  nextClaimTime: null, countdown: "Available now", claiming: false, claimError: null,
};

function applySnapshot(state: TokensState, snapshot: BalanceSnapshot) {
  if (!canApplyBalance(state.ownerId, state.balanceVersion, snapshot)) return;
  // Legacy transfer receipts omit holds; wait for the authoritative GET rather
  // than replacing a known reservation snapshot with incomplete information.
  if (state.reservedTokens !== null && snapshot.reservedAppTokens === undefined) return;
  state.reservedTokens = snapshot.reservedAppTokens ?? null;
  state.availableTokens = snapshot.availableTokens ?? snapshot.appTokens;
  state.maxTransferTokens = snapshot.maxTransferTokens ?? Math.max(0, snapshot.appTokens);
  state.balance = snapshot.appTokens;
  state.balanceVersion = snapshot.balanceVersion;
  state.balanceReady = true;
  if (snapshot.nextClaimDate !== undefined) state.nextClaimTime = snapshot.nextClaimDate;
}

const tokensSlice = createSlice({
  name: "tokens", initialState,
  reducers: {
    setCountdown(state, { payload }: PayloadAction<string>) { state.countdown = payload; },
    setBalanceOwner(state, { payload }: PayloadAction<string>) {
      if (state.ownerId === payload) return;
      Object.assign(state, initialState, { ownerId: payload });
    },
    applyBalanceSnapshot(state, { payload }: PayloadAction<BalanceSnapshot>) { applySnapshot(state, payload); },
  },
  extraReducers: (builder) => builder
    .addCase(loginUser.fulfilled, (state, { payload }) => {
      Object.assign(state, initialState, { ownerId: payload.user.id });
      if (typeof payload.user.appTokens === "number") state.balance = payload.user.appTokens;
      state.nextClaimTime = payload.user.nextDateClaimToken ?? null;
    })
    .addCase(refreshBalance.fulfilled, (state, { payload }) => { applySnapshot(state, payload); })
    .addCase(claimTokens.pending, (state) => { state.claiming = true; state.claimError = null; })
    .addCase(claimTokens.fulfilled, (state, { payload }) => {
      state.claiming = false;
      const snapshot = readBalanceSnapshot(payload);
      if (snapshot) applySnapshot(state, snapshot);
    })
    .addCase(claimTokens.rejected, (state, { payload }) => {
      state.claiming = false;
      state.claimError = payload ?? "Failed to claim tokens";
    })
    .addMatcher(isAnyOf(logoutUser.fulfilled, refreshError, refreshUser.rejected),
      (state) => { Object.assign(state, initialState); }),
});
export const { setCountdown, setBalanceOwner, applyBalanceSnapshot } = tokensSlice.actions;
export const tokensReducer = tokensSlice.reducer;
