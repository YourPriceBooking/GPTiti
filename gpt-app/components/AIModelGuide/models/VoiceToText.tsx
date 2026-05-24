"use client";

import { motion } from "framer-motion";
import Link from "next/link";

import ModelInputLimits from "@/components/common/ModelInputLimits/ModelInputLimits";

const VoiceToText = () => (
  <>
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="text-gray-700 text-lg leading-relaxed"
    >
      Voice to Text is an AI feature that converts spoken language into written
      text in real time. Instead of typing, you can simply speak — and the
      system transcribes your words instantly.
    </motion.p>

    <motion.p
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="text-gray-700 text-lg leading-relaxed"
    >
      It is widely used for chat, voice assistants, transcription, and
      hands-free workflows.
    </motion.p>

    <hr className="border-gray-200" />

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="space-y-4"
    >
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">
        How Voice to Text works
      </h2>
      <p className="text-gray-700 text-lg leading-relaxed">
        Voice to Text uses speech recognition models trained on large datasets
        of audio and language.
      </p>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>1. Audio is captured from microphone</li>
        <li>2. AI processes sound waves</li>
        <li>3. Speech is converted into text</li>
        <li>4. Output is returned instantly</li>
      </ul>
      <p className="text-gray-700 text-lg leading-relaxed">
        Modern systems use neural networks that understand accents, context, and
        natural speech patterns.
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
        What models power Voice to Text?
      </h2>
      <p className="text-gray-700 text-lg leading-relaxed">
        Voice to Text is typically powered by:
      </p>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>👉 Speech-to-text models (like Whisper)</li>
        <li>👉 Language models (optional, for correction and formatting)</li>
      </ul>
      <p className="text-gray-700 text-lg leading-relaxed">
        Speech models handle transcription, while GPT models can improve
        readability and structure.
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
        Why Voice to Text is useful
      </h2>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>✔️ Faster than typing</li>
        <li>✔️ Works hands-free</li>
        <li>✔️ Great for mobile and multitasking</li>
        <li>✔️ Natural way to interact with AI</li>
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
        Best use cases
      </h2>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>✔️ Chat and messaging</li>
        <li>✔️ Voice assistants</li>
        <li>✔️ Meeting transcription</li>
        <li>✔️ Notes and dictation</li>
        <li>✔️ Accessibility tools</li>
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
        Accuracy and limitations
      </h2>
      <p className="text-gray-700 text-lg leading-relaxed">
        Voice to Text is highly accurate, but not perfect.
      </p>
      <ul className="list-disc list-inside text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>Background noise can reduce accuracy</li>
        <li>Strong accents may affect results</li>
        <li>Requires good audio quality</li>
      </ul>
      <p className="text-gray-700 text-lg leading-relaxed">
        Most systems improve accuracy using AI post-processing.
      </p>
    </motion.div>

    <hr className="border-gray-200" />

    <ModelInputLimits model="Voice → Text" />

    <hr className="border-gray-200" />

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="space-y-4"
    >
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">
        Voice to Text vs typing
      </h2>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>
          <span className="font-semibold">Voice:</span> faster, more natural
        </li>
        <li>
          <span className="font-semibold">Typing:</span> more precise control
        </li>
      </ul>
      <p className="text-gray-700 text-lg leading-relaxed">
        👉{" "}
        <Link
          href="/ai-models-guide/compare-voice-vs-text-input"
          className="text-blue-600 hover:underline font-semibold"
        >
          Compare Voice vs Text Input
        </Link>
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
        When to use Voice to Text
      </h2>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>✔️ When you need speed</li>
        <li>✔️ When typing is inconvenient</li>
        <li>✔️ When using mobile devices</li>
      </ul>
      <p className="text-gray-700 text-lg leading-relaxed">
        For detailed editing or coding, typing is still more efficient.
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
        Final thoughts
      </h2>
      <p className="text-gray-700 text-lg leading-relaxed">
        Voice to Text is one of the most natural ways to interact with AI.
      </p>
      <p className="text-gray-700 text-lg leading-relaxed">
        It turns speech into input instantly, making AI faster and more
        accessible.
      </p>
      <p className="text-gray-700 text-lg leading-relaxed">
        👉{" "}
        <Link
          href="/ai-models-guide/text-to-speech"
          className="text-blue-600 hover:underline font-semibold"
        >
          Learn about Text to Speech
        </Link>
      </p>
    </motion.div>
  </>
);

export default VoiceToText;
