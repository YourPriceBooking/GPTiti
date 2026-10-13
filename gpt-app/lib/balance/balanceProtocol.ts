export interface BalanceSnapshot {
  userId: string;
  appTokens: number;
  balanceVersion: number;
  reservedAppTokens?: number;
  availableTokens?: number;
  maxTransferTokens?: number;
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
  const hasReservations = ["reservedAppTokens", "availableTokens", "maxTransferTokens"].some((key) => data[key] !== undefined);
  if (hasReservations && (
    !Number.isSafeInteger(data.reservedAppTokens) || (data.reservedAppTokens as number) < 0 ||
    !Number.isSafeInteger(data.availableTokens) || !Number.isSafeInteger(data.maxTransferTokens) ||
    data.availableTokens !== (data.appTokens as number) - (data.reservedAppTokens as number) ||
    data.maxTransferTokens !== Math.max(0, data.availableTokens as number)
  )) return null;
  return {
    ...(hasReservations ? { reservedAppTokens: data.reservedAppTokens as number,
      availableTokens: data.availableTokens as number, maxTransferTokens: data.maxTransferTokens as number } : {}),
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
