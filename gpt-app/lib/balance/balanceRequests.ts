import { api } from "@/helpers/api";
import { readBalanceSnapshot, type BalanceSnapshot } from "./balanceProtocol";
import { createRefreshQueue } from "./refreshQueue";

let owner: string | null = null;
let queue: ReturnType<typeof createRefreshQueue<BalanceSnapshot>> | null = null;

export function cancelBalanceRequests(userId: string) {
  if (owner !== userId) return;
  queue?.cancel();
  queue = null;
  owner = null;
}

export function requestBalance(userId: string) {
  if (owner !== userId || !queue) {
    queue?.cancel();
    owner = userId;
    queue = createRefreshQueue(async (signal) => {
      const snapshot = readBalanceSnapshot(await api.getBalance(signal));
      if (!snapshot || snapshot.userId !== userId) throw new Error("Invalid balance response");
      return snapshot;
    });
  }
  return queue.request();
}
