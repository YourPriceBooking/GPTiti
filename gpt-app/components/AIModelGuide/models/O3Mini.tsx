"use client";

import { motion } from "framer-motion";
import Link from "next/link";

import ModelInputLimits from "@/components/common/ModelInputLimits/ModelInputLimits";

const O3Mini = () => (
  <>
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="text-gray-700 text-lg leading-relaxed"
    >
      O3-mini is a cost-efficient AI model designed for reasoning, logic, and
      structured thinking. It provides strong problem-solving capabilities
      without the high cost of premium models like O1.
    </motion.p>

    <motion.p
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="text-gray-700 text-lg leading-relaxed"
    >
      If you need reasoning and structured answers but want to keep token usage
      under control, O3-mini is the best choice.
    </motion.p>

    <hr className="border-gray-200" />

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="space-y-4"
    >
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">
        What is O3-mini?
      </h2>
      <p className="text-gray-700 text-lg leading-relaxed">
        O3-mini is a lightweight reasoning model focused on logical consistency
        and step-by-step thinking. It is built to handle structured tasks better
        than basic AI models while remaining affordable.
      </p>
      <p className="text-gray-700 text-lg leading-relaxed">
        Compared to general-purpose models, O3-mini is optimized for clarity,
        reasoning, and problem-solving rather than speed or creativity.
      </p>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="space-y-4"
    >
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">
        What is O3-mini best for?
      </h2>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>✔️ Logical problem solving</li>
        <li>✔️ Step-by-step explanations</li>
        <li>✔️ Structured answers</li>
        <li>✔️ Light coding tasks</li>
        <li>✔️ Tasks that require reasoning over speed</li>
      </ul>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="space-y-4"
    >
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">
        When O3-mini is ideal
      </h2>
      <p className="text-gray-700 text-lg leading-relaxed">
        O3-mini is ideal when you need better reasoning than basic models but
        want to avoid the high cost of advanced AI.
      </p>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>✔️ Medium complexity problems</li>
        <li>✔️ Budget reasoning tasks</li>
        <li>✔️ Daily structured work</li>
        <li>✔️ Analytical questions</li>
      </ul>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="space-y-4"
    >
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">
        When O3-mini is not the best choice
      </h2>
      <ul className="list-disc list-inside text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>Simple chat (use gpt-4o-mini)</li>
        <li>Maximum reasoning (use o1)</li>
        <li>High-end performance tasks (use GPT-5.4)</li>
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
        <li>✔️ Strong reasoning ability for the price</li>
        <li>✔️ Much cheaper than O1</li>
        <li>✔️ More structured answers than basic models</li>
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
        <li>Less powerful than O1</li>
        <li>Slower than basic chat models</li>
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
        O3-mini uses approximately{" "}
        <span className="font-semibold">280 tokens per message</span>.
      </p>
      <p className="text-gray-700 text-lg leading-relaxed">
        With 10,000 tokens, you get approximately:
      </p>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>
          👉 <span className="font-semibold">≈ 35 messages</span>
        </li>
      </ul>
      <p className="text-gray-700 text-lg leading-relaxed">
        Compared to other models:
      </p>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>✔️ ~10x cheaper than O1</li>
        <li>✔️ more capable than gpt-4o-mini for reasoning</li>
      </ul>
      <ul className="list-disc list-inside text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>more expensive than basic models</li>
      </ul>
    </motion.div>

    <hr className="border-gray-200" />

    <ModelInputLimits model="o3-mini" />

    <hr className="border-gray-200" />

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="space-y-4"
    >
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">
        O3-mini vs other models
      </h2>

      <p className="text-gray-700 text-lg leading-relaxed font-semibold">
        vs O1:
      </p>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>✔️ Much cheaper</li>
        <li>✔️ Faster</li>
      </ul>
      <ul className="list-disc list-inside text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>Less deep reasoning</li>
      </ul>

      <p className="text-gray-700 text-lg leading-relaxed font-semibold">
        vs GPT-5.4-mini:
      </p>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>✔️ Cheaper</li>
      </ul>
      <ul className="list-disc list-inside text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>Less powerful</li>
      </ul>

      <p className="text-gray-700 text-lg leading-relaxed font-semibold">
        vs GPT-4o-mini:
      </p>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>✔️ Better reasoning</li>
      </ul>
      <ul className="list-disc list-inside text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>Higher cost</li>
      </ul>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="space-y-4"
    >
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">
        When to choose O3-mini
      </h2>
      <p className="text-gray-700 text-lg leading-relaxed">
        Choose O3-mini if you need reliable reasoning and structured answers
        without paying for premium models.
      </p>
      <p className="text-gray-700 text-lg leading-relaxed">
        It is the best option for users who regularly solve problems, analyze
        information, or work with logic-based tasks.
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
      <ul className="list-disc list-inside text-lg leading-relaxed space-y-1 pl-5">
        <li>
          <Link
            href="/ai-models-guide/compare-o1-vs-o3-mini"
            className="text-blue-600 hover:underline"
          >
            O1 vs O3-mini
          </Link>
        </li>
        <li>
          <Link
            href="/ai-models-guide/compare-gpt-5-4-mini-vs-gpt-4o-mini"
            className="text-blue-600 hover:underline"
          >
            GPT-5.4-mini vs GPT-4o-mini
          </Link>
        </li>
      </ul>
    </motion.div>
  </>
);

export default O3Mini;
