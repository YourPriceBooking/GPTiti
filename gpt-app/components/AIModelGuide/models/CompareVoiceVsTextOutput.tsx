"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const CompareVoiceVsTextOutput = () => (
  <>
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="text-gray-700 text-lg leading-relaxed"
    >
      AI can deliver information in two main ways: voice (audio) and text. Each
      format has advantages depending on how you consume information.
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
          <span className="font-semibold">Voice output</span> → better for speed
          and multitasking
        </li>
        <li>
          <span className="font-semibold">Text output</span> → better for focus
          and deep understanding
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
        Speed: listening vs reading
      </h2>
      <p className="text-gray-700 text-lg leading-relaxed">
        Listening and reading speeds are different depending on the context.
      </p>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>Voice → ~150–180 words per minute</li>
        <li>Reading → ~200–300 words per minute (silent reading)</li>
      </ul>
      <p className="text-gray-700 text-lg leading-relaxed">
        Reading is technically faster, but voice allows passive consumption.
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
        Understanding and retention
      </h2>
      <p className="text-gray-700 text-lg leading-relaxed">
        Text is generally better for deep understanding, especially for complex
        topics. Voice is better for general understanding and quick information.
      </p>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>
          <span className="font-semibold">Voice:</span> easier, more natural,
          less effort
        </li>
        <li>
          <span className="font-semibold">Text:</span> better for analysis and
          memory
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
        Multitasking
      </h2>
      <p className="text-gray-700 text-lg leading-relaxed">
        Voice output allows you to consume information while doing other tasks.
      </p>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>✔️ Walking</li>
        <li>✔️ Driving</li>
        <li>✔️ Working</li>
      </ul>
      <p className="text-gray-700 text-lg leading-relaxed">
        Text requires full visual attention.
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
        Use Voice Output if:
      </h3>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>✔️ You want hands-free interaction</li>
        <li>✔️ You are multitasking</li>
        <li>✔️ Listening to summaries or messages</li>
      </ul>
      <h3 className="text-lg font-semibold text-gray-800">
        Use Text Output if:
      </h3>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>✔️ You need deep understanding</li>
        <li>✔️ You are reading complex content</li>
        <li>✔️ You need to reference information</li>
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
        How AI generates both
      </h2>
      <p className="text-gray-700 text-lg leading-relaxed">
        Text output is generated directly by GPT models. Voice output is
        generated by Text-to-Speech models based on that text.
      </p>
      <p className="text-gray-700 text-lg leading-relaxed">
        This means voice is an additional layer on top of text generation.
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
      <h3 className="text-lg font-semibold text-gray-800">Voice output:</h3>
      <ul className="list-disc list-inside text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>Slower for detailed information</li>
        <li>Harder to scan quickly</li>
      </ul>
      <h3 className="text-lg font-semibold text-gray-800">Text output:</h3>
      <ul className="list-disc list-inside text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>Requires attention</li>
        <li>Less convenient on mobile</li>
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
        Voice output is better for convenience and accessibility.
      </p>
      <p className="text-gray-700 text-lg leading-relaxed">
        Text output is better for precision and deep work.
      </p>
      <p className="text-gray-700 text-lg leading-relaxed">
        The best experience is combining both — read when needed, listen when
        convenient.
      </p>
      <p className="text-gray-700 text-lg leading-relaxed">
        👉{" "}
        <Link
          href="/ai-models-guide/text-to-speech"
          className="text-blue-600 hover:underline font-semibold"
        >
          Learn more about Text to Speech
        </Link>
      </p>
    </motion.div>
  </>
);

export default CompareVoiceVsTextOutput;
