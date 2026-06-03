export interface BackendAuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    email: string;
    name: string;
    avatar?: string;
    appTokens?: number;
    role?: string;
    dateClaimToken?: string;
    nextDateClaimToken?: string;
  };
}
