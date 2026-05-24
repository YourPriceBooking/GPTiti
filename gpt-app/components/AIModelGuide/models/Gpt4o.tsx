"use client";

import { motion } from "framer-motion";
import Link from "next/link";

import ModelInputLimits from "@/components/common/ModelInputLimits/ModelInputLimits";

const Gpt4o = () => (
  <>
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="text-gray-700 text-lg leading-relaxed"
    >
      GPT-4o is a versatile AI model that balances performance and speed. It is
      more powerful than lightweight models like GPT-4o-mini and can handle more
      complex tasks with higher accuracy.
    </motion.p>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="space-y-4"
    >
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">
        What is GPT-4o best for?
      </h2>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>✔️ General-purpose AI tasks</li>
        <li>✔️ Writing high-quality content</li>
        <li>✔️ More detailed answers</li>
        <li>✔️ Light coding and problem-solving</li>
        <li>✔️ Better conversations</li>
      </ul>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="space-y-4"
    >
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">
        When GPT-4o is ideal
      </h2>
      <p className="text-gray-700 text-lg leading-relaxed">
        GPT-4o is ideal when you need better quality than basic models but still
        want fast responses.
      </p>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>✔️ Daily work with better accuracy</li>
        <li>✔️ Content creation</li>
        <li>✔️ Chat with higher quality responses</li>
      </ul>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="space-y-4"
    >
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">
        When GPT-4o is not the best choice
      </h2>
      <p className="text-gray-700 text-lg leading-relaxed">
        GPT-4o is not the most efficient model for cheap usage or the best for
        deep reasoning tasks.
      </p>
      <ul className="list-disc list-inside text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>High-volume cheap usage (use GPT-4o-mini)</li>
        <li>Complex reasoning (use GPT-5.4-mini or O1)</li>
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
        <li>✔️ Good balance of speed and quality</li>
        <li>✔️ More powerful than basic models</li>
        <li>✔️ Reliable for most tasks</li>
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
        <li>Not as powerful as GPT-5 series</li>
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
        GPT-4o uses approximately{" "}
        <span className="font-semibold">500 tokens per message</span>.
      </p>
      <p className="text-gray-700 text-lg leading-relaxed">
        With 10,000 tokens, you get approximately:
      </p>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>
          👉 <span className="font-semibold">≈ 20 messages</span>
        </li>
      </ul>
      <p className="text-gray-700 text-lg leading-relaxed">
        Compared to other models:
      </p>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>✔️ ~5x more powerful than GPT-4o-mini</li>
        <li className="list-disc ml-5">~10x more expensive than GPT-4o-mini</li>
        <li>✔️ cheaper than GPT-5 models</li>
      </ul>
    </motion.div>

    <hr className="border-gray-200" />

    <ModelInputLimits model="gpt-4o" />

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
            href="/ai-models-guide/compare-gpt-4o-vs-gpt-5-1"
            className="text-blue-600 hover:underline"
          >
            GPT-4o vs GPT-5.1
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
            href="/ai-models-guide/gpt-4o-mini"
            className="text-blue-600 hover:underline"
          >
            GPT-4o-mini — cheapest option
          </Link>
        </li>
        <li>
          <Link
            href="/ai-models-guide/gpt-5-4-mini"
            className="text-blue-600 hover:underline"
          >
            GPT-5.4-mini — better quality
          </Link>
        </li>
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
            href="/ai-models-guide/o1"
            className="text-blue-600 hover:underline"
          >
            O1 — deep reasoning
          </Link>
        </li>
      </ul>
    </motion.div>
  </>
);

export default Gpt4o;
