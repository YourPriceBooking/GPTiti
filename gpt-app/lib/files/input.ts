export const TEXT_EXTENSIONS = 'txt md csv tsv json xml yaml yml html css js jsx ts tsx py sql sh java c cpp h go rs rb php log'.split(' ');
export const IMAGE_EXTENSIONS = ['png', 'jpg', 'jpeg', 'webp'];
export const IMAGE_ACCEPT = IMAGE_EXTENSIONS.map(ext => '.' + ext).join(',');
export const FILE_ACCEPT = [...TEXT_EXTENSIONS, ...IMAGE_EXTENSIONS].map(ext => '.' + ext).join(',');
export const TEXT_FILE_BYTES = 64 * 1024;
export const TEXT_CONTEXT_BYTES = 128 * 1024;
export const TOTAL_FILE_BYTES = 25 * 1024 * 1024;
export const MAX_ATTACHMENTS = 10;
type InputFile = { name: string; size: number };
export const inputKind = (file: InputFile) => {
  const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
  return IMAGE_EXTENSIONS.includes(ext) ? 'image' : TEXT_EXTENSIONS.includes(ext) ? 'text' : null;
};
export function validateInputFiles(files: InputFile[], limits: { maxImages: number; maxImageSizeMb: number }): string | null {
  if (files.length > MAX_ATTACHMENTS) return 'Attach up to 10 files in total, including images.';
  let textBytes = 0, totalBytes = 0, images = 0;
  for (const file of files) {
    const kind = inputKind(file);
    if (!kind) return `${file.name}: this format cannot be read yet. Choose text, code, PNG, JPG or WEBP. See ⓘ for all supported formats.`;
    if (!file.size) return `${file.name}: the file is empty.`;
    totalBytes += file.size;
    if (kind === 'text') {
      if (file.size > TEXT_FILE_BYTES) return `${file.name}: text files must be 64 KiB or smaller. Split the file before attaching it.`;
      textBytes += file.size;
    } else {
      images++;
      if (!limits.maxImages) return 'The selected model does not support image attachments. Choose another model or remove the images.';
      if (file.size > Math.min(TOTAL_FILE_BYTES, limits.maxImageSizeMb * 1024 * 1024)) return `${file.name}: the image exceeds this model’s ${limits.maxImageSizeMb} MB limit.`;
    }
  }
  if (images > limits.maxImages) return `The selected model allows up to ${limits.maxImages} images.`;
  if (textBytes > TEXT_CONTEXT_BYTES) return 'Text attachments exceed 128 KiB. Use smaller files. Earlier attachments in this chat also count toward the server’s context limit.';
  if (totalBytes > TOTAL_FILE_BYTES) return 'Attachments exceed the 25 MiB total limit. Use smaller files.';
  return null;
}
export function validateTextBytes(bytes: ArrayBuffer): string | null {
  let text;
  try { text = new TextDecoder('utf-8', { fatal: true }).decode(bytes); } catch { return 'Save this file as UTF-8 text and try again.'; }
  return /[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/.test(text) ? 'This file contains unsupported binary or control characters.' : null;
}
