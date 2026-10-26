import { readArchivePreview, type ArchivePreview } from './archive';
import { readOcrPreview } from './ocr';
import { axiosInstance } from '@/lib/axiosInstance';
import { readStructuredPreview, type StructuredPreview, type ManagedFile } from './types';
const route = (id: string, suffix = '') => {
  if (!/^[a-f0-9]{24}$/i.test(id)) throw new Error('Invalid file ID.');
  // Never send credentials to a URL supplied by a model or attachment DTO.
  return `/files/${id}${suffix}`;
};
export type Preview = ArchivePreview | StructuredPreview | { kind: 'image'; blob: Blob } | { kind: 'text' | 'unavailable'; text: string; truncated: boolean };
export async function loadPreview(id: string, signal: AbortSignal): Promise<Preview> {
  const res = await axiosInstance.get<Blob>(route(id, '/preview'), { responseType: 'blob', signal, timeout: 30000 });
  const mime = res.data.type.split(';')[0];
  if (['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'].includes(mime)) return { kind: 'image', blob: res.data };
  const data = JSON.parse(await res.data.text());
  const archive = readArchivePreview(data);
  if (archive) return archive;
  const structured = readStructuredPreview(data);
  if (structured) return structured;
  if (data.kind === 'text' && typeof data.text === 'string') return { kind: 'text', text: data.text, truncated: data.truncated === true };
  return { kind: 'unavailable', text: '', truncated: false };
}
export async function downloadFile(file: ManagedFile) {
  const res = await axiosInstance.get<Blob>(route(file.fileId, '/download'), { responseType: 'blob', timeout: 60000 });
  const url = URL.createObjectURL(new Blob([res.data], { type: 'application/octet-stream' }));
  const a = document.createElement('a'); a.href = url; a.download = file.originalName; document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function fileError(error: unknown): string {
  const status = (error as { response?: { status?: number } })?.response?.status;
  if (status === 401) return 'Please sign in again to access this file.';
  if (status === 403 || status === 404) return 'This file is deleted, expired or no longer accessible.';
  if (status === 429) return 'Too many requests. Please try again shortly.';
  return 'Could not load this file. Please try again.';
}

export async function loadOcr(id: string, signal: AbortSignal) {
  const res = await axiosInstance.get(route(id, '/ocr'), { signal, timeout: 30000 });
  return readOcrPreview(res.data);
}
export async function downloadOcr(file: ManagedFile) {
  const res = await axiosInstance.get<Blob>(route(file.fileId, '/ocr?download=1'), { responseType: 'blob', timeout: 30000 });
  const url = URL.createObjectURL(new Blob([res.data], { type: 'text/plain;charset=utf-8' }));
  const a = document.createElement('a'); a.href = url; a.download = file.originalName + '.ocr.txt';
  document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}
