"use client";

import { motion } from "framer-motion";
import Link from "next/link";

import ModelInputLimits from "@/components/common/ModelInputLimits/ModelInputLimits";

const O1Mini = () => (
  <>
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="text-gray-700 text-lg leading-relaxed"
    >
      O1-mini is a powerful AI model for reasoning, coding, and structured
      problem solving. It delivers strong logical thinking and step-by-step
      answers at a lower cost than the full O1 model.
    </motion.p>

    <motion.p
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="text-gray-700 text-lg leading-relaxed"
    >
      It is the ideal choice for users who need advanced reasoning capabilities
      without paying premium token prices.
    </motion.p>

    <hr className="border-gray-200" />

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="space-y-4"
    >
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">
        What is O1-mini?
      </h2>
      <p className="text-gray-700 text-lg leading-relaxed">
        O1-mini is a lightweight version of the O1 reasoning model. It focuses
        on step-by-step thinking, logical consistency, and structured responses.
      </p>
      <p className="text-gray-700 text-lg leading-relaxed">
        Compared to standard AI models, O1-mini is better at tasks that require
        reasoning, such as solving problems, writing code, or explaining complex
        topics.
      </p>
      <p className="text-gray-700 text-lg leading-relaxed">
        At the same time, it is significantly more affordable than the full O1
        model, making it a more accessible option for regular use.
      </p>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="space-y-4"
    >
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">
        What is O1-mini best for?
      </h2>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>✔️ Logical reasoning and structured thinking</li>
        <li>✔️ Coding and debugging tasks</li>
        <li>✔️ Step-by-step explanations</li>
        <li>✔️ Problem-solving tasks</li>
        <li>✔️ Technical and analytical questions</li>
      </ul>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="space-y-4"
    >
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">
        When O1-mini is ideal
      </h2>
      <p className="text-gray-700 text-lg leading-relaxed">
        O1-mini is ideal when you need reasoning capabilities that basic models
        cannot provide, but you still want to control token usage.
      </p>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>✔️ Medium to advanced coding tasks</li>
        <li>✔️ Analytical questions</li>
        <li>✔️ Tasks requiring structured logic</li>
        <li>✔️ Situations where GPT-4o or mini models are not enough</li>
      </ul>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="space-y-4"
    >
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">
        When O1-mini is not the best choice
      </h2>
      <p className="text-gray-700 text-lg leading-relaxed">
        While O1-mini is powerful, it is not always the most efficient option.
      </p>
      <ul className="list-disc list-inside text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>Simple chat or casual use (use GPT-4o-mini)</li>
        <li>Very high-volume usage (cost can add up)</li>
        <li>Maximum reasoning tasks (use O1)</li>
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
        <li>✔️ Strong reasoning capabilities</li>
        <li>✔️ More affordable than O1</li>
        <li>✔️ Better structured answers than basic models</li>
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
        <li>Higher token usage than mini models</li>
        <li>Slower than basic chat models</li>
        <li>Less powerful than full O1</li>
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
        O1-mini uses approximately{" "}
        <span className="font-semibold">750 tokens per message</span>.
      </p>
      <p className="text-gray-700 text-lg leading-relaxed">
        With 10,000 tokens, you get approximately:
      </p>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>
          👉 <span className="font-semibold">≈ 13 messages</span>
        </li>
      </ul>
      <p className="text-gray-700 text-lg leading-relaxed">
        Compared to other models:
      </p>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>✔️ ~2x cheaper than O1</li>
        <li className="list-disc ml-5">~20x more expensive than GPT-4o-mini</li>
        <li>✔️ stronger reasoning than GPT models at similar cost</li>
      </ul>
    </motion.div>

    <hr className="border-gray-200" />

    <ModelInputLimits model="o1-mini" />

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
            href="/ai-models-guide/compare-gpt-5-4-vs-o1"
            className="text-blue-600 hover:underline"
          >
            GPT-5.4 vs O1
          </Link>
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
        Explore alternatives
      </h2>
      <ul className="list-disc list-inside text-lg leading-relaxed space-y-1 pl-5">
        <li>
          <Link
            href="/ai-models-guide/o1"
            className="text-blue-600 hover:underline"
          >
            O1 — maximum reasoning
          </Link>
        </li>
        <li>
          <Link
            href="/ai-models-guide/o3-mini"
            className="text-blue-600 hover:underline"
          >
            O3-mini — cheaper reasoning
          </Link>
        </li>
        <li>
          <Link
            href="/ai-models-guide/gpt-5-4-mini"
            className="text-blue-600 hover:underline"
          >
            GPT-5.4-mini — best balance
          </Link>
        </li>
        <li>
          <Link
            href="/ai-models-guide/gpt-4o-mini"
            className="text-blue-600 hover:underline"
          >
            GPT-4o-mini — cheapest option
          </Link>
        </li>
      </ul>
    </motion.div>
  </>
);

export default O1Mini;
