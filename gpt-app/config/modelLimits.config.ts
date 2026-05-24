export type ModelLimits = {
  maxImages: number;
  maxImageSizeMb: number;
  maxFiles: number;
  maxFileSizeMb: number;
  maxLinks: number;
  maxTextChars: number | null;
};

const MODEL_LIMITS: Record<string, ModelLimits> = {
  "gpt-4o-mini": {
    maxImages: 3,
    maxImageSizeMb: 5,
    maxFiles: 3,
    maxFileSizeMb: 10,
    maxLinks: 3,
    maxTextChars: 20_000,
  },
  "gpt-4o": {
    maxImages: 5,
    maxImageSizeMb: 10,
    maxFiles: 5,
    maxFileSizeMb: 20,
    maxLinks: 5,
    maxTextChars: 40_000,
  },
  "gpt-4o-realtime": {
    maxImages: 0,
    maxImageSizeMb: 0,
    maxFiles: 0,
    maxFileSizeMb: 0,
    maxLinks: 0,
    maxTextChars: 5_000,
  },
  "gpt-5.4-mini": {
    maxImages: 3,
    maxImageSizeMb: 5,
    maxFiles: 3,
    maxFileSizeMb: 10,
    maxLinks: 3,
    maxTextChars: 25_000,
  },
  "gpt-5.1-mini": {
    maxImages: 3,
    maxImageSizeMb: 5,
    maxFiles: 3,
    maxFileSizeMb: 10,
    maxLinks: 3,
    maxTextChars: 25_000,
  },
  "gpt-5.1": {
    maxImages: 5,
    maxImageSizeMb: 10,
    maxFiles: 5,
    maxFileSizeMb: 20,
    maxLinks: 5,
    maxTextChars: 50_000,
  },
  "gpt-5.1-realtime": {
    maxImages: 0,
    maxImageSizeMb: 0,
    maxFiles: 0,
    maxFileSizeMb: 0,
    maxLinks: 0,
    maxTextChars: 5_000,
  },
  "gpt-5.4": {
    maxImages: 5,
    maxImageSizeMb: 10,
    maxFiles: 5,
    maxFileSizeMb: 20,
    maxLinks: 5,
    maxTextChars: 60_000,
  },
  "gpt-5.5": {
    maxImages: 5,
    maxImageSizeMb: 10,
    maxFiles: 5,
    maxFileSizeMb: 20,
    maxLinks: 5,
    maxTextChars: 80_000,
  },
  "o3-mini": {
    maxImages: 0,
    maxImageSizeMb: 0,
    maxFiles: 3,
    maxFileSizeMb: 10,
    maxLinks: 3,
    maxTextChars: 25_000,
  },
  "o1-mini": {
    maxImages: 0,
    maxImageSizeMb: 0,
    maxFiles: 3,
    maxFileSizeMb: 10,
    maxLinks: 3,
    maxTextChars: 30_000,
  },
  o1: {
    maxImages: 0,
    maxImageSizeMb: 0,
    maxFiles: 5,
    maxFileSizeMb: 20,
    maxLinks: 5,
    maxTextChars: 60_000,
  },
  "Smart Search": {
    maxImages: 0,
    maxImageSizeMb: 0,
    maxFiles: 10,
    maxFileSizeMb: 25,
    maxLinks: 10,
    maxTextChars: 100_000,
  },
  "Voice → Text": {
    maxImages: 0,
    maxImageSizeMb: 0,
    maxFiles: 0,
    maxFileSizeMb: 0,
    maxLinks: 0,
    maxTextChars: null,
  },
  "Text → Voice": {
    maxImages: 0,
    maxImageSizeMb: 0,
    maxFiles: 0,
    maxFileSizeMb: 0,
    maxLinks: 0,
    maxTextChars: 10_000,
  },
  "Image → Create HD": {
    maxImages: 0,
    maxImageSizeMb: 0,
    maxFiles: 0,
    maxFileSizeMb: 0,
    maxLinks: 0,
    maxTextChars: 2_000,
  },
  "Image → Create Fast": {
    maxImages: 0,
    maxImageSizeMb: 0,
    maxFiles: 0,
    maxFileSizeMb: 0,
    maxLinks: 0,
    maxTextChars: 1_500,
  },
};

/** Safe default for unknown models: behave like the most restrictive mini. */
const DEFAULT_LIMITS: ModelLimits = {
  maxImages: 3,
  maxImageSizeMb: 5,
  maxFiles: 3,
  maxFileSizeMb: 10,
  maxLinks: 3,
  maxTextChars: 20_000,
};

export function getModelLimits(model: string): ModelLimits {
  return MODEL_LIMITS[model] ?? DEFAULT_LIMITS;
}

/** Convenience: true when the model has zero image quota. */
export function modelSupportsImages(model: string): boolean {
  return getModelLimits(model).maxImages > 0;
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
