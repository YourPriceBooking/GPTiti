"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const CompareGpt4oVsGpt51 = () => (
  <>
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="text-gray-700 text-lg leading-relaxed"
    >
      GPT-4o and GPT-5.1 are both powerful AI models, but they are designed for
      different levels of performance.
    </motion.p>

    <motion.p
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="text-gray-700 text-lg leading-relaxed"
    >
      The main difference is simple: GPT-4o is faster and cheaper, while GPT-5.1
      provides better quality and more advanced reasoning.
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
          👉 <span className="font-semibold">Best overall:</span> GPT-5.1
        </li>
        <li>
          👉 <span className="font-semibold">Best for speed & cost:</span>{" "}
          GPT-4o
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
        Key difference
      </h2>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>
          <span className="font-semibold">GPT-4o</span> → fast, balanced,
          cost-efficient
        </li>
        <li>
          <span className="font-semibold">GPT-5.1</span> → higher quality,
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
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">
        Performance
      </h2>
      <p className="text-gray-700 text-lg leading-relaxed">
        GPT-5.1 delivers stronger performance overall. It produces more
        accurate, structured, and detailed responses, especially for complex
        tasks.
      </p>
      <p className="text-gray-700 text-lg leading-relaxed">
        GPT-4o is still very capable but focuses more on speed and efficiency
        rather than maximum output quality.
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
        Quality of responses
      </h2>
      <p className="text-gray-700 text-lg leading-relaxed">
        GPT-5.1 provides higher-quality answers. It is better for writing,
        coding, and professional tasks where accuracy and depth matter.
      </p>
      <p className="text-gray-700 text-lg leading-relaxed">
        GPT-4o is good for general tasks but may produce simpler or less
        detailed responses.
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
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>GPT-4o → faster responses</li>
        <li>GPT-5.1 → slightly slower but more accurate</li>
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
        Cost and token usage
      </h2>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>GPT-4o → ≈ 20 messages per 10,000 tokens</li>
        <li>GPT-5.1 → ≈ 16 messages per 10,000 tokens</li>
      </ul>
      <p className="text-gray-700 text-lg leading-relaxed">
        GPT-4o is more cost-efficient, while GPT-5.1 trades cost for better
        performance.
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

      <h3 className="text-lg font-semibold text-gray-800">Use GPT-4o if:</h3>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>✔️ You want faster responses</li>
        <li>✔️ Daily chat and general tasks</li>
        <li>✔️ Cost efficiency matters</li>
      </ul>

      <h3 className="text-lg font-semibold text-gray-800">Use GPT-5.1 if:</h3>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>✔️ You need higher quality output</li>
        <li>✔️ Writing, coding, or business tasks</li>
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
        GPT-4o is the best choice for speed and everyday usage.
      </p>
      <p className="text-gray-700 text-lg leading-relaxed">
        GPT-5.1 is the better option for higher-quality work and more demanding
        tasks.
      </p>
      <p className="text-gray-700 text-lg leading-relaxed">
        For most users who care about results,{" "}
        <span className="font-semibold">GPT-5.1</span> is the recommended model.
      </p>
    </motion.div>

    <hr className="border-gray-200" />

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="space-y-2"
    >
      <p className="text-gray-700 text-lg leading-relaxed">
        👉{" "}
        <Link
          href="/ai-models-guide/gpt-5-1"
          className="text-blue-600 hover:underline font-semibold"
        >
          Try GPT-5.1
        </Link>
      </p>
      <p className="text-gray-700 text-lg leading-relaxed">
        👉{" "}
        <Link
          href="/ai-models-guide/gpt-4o"
          className="text-blue-600 hover:underline font-semibold"
        >
          Try GPT-4o
        </Link>
      </p>
    </motion.div>
  </>
);

export default CompareGpt4oVsGpt51;
