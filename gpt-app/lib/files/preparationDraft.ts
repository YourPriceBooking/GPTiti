import type { UploadedFile } from '../../types/api.types';
export type PreparationDraft = {
  clientMessageId: string; owner: string; conversationId: string; modelId: string; text: string;
  files: UploadedFile[]; createdAt: number;
};
export const preparationDraftKey = (owner: string) => `gptiti:ocr-draft:v1:${owner}`;
// Only server file IDs and display metadata are retained in this tab. Never tokens, bytes or URLs.
export function encodePreparationDraft(draft: PreparationDraft): string {
  return JSON.stringify({ ...draft, files: draft.files.map(f => ({ fileId: f.fileId, originalName: f.originalName, mimetype: f.mimetype, size: f.size, expiresAt: f.expiresAt })) });
}
export function readPreparationDraft(raw: string | null, owner: string, now = Date.now()): PreparationDraft | null {
  try {
    if (!raw || raw.length > 200000) return null;
    const d = JSON.parse(raw);
    if (!/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(d.clientMessageId) || d.owner !== owner || !/^[a-f0-9]{24}$/i.test(d.conversationId) || typeof d.modelId !== 'string' || !d.modelId || d.modelId.length > 200 ||
      typeof d.text !== 'string' || d.text.length > 100000 || !Number.isSafeInteger(d.createdAt) || d.createdAt > now || now - d.createdAt > 86400000 ||
      !Array.isArray(d.files) || !d.files.length || d.files.length > 10) return null;
    const files: UploadedFile[] = [];
    for (const f of d.files) {
      if (!/^[a-f0-9]{24}$/i.test(f.fileId) || typeof f.originalName !== 'string' || !f.originalName || f.originalName.length > 255 ||
        typeof f.mimetype !== 'string' || f.mimetype.length > 200 || !Number.isSafeInteger(f.size) || f.size < 1 || f.size > 50000000 ||
        (f.expiresAt !== null && (typeof f.expiresAt !== 'string' || !Number.isFinite(Date.parse(f.expiresAt)) || Date.parse(f.expiresAt) <= now))) return null;
      files.push({fileId: f.fileId, originalName: f.originalName, mimetype: f.mimetype, size: f.size, expiresAt: f.expiresAt, url: ''});
    }
    if (new Set(files.map(f => f.fileId)).size !== files.length) return null;
    return {clientMessageId: d.clientMessageId, owner, conversationId: d.conversationId, modelId: d.modelId, text: d.text, createdAt: d.createdAt, files};
  } catch { return null; }
}
