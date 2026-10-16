export type ManagedFile = {
  fileId: string;
  originalName: string;
  mimetype: string;
  size: number;
  status: 'ready' | 'deleted' | 'expired';
  source?: string;
};
export type FileResult = {
  status: 'ready' | 'failed' | 'deleted' | 'expired';
  filename: string;
  fileId?: string;
  error?: string | null;
};
export function readFiles(value: unknown): ManagedFile[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((f) => {
    if (!f || typeof f !== 'object' || typeof f.fileId !== 'string' || !/^[a-f0-9]{24}$/i.test(f.fileId)
      || typeof f.originalName !== 'string' || typeof f.mimetype !== 'string'
      || typeof f.size !== 'number' || !Number.isFinite(f.size) || f.size < 0
      || !['ready', 'deleted', 'expired'].includes(f.status)) return [];
    return [{ fileId: f.fileId, originalName: f.originalName, mimetype: f.mimetype, size: f.size, status: f.status, source: f.source }];
  });
}
export function readFileResult(value: unknown): FileResult | null {
  if (!value || typeof value !== 'object') return null;
  const f = value as Record<string, unknown>;
  if (!['ready', 'failed', 'deleted', 'expired'].includes(String(f.status)) || typeof f.filename !== 'string') return null;
  return { status: f.status as FileResult['status'], filename: f.filename,
    fileId: typeof f.fileId === 'string' ? f.fileId : undefined, error: typeof f.error === 'string' ? f.error : null };
}
export const extension = (name: string) => name.split('.').pop()?.toLowerCase() || 'txt';
export const fileSize = (size: number) => size < 1024 ? `${size} B` : size < 1024 ** 2 ? `${(size / 1024).toFixed(1)} KB` : `${(size / 1024 ** 2).toFixed(1)} MB`;
// Bounded CSV/TSV preview, respecting quoted delimiters and multiline cells.
export function tablePreview(text: string, delimiter: string, truncated = false): string[][] {
  const rows: string[][] = []; let row: string[] = [], cell = '', quoted = false;
  const push = () => { if (row.length < 50) row.push(cell); cell = ''; };
  for (let i = 0; i < text.length && rows.length < 200; i++) {
    const c = text[i];
    if (c === '"') { if (quoted && text[i + 1] === '"') { cell += '"'; i++; } else quoted = !quoted; }
    else if (!quoted && c === delimiter) push();
    else if (!quoted && (c === '\n' || c === '\r')) { if (c === '\r' && text[i + 1] === '\n') i++; push(); rows.push(row); row = []; }
    else cell += c;
  }
  if (!truncated && rows.length < 200 && (cell || row.length)) { push(); rows.push(row); }
  return rows;
}
