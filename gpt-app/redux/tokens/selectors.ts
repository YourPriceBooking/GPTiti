import type { RootState } from "../store";

export const selectBalance = (state: RootState) => state.tokens.balance;
export const selectNextClaimTime = (state: RootState) =>
  state.tokens.nextClaimTime;
export const selectCountdown = (state: RootState) => state.tokens.countdown;
export const selectClaiming = (state: RootState) => state.tokens.claiming;
export const selectClaimError = (state: RootState) => state.tokens.claimError;
