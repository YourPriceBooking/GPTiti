"use client";

import { useEffect, useSyncExternalStore } from "react";
import { enabledChatIds } from "@/config/modelDiscovery";
import { axiosInstance } from "@/lib/axiosInstance";
import { selectAccessTokenReady } from "@/redux/auth/selectors";
import { useAppSelector } from "@/redux/hooks";

type Catalog = { ids: readonly string[]; status: "loading" | "ready" | "error" };
const initial: Catalog = { ids: [], status: "loading" };
let snapshot = initial;
let inflight: Promise<void> | undefined;
let generation = 0;
let lastSuccess = 0;
let authKey: boolean | undefined;
const listeners = new Set<() => void>();
function subscribe(fn: () => void) { listeners.add(fn); return () => { listeners.delete(fn); }; }
function publish(next: Catalog) { snapshot = next; listeners.forEach(fn => fn()); }
function refresh(auth: boolean, force = false) {
  if (authKey !== auth) {
    authKey = auth; generation++; inflight = undefined; lastSuccess = 0; publish(initial);
  }
  if (inflight || (!force && Date.now() - lastSuccess < 60_000)) return;
  const request = generation;
  inflight = axiosInstance.get("/users/get-chat-models", { timeout: 10000 })
    .then(({ data }) => {
      if (request !== generation) return;
      const ids = enabledChatIds(data);
      lastSuccess = Date.now();
      publish({ ids, status: "ready" });
    }).catch(() => {
      if (request === generation) publish({ ids: snapshot.ids, status: "error" });
    }).finally(() => { if (request === generation) inflight = undefined; });
}
export function useChatCatalog() {
  const auth = useAppSelector(selectAccessTokenReady);
  const catalog = useSyncExternalStore(subscribe, () => snapshot, () => initial);
  useEffect(() => {
    const update = () => refresh(auth);
    update();
    window.addEventListener("focus", update);
    return () => window.removeEventListener("focus", update);
  }, [auth]);
  return { ...catalog, retry: () => refresh(auth, true) };
}
