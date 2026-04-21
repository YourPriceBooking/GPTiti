"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const Gpt51 = () => (
  <>
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="text-gray-700 text-lg leading-relaxed"
    >
      GPT-5.1 is an advanced AI model for writing, coding, and professional
      tasks. It delivers stronger performance, better reasoning, and
      higher-quality responses than mid-tier models.
    </motion.p>

    <motion.p
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="text-gray-700 text-lg leading-relaxed"
    >
      It is designed for users who need more power than lightweight models but
      do not always require the full capabilities of flagship models like
      GPT-5.4.
    </motion.p>

    <hr className="border-gray-200" />

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="space-y-4"
    >
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">
        What is GPT-5.1?
      </h2>
      <p className="text-gray-700 text-lg leading-relaxed">
        GPT-5.1 is part of the GPT-5 series and offers a balance between
        performance and cost. It provides more accurate, structured, and
        detailed responses compared to models like GPT-4o and GPT-5.1-mini.
      </p>
      <p className="text-gray-700 text-lg leading-relaxed">
        This model is suitable for users who want higher-quality results for
        work, content, or technical tasks without moving to the most expensive
        tier.
      </p>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="space-y-4"
    >
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">
        What is GPT-5.1 best for?
      </h2>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>✔️ Writing detailed and high-quality content</li>
        <li>✔️ Coding and technical tasks</li>
        <li>✔️ Business and productivity workflows</li>
        <li>✔️ More accurate and structured responses</li>
        <li>✔️ Tasks that require better reasoning than mid-tier models</li>
      </ul>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="space-y-4"
    >
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">
        When GPT-5.1 is ideal
      </h2>
      <p className="text-gray-700 text-lg leading-relaxed">
        GPT-5.1 is ideal when you need reliable and high-quality results without
        jumping to the highest-cost models.
      </p>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>✔️ Professional usage</li>
        <li>✔️ Content creation with higher standards</li>
        <li>✔️ Technical and analytical tasks</li>
        <li>✔️ Situations where GPT-4o is not enough</li>
      </ul>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="space-y-4"
    >
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">
        When GPT-5.1 is not the best choice
      </h2>
      <ul className="list-disc list-inside text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>Cheap everyday usage (use GPT-4o-mini)</li>
        <li>Maximum performance tasks (use GPT-5.4)</li>
        <li>Deep reasoning (use O1)</li>
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
        <li>✔️ Strong performance across tasks</li>
        <li>✔️ Better reasoning than mid-tier models</li>
        <li>✔️ High-quality outputs</li>
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
        <li>Not as powerful as GPT-5.4</li>
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
        GPT-5.1 uses approximately{" "}
        <span className="font-semibold">600 tokens per message</span>.
      </p>
      <p className="text-gray-700 text-lg leading-relaxed">
        With 10,000 tokens, you get approximately:
      </p>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>
          👉 <span className="font-semibold">≈ 16 messages</span>
        </li>
      </ul>
      <p className="text-gray-700 text-lg leading-relaxed">
        Compared to other models:
      </p>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>✔️ more powerful than GPT-4o and GPT-5.1-mini</li>
        <li className="list-disc ml-5">~5x more expensive than GPT-4o-mini</li>
        <li>✔️ cheaper than GPT-5.4</li>
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
        Compare with other models
      </h2>
      <p className="text-gray-700 text-lg leading-relaxed">
        Not sure if GPT-5.1 is right for you? Compare it with alternatives:
      </p>
      <ul className="list-disc list-inside text-lg leading-relaxed space-y-1 pl-5">
        <li>
          <Link
            href="/ai-models-guide/compare-gpt-4o-vs-gpt-5-1"
            className="text-blue-600 hover:underline"
          >
            GPT-4o vs GPT-5.1
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
            href="/ai-models-guide/gpt-5-4"
            className="text-blue-600 hover:underline"
          >
            GPT-5.4 — maximum performance
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
            href="/ai-models-guide/gpt-4o"
            className="text-blue-600 hover:underline"
          >
            GPT-4o — cheaper alternative
          </Link>
        </li>
      </ul>
    </motion.div>
  </>
);

export default Gpt51;
