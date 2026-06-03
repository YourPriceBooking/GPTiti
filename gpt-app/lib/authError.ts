export function isAuthExpiredError(error: unknown): boolean {
  if (typeof error === "string") return error === "jwt expired";

  const e = error as {
    response?: { status?: number; data?: { message?: string } };
    message?: string;
  };

  return (
    e?.response?.status === 401 ||
    e?.response?.data?.message === "jwt expired" ||
    e?.message === "jwt expired"
  );
}
