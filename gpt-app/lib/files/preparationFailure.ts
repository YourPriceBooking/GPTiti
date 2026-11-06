export class PreparationFailure extends Error {
  constructor(message: string, public readonly retryable: boolean, public readonly code?: string) {
    super(message);
    this.name = 'PreparationFailure';
  }
}

const permanentCodes = new Set([
  'PDF_PAGE_LIMIT', 'OCR_PAGE_LIMIT', 'OCR_FILE_TOO_LARGE', 'OCR_TEXT_TOO_LARGE',
  'PDF_PASSWORD_PROTECTED', 'INVALID_PDF_DOCUMENT', 'OCR_INVALID_IMAGE', 'OCR_IMAGE_LIMIT',
  'FILE_NOT_FOUND', 'ZIP_TOO_LARGE', 'ZIP_LIMIT', 'ZIP_ENCRYPTED',
  'ZIP_UNSAFE_PATH', 'ZIP_UNSUPPORTED', 'ZIP_UNSUPPORTED_ENTRY', 'INVALID_ZIP',
]);

export function cannotResumePreparation(error: unknown): boolean {
  if (error instanceof PreparationFailure) return !error.retryable;
  const code = (error as { response?: { data?: { error?: string } } })?.response?.data?.error;
  return Boolean(code && permanentCodes.has(code));
}
