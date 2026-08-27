export interface AuthUser {
  id: number;
  email: string;
  name: string;
  avatar?: string;
  appTokens?: number;
  role?: string;
  dateClaimToken?: string;
  nextDateClaimToken?: string;
}

/** Raw backend boundary. Never return this object from a Redux thunk. */
export interface BackendAuthResponse {
  accessToken: string;
  user: AuthUser;
}

/** Safe application payload: contains no credential material. */
export interface AuthSession {
  user: AuthUser;
}
