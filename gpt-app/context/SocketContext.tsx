"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { Socket } from "socket.io-client";

import { clearAccessToken, readAccessToken } from "@/lib/authTokenVault";
import { isSocketAuthError } from "@/lib/authError";
import { runSingleFlightRefresh } from "@/lib/authSession";
import { env } from "@/lib/env";
import {
  configureSocketAuth,
  getOrCreateSocket,
  resetSocket,
} from "@/lib/socketClient";
import { refreshUser } from "@/redux/auth/operations";
import { refreshError } from "@/redux/auth/slice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
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
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const accessTokenReady = useAppSelector(selectAccessTokenReady);
  const [socketConfig] = useState(resolveSocketConfig);
  const allowGuest = env.socketAllowGuest;
  const authRecoveryAttemptedRef = useRef(false);

  const [status, setStatus] = useState<SocketStatus>(() =>
    socketConfig ? "disconnected" : "disabled"
  );
  const [lastError, setLastError] = useState<string | null>(null);

  const [socket, setSocket] = useState<Socket | null>(() =>
    socketConfig ? getOrCreateSocket(socketConfig) : null,
  );

  useEffect(() => {
    if (!socketConfig) {
      if (process.env.NODE_ENV !== "production") {
        
        console.warn(
          "Socket.IO disabled: NEXT_PUBLIC_SOCKET_URL is not set (optionally set NEXT_PUBLIC_SOCKET_PATH)."
        );
      }
      return;
    }

    if (!socket) return;
    const liveSocket = socket;
    let disposed = false;
    let authRecoveryStarted = false;

    const onConnect = () => {
      authRecoveryAttemptedRef.current = false;
      setStatus("connected");
      setLastError(null);
    };

    const onDisconnect = () => {
      setStatus("disconnected");
    };

    const onConnectError = (err: unknown) => {
      setStatus("error");
      setLastError(err instanceof Error ? err.message : String(err));

      if (
        authRecoveryStarted ||
        !isLoggedIn ||
        !accessTokenReady ||
        !isSocketAuthError(err)
      ) {
        return;
      }
      authRecoveryStarted = true;

      if (authRecoveryAttemptedRef.current) {
        clearAccessToken();
        dispatch(refreshError());
        return;
      }

      authRecoveryAttemptedRef.current = true;
      void runSingleFlightRefresh(() => dispatch(refreshUser()).unwrap())
        .then(() => {
          if (disposed) return;
          resetSocket(liveSocket);
          setSocket(getOrCreateSocket(socketConfig));
        })
        .catch(() => {
          // refreshUser owns the terminal session-expired state
        });
    };

    liveSocket.on("connect", onConnect);
    liveSocket.on("disconnect", onDisconnect);
    liveSocket.on("connect_error", onConnectError);

    return () => {
      disposed = true;
      liveSocket.off("connect", onConnect);
      liveSocket.off("disconnect", onDisconnect);
      liveSocket.off("connect_error", onConnectError);
    };
  }, [accessTokenReady, dispatch, isLoggedIn, socket, socketConfig]);

  useEffect(() => {
    if (!socketConfig) return;

    if (!socket) return;
    const liveSocket = socket;

    if ((!isLoggedIn || !accessTokenReady) && !allowGuest) {
      liveSocket.disconnect();
      return;
    }

    // Socket.IO invokes this callback for every handshake/reconnect, so a
    // refreshed token is never captured in a stale React closure.
    configureSocketAuth(liveSocket, readAccessToken);

    liveSocket.connect();

    return () => {
      // keep singleton instance, but stop network activity if provider unmounts
      liveSocket.disconnect();
    };
  }, [socket, socketConfig, isLoggedIn, accessTokenReady, allowGuest]);

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
