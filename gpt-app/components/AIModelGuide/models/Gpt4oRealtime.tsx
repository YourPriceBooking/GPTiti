"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const Gpt4oRealtime = () => (
  <>
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="text-gray-700 text-lg leading-relaxed"
    >
      GPT-4o-realtime is a fast and cost-efficient AI model for voice chat,
      live interaction, and real-time responses. It is designed for users who
      need instant communication without the higher cost of advanced realtime
      models.
    </motion.p>

    <motion.p
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="text-gray-700 text-lg leading-relaxed"
    >
      It provides a strong balance between speed, responsiveness, and
      affordability.
    </motion.p>

    <hr className="border-gray-200" />

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="space-y-4"
    >
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">
        What is GPT-4o-realtime?
      </h2>
      <p className="text-gray-700 text-lg leading-relaxed">
        GPT-4o-realtime is a streaming AI model optimized for real-time
        communication. It generates responses instantly, making it suitable for
        voice assistants, live chat, and interactive tools.
      </p>
      <p className="text-gray-700 text-lg leading-relaxed">
        Compared to GPT-5 realtime models, it is more affordable but slightly
        less powerful.
      </p>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="space-y-4"
    >
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">
        What is GPT-4o-realtime best for?
      </h2>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>✔️ Voice chat and conversations</li>
        <li>✔️ Real-time responses</li>
        <li>✔️ Interactive apps</li>
        <li>✔️ Fast communication tools</li>
      </ul>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="space-y-4"
    >
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">
        When GPT-4o-realtime is ideal
      </h2>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>✔️ Live conversations</li>
        <li>✔️ Voice assistants</li>
        <li>✔️ Real-time chat interfaces</li>
      </ul>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="space-y-4"
    >
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">
        When GPT-4o-realtime is not the best choice
      </h2>
      <ul className="list-disc list-inside text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>Text tasks (use GPT-4o or GPT-5 models)</li>
        <li>Complex reasoning (use O1)</li>
      </ul>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="space-y-4"
    >
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">Pros</h2>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>✔️ Fast response time</li>
        <li>✔️ Lower cost than advanced realtime models</li>
        <li>✔️ Good performance for live interaction</li>
      </ul>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="space-y-4"
    >
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">Cons</h2>
      <ul className="list-disc list-inside text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>Higher token usage than text models</li>
        <li>Less powerful than GPT-5 realtime</li>
      </ul>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="space-y-4"
    >
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">
        Token usage and cost
      </h2>
      <p className="text-gray-700 text-lg leading-relaxed">
        GPT-4o-realtime uses approximately{" "}
        <span className="font-semibold">1250 tokens per interaction</span>.
      </p>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>
          👉{" "}
          <span className="font-semibold">≈ 8 interactions per 10,000 tokens</span>
        </li>
      </ul>
      <p className="text-gray-700 text-lg leading-relaxed">
        Approximate real-time usage:
      </p>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>
          👉{" "}
          <span className="font-semibold">≈ 5–10 minutes of interaction</span>
        </li>
      </ul>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="space-y-4"
    >
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">
        When to choose GPT-4o-realtime
      </h2>
      <p className="text-gray-700 text-lg leading-relaxed">
        Choose GPT-4o-realtime if you need real-time interaction at a lower
        cost compared to advanced realtime models.
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
        Compare with other models
      </h2>
      <p className="text-gray-700 text-lg leading-relaxed">
        Not sure if this model is right for you? Compare alternatives:
      </p>
      <ul className="list-disc list-inside text-lg leading-relaxed space-y-1 pl-5">
        <li>
          <Link
            href="/ai-models-guide/gpt-5-1-realtime"
            className="text-blue-600 hover:underline"
          >
            GPT-5.1-realtime — higher quality realtime
          </Link>
        </li>
        <li>
          <Link
            href="/ai-models-guide/gpt-4o"
            className="text-blue-600 hover:underline"
          >
            GPT-4o — better for text tasks
          </Link>
        </li>
        <li>
          <Link
            href="/ai-models-guide/o1"
            className="text-blue-600 hover:underline"
          >
            O1 — deep reasoning tasks
          </Link>
        </li>
      </ul>
    </motion.div>
  </>
);

export default Gpt4oRealtime;
