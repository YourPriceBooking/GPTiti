import type { ReactNode } from "react";

const shapes: Record<string, ReactNode> = {
  eye: <><path d="M2 12s3.7-6.5 10-6.5S22 12 22 12s-3.7 6.5-10 6.5S2 12 2 12Z"/><circle cx="12" cy="12" r="2.5"/></>,
  voice: <><rect x="9" y="2.7" width="6" height="12" rx="3"/><path d="M5.5 10.5v1a6.5 6.5 0 0 0 13 0v-1M12 18v3m-4 0h8"/></>,
  mini: <><path d="m4 15 5-8 3 5-3 5m4-2 5-8 3 5-3 5"/></>,
  sol: <><circle cx="12" cy="12" r="4.1"/><path d="M12 2v2.7m0 14.6V22M2 12h2.7m14.6 0H22M5 5l2 2m10 10 2 2M19 5l-2 2M7 17l-2 2"/></>,
  astra: <><path d="m12 3 1.8 6.7L20.5 12l-6.7 2.1L12 21l-2.2-6.9L3 12l6.8-2.3Z"/><path d="m19.5 3 .5 1.5 1.5.5-1.5.5-.5 1.5-.5-1.5-1.5-.5 1.5-.5Z"/></>,
  luna: <><path d="M17.8 15.7a7.9 7.9 0 0 1-9.6-10 8.1 8.1 0 1 0 9.6 10Z"/><path d="m16.5 4 .8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8Z"/></>,
  terra: <><circle cx="12" cy="12" r="8.6"/><path d="M4 10.5c4 1.5 6-.2 8.5-2.2s4-2.1 6.4-1.5M4.6 15c4.3 1.3 8.2-.5 10.4-2.8 1.8-1.9 3.9-2.8 5.6-2.1"/></>,
  base: <><path d="m12 3.5 8.3 4.7v8.4L12 21l-8.3-4.4V8.2L12 3.5Zm-8 4.9 8 4.4 8-4.4m-8 4.4v7.7"/></>,
  images: <><rect x="3.5" y="4" width="17" height="16" rx="3"/><circle cx="9" cy="9" r="1.2"/><path d="m5 17 6-5.8 3.1 3 2.4-2.1 3 3"/></>,
  realtime: <><path d="M3 10v4m4-7v10m5-14v18m5-14v10m4-7v4"/></>,
  custom: <><path d="m12 3 8 4.5-8 4.5-8-4.5L12 3Zm-8 9 8 4.5 8-4.5M4 16.5l8 4.5 8-4.5"/></>,
};

export function ModelGlyph({ icon }: { icon: string }) {
  return <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{shapes[icon]}</svg>;
}
