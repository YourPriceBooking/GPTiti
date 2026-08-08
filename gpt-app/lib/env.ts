const required = (value: string | undefined, name: string): string => {
  const trimmed = value?.trim();
  if (trimmed) return trimmed;
  throw new Error(
    `[env] ${name} is not set. Add it to .env.local before building the app.`,
  );
};

const optional = (value: string | undefined): string | null =>
  value?.trim() || null;

export const env = {
  backendApiUrl: required(
    process.env.NEXT_PUBLIC_BACKEND_API_URL,
    "NEXT_PUBLIC_BACKEND_API_URL",
  ),
  googleClientId: required(
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    "NEXT_PUBLIC_GOOGLE_CLIENT_ID",
  ),
  socketUrl: optional(process.env.NEXT_PUBLIC_SOCKET_URL),
  socketPath: optional(process.env.NEXT_PUBLIC_SOCKET_PATH),
  socketAllowGuest: process.env.NEXT_PUBLIC_SOCKET_ALLOW_GUEST === "true",
} as const;
