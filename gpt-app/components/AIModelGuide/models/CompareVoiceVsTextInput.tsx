"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const CompareVoiceVsTextInput = () => (
  <>
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="text-gray-700 text-lg leading-relaxed"
    >
      Voice input and text input are two main ways to interact with AI. Each has
      its own strengths, depending on speed, accuracy, and context.
    </motion.p>

    <hr className="border-gray-200" />

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="space-y-4"
    >
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">
        Quick answer
      </h2>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>
          <span className="font-semibold">Voice input</span> → faster and more
          natural
        </li>
        <li>
          <span className="font-semibold">Text input</span> → more precise and
          controlled
        </li>
      </ul>
    </motion.div>

    <hr className="border-gray-200" />

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="space-y-4"
    >
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">
        Speed comparison
      </h2>
      <p className="text-gray-700 text-lg leading-relaxed">
        Voice is significantly faster than typing for most users.
      </p>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>Voice → ~120–160 words per minute</li>
        <li>Typing → ~40–70 words per minute</li>
      </ul>
      <p className="text-gray-700 text-lg leading-relaxed">
        For quick messages or long inputs, voice can be 2–3x faster.
      </p>
    </motion.div>

    <hr className="border-gray-200" />

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="space-y-4"
    >
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">
        Accuracy comparison
      </h2>
      <p className="text-gray-700 text-lg leading-relaxed">
        Text input is generally more accurate because you control every word.
        Voice input depends on audio quality and speech recognition.
      </p>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>
          <span className="font-semibold">Voice:</span> high accuracy, but
          depends on environment
        </li>
        <li>
          <span className="font-semibold">Text:</span> near-perfect accuracy
        </li>
      </ul>
    </motion.div>

    <hr className="border-gray-200" />

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="space-y-4"
    >
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">
        Ease of use
      </h2>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>✔️ Voice → natural, hands-free, no typing</li>
        <li>✔️ Text → better for editing and formatting</li>
      </ul>
      <p className="text-gray-700 text-lg leading-relaxed">
        Voice feels more like talking, while text feels more like working.
      </p>
    </motion.div>

    <hr className="border-gray-200" />

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="space-y-4"
    >
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">
        Best use cases
      </h2>
      <h3 className="text-lg font-semibold text-gray-800">
        Use Voice Input if:
      </h3>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>✔️ You want speed</li>
        <li>✔️ You are on mobile</li>
        <li>✔️ Hands are busy</li>
        <li>✔️ Casual chat or quick ideas</li>
      </ul>
      <h3 className="text-lg font-semibold text-gray-800">
        Use Text Input if:
      </h3>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>✔️ You need precision</li>
        <li>✔️ Writing or coding</li>
        <li>✔️ Structured input</li>
        <li>✔️ Editing content</li>
      </ul>
    </motion.div>

    <hr className="border-gray-200" />

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="space-y-4"
    >
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">
        How AI processes both
      </h2>
      <p className="text-gray-700 text-lg leading-relaxed">
        Voice input is first converted into text using speech recognition models
        (like Whisper), then processed by GPT models.
      </p>
      <p className="text-gray-700 text-lg leading-relaxed">
        Text input goes directly into the AI model without conversion.
      </p>
    </motion.div>

    <hr className="border-gray-200" />

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="space-y-4"
    >
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">
        Limitations
      </h2>
      <h3 className="text-lg font-semibold text-gray-800">Voice input:</h3>
      <ul className="list-disc list-inside text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>Sensitive to noise</li>
        <li>May misinterpret words</li>
      </ul>
      <h3 className="text-lg font-semibold text-gray-800">Text input:</h3>
      <ul className="list-disc list-inside text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>Slower</li>
        <li>Requires manual typing</li>
      </ul>
    </motion.div>

    <hr className="border-gray-200" />

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="space-y-4"
    >
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">
        Final verdict
      </h2>
      <p className="text-gray-700 text-lg leading-relaxed">
        Voice input is better for speed and natural interaction.
      </p>
      <p className="text-gray-700 text-lg leading-relaxed">
        Text input is better for accuracy and control.
      </p>
      <p className="text-gray-700 text-lg leading-relaxed">
        The best experience comes from using both depending on the situation.
      </p>
      <p className="text-gray-700 text-lg leading-relaxed">
        👉{" "}
        <Link
          href="/ai-models-guide/voice-to-text"
          className="text-blue-600 hover:underline font-semibold"
        >
          Learn more about Voice to Text
        </Link>
      </p>
    </motion.div>
  </>
);

export default CompareVoiceVsTextInput;
