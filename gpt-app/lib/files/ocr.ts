export type OcrPreview = { kind: 'ocr'; text: string; version: number; textBytes: number; ocrPages: number; uncertain: boolean; legacy: boolean };
export function readOcrPreview(value: unknown): OcrPreview {
  const v = value as Partial<OcrPreview> | null;
  if (!v || v.kind !== 'ocr' || typeof v.text !== 'string' || new TextEncoder().encode(v.text).length > 65536 || ![2, 3].includes(v.version ?? 0) || typeof v.uncertain !== 'boolean' || typeof v.legacy !== 'boolean' || !Number.isInteger(v.ocrPages) || v.ocrPages! < 0 || v.ocrPages! > 10 || v.textBytes !== new TextEncoder().encode(v.text).length) throw new Error('Invalid recognized text response');
  return v as OcrPreview;
}
// Presentation only. The raw string remains authoritative for copy/download.
export function ocrSections(text: string) {
  const markers = [...text.matchAll(/^\[PDF PAGE (\d+) OF (\d+) — [^\]\n]+\]/gm)];
  if (!markers.length) return [{ label: 'Recognized text', text }];
  const sections = markers.map((m, i) => ({ label: `Page ${m[1]} / ${m[2]}`, text: text.slice(m.index!, markers[i + 1]?.index ?? text.length) }));
  if (markers[0].index) sections.unshift({ label: 'Recognition notes', text: text.slice(0, markers[0].index) });
  return sections;
}
export function ocrError(error: unknown): string | null {
  const status = (error as { response?: { status?: number } })?.response?.status;
  if (status === 409) return 'No saved recognized text is available yet. Send this file in a message first; opening this view does not start recognition.';
  if (status === 415) return 'Saved recognition is available for supported PDF scans and images.';
  return null;
}
