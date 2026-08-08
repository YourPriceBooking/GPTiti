const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const readNonEmptyString = (value: unknown): string | null =>
  typeof value === "string" && value.trim().length > 0 ? value : null;

const readEnvelopeField = (source: unknown, key: string): unknown => {
  if (!isRecord(source)) return undefined;
  if (source[key] !== undefined) return source[key];
  const { payload } = source;
  return isRecord(payload) ? payload[key] : undefined;
};

export const readErrorMessage = (err: unknown, fallback: string): string => {
  if (typeof err === "string") return readNonEmptyString(err) ?? fallback;
  if (err instanceof Error) return readNonEmptyString(err.message) ?? fallback;
  if (!isRecord(err)) return fallback;

  const { response } = err;
  if (isRecord(response) && isRecord(response.data)) {
    const apiMessage = readNonEmptyString(response.data.message);
    if (apiMessage) return apiMessage;
  }

  return (
    readNonEmptyString(readEnvelopeField(err, "message")) ??
    readNonEmptyString(readEnvelopeField(err, "error")) ??
    fallback
  );
};

export { isRecord, readEnvelopeField, readNonEmptyString };
