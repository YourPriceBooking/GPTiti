"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const CompareGpt54MiniVsGpt4oMini = () => (
  <>
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="text-gray-700 text-lg leading-relaxed"
    >
      Choosing between GPT-5.4-mini and GPT-4o-mini depends on your priorities:
      cost vs quality. Both are popular AI models for chat, writing, and
      everyday tasks, but they serve different use cases.
    </motion.p>

    <hr className="border-gray-200" />

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="space-y-4"
    >
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">
        Key difference
      </h2>
      <ul className="list-disc list-inside text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>
          <span className="font-semibold">GPT-4o-mini</span> — cheap, fast,
          best for simple tasks
        </li>
        <li>
          <span className="font-semibold">GPT-5.4-mini</span> — higher quality,
          better reasoning
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
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">Quality</h2>
      <p className="text-gray-700 text-lg leading-relaxed">
        GPT-5.4-mini provides significantly better answers, more accurate
        responses, and stronger reasoning compared to GPT-4o-mini. It is more
        suitable for complex tasks like writing, coding, and structured outputs.
      </p>
    </motion.div>

    <hr className="border-gray-200" />

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="space-y-4"
    >
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">Cost</h2>
      <ul className="list-disc list-inside text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>GPT-4o-mini — ≈ 260 messages per 10,000 tokens</li>
        <li>GPT-5.4-mini — ≈ 75 messages per 10,000 tokens</li>
      </ul>
      <p className="text-gray-700 text-lg leading-relaxed">
        GPT-4o-mini is approximately 3–4x cheaper, making it the best option
        for high-volume usage.
      </p>
    </motion.div>

    <hr className="border-gray-200" />

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="space-y-4"
    >
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">Speed</h2>
      <ul className="list-disc list-inside text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>GPT-4o-mini — faster</li>
        <li>GPT-5.4-mini — slightly slower but more accurate</li>
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
      <h3 className="text-lg font-semibold text-gray-800">
        Use GPT-4o-mini if:
      </h3>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>✔️ You want cheap usage</li>
        <li>✔️ Simple chat and messaging</li>
        <li>✔️ High-volume tasks</li>
      </ul>
      <h3 className="text-lg font-semibold text-gray-800">
        Use GPT-5.4-mini if:
      </h3>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>✔️ You need better quality</li>
        <li>✔️ Writing or coding</li>
        <li>✔️ More accurate and structured answers</li>
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
        GPT-4o-mini is the best choice for cost efficiency and frequent usage.
        GPT-5.4-mini is the better option for higher quality and more demanding
        tasks.
      </p>
      <p className="text-gray-700 text-lg leading-relaxed">
        For most users,{" "}
        <span className="font-semibold">GPT-5.4-mini</span> is the recommended
        choice.
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
        Explore these models
      </h2>
      <p className="text-gray-700 text-lg leading-relaxed">
        Want to learn more? Read detailed guides:
      </p>
      <ul className="list-disc list-inside text-lg leading-relaxed space-y-1 pl-5">
        <li>
          <Link
            href="/ai-models-guide/gpt-5-4-mini"
            className="text-blue-600 hover:underline"
          >
            GPT-5.4-mini — Best balance
          </Link>
        </li>
        <li>
          <Link
            href="/ai-models-guide/gpt-4o-mini"
            className="text-blue-600 hover:underline"
          >
            GPT-4o-mini — Cheapest option
          </Link>
        </li>
      </ul>
    </motion.div>
  </>
);

export default CompareGpt54MiniVsGpt4oMini;
