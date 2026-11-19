import { useCallback, useEffect, useRef, useState } from "react";
import { loadLibraryPage, type LibraryQuery, type LegacyLibraryCache } from "@/lib/files/libraryApi";
import { mergeLibraryFiles, type LibraryPage } from "@/lib/files/library";
import { preparationErrorMessage } from "@/lib/files/preparation";

export function useLibraryPages(owner: string, refresh: number, { q, category, source, sort }: LibraryQuery) {
  const [data, setData] = useState<LibraryPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [term, setTerm] = useState(q);
  const fetchRef = useRef<(() => void) | null>(null);
  const loadMore = useCallback(() => fetchRef.current?.(), []);
  useEffect(() => {
    const timer = setTimeout(() => setTerm(q), 200);
    return () => clearTimeout(timer);
  }, [q]);

  const legacy = useRef<LegacyLibraryCache>({ snapshot: null });
  // Only cached for the capped v1 API. Do not reuse across accounts or refreshes.
  useEffect(() => { legacy.current = { snapshot: null }; }, [owner, refresh]);

  useEffect(() => {
    const controller = new AbortController();
    let current: LibraryPage | null = null;
    let inFlight = false;
    const seen = new Set<string>();
    setData(null);
    async function fetchPage() {
      if (inFlight || controller.signal.aborted || (current && !current.nextCursor)) return;
      inFlight = true;
      setLoading(true);
      setPageError("");
      try {
        const page = await loadLibraryPage({ q: term, category, source, sort }, current?.nextCursor ?? null, controller.signal, legacy.current);
        if (controller.signal.aborted) return;
        if (page.nextCursor && seen.has(page.nextCursor)) throw new Error("Library returned a repeated page. Refresh Files and try again.");
        if (page.nextCursor) seen.add(page.nextCursor);
        current = { ...page, files: current ? mergeLibraryFiles(current.files, page.files) : page.files };
        setData(current);
      } catch (error) {
        if (!controller.signal.aborted) setPageError(preparationErrorMessage(error));
      } finally {
        inFlight = false;
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    fetchRef.current = () => void fetchPage();
    void fetchPage();
    return () => { controller.abort(); fetchRef.current = null; };
  }, [owner, refresh, term, category, source, sort]);

  return { data, loading, pageError, loadMore };
}
