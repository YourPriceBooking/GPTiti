"use client";

import type { ReactNode } from "react";

import { motion } from "framer-motion";

import { getModelLimits, type ModelLimits } from "@/config/modelLimits.config";

type Item = { label: string; value: ReactNode };

type ModelLimitsCopy = {
  displayName: string;
  intro: string;
  note: string;
  items: (limits: ModelLimits) => Item[];
};

const fmtChars = (n: number | null) =>
  `up to ${(n ?? 0).toLocaleString("en-US")} characters`;

const PER_MODEL: Record<string, ModelLimitsCopy> = {
  "gpt-4o-mini": {
    displayName: "GPT-4o-mini",
    intro:
      "GPT-4o-mini is designed for fast and affordable everyday AI tasks. It supports text, images, files, and links, but has lighter limits compared to premium models.",
    note: "These limits help keep GPT-4o-mini fast, affordable, and stable for daily use.",
    items: (l) => [
      { label: "Images", value: `up to ${l.maxImages} images per request` },
      { label: "Max image size", value: `${l.maxImageSizeMb} MB per image` },
      { label: "Files", value: `up to ${l.maxFiles} files per request` },
      { label: "Max file size", value: `${l.maxFileSizeMb} MB per file` },
      { label: "Links", value: `up to ${l.maxLinks} links per request` },
      { label: "Text", value: fmtChars(l.maxTextChars) },
    ],
  },

  "gpt-4o": {
    displayName: "GPT-4o",
    intro:
      "GPT-4o is a balanced multimodal model for text, images, files, and links. It works well for general tasks, image understanding, document analysis, and everyday professional work.",
    note: "GPT-4o is a good choice when you need image input, document context, and strong general performance.",
    items: (l) => [
      { label: "Images", value: `up to ${l.maxImages} images per request` },
      { label: "Max image size", value: `${l.maxImageSizeMb} MB per image` },
      { label: "Files", value: `up to ${l.maxFiles} files per request` },
      { label: "Max file size", value: `${l.maxFileSizeMb} MB per file` },
      { label: "Links", value: `up to ${l.maxLinks} links per request` },
      { label: "Text", value: fmtChars(l.maxTextChars) },
    ],
  },

  "gpt-4o-realtime": {
    displayName: "GPT-4o-realtime",
    intro:
      "GPT-4o-realtime is designed for live voice conversations and realtime interaction. It is not intended for file, image, or link-heavy workflows.",
    note: "Use GPT-4o-realtime for live voice AI, not for document or image analysis.",
    items: (l) => [
      { label: "Images", value: "not supported in this mode" },
      { label: "Files", value: "not supported in this mode" },
      { label: "Links", value: "not supported in this mode" },
      { label: "Audio", value: "1 live voice session or audio input" },
      { label: "Text", value: fmtChars(l.maxTextChars) },
    ],
  },

  "gpt-5.4-mini": {
    displayName: "GPT-5.4-mini",
    intro:
      "GPT-5.4-mini is the best-value model in GPTiti. It supports images, files, links, and text while keeping usage affordable.",
    note: "GPT-5.4-mini is ideal for users who want a strong balance between quality, speed, and token cost.",
    items: (l) => [
      { label: "Images", value: `up to ${l.maxImages} images per request` },
      { label: "Max image size", value: `${l.maxImageSizeMb} MB per image` },
      { label: "Files", value: `up to ${l.maxFiles} files per request` },
      { label: "Max file size", value: `${l.maxFileSizeMb} MB per file` },
      { label: "Links", value: `up to ${l.maxLinks} links per request` },
      { label: "Text", value: fmtChars(l.maxTextChars) },
    ],
  },

  "gpt-5.1-mini": {
    displayName: "GPT-5.1-mini",
    intro:
      "GPT-5.1-mini is a balanced mini model for daily AI usage. It supports common input types while keeping requests lightweight and efficient.",
    note: "GPT-5.1-mini is best for affordable daily work, summaries, writing, and quick analysis.",
    items: (l) => [
      { label: "Images", value: `up to ${l.maxImages} images per request` },
      { label: "Max image size", value: `${l.maxImageSizeMb} MB per image` },
      { label: "Files", value: `up to ${l.maxFiles} files per request` },
      { label: "Max file size", value: `${l.maxFileSizeMb} MB per file` },
      { label: "Links", value: `up to ${l.maxLinks} links per request` },
      { label: "Text", value: fmtChars(l.maxTextChars) },
    ],
  },

  "gpt-5.1": {
    displayName: "GPT-5.1",
    intro:
      "GPT-5.1 is a strong model for work, writing, content generation, and general AI tasks. It allows more context than mini models and is suitable for professional use.",
    note: "GPT-5.1 is a good choice for larger prompts, professional content, and more detailed AI responses.",
    items: (l) => [
      { label: "Images", value: `up to ${l.maxImages} images per request` },
      { label: "Max image size", value: `${l.maxImageSizeMb} MB per image` },
      { label: "Files", value: `up to ${l.maxFiles} files per request` },
      { label: "Max file size", value: `${l.maxFileSizeMb} MB per file` },
      { label: "Links", value: `up to ${l.maxLinks} links per request` },
      { label: "Text", value: fmtChars(l.maxTextChars) },
    ],
  },

  "gpt-5.1-realtime": {
    displayName: "GPT-5.1-realtime",
    intro:
      "GPT-5.1-realtime is built for live AI conversations, voice interaction, and realtime feedback. It is optimized for speaking and listening rather than file or image analysis.",
    note: "Use GPT-5.1-realtime when you want natural voice AI instead of traditional text chat.",
    items: (l) => [
      { label: "Images", value: "not supported in this mode" },
      { label: "Files", value: "not supported in this mode" },
      { label: "Links", value: "not supported in this mode" },
      { label: "Audio", value: "1 live voice session or audio input" },
      { label: "Text", value: fmtChars(l.maxTextChars) },
    ],
  },

  "gpt-5.4": {
    displayName: "GPT-5.4",
    intro:
      "GPT-5.4 is a powerful premium model for complex tasks, professional work, coding, analysis, and high-quality content. It supports larger prompts and more attached context than mini models.",
    note: "GPT-5.4 is best when you need strong reasoning, larger context, and better output quality.",
    items: (l) => [
      { label: "Images", value: `up to ${l.maxImages} images per request` },
      { label: "Max image size", value: `${l.maxImageSizeMb} MB per image` },
      { label: "Files", value: `up to ${l.maxFiles} files per request` },
      { label: "Max file size", value: `${l.maxFileSizeMb} MB per file` },
      { label: "Links", value: `up to ${l.maxLinks} links per request` },
      { label: "Text", value: fmtChars(l.maxTextChars) },
    ],
  },

  "gpt-5.5": {
    displayName: "GPT-5.5",
    intro:
      "GPT-5.5 is the premium advanced model in GPTiti. It is designed for serious work, deep analysis, coding, professional writing, and complex prompts with more context.",
    note: "GPT-5.5 is best for advanced tasks where quality, reasoning, and detailed context matter more than speed or cost.",
    items: (l) => [
      { label: "Images", value: `up to ${l.maxImages} images per request` },
      { label: "Max image size", value: `${l.maxImageSizeMb} MB per image` },
      { label: "Files", value: `up to ${l.maxFiles} files per request` },
      { label: "Max file size", value: `${l.maxFileSizeMb} MB per file` },
      { label: "Links", value: `up to ${l.maxLinks} links per request` },
      { label: "Text", value: fmtChars(l.maxTextChars) },
    ],
  },

  "o3-mini": {
    displayName: "O3-mini",
    intro:
      "O3-mini is a budget reasoning model for logic, planning, and structured problem solving. It does not support image inputs, but files and links can be processed as extracted text.",
    note: "For files and links, GPTiti extracts the text first and then sends the content to O3-mini for reasoning.",
    items: (l) => [
      { label: "Images", value: "not supported" },
      { label: "Files", value: `up to ${l.maxFiles} files per request` },
      { label: "Max file size", value: `${l.maxFileSizeMb} MB per file` },
      { label: "Links", value: `up to ${l.maxLinks} links per request` },
      { label: "Text", value: fmtChars(l.maxTextChars) },
    ],
  },

  "o1-mini": {
    displayName: "O1-mini",
    intro:
      "O1-mini is an affordable reasoning model for step-by-step thinking, logic, and structured analysis. It does not process images directly.",
    note: "Use O1-mini when you need reasoning at a lower cost, but do not need image input.",
    items: (l) => [
      { label: "Images", value: "not supported" },
      { label: "Files", value: `up to ${l.maxFiles} files per request` },
      { label: "Max file size", value: `${l.maxFileSizeMb} MB per file` },
      { label: "Links", value: `up to ${l.maxLinks} links per request` },
      { label: "Text", value: fmtChars(l.maxTextChars) },
    ],
  },

  o1: {
    displayName: "O1",
    intro:
      "O1 is a deep reasoning model for complex logic, difficult planning, math, and advanced problem solving. It does not support image inputs in GPTiti.",
    note: "O1 is best for reasoning-heavy tasks where careful thinking matters more than speed.",
    items: (l) => [
      { label: "Images", value: "not supported" },
      { label: "Files", value: `up to ${l.maxFiles} files per request` },
      { label: "Max file size", value: `${l.maxFileSizeMb} MB per file` },
      { label: "Links", value: `up to ${l.maxLinks} links per request` },
      { label: "Text", value: fmtChars(l.maxTextChars) },
    ],
  },

  "Smart Search": {
    displayName: "Smart Search",
    intro:
      "Smart Search is designed to search your data with AI. It works best with documents, spreadsheets, text, and links that can be indexed or analyzed.",
    note: "Smart Search is best for finding answers inside your documents, data, notes, and web content.",
    items: (l) => [
      { label: "Images", value: "not supported for Smart Search yet" },
      { label: "Files", value: `up to ${l.maxFiles} files per request` },
      { label: "Max file size", value: `${l.maxFileSizeMb} MB per file` },
      { label: "Links", value: `up to ${l.maxLinks} links per request` },
      { label: "Text", value: fmtChars(l.maxTextChars) },
    ],
  },

  "Voice → Text": {
    displayName: "Voice → Text",
    intro:
      "Voice → Text converts speech into written text. It is designed for voice notes, recordings, meetings, ideas, and quick dictation.",
    note: "Use Voice → Text when you want to turn speech into clean, editable text.",
    items: () => [
      { label: "Audio", value: "1 audio file or recording per request" },
      { label: "Max audio size", value: "25 MB" },
      { label: "Images", value: "not supported" },
      { label: "Files", value: "not supported" },
      { label: "Links", value: "not supported" },
    ],
  },

  "Text → Voice": {
    displayName: "Text → Voice",
    intro:
      "Text → Voice turns written text into natural AI speech. It is useful for voice replies, narration, product demos, learning, and audio content.",
    note: "Use Text → Voice when you already have text and want to generate natural audio.",
    items: (l) => [
      { label: "Text", value: fmtChars(l.maxTextChars) },
      { label: "Images", value: "not supported" },
      { label: "Files", value: "not supported" },
      { label: "Links", value: "not supported" },
      { label: "Audio input", value: "not supported" },
    ],
  },

  "Image → Create HD": {
    displayName: "Image → Create HD",
    intro:
      "Image → Create HD generates high-quality AI images from text prompts. It is optimized for better detail, stronger visual quality, and professional image generation.",
    note: "Use Image → Create HD when image quality matters more than speed or cost.",
    items: (l) => [
      { label: "Input", value: "text prompt only" },
      { label: "Prompt length", value: fmtChars(l.maxTextChars) },
      {
        label: "Images",
        value: "uploaded image input is not used in this mode",
      },
      { label: "Files", value: "not supported" },
      { label: "Links", value: "not supported" },
      { label: "Output", value: "1 generated image per request" },
    ],
  },

  "Image → Create Fast": {
    displayName: "Image → Create Fast",
    intro:
      "Image → Create Fast generates AI images quickly at a lower token cost. It is best for drafts, ideas, quick visuals, and everyday image generation.",
    note: "Use Image → Create Fast when you need quick image ideas at a lower cost.",
    items: (l) => [
      { label: "Input", value: "text prompt only" },
      { label: "Prompt length", value: fmtChars(l.maxTextChars) },
      {
        label: "Images",
        value: "uploaded image input is not used in this mode",
      },
      { label: "Files", value: "not supported" },
      { label: "Links", value: "not supported" },
      { label: "Output", value: "1 generated image per request" },
    ],
  },
};

type Props = {
  /** Model key as used in `modelLimits.config.ts` (e.g. `"gpt-5.5"`). */
  model: string;
};

const ModelInputLimits = ({ model }: Props) => {
  const copy = PER_MODEL[model];
  if (!copy) return null;

  const limits = getModelLimits(model);
  const items = copy.items(limits);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="space-y-4"
    >
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">
        {copy.displayName} input limits
      </h2>
      <p className="text-gray-700 text-lg leading-relaxed">{copy.intro}</p>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-2 pl-5">
        {items.map((item) => (
          <li key={item.label}>
            <span className="font-semibold">{item.label}:</span> {item.value}
          </li>
        ))}
      </ul>
      <p className="text-gray-500 text-sm leading-relaxed">{copy.note}</p>
    </motion.div>
  );
};

export default ModelInputLimits;
