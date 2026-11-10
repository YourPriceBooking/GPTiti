export type ModelLimits = {
  maxImages: number;
  maxImageSizeMb: number;
  maxFiles: number;
  maxFileSizeMb: number;
  maxLinks: number;
  maxTextChars: number | null;
};

// No optimistic fallback while the public catalog is unavailable.
const UNKNOWN_LIMITS: ModelLimits = {
  maxImages: 0,
  maxImageSizeMb: 0,
  maxFiles: 0,
  maxFileSizeMb: 0,
  maxLinks: 0,
  maxTextChars: null,
};
export function getModelLimits(
  model: string,
  catalog: readonly { title: string; limits: ModelLimits }[] = [],
): ModelLimits {
  return catalog.find((m) => m.title === model)?.limits ?? UNKNOWN_LIMITS;
}
export function modelSupportsImages(
  model: string,
  catalog: readonly { title: string; limits: ModelLimits }[] = [],
): boolean {
  return getModelLimits(model, catalog).maxImages > 0;
}

/**
 * Image-compression target used on the front-end before upload.
 * See `lib/compressImage.ts`.
 */
export const IMAGE_COMPRESSION = {
  maxLongSide: 1536,
  mimeType: "image/webp" as const,
  fallbackMimeType: "image/jpeg" as const,
  quality: 0.8,
} as const;
