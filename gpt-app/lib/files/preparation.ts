import type { UploadedFile } from '../../types/api.types';

export const OCR_ERROR_MESSAGES = {
  OCR_INPUT_DISABLED: 'Text recognition is disabled for this model. Choose another model or attach a text file.',
  OCR_UNAVAILABLE: 'Text recognition is temporarily unavailable. Try again later with the same attachment.',
  OCR_FILE_TOO_LARGE: 'OCR accepts files up to 5 MiB. Split or resize this file.',
  OCR_PAGE_LIMIT: 'A PDF can contain up to 10 pages that need OCR. Split the PDF.',
  OCR_IMAGE_LIMIT: 'OCR images must have at most 16 million pixels and no side over 10,000 pixels. Resize the image.',
  OCR_TEXT_TOO_LARGE: 'Recognized text exceeds 64 KiB per file. Split the document.',
  OCR_NO_TEXT: 'No readable text was found in this PDF. Use a clearer scan or attach a text version.',
  OCR_INVALID_IMAGE: 'This image cannot be read. Use a valid, static PNG, JPG or WEBP.',
  OCR_FAILED: 'Text recognition failed. Try again, or use a clearer scan.',
  OCR_PROCESSING_TIMEOUT: 'Text recognition took too long. Retry the same attachment, or split the document.',
  OCR_PROCESSING_BUSY: 'Text recognition is busy. Wait a moment and send again; uploaded files will be reused.',
  OCR_NOT_READY: 'Text recognition is still preparing. Wait a moment and send again; uploaded files will be reused.',
  FILE_QUOTA_EXCEEDED: 'Your private file storage is full. Delete files you no longer need and try again.',
} as const;
export const OCR_ERROR_CODES = Object.keys(OCR_ERROR_MESSAGES) as (keyof typeof OCR_ERROR_MESSAGES)[];

export type FilePreparation = { status: 'not_required' } | {
  status: 'ready'; method: 'local_ocr'; ocrPages: number; textBytes: number;
  scripts: string[]; uncertain: boolean;
};
export function readFilePreparation(value: unknown): FilePreparation {
  const data = value as { success?: unknown; processing?: Partial<Extract<FilePreparation, {status: 'ready'}>> & {status?: string} } | null;
  const p = data?.processing;
  if (data?.success !== true || !p) throw new Error('Invalid file preparation response. Please try again.');
  if ((p.status as string) === 'not_required') return { status: 'not_required' };
  if (p.status !== 'ready' || p.method !== 'local_ocr' ||
      !Number.isInteger(p.ocrPages) || p.ocrPages! < 0 || p.ocrPages! > 10 ||
      !Number.isInteger(p.textBytes) || p.textBytes! < 0 || p.textBytes! > 65536 ||
      !Array.isArray(p.scripts) || !p.scripts.every(s => typeof s === 'string') ||
      typeof p.uncertain !== 'boolean') throw new Error('Invalid file preparation response. Please try again.');
  return p as Extract<FilePreparation, {status: 'ready'}>;
}
export function preparationErrorMessage(error: unknown): string {
  const e = error as { response?: {data?: {error?: string; message?: string}}; code?: string; message?: string } | null;
  const code = e?.response?.data?.error;
  if (code && Object.hasOwn(OCR_ERROR_MESSAGES, code)) return OCR_ERROR_MESSAGES[code as keyof typeof OCR_ERROR_MESSAGES];
  if (code === 'FILE_NOT_FOUND' || code === 'FILE_UNAVAILABLE') return 'This attachment is no longer available. Remove it and attach the file again.';
  if (code === 'PDF_PASSWORD_PROTECTED') return 'This PDF is protected. Attach an unencrypted copy you are authorized to use.';
  if (e?.code === 'ECONNABORTED' || e?.code === 'ERR_NETWORK') return 'Could not confirm file preparation. Check your connection and send again; uploaded files will be reused.';
  return e?.response?.data?.message || e?.message || 'Could not prepare this attachment. Please try again.';
}

export type PreparationProgress = { phase: 'uploading' | 'recognizing'; name: string; index: number; total: number };

// File identity, not name/size, prevents reuse for different bytes. Weak keys release removed drafts.
// This cache belongs to one signed-in session and never persists private IDs in browser storage.
export class AttachmentPreparation {
  private uploads = new WeakMap<File, UploadedFile>();
  async run(files: File[], modelId: string, deps: {
    upload: (file: File) => Promise<UploadedFile>;
    prepare: (id: string, modelId: string) => Promise<FilePreparation>;
    progress: (progress: PreparationProgress) => void;
    warning: (name: string) => void;
    signal: AbortSignal;
  }): Promise<UploadedFile[]> {
    const result: UploadedFile[] = [];
    for (const [index, file] of files.entries()) {
      deps.signal.throwIfAborted();
      let stored = this.uploads.get(file);
      if (!stored) {
        deps.progress({ phase: 'uploading', name: file.name, index: index + 1, total: files.length });
        stored = await deps.upload(file);
        deps.signal.throwIfAborted();
        this.uploads.set(file, stored);
      }
      if (stored.fileId && (stored.mimetype === 'application/pdf' || ['image/png', 'image/jpeg', 'image/webp'].includes(stored.mimetype))) {
        deps.progress({ phase: 'recognizing', name: file.name, index: index + 1, total: files.length });
        const processing = await deps.prepare(stored.fileId, modelId);
        deps.signal.throwIfAborted();
        if (processing.status === 'ready' && processing.uncertain) deps.warning(file.name);
      }
      result.push(stored);
    }
    deps.signal.throwIfAborted();
    return result;
  }
}
