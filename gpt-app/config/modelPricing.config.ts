const USD_TO_TOKENS = 100_000;

type ModelPricingUsd = {
  per30CharsUsd: number;
  perImageUsd: number;
  supportsImage: boolean;
};

const PRICING_USD: Record<string, ModelPricingUsd> = {
  "gpt-4o-mini": {
    per30CharsUsd: 0.0001815,
    perImageUsd: 0.0000945,
    supportsImage: true,
  },
  "gpt-4o": {
    per30CharsUsd: 0.003025,
    perImageUsd: 0.001575,
    supportsImage: true,
  },
  "gpt-4o-realtime": {
    per30CharsUsd: 0.00484,
    perImageUsd: 0.00315,
    supportsImage: true,
  },
  "gpt-5.4-mini": {
    per30CharsUsd: 0.0013575,
    perImageUsd: 0.0004725,
    supportsImage: true,
  },
  "gpt-5.1-mini": {
    per30CharsUsd: 0.0011,
    perImageUsd: 0.0004725,
    supportsImage: true,
  },
  "gpt-5.1": {
    per30CharsUsd: 0.006,
    perImageUsd: 0.0004725,
    supportsImage: true,
  },
  "gpt-5.1-realtime": {
    per30CharsUsd: 0.00724,
    perImageUsd: 0.00315,
    supportsImage: true,
  },
  "gpt-5.4": {
    per30CharsUsd: 0.004525,
    perImageUsd: 0.001575,
    supportsImage: true,
  },
  "gpt-5.5": {
    per30CharsUsd: 0.00905,
    perImageUsd: 0.00315,
    supportsImage: true,
  },
  "o3-mini": {
    per30CharsUsd: 0.0028,
    perImageUsd: 0,
    supportsImage: false,
  },
  "o1-mini": {
    per30CharsUsd: 0.0075,
    perImageUsd: 0,
    supportsImage: false,
  },
  o1: {
    per30CharsUsd: 0.038,
    perImageUsd: 0,
    supportsImage: false,
  },
};

export type ModelPricing = {
  per30CharsTokens: number;
  perImageTokens: number;
  supportsImage: boolean;
};

export const MODEL_PRICING: Record<string, ModelPricing> = Object.fromEntries(
  Object.entries(PRICING_USD).map(([key, val]) => [
    key,
    {
      per30CharsTokens: val.per30CharsUsd * USD_TO_TOKENS,
      perImageTokens: val.perImageUsd * USD_TO_TOKENS,
      supportsImage: val.supportsImage,
    },
  ])
);

const ESTIMATE_HIDDEN_FOR: ReadonlySet<string> = new Set([
  "Smart Search",
  "Voice → Text",
  "Text → Voice",
  "Image → Create HD",
  "Image → Create Fast",
]);

export function modelSupportsEstimate(model: string): boolean {
  return !ESTIMATE_HIDDEN_FOR.has(model) && model in MODEL_PRICING;
}

export function getEstimatedTokens(
  model: string,
  charCount: number,
  imageCount: number
): number | null {
  if (ESTIMATE_HIDDEN_FOR.has(model)) return null;
  const pricing = MODEL_PRICING[model];
  if (!pricing) return null;

  const safeChars = Math.max(0, charCount);
  const safeImages = Math.max(0, imageCount);
  if (safeChars === 0 && safeImages === 0) return null;

  const buckets = safeChars > 0 ? Math.ceil(safeChars / 30) : 0;
  const textTokens = buckets * pricing.per30CharsTokens;
  const imageTokens = pricing.supportsImage
    ? safeImages * pricing.perImageTokens
    : 0;

  return Math.max(1, Math.round(textTokens + imageTokens));
}
