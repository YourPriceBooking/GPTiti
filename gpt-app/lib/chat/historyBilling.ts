// History tokens counts provider output; it must never be labelled as TITI.
export function historyAppTokens(message: {
  role: string;
  billing?: { appTokensSpent?: unknown } | null;
  meta?: { appTokens?: unknown } | null;
}): number | undefined {
  if (message.role !== 'assistant') return undefined;
  const value = message.billing?.appTokensSpent ?? message.meta?.appTokens;
  return typeof value === 'number' && Number.isFinite(value) && value >= 0
    ? value : undefined;
}
