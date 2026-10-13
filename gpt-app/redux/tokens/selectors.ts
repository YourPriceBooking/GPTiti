import type { RootState } from "../store";

export const selectBalance = (state: RootState) => state.tokens.balance;
export const selectNextClaimTime = (state: RootState) =>
  state.tokens.nextClaimTime;
export const selectCountdown = (state: RootState) => state.tokens.countdown;
export const selectClaiming = (state: RootState) => state.tokens.claiming;
export const selectClaimError = (state: RootState) => state.tokens.claimError;

export const selectBalanceReady = (state: RootState) =>
  state.tokens.balanceReady && state.tokens.ownerId === state.auth.user?.id;

export const selectReservedTokens = (state: RootState) => selectBalanceReady(state) ? state.tokens.reservedTokens ?? 0 : 0;
export const selectAvailableTokens = (state: RootState) => state.tokens.availableTokens;
export const selectMaxTransferTokens = (state: RootState) => state.tokens.maxTransferTokens;
