export type HistoryMode = "general" | "detailed";
export type HistoryType =
  | "purchase"
  | "received"
  | "sent"
  | "bonus"
  | "usage"
  | "refund"
  | "adjustment";
export type HistoryFilter = "all" | "nonusage" | HistoryType;
export interface HistoryQuery {
  mode?: HistoryMode;
  type?: HistoryFilter;
  from?: string;
  to?: string;
  timeZone: string;
  limit?: string;
  cursor?: string;
}
export interface HistoryActivity {
  id: string;
  type: HistoryType;
  kind: string;
  at: string;
  day: string;
  amount: number;
  balanceAfter: number;
  balanceVersion: number;
  status: "confirmed";
  model: string | null;
  conversationId: string | null;
  chat: string | null;
  peer: string | null;
  payment: {
    id: string | null;
    amountMinor: number | null;
    currency: string | null;
  } | null;
  bonusReason: "registration" | "weekly" | null;
  detailsAvailable: boolean;
}
export interface HistoryDay {
  day: string;
  operationCount: number;
  activity: HistoryActivity[];
  nextActivityCursor: string | null;
  activityQuery: HistoryQuery;
  usage: {
    amount: number;
    chargeCount: number;
    modelCount: number;
    unknownModelCharges: number;
  } | null;
}
export interface GeneralHistory {
  mode: "general";
  timeZone: string;
  days: HistoryDay[];
  nextCursor: string | null;
}
export interface DetailedHistory {
  mode: "detailed";
  timeZone: string;
  items: HistoryActivity[];
  nextCursor: string | null;
}
export type HistoryPage = GeneralHistory | DetailedHistory;
export interface HistorySummary {
  incoming: number;
  outgoing: number;
  netChange: number;
  operationCount: number;
  from: string | null;
  to: string | null;
  timeZone: string;
  coverage: {
    source: "token-ledger";
    firstRecordedAt: string | null;
    includesPreLedgerHistory: false;
  };
}
