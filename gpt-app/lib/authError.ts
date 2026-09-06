export function isAuthExpiredError(error: unknown): boolean {
  if (typeof error === "string") return error === "jwt expired";

  const e = error as {
    response?: { status?: number; data?: { message?: string } };
    data?: { code?: string; message?: string; status?: number };
    code?: string;
    message?: string;
  };

  return (
    e?.response?.status === 401 ||
    e?.response?.data?.message === "jwt expired" ||
    e?.data?.status === 401 ||
    e?.data?.code === "TOKEN_EXPIRED" ||
    e?.data?.code === "JWT_EXPIRED" ||
    e?.code === "TOKEN_EXPIRED" ||
    e?.code === "JWT_EXPIRED" ||
    e?.data?.message === "jwt expired" ||
    e?.message === "jwt expired"
  );
}

export function isSocketAuthError(error: unknown): boolean {
  if (isAuthExpiredError(error)) return true;

  const e = error as {
    data?: { code?: string; message?: string; status?: number };
    code?: string;
    message?: string;
  };
  const code = (e?.data?.code ?? e?.code ?? "").toUpperCase();
  const message = (e?.data?.message ?? e?.message ?? String(error)).toLowerCase();

  return (
    e?.data?.status === 401 ||
    code === "UNAUTHORIZED" ||
    code === "UNAUTHENTICATED" ||
    code === "AUTHENTICATION_ERROR" ||
    message === "unauthorized" ||
    message.startsWith("unauthorized:") ||
    message === "unauthenticated" ||
    message.includes("invalid jwt") ||
    message.includes("invalid token") ||
    message.includes("token expired")
  );
}
