"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const CompareGpt54VsO1 = () => (
  <>
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="text-gray-700 text-lg leading-relaxed"
    >
      GPT-5.4 and O1 are two of the most powerful AI models available, but they
      are designed for different purposes.
    </motion.p>

    <motion.p
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="text-gray-700 text-lg leading-relaxed"
    >
      The choice depends on what you need: overall performance or maximum
      reasoning depth.
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
          👉 <span className="font-semibold">Best overall:</span> GPT-5.4
        </li>
        <li>
          👉 <span className="font-semibold">Best for deep reasoning:</span> O1
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
          <span className="font-semibold">GPT-5.4</span> → best all-purpose
          performance
        </li>
        <li>
          <span className="font-semibold">O1</span> → best for complex reasoning
          and logic
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
        GPT-5.4 delivers the best overall performance. It is faster, more
        efficient, and works well across a wide range of tasks including
        writing, coding, and business workflows.
      </p>
      <p className="text-gray-700 text-lg leading-relaxed">
        O1 is more specialized. It focuses on deep reasoning and performs better
        in tasks that require multi-step logic and complex thinking.
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
        Reasoning ability
      </h2>
      <p className="text-gray-700 text-lg leading-relaxed">
        O1 provides the highest level of reasoning. It can solve complex
        problems, analyze deeply, and generate structured step-by-step answers.
      </p>
      <p className="text-gray-700 text-lg leading-relaxed">
        GPT-5.4 still has strong reasoning, but it is optimized for versatility
        rather than extreme depth.
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
        <li>GPT-5.4 → faster and more responsive</li>
        <li>O1 → slower due to deeper processing</li>
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
        <li>GPT-5.4 → ≈ 12 messages per 10,000 tokens</li>
        <li>O1 → ≈ 3 messages per 10,000 tokens</li>
      </ul>
      <p className="text-gray-700 text-lg leading-relaxed">
        O1 is significantly more expensive and should be used only when
        necessary.
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

      <h3 className="text-lg font-semibold text-gray-800">Use GPT-5.4 if:</h3>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>✔️ You need the best overall performance</li>
        <li>✔️ Writing, coding, or business tasks</li>
        <li>✔️ Faster and more efficient responses</li>
      </ul>

      <h3 className="text-lg font-semibold text-gray-800">Use O1 if:</h3>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>✔️ You need deep reasoning</li>
        <li>✔️ Complex technical problems</li>
        <li>✔️ Advanced debugging or analysis</li>
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
        GPT-5.4 is the best choice for most users. It offers the highest quality
        across all types of tasks.
      </p>
      <p className="text-gray-700 text-lg leading-relaxed">
        O1 should be used only for complex problems where maximum reasoning is
        required.
      </p>
      <p className="text-gray-700 text-lg leading-relaxed">
        For most use cases, <span className="font-semibold">GPT-5.4</span> is
        the recommended model.
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
          href="/ai-models-guide/gpt-5-4"
          className="text-blue-600 hover:underline font-semibold"
        >
          Try GPT-5.4
        </Link>
      </p>
      <p className="text-gray-700 text-lg leading-relaxed">
        👉{" "}
        <Link
          href="/ai-models-guide/o1"
          className="text-blue-600 hover:underline font-semibold"
        >
          Try O1
        </Link>
      </p>
    </motion.div>
  </>
);

export default CompareGpt54VsO1;
