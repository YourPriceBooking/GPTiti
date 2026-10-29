/** Public deployment defaults; explicit environment overrides support local/staging. */
export const DEFAULT_BACKEND_API_URL = "https://gptiti.com/api/";
export const DEFAULT_SOCKET_PATH = "/socket.io";

export function resolveBackendConfig(
  apiUrl?: string,
  socketUrl?: string,
  socketPath?: string,
) {
  const backendApiUrl = `${(apiUrl?.trim() || DEFAULT_BACKEND_API_URL).replace(/\/+$/, "")}/`;
  return {
    backendApiUrl,
    // An API pathname is not a Socket.IO namespace or transport path.
    socketUrl: socketUrl?.trim() || new URL(backendApiUrl).origin,
    socketPath: socketPath?.trim() || DEFAULT_SOCKET_PATH,
  };
}
