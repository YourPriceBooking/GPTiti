"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Socket } from "socket.io-client";

import { getOrCreateSocket } from "@/lib/socketClient";
import { useAppSelector } from "@/redux/hooks";
import { selectAccessToken } from "@/redux/auth/selectors";

type SocketStatus = "disabled" | "disconnected" | "connecting" | "connected" | "error";

type SocketContextValue = {
  socket: Socket | null;
  status: SocketStatus;
  lastError: string | null;
};

const SocketContext = createContext<SocketContextValue | undefined>(undefined);

function resolveSocketConfig() {
  const url = process.env.NEXT_PUBLIC_SOCKET_URL;
  const path = process.env.NEXT_PUBLIC_SOCKET_PATH;

  if (!url) return null;

  return { url, path };
}

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const accessToken = useAppSelector(selectAccessToken);
  const socketConfig = useMemo(() => resolveSocketConfig(), []);
  const allowGuest = process.env.NEXT_PUBLIC_SOCKET_ALLOW_GUEST === "true";

  const [status, setStatus] = useState<SocketStatus>(() =>
    socketConfig ? "disconnected" : "disabled"
  );
  const [lastError, setLastError] = useState<string | null>(null);

  // Expose a stable instance to consumers (do not mutate this value in render).
  const socket = useMemo<Socket | null>(() => {
    if (!socketConfig) return null;
    return getOrCreateSocket(socketConfig);
  }, [socketConfig]);

  useEffect(() => {
    if (!socketConfig) {
      if (process.env.NODE_ENV !== "production") {
        
        console.warn(
          "Socket.IO disabled: NEXT_PUBLIC_SOCKET_URL is not set (optionally set NEXT_PUBLIC_SOCKET_PATH)."
        );
      }
      return;
    }

    const liveSocket = getOrCreateSocket(socketConfig);

    const onConnect = () => {
      setStatus("connected");
      setLastError(null);
    };

    const onDisconnect = () => {
      setStatus("disconnected");
    };

    const onConnectError = (err: unknown) => {
      setStatus("error");
      setLastError(err instanceof Error ? err.message : String(err));
    };

    liveSocket.on("connect", onConnect);
    liveSocket.on("disconnect", onDisconnect);
    liveSocket.on("connect_error", onConnectError);

    return () => {
      liveSocket.off("connect", onConnect);
      liveSocket.off("disconnect", onDisconnect);
      liveSocket.off("connect_error", onConnectError);
    };
  }, [socketConfig]);

  useEffect(() => {
    if (!socketConfig) return;

    const liveSocket = getOrCreateSocket(socketConfig);

    if (!accessToken && !allowGuest) {
      liveSocket.disconnect();
      return;
    }

    // update auth token and (re)connect
    liveSocket.auth = accessToken ? { token: accessToken } : {};

    liveSocket.connect();

    return () => {
      // keep singleton instance, but stop network activity if provider unmounts
      liveSocket.disconnect();
    };
  }, [socketConfig, accessToken, allowGuest]);

  const value = useMemo<SocketContextValue>(
    () => ({ socket, status, lastError }),
    [socket, status, lastError]
  );

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
}

export function useSocket() {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error("useSocket must be used within SocketProvider");
  return ctx;
}
