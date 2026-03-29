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
    });
    socketKey = key;
  }

  return socketSingleton;
}

export function disconnectSocket() {
  socketSingleton?.disconnect();
}
