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
