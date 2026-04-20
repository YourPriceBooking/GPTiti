"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const CompareO1VsO3Mini = () => (
  <>
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="text-gray-700 text-lg leading-relaxed"
    >
      O1 and O3-mini are AI models designed for reasoning, logic, and problem
      solving. The main difference is cost vs depth: O1 offers maximum reasoning
      power, while O3-mini provides a more affordable solution for everyday
      logic tasks.
    </motion.p>

    <motion.p
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="text-gray-700 text-lg leading-relaxed"
    >
      Choosing the right model depends on how complex your tasks are and how
      many tokens you want to spend.
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
          <span className="font-semibold">O3-mini</span> — affordable reasoning
          for everyday and medium tasks
        </li>
        <li>
          <span className="font-semibold">O1</span> — maximum reasoning for
          complex and critical problems
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
        Reasoning ability
      </h2>
      <p className="text-gray-700 text-lg leading-relaxed">
        O1 provides the highest level of reasoning. It can solve complex
        problems, handle deep logic, and generate detailed step-by-step
        solutions.
      </p>
      <p className="text-gray-700 text-lg leading-relaxed">
        O3-mini also focuses on reasoning but at a lower level. It is suitable
        for medium-complexity tasks and structured answers but may struggle with
        highly complex problems.
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
        <li>O3-mini — faster and more efficient</li>
        <li>O1 — slower due to deeper reasoning</li>
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
      <ul className="list-disc list-inside text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>O3-mini — ≈ 35 messages per 10,000 tokens</li>
        <li>O1 — ≈ 3 messages per 10,000 tokens</li>
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
      <h3 className="text-lg font-semibold text-gray-800">Use O3-mini if:</h3>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>✔️ You need reasoning at a lower cost</li>
        <li>✔️ Medium complexity problems</li>
        <li>✔️ Structured answers</li>
        <li>✔️ Regular use of logic-based tasks</li>
      </ul>
      <h3 className="text-lg font-semibold text-gray-800">Use O1 if:</h3>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>✔️ You need deep reasoning</li>
        <li>✔️ Complex technical problems</li>
        <li>✔️ Advanced coding or debugging</li>
        <li>✔️ Tasks where other models fail</li>
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
        When not to use these models
      </h2>
      <p className="text-gray-700 text-lg leading-relaxed font-semibold">
        O3-mini:
      </p>
      <ul className="list-disc list-inside text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>Not ideal for very complex tasks</li>
      </ul>
      <p className="text-gray-700 text-lg leading-relaxed font-semibold">O1:</p>
      <ul className="list-disc list-inside text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>Not suitable for simple or cost-sensitive usage</li>
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
        O3-mini is the best choice for most users who need reasoning without
        high cost.
      </p>
      <p className="text-gray-700 text-lg leading-relaxed">
        O1 should be used only for complex tasks where maximum reasoning is
        required.
      </p>
      <p className="text-gray-700 text-lg leading-relaxed">
        For most use cases,{" "}
        <span className="font-semibold">O3-mini</span> is the more practical
        and cost-efficient option.
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
        Want more details? Learn more about each model:
      </p>
      <ul className="list-disc list-inside text-lg leading-relaxed space-y-1 pl-5">
        <li>
          <Link
            href="/ai-models-guide/o3-mini"
            className="text-blue-600 hover:underline"
          >
            O3-mini — Affordable reasoning model
          </Link>
        </li>
        <li>
          <Link
            href="/ai-models-guide/o1"
            className="text-blue-600 hover:underline"
          >
            O1 — Maximum reasoning power
          </Link>
        </li>
      </ul>
    </motion.div>
  </>
);

export default CompareO1VsO3Mini;
