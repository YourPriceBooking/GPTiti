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

export type PreviewCell = string | number | boolean | null;
export type DocumentBlock = { type: 'heading' | 'paragraph' | 'bullet'; text: string } | { type: 'table'; rows: string[][] };
export type StructuredPreview = { kind: 'document'; title: string; blocks: DocumentBlock[]; truncated: boolean } | { kind: 'workbook'; sheets: { name: string; rows: PreviewCell[][] }[]; truncated: boolean };
// Treat server JSON as unknown; never pass document contents to HTML or Office engines.
export function readStructuredPreview(input: unknown): StructuredPreview | null {
  if (!input || typeof input !== 'object' || JSON.stringify(input).length > 65536) return null;
  const data = input as Record<string, unknown>;
  const string = (v: unknown): v is string => typeof v === 'string' && v.length <= 8000;
  const rows = (v: unknown, maxRows: number, maxCols: number, stringsOnly: boolean) => Array.isArray(v) && v.length <= maxRows && v.every(row => Array.isArray(row) && row.length <= maxCols && row.every(cell => string(cell) || (!stringsOnly && (cell === null || typeof cell === 'boolean' || (typeof cell === 'number' && Number.isFinite(cell))))));
  if (data.kind === 'document' && string(data.title) && Array.isArray(data.blocks) && data.blocks.length <= 300) {
    const blocks: DocumentBlock[] = [];
    for (const item of data.blocks) {
      if (!item || typeof item !== 'object') return null;
      if (item.type === 'table' && rows(item.rows, 300, 8, true)) blocks.push({ type: 'table', rows: item.rows });
      else if (['heading', 'paragraph', 'bullet'].includes(item.type) && string(item.text)) blocks.push({ type: item.type, text: item.text });
      else return null;
    }
    return { kind: 'document', title: data.title, blocks, truncated: data.truncated === true };
  }
  if (data.kind === 'workbook' && Array.isArray(data.sheets) && data.sheets.length > 0 && data.sheets.length <= 10) {
    const sheets: { name: string; rows: PreviewCell[][] }[] = [];
    for (const sheet of data.sheets) {
      if (!sheet || !string(sheet.name) || sheet.name.length > 31 || !rows(sheet.rows, 200, 30, false)) return null;
      sheets.push({ name: sheet.name, rows: sheet.rows });
    }
    return { kind: 'workbook', sheets, truncated: data.truncated === true };
  }
  return null;
}
