import { io, type Socket } from "socket.io-client";

type SocketClientOptions = {
  url: string;
  path?: string;
};

let socketSingleton: Socket | null = null;
let socketKey: string | null = null;

export function getOrCreateSocket({ url, path }: SocketClientOptions): Socket {
  const key = `${url}@@${path ?? ""}`;

  if (socketSingleton && socketKey !== key) {
    socketSingleton.disconnect();
    socketSingleton = null;
  }

  if (!socketSingleton) {
    socketSingleton = io(url, {
      path,
      autoConnect: false,
      transports: ["websocket", "polling"],
      reconnectionAttempts: 3,
      reconnectionDelay: 2000,
    });
    socketKey = key;
  }

  return socketSingleton;
}

export function disconnectSocket() {
  socketSingleton?.disconnect();
}

export function ensureSocketConnected(
  socket: Socket,
  timeoutMs = 8000,
): Promise<void> {
  if (socket.connected) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const cleanup = () => {
      clearTimeout(timer);
      socket.off("connect", onConnect);
      socket.off("connect_error", onError);
    };
    const onConnect = () => {
      cleanup();
      resolve();
    };
    const onError = (error: Error) => {
      cleanup();
      reject(error);
    };
    const timer = setTimeout(() => {
      cleanup();
      reject(new Error("Timed out while connecting to chat."));
    }, timeoutMs);

    socket.once("connect", onConnect);
    socket.once("connect_error", onError);
    socket.connect();
  });
}
