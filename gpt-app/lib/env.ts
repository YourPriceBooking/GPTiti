import { resolveBackendConfig } from "@/config/backend.config";

const required = (value: string | undefined, name: string): string => {
  const trimmed = value?.trim();
  if (trimmed) return trimmed;
  throw new Error(
    `[env] ${name} is not set. Add it to .env.local before building the app.`,
  );
};

export const env = {
  ...resolveBackendConfig(
    process.env.NEXT_PUBLIC_BACKEND_API_URL,
    process.env.NEXT_PUBLIC_SOCKET_URL,
    process.env.NEXT_PUBLIC_SOCKET_PATH,
  ),
  googleClientId: required(
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    "NEXT_PUBLIC_GOOGLE_CLIENT_ID",
  ),
  socketAllowGuest: process.env.NEXT_PUBLIC_SOCKET_ALLOW_GUEST === "true",
} as const;
