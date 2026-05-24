"use client";

import { motion } from "framer-motion";
import Link from "next/link";

import ModelInputLimits from "@/components/common/ModelInputLimits/ModelInputLimits";

const TextToSpeech = () => (
  <>
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="text-gray-700 text-lg leading-relaxed"
    >
      Text to Speech (TTS) is an AI technology that converts written text into
      spoken voice. It allows AI to "talk" using natural-sounding speech instead
      of just displaying text.
    </motion.p>

    <motion.p
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="text-gray-700 text-lg leading-relaxed"
    >
      Modern AI voices are fast, expressive, and increasingly close to human
      speech.
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
          <span className="font-semibold">Text to Speech</span> → turns text
          into audio
        </li>
        <li>
          <span className="font-semibold">AI voice</span> → fast, scalable, and
          always available
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
        How Text to Speech works
      </h2>
      <p className="text-gray-700 text-lg leading-relaxed">
        Text to Speech uses neural networks trained on human speech to generate
        realistic audio.
      </p>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>1. Text is processed and normalized</li>
        <li>2. AI predicts pronunciation and tone</li>
        <li>3. Model generates waveform (audio)</li>
        <li>4. Output is played instantly</li>
      </ul>
      <p className="text-gray-700 text-lg leading-relaxed">
        Modern systems use deep learning to capture rhythm, emotion, and natural
        pauses.
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
        What models power Text to Speech?
      </h2>
      <p className="text-gray-700 text-lg leading-relaxed">
        Text to Speech is powered by:
      </p>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>👉 Neural TTS models (AI voice synthesis)</li>
        <li>👉 Optional GPT models (for improving phrasing)</li>
      </ul>
      <p className="text-gray-700 text-lg leading-relaxed">
        Unlike chat models, TTS focuses on audio generation rather than
        reasoning.
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
        AI voice vs human voice
      </h2>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>
          <span className="font-semibold">AI voice:</span> instant, scalable,
          always available
        </li>
        <li>
          <span className="font-semibold">Human voice:</span> more emotional and
          nuanced
        </li>
      </ul>
      <p className="text-gray-700 text-lg leading-relaxed">
        AI voice is already good enough for many real-world applications, but it
        may still lack deep emotional expression.
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
        Why use Text to Speech
      </h2>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>✔️ Hands-free interaction</li>
        <li>✔️ Faster content consumption</li>
        <li>✔️ Accessibility (for visually impaired users)</li>
        <li>✔️ Scalable voice generation</li>
        <li>✔️ Works across devices</li>
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
        <li>✔️ Voice assistants</li>
        <li>✔️ Reading articles or messages</li>
        <li>✔️ AI chat with voice responses</li>
        <li>✔️ Content narration</li>
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
        Limitations (honest)
      </h2>
      <ul className="list-disc list-inside text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>Less emotional than humans</li>
        <li>Can sound repetitive</li>
        <li>Depends on voice quality</li>
      </ul>
      <p className="text-gray-700 text-lg leading-relaxed">
        AI voice is improving quickly, but human speech is still more
        expressive.
      </p>
    </motion.div>

    <hr className="border-gray-200" />

    <ModelInputLimits model="Text → Voice" />

    <hr className="border-gray-200" />

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="space-y-4"
    >
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">
        Text to Speech vs reading text
      </h2>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>
          <span className="font-semibold">Voice:</span> faster, passive
          consumption
        </li>
        <li>
          <span className="font-semibold">Text:</span> better for deep focus
        </li>
      </ul>
      <p className="text-gray-700 text-lg leading-relaxed">
        👉{" "}
        <Link
          href="/ai-models-guide/compare-voice-vs-text-output"
          className="text-blue-600 hover:underline font-semibold"
        >
          Compare Voice vs Text Output
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
        When to use Text to Speech
      </h2>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>✔️ When you want hands-free usage</li>
        <li>✔️ When multitasking</li>
        <li>✔️ When reading is inconvenient</li>
      </ul>
      <p className="text-gray-700 text-lg leading-relaxed">
        For detailed reading or analysis, text is still better.
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
        Text to Speech transforms AI from a text tool into a conversational
        experience.
      </p>
      <p className="text-gray-700 text-lg leading-relaxed">
        It makes AI more natural, more accessible, and easier to use in everyday
        life.
      </p>
      <p className="text-gray-700 text-lg leading-relaxed">
        👉{" "}
        <Link
          href="/ai-models-guide/voice-to-text"
          className="text-blue-600 hover:underline font-semibold"
        >
          Learn about Voice to Text
        </Link>
      </p>
    </motion.div>
  </>
);

export default TextToSpeech;
