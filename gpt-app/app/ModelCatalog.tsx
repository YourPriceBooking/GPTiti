"use client";
import { useEffect } from "react";
import { useAppDispatch } from "@/redux/hooks";
import {
  catalogLoading,
  catalogFailed,
  catalogLoaded,
} from "@/redux/model/slice";
import { readModelCatalog } from "@/lib/models/catalog";
import { env } from "@/lib/env";
export const refreshModelCatalog = () =>
  window.dispatchEvent(new Event("gptiti:refresh-models"));
export default function ModelCatalog() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    let active: AbortController | null = null,
      disposed = false;
    const load = async () => {
      if (active) return;
      const controller = new AbortController();
      active = controller;
      const timer = setTimeout(() => controller.abort(), 15000);
      dispatch(catalogLoading());
      try {
        const res = await fetch(
          `${env.backendApiUrl.replace(/\/$/, "")}/users/get-chat-models`,
          { credentials: "omit", cache: "no-store", signal: controller.signal },
        );
        if (!res.ok) throw Error("Catalog unavailable");
        const models = readModelCatalog(await res.json());
        if (!disposed) dispatch(catalogLoaded(models));
      } catch {
        if (!disposed) dispatch(catalogFailed());
      } finally {
        clearTimeout(timer);
        active = null;
      }
    };
    void load();
    window.addEventListener("focus", load);
    window.addEventListener("gptiti:refresh-models", load);
    return () => {
      disposed = true;
      active?.abort();
      window.removeEventListener("focus", load);
      window.removeEventListener("gptiti:refresh-models", load);
    };
  }, [dispatch]);
  return null;
}
