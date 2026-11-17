// Coordinate cookie-writing auth requests with logout. Waiting for them prevents
// a late Set-Cookie response from replacing the cookie cleared by logout.
let generation = 0;
let accountGeneration = 0;
let loggingOut = false;
let inFlight: Promise<void> | null = null;
const authRequests = new Set<Promise<unknown>>();

export class AuthSessionChangedError extends Error {
  constructor() { super("Auth session changed"); this.name = "AuthSessionChangedError"; }
}
export const getAuthGeneration = () => generation;
export const getAccountGeneration = () => accountGeneration;
export const completeLogout = () => { accountGeneration += 1; };
export const isLogoutPending = () => loggingOut;
export const isCurrentAuthGeneration = (value: number) => value === generation && !loggingOut;

export async function runAuthRequest<T>(start: () => Promise<T>): Promise<T> {
  if (loggingOut) throw new AuthSessionChangedError();
  const started = generation;
  const request = start();
  authRequests.add(request);
  try {
    const result = await request;
    if (!isCurrentAuthGeneration(started)) throw new AuthSessionChangedError();
    return result;
  } catch (error) {
    if (!isCurrentAuthGeneration(started)) throw new AuthSessionChangedError();
    throw error;
  } finally {
    authRequests.delete(request);
  }
}

export async function beginLogout(): Promise<void> {
  loggingOut = true;
  generation += 1;
  // Auth HTTP calls have a timeout; a failed refresh must not prevent logout.
  await Promise.allSettled([...authRequests]);
}
export function endLogout() { loggingOut = false; }

export const runSingleFlightRefresh = (start: () => Promise<void>): Promise<void> => {
  if (loggingOut) return Promise.reject(new AuthSessionChangedError());
  if (inFlight) return inFlight;
  const started = generation;
  const request = start().then(() => {
    if (!isCurrentAuthGeneration(started)) throw new AuthSessionChangedError();
  });
  inFlight = request;
  const release = () => { if (inFlight === request) inFlight = null; };
  request.then(release, release);
  return request;
};
