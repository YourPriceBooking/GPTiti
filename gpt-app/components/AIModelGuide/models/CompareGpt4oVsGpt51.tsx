"use client";

import { motion } from "framer-motion";

const CompareGpt4oVsGpt51 = () => (
  <>
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="text-gray-700 text-lg leading-relaxed"
    >
      GPT-4o is a fast and reliable multimodal model, while GPT-5.1 offers
      improved quality from the newer GPT-5 generation.
    </motion.p>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="space-y-4"
    >
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">Overview</h2>
      <p className="text-gray-700 text-lg leading-relaxed">
        GPT-4o and GPT-5.1 are both strong general-purpose models. GPT-4o is a
        mature, well-rounded model with multimodal capabilities, while GPT-5.1
        represents the next generation — bringing better reasoning and output
        quality across most text-based tasks.
      </p>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="space-y-4"
    >
      <h2 className="text-xl md:text-2xl font-bold text-purple-600">
        GPT-4o strengths
      </h2>
      <ul className="list-disc list-inside text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>Multimodal — supports image input</li>
        <li>Fast and reliable</li>
        <li>Well-tested across many use cases</li>
        <li>128K context window</li>
        <li>Good cost-to-quality ratio</li>
      </ul>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="space-y-4"
    >
      <h2 className="text-xl md:text-2xl font-bold text-blue-600">
        GPT-5.1 strengths
      </h2>
      <ul className="list-disc list-inside text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>Newer generation — better baseline quality</li>
        <li>Improved instruction following</li>
        <li>Better at nuanced writing tasks</li>
        <li>Stronger reasoning on complex prompts</li>
        <li>More consistent outputs</li>
      </ul>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="space-y-4"
    >
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">
        Which should you choose?
      </h2>
      <p className="text-gray-700 text-lg leading-relaxed">
        If your task involves processing images, GPT-4o is the clear choice
        since GPT-5.1 is text-only. For purely text-based work — writing,
        analysis, Q&amp;A — GPT-5.1 generally produces better results. If
        you&apos;re starting a new project today, GPT-5.1 is the better default
        for text tasks.
      </p>
    </motion.div>
  </>
);

export default CompareGpt4oVsGpt51;
