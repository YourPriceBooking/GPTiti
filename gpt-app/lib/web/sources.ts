export type WebSource = {
  id: string;
  status: "ready" | "failed";
  url?: string;
  requestedUrl: string;
  title?: string;
  truncated: boolean;
  reading?: { read: number; selected: number; total: number; continueId?: string };
  error?: string;
};
export type WebStatus = { stage: string; completed: number; total: number };
const object = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === "object" && !Array.isArray(v);
export function safeWebUrl(v: unknown): string | undefined {
  if (typeof v !== "string" || v.length > 8192) return;
  try {
    const u = new URL(v);
    if (/^https?:$/.test(u.protocol) && !u.username && !u.password) return v;
  } catch {
    /* Invalid optional metadata is ignored. */
  }
}
export function readWebSources(value: unknown): WebSource[] {
  if (!Array.isArray(value)) return [];
  return value.slice(0, 50).flatMap((v) => {
    if (
      !object(v) ||
      typeof v.id !== "string" ||
      !/^web-\d+$/.test(v.id) ||
      !["ready", "failed"].includes(String(v.status))
    )
      return [];
    const url = safeWebUrl(v.url),
      requestedUrl = safeWebUrl(v.requestedUrl) ?? url;
    if (!requestedUrl || (v.status === "ready" && !url)) return [];
    const p = v.reading;
    const validCount = (x: unknown): x is number => typeof x === "number" && Number.isSafeInteger(x) && x >= 0;
    const reading = object(p) && validCount(p.read) && validCount(p.selected) && validCount(p.total)
      && p.read <= p.selected && p.selected <= p.total ? {
        read: p.read, selected: p.selected, total: p.total,
        continueId: p.canContinue === true && typeof p.continueId === "string"
          && /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(p.continueId)
          ? p.continueId : undefined,
      } : undefined;
    return [
      {
        id: v.id,
        status: v.status as WebSource["status"],
        url,
        requestedUrl,
        title: typeof v.title === "string" ? v.title.slice(0, 300) : undefined,
        truncated: v.truncated === true,
        ...(reading ? { reading } : {}),
        error:
          typeof v.error === "string" && /^[A-Z0-9_]+$/.test(v.error)
            ? v.error
            : undefined,
      },
    ];
  });
}
export function readWebStatus(v: unknown): WebStatus | null {
  if (
    !object(v) ||
    typeof v.stage !== "string" ||
    ![
      "opening_browser",
      "navigating",
      "reading",
      "reading_web",
      "answering",
    ].includes(v.stage)
  )
    return null;
  if (
    !Number.isInteger(v.completed) ||
    !Number.isInteger(v.total) ||
    Number(v.completed) < 0 ||
    Number(v.total) < 1 ||
    Number(v.completed) > Number(v.total) ||
    Number(v.total) > 50
  )
    return null;
  return {
    stage: v.stage,
    completed: Number(v.completed),
    total: Number(v.total),
  };
}
export const webStageLabel = (stage: string) =>
  ({
    opening_browser: "Opening website…",
    navigating: "Navigating website…",
    reading: "Reading page…",
    reading_web: "Reading links…",
    answering: "Preparing response…",
  })[stage] ?? "Working…";
// Remove only the exact server-generated suffix confirmed by structured metadata.
export function withoutWebFooter(
  content: string,
  sources: WebSource[],
): string {
  if (!sources.length) return content;
  const suffix =
    "\n\n---\n" +
    sources
      .map((s) =>
        s.status === "ready"
          ? `[${s.id}](<${s.url}>)${s.truncated ? " — partial page text" : ""}`
          : `[${s.id}] ${s.requestedUrl} — ${s.error}`,
      )
      .join("\n");
  return content.endsWith(suffix) ? content.slice(0, -suffix.length) : content;
}
export function groupWebSources(sources: WebSource[]) {
  const groups = new Map<
    string,
    { source: WebSource; visits: number; partial: boolean; ready: boolean }
  >();
  for (const source of sources) {
    const key = source.url ?? source.requestedUrl;
    const prior = groups.get(key);
    if (prior) {
      prior.visits++;
      prior.partial ||= source.truncated || source.status === "failed";
      prior.ready ||= source.status === "ready";
      if (!prior.source.title && source.title) prior.source = source;
    } else
      groups.set(key, {
        source,
        visits: 1,
        partial: source.truncated,
        ready: source.status === "ready",
      });
  }
  return [...groups.values()];
}
