"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Socket } from "socket.io-client";

import { readAccessToken } from "@/lib/authTokenVault";
import { env } from "@/lib/env";
import { getOrCreateSocket } from "@/lib/socketClient";
import { useAppSelector } from "@/redux/hooks";
import {
  selectAccessTokenReady,
  selectIsLoggedIn,
} from "@/redux/auth/selectors";

type SocketStatus = "disabled" | "disconnected" | "connecting" | "connected" | "error";

type SocketContextValue = {
  socket: Socket | null;
  status: SocketStatus;
  lastError: string | null;
};

const SocketContext = createContext<SocketContextValue | undefined>(undefined);

function resolveSocketConfig() {
  if (!env.socketUrl) return null;
  return { url: env.socketUrl, path: env.socketPath ?? undefined };
}

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const accessTokenReady = useAppSelector(selectAccessTokenReady);
  const socketConfig = useMemo(() => resolveSocketConfig(), []);
  const allowGuest = env.socketAllowGuest;

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

    if ((!isLoggedIn || !accessTokenReady) && !allowGuest) {
      liveSocket.disconnect();
      return;
    }

    // Socket.IO invokes this callback for every handshake/reconnect, so a
    // refreshed token is never captured in a stale React closure.
    liveSocket.auth = (authorize) => {
      const token = readAccessToken();
      authorize(token ? { token } : {});
    };

    liveSocket.connect();

    return () => {
      // keep singleton instance, but stop network activity if provider unmounts
      liveSocket.disconnect();
    };
  }, [socketConfig, isLoggedIn, accessTokenReady, allowGuest]);

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
