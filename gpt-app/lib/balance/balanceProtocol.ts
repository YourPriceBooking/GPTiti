export interface BalanceSnapshot {
  userId: string;
  appTokens: number;
  balanceVersion: number;
  nextClaimDate?: string | null;
}

export function readBalanceSnapshot(value: unknown): BalanceSnapshot | null {
  if (!value || typeof value !== "object") return null;
  const data = value as Record<string, unknown>;
  if (typeof data.userId !== "string" || !data.userId ||
      !Number.isSafeInteger(data.appTokens) || !Number.isSafeInteger(data.balanceVersion) ||
      (data.balanceVersion as number) < 0) return null;
  if (data.nextClaimDate !== undefined && data.nextClaimDate !== null &&
      typeof data.nextClaimDate !== "string") return null;
  return {
    userId: data.userId, appTokens: data.appTokens as number,
    balanceVersion: data.balanceVersion as number,
    ...(data.nextClaimDate !== undefined ? { nextClaimDate: data.nextClaimDate as string | null } : {}),
  };
}

export function canApplyBalance(
  ownerId: string | null, version: number, snapshot: BalanceSnapshot,
): boolean {
  return snapshot.userId === ownerId && snapshot.balanceVersion >= version;
}
