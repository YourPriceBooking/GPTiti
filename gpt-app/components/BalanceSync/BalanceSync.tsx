"use client";

import { useEffect } from "react";
import { useSocket } from "@/context/SocketContext";
import { cancelBalanceRequests } from "@/lib/balance/balanceRequests";
import { selectAccessTokenReady, selectIsLoggedIn, selectUser } from "@/redux/auth/selectors";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { refreshBalance } from "@/redux/tokens/operations";
import { setBalanceOwner } from "@/redux/tokens/slice";

export default function BalanceSync() {
  const dispatch = useAppDispatch();
  const userId = useAppSelector(selectUser)?.id;
  const loggedIn = useAppSelector(selectIsLoggedIn);
  const ready = useAppSelector(selectAccessTokenReady);
  const { socket } = useSocket();

  useEffect(() => {
    if (!userId || !loggedIn || !ready) return;
    dispatch(setBalanceOwner(userId));
    const refresh = () => { void dispatch(refreshBalance({ userId })); };
    const onUpdated = (event: unknown) => {
      if (event && typeof event === "object" &&
          "userId" in event && event.userId === userId) refresh();
    };
    const onVisible = () => { if (document.visibilityState === "visible") refresh(); };
    const onOnline = () => { socket?.connect(); refresh(); };
    // Subscribe before the initial read to cover changes while GET is in flight.
    socket?.on("balance.updated", onUpdated);
    socket?.on("balance.sync", refresh);
    socket?.on("connect", refresh);
    window.addEventListener("focus", onVisible);
    window.addEventListener("online", onOnline);
    document.addEventListener("visibilitychange", onVisible);
    refresh();
    // Background polling only while push is unavailable, or as a repair read
    // once a minute for a missed Pub/Sub message on an otherwise healthy socket.
    let ticks = 0;
    const timer = window.setInterval(() => {
      ticks += 1;
      if (document.visibilityState !== "visible" || !navigator.onLine) return;
      if (!socket?.connected || ticks % 4 === 0) refresh();
    }, 15_000);
    return () => {
      window.clearInterval(timer);
      socket?.off("balance.updated", onUpdated);
      socket?.off("balance.sync", refresh);
      socket?.off("connect", refresh);
      window.removeEventListener("focus", onVisible);
      window.removeEventListener("online", onOnline);
      document.removeEventListener("visibilitychange", onVisible);
      cancelBalanceRequests(userId);
    };
  }, [dispatch, loggedIn, ready, socket, userId]);

  return null;
}
