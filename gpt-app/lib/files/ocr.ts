export type OcrPreview = { kind: 'ocr'; text: string; version: number; textBytes: number; ocrPages: number; uncertain: boolean; legacy: boolean };
export function readOcrPreview(value: unknown): OcrPreview {
  const v = value as Partial<OcrPreview> | null;
  if (!v || v.kind !== 'ocr' || typeof v.text !== 'string' || new TextEncoder().encode(v.text).length > 1048576 || ![2, 3].includes(v.version ?? 0) || typeof v.uncertain !== 'boolean' || typeof v.legacy !== 'boolean' || !Number.isInteger(v.ocrPages) || v.ocrPages! < 0 || v.ocrPages! > 30 || v.textBytes !== new TextEncoder().encode(v.text).length) throw new Error('Invalid recognized text response');
  return v as OcrPreview;
}
// Presentation only. The raw string remains authoritative for copy/download.
export function ocrSections(text: string) {
  const markers = [...text.matchAll(/^\[(?:PDF|IMAGE) PAGE (\d+) OF (\d+) — [^\]\n]+\]/gm)];
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

export type OcrReading = { original: string; readings: string[]; conflict: boolean; numericDisagreement: boolean; incomplete: boolean };
// Only known, standalone metadata is hidden. Unknown/malformed content stays visible.
export function readableOcrSections(text: string) {
  return ocrSections(text).filter(section => section.label !== 'Recognition notes').map(section => {
    const lines: string[] = [];
    const alternatives: OcrReading[] = [];
    let inAlternatives = false;
    for (const line of section.text.split('\n')) {
      if (/^\[(?:PDF|IMAGE) PAGE \d+ OF \d+ — [^\]]+\]$/.test(line) || /^\[OCR (?:QUALITY UNCERTAIN:|MODELS:|REGION CHECK INCOMPLETE:)[^\]]*\]$/.test(line)) continue;
      if (/^\[OCR (?:REGION|IDENTIFIER) ALTERNATIVES — [^\]]*\]$/.test(line)) { inAlternatives = true; continue; }
      if (inAlternatives && line.startsWith('{')) {
        try {
          const value = JSON.parse(line);
          const alternative = value?.alternative ?? value?.latin;
          if (typeof value?.original === 'string' && typeof alternative === 'string') {
            const cross = value.crossCheck;
            const readings = [alternative];
            if (Array.isArray(cross?.readings)) for (const item of cross.readings) {
              if (typeof item?.text === 'string' && !readings.includes(item.text)) readings.push(item.text);
            }
            alternatives.push({ original: value.original, readings, conflict: cross?.status === 'conflict', numericDisagreement: value.numericAgreement === false, incomplete: value.recognitionIncomplete === true || (typeof cross?.status === 'string' && !['agreement', 'conflict'].includes(cross.status)) });
            continue;
          }
        } catch { /* Keep unrecognized data visible and available in the exact export. */ }
      }
      lines.push(line);
    }
    return { label: section.label, text: lines.join('\n').trim(), alternatives };
  });
}
