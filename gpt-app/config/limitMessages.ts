import { getModelLimits } from "./modelLimits.config";

export type LimitKind =
  | "imagesCount"
  | "imagesNotSupported"
  | "imageSize"
  | "filesCount"
  | "filesNotSupported"
  | "fileSize"
  | "linksCount"
  | "linksNotSupported"
  | "textLength"
  | "audioNotSupported"
  | "audioCount"
  | "audioSize";

export type LimitMessage = {
  heading: string;
  body: string;
  note?: string;
};

const HEADINGS: Record<LimitKind, string> = {
  imagesCount: "Image limit reached",
  imagesNotSupported: "Images are not supported",
  imageSize: "Image is too large",
  filesCount: "File limit reached",
  filesNotSupported: "Files are not supported",
  fileSize: "File is too large",
  linksCount: "Link limit reached",
  linksNotSupported: "Links are not supported",
  textLength: "Message is too long",
  audioNotSupported: "Audio is not supported",
  audioCount: "Only 1 audio per request",
  audioSize: "Audio file is too large",
};

type Templater = (model: string, value: number) => string;

const UNIVERSAL: Record<LimitKind, Templater> = {
  imagesCount: (m, n) =>
    `You can add up to ${n} image${n === 1 ? "" : "s"} per request with ${m}.`,
  imagesNotSupported: (m) => `${m} does not support image inputs.`,
  imageSize: (m, mb) =>
    `This image is too large. Max image size for ${m} is ${mb} MB.`,
  filesCount: (m, n) =>
    `You can add up to ${n} file${n === 1 ? "" : "s"} per request with ${m}.`,
  filesNotSupported: (m) => `${m} does not support file uploads.`,
  fileSize: (m, mb) =>
    `This file is too large. Max file size for ${m} is ${mb} MB.`,
  linksCount: (m, n) =>
    `You can add up to ${n} link${n === 1 ? "" : "s"} per request with ${m}.`,
  linksNotSupported: (m) => `${m} does not support links in this mode.`,
  textLength: (m, c) =>
    `Your message is too long. Max text length for ${m} is ${c.toLocaleString(
      "en-US"
    )} characters.`,
  audioNotSupported: (m) => `${m} does not support audio input.`,
  audioCount: (m) => `${m} supports only 1 audio input per request.`,
  audioSize: (m, mb) =>
    `This audio file is too large. Max audio size for ${m} is ${mb} MB.`,
};

const REALTIME_MODELS = new Set(["gpt-4o-realtime", "gpt-5.1-realtime"]);
const O_SERIES_MODELS = new Set(["o1", "o1-mini", "o3-mini"]);

const DEFAULT_AUDIO_SIZE_MB = 25;

type OverrideBuilder = (model: string, value: number) => LimitMessage;
type OverrideMap = Partial<Record<LimitKind, OverrideBuilder>>;

const TOOL_OVERRIDES: Record<string, OverrideMap> = {
  "Smart Search": {
    imagesNotSupported: () => ({
      heading: HEADINGS.imagesNotSupported,
      body: "Smart Search does not support image inputs yet.",
      note: "Use files, text, documents, spreadsheets, or links instead.",
    }),
    filesCount: (_m, n) => ({
      heading: HEADINGS.filesCount,
      body: `You can add up to ${n} files to Smart Search.`,
    }),
    linksCount: (_m, n) => ({
      heading: HEADINGS.linksCount,
      body: `You can add up to ${n} links to Smart Search.`,
    }),
    fileSize: (_m, mb) => ({
      heading: HEADINGS.fileSize,
      body: `This file is too large. Max file size for Smart Search is ${mb} MB.`,
    }),
    textLength: (_m, c) => ({
      heading: HEADINGS.textLength,
      body: `Your text is too long. Smart Search supports up to ${c.toLocaleString(
        "en-US"
      )} characters.`,
    }),
  },
  "Voice → Text": {
    imagesNotSupported: () => ({
      heading: HEADINGS.imagesNotSupported,
      body: "Voice → Text only accepts audio input.",
    }),
    filesNotSupported: () => ({
      heading: HEADINGS.filesNotSupported,
      body: "Voice → Text only accepts audio input.",
    }),
    audioCount: () => ({
      heading: HEADINGS.audioCount,
      body: "Voice → Text supports only 1 audio file or recording per request.",
    }),
    audioSize: (_m, mb) => ({
      heading: HEADINGS.audioSize,
      body: `This audio file is too large. Max audio size is ${mb} MB.`,
    }),
  },
  "Text → Voice": {
    imagesNotSupported: () => ({
      heading: HEADINGS.imagesNotSupported,
      body: "Text → Voice only works with text input.",
    }),
    filesNotSupported: () => ({
      heading: HEADINGS.filesNotSupported,
      body: "Text → Voice only works with text input.",
    }),
    textLength: (_m, c) => ({
      heading: HEADINGS.textLength,
      body: `Your text is too long. Text → Voice supports up to ${c.toLocaleString(
        "en-US"
      )} characters.`,
    }),
  },
  "Image → Create HD": {
    imagesNotSupported: () => ({
      heading: HEADINGS.imagesNotSupported,
      body: "Image → Create HD creates images from text prompts.",
      note: "Uploaded images are not used in this mode.",
    }),
    textLength: (_m, c) => ({
      heading: HEADINGS.textLength,
      body: `Your prompt is too long. Image → Create HD supports up to ${c.toLocaleString(
        "en-US"
      )} characters.`,
    }),
  },
  "Image → Create Fast": {
    imagesNotSupported: () => ({
      heading: HEADINGS.imagesNotSupported,
      body: "Image → Create Fast creates images from text prompts.",
      note: "Uploaded images are not used in this mode.",
    }),
    textLength: (_m, c) => ({
      heading: HEADINGS.textLength,
      body: `Your prompt is too long. Image → Create Fast supports up to ${c.toLocaleString(
        "en-US"
      )} characters.`,
    }),
  },
};

function valueForKind(kind: LimitKind, model: string): number {
  const l = getModelLimits(model);
  switch (kind) {
    case "imagesCount":
      return l.maxImages;
    case "imageSize":
      return l.maxImageSizeMb;
    case "filesCount":
      return l.maxFiles;
    case "fileSize":
      return l.maxFileSizeMb;
    case "linksCount":
      return l.maxLinks;
    case "textLength":
      return l.maxTextChars ?? 0;
    case "audioSize":
      return DEFAULT_AUDIO_SIZE_MB;
    default:
      return 0;
  }
}

function realtimeOverride(kind: LimitKind, model: string): LimitMessage | null {
  if (!REALTIME_MODELS.has(model)) return null;
  if (kind === "imagesNotSupported") {
    return {
      heading: HEADINGS.imagesNotSupported,
      body: `${model} is built for live voice. Images are not supported in this mode.`,
    };
  }
  if (kind === "filesNotSupported") {
    return {
      heading: HEADINGS.filesNotSupported,
      body: `${model} is built for live voice. File uploads are not supported in this mode.`,
    };
  }
  if (kind === "linksNotSupported") {
    return {
      heading: HEADINGS.linksNotSupported,
      body: `${model} is built for live voice. Links are not supported in this mode.`,
    };
  }
  return null;
}

function oSeriesOverride(kind: LimitKind, model: string): LimitMessage | null {
  if (!O_SERIES_MODELS.has(model)) return null;
  if (kind === "imagesNotSupported") {
    return {
      heading: HEADINGS.imagesNotSupported,
      body: `${model} does not support image inputs.`,
      note: "Please choose a GPT model with image support.",
    };
  }
  return null;
}

export function getLimitMessage(kind: LimitKind, model: string): LimitMessage {
  const value = valueForKind(kind, model);

  const toolOverride = TOOL_OVERRIDES[model]?.[kind];
  if (toolOverride) return toolOverride(model, value);

  const realtime = realtimeOverride(kind, model);
  if (realtime) return realtime;

  const oSeries = oSeriesOverride(kind, model);
  if (oSeries) return oSeries;

  return {
    heading: HEADINGS[kind],
    body: UNIVERSAL[kind](model, value),
  };
}
