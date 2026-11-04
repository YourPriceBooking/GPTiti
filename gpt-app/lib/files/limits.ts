import { inputKind } from './input';
type Reader = { enabled: boolean; maxBytes: number };
export type FileLimits = {
  version: 1;
  preparation?: { async: boolean; pageCheckpoints: boolean };
  storage: { maxBytes: number; maxCount: number };
  upload: { maxBytes: number; types: Record<string, { extensions: string[]; maxBytes: number }> };
  message: { maxAttachments: number; maxBytes: number; extractedTextBytes: number };
  processing: { text: Reader; office: Reader; pdf: Reader;
    ocr: Reader & { maxOcrPages: number; maxTextBytes: number; maxPdfPages?: number; imageMaxBytes?: number };
    zip: { enabled: boolean; inputBytes: number; expandedBytes: number; entryBytes: number; entries: number; records: number; textBytes: number; outputEntries: number } };
};
const object = (v: unknown): Record<string, unknown> => {
  if (!v || typeof v !== 'object' || Array.isArray(v)) throw new Error('Invalid file limits response.');
  return v as Record<string, unknown>;
};
const number = (v: unknown) => {
  if (typeof v !== 'number' || !Number.isSafeInteger(v) || v < 1 || v > 1e12) throw new Error('Invalid file limits response.');
  return v;
};
const boolean = (v: unknown) => { if (typeof v !== 'boolean') throw new Error('Invalid file limits response.'); return v; };
const reader = (v: unknown): Reader => { const r = object(v); return { enabled: boolean(r.enabled), maxBytes: number(r.maxBytes) }; };
export function readFileLimits(value: unknown): FileLimits {
  const v = object(value);
  if (v.version !== 1 || v.profile !== 'stage-a-storage') throw new Error('Unsupported file limits response.');
  const units = object(v.units);
  if (units.MB !== 1e6 || units.GB !== 1e9) throw new Error('Invalid file limits units.');
  const storage = object(v.storage), upload = object(v.upload), message = object(v.message), processing = object(v.processing);
  const types: FileLimits['upload']['types'] = Object.create(null);
  const entries = Object.entries(object(upload.types));
  if (!entries.length || entries.length > 20) throw new Error('Invalid file limits response.');
  for (const [key, value] of entries) {
    const t = object(value);
    if (!/^[a-z]{1,30}$/.test(key) || !Array.isArray(t.extensions) || !t.extensions.length || t.extensions.length > 100 ||
      !t.extensions.every(x => typeof x === 'string' && /^[a-z0-9]{1,12}$/.test(x))) throw new Error('Invalid file limits response.');
    types[key] = { extensions: t.extensions as string[], maxBytes: number(t.maxBytes) };
  }
  const ocr = object(processing.ocr), zip = object(processing.zip);
  const prep = v.preparation === undefined ? null : object(v.preparation);
  if (prep?.version === 2 && prep.pageCheckpoints === true) { number(ocr.maxPdfPages); number(ocr.imageMaxBytes); }
  return { version: 1,
    preparation: prep ? { async: (prep.version === 1 || prep.version === 2) && prep.async === true && Array.isArray(prep.kinds) && prep.kinds.includes("ocr"), pageCheckpoints: prep.version === 2 && prep.pageCheckpoints === true } : undefined,
    storage: { maxBytes: number(storage.maxBytes), maxCount: number(storage.maxCount) },
    upload: { maxBytes: number(upload.maxBytes), types },
    message: { maxAttachments: number(message.maxAttachments), maxBytes: number(message.maxBytes), extractedTextBytes: number(message.extractedTextBytes) },
    processing: { text: reader(processing.text), office: reader(processing.office), pdf: reader(processing.pdf),
      ocr: { ...reader(ocr), maxOcrPages: number(ocr.maxOcrPages), maxTextBytes: number(ocr.maxTextBytes), maxPdfPages: ocr.maxPdfPages === undefined ? undefined : number(ocr.maxPdfPages), imageMaxBytes: ocr.imageMaxBytes === undefined ? undefined : number(ocr.imageMaxBytes) },
      zip: { enabled: boolean(zip.enabled), inputBytes: number(zip.inputBytes), expandedBytes: number(zip.expandedBytes), entryBytes: number(zip.entryBytes), entries: number(zip.entries), records: number(zip.records), textBytes: number(zip.textBytes), outputEntries: number(zip.outputEntries) } },
  };
}
export function formatLimit(bytes: number): string {
  if (bytes >= 1e9 && bytes % 1e9 === 0) return `${bytes / 1e9} GB`;
  if (bytes >= 1e6 && bytes % 1e6 === 0) return `${bytes / 1e6} MB`;
  if (bytes >= 1024 ** 2 && bytes % 1024 ** 2 === 0) return `${bytes / 1024 ** 2} MiB`;
  if (bytes >= 1024 && bytes % 1024 === 0) return `${bytes / 1024} KiB`;
  return `${bytes.toLocaleString('en-US')} bytes`;
}
export function fileCeilings(name: string, limits: FileLimits) {
  const kind = inputKind({ name, size: 1 });
  const ext = name.split('.').pop()?.toLowerCase();
  const type = Object.values(limits.upload.types).find(t => t.extensions.includes(ext ?? ''));
  if (!kind || !type) return null;
  const upload = Math.min(limits.upload.maxBytes, type.maxBytes);
  const p = limits.processing;
  const selected = kind === 'zip' ? { enabled: p.zip.enabled, maxBytes: p.zip.inputBytes }
    : kind === 'image' ? (p.ocr.enabled ? { enabled: true, maxBytes: p.ocr.imageMaxBytes ?? p.ocr.maxBytes } : { enabled: true, maxBytes: upload })
    : kind === 'pdf' ? { enabled: p.pdf.enabled, maxBytes: usesBackgroundOcr(limits) && limits.preparation?.pageCheckpoints ? p.ocr.maxBytes : Math.min(p.pdf.maxBytes, p.ocr.enabled ? p.ocr.maxBytes : Infinity) }
    : p[kind];
  return { upload, reading: Math.min(upload, selected.maxBytes), enabled: selected.enabled };
}
export function validateServerFiles(files: { name: string; size: number }[], limits: FileLimits | null): string | null {
  if (!files.length) return null;
  if (!limits) return 'File limits are unavailable. Open Add files → ⓘ and retry. Your draft is kept.';
  if (files.length > limits.message.maxAttachments) return `Attach up to ${limits.message.maxAttachments} files in total, including images.`;
  let total = 0, text = 0;
  for (const file of files) {
    if (!Number.isSafeInteger(file.size) || file.size <= 0) return `${file.name}: the file is empty or has an invalid size.`;
    const caps = fileCeilings(file.name, limits);
    if (!caps) return `${file.name}: this format cannot be read in chat. See ⓘ for supported formats.`;
    if (!caps.enabled) return `${file.name}: reading this format is disabled for the selected model.`;
    if (file.size > caps.upload) return `${file.name}: the storage upload limit is ${formatLimit(caps.upload)}. Use a smaller file.`;
    if (file.size > caps.reading) return `${file.name}: storage accepts up to ${formatLimit(caps.upload)}, but chat reading currently accepts ${formatLimit(caps.reading)}. Split or resize it before attaching.`;
    total += file.size;
    if (inputKind(file) === 'text') text += file.size;
  }
  if (total > limits.message.maxBytes) return `Attachments exceed ${formatLimit(limits.message.maxBytes)} per message.`;
  if (text > limits.message.extractedTextBytes) return `Text attachments exceed ${formatLimit(limits.message.extractedTextBytes)}. Earlier attachments and extracted document content also share this limit.`;
  return null;
}

export const usesBackgroundOcr = (limits: FileLimits | null): boolean =>
  limits?.preparation?.async === true && limits.processing.ocr.enabled;
