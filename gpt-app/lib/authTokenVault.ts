let accessToken: string | null = null;

export const readAccessToken = (): string | null => accessToken;

export const storeAccessToken = (token: unknown): void => {
  if (typeof token !== "string" || token.trim().length === 0) {
    accessToken = null;
    throw new Error("Authentication response did not contain an access token.");
  }
  accessToken = token;
};

export const clearAccessToken = (): void => {
  accessToken = null;
};
