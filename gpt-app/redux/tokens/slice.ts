import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface TokensState {
  balance: number;
  /** ISO string so persist stays serialisable */
  nextClaimTime: string | null;
  countdown: string;
}

const initialState: TokensState = {
  balance: 10000,
  nextClaimTime: null,
  countdown: "7 days 00:00",
};

const tokensSlice = createSlice({
  name: "tokens",
  initialState,
  reducers: {
    claim(state) {
      const next = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      state.balance += 10000;
      state.nextClaimTime = next.toISOString();
    },
    setCountdown(state, { payload }: PayloadAction<string>) {
      state.countdown = payload;
    },
    setBalance(state, { payload }: PayloadAction<number>) {
      state.balance = payload;
    },
  },
});

export const { claim, setCountdown, setBalance } = tokensSlice.actions;
export const tokensReducer = tokensSlice.reducer;
