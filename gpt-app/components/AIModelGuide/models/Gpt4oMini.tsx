"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const Gpt4oMini = () => (
  <>
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="text-gray-700 text-lg leading-relaxed"
    >
      GPT-4o-mini is a fast, lightweight, and cost-efficient AI model for chat,
      writing, and everyday tasks. It is the best choice for users who want
      quick answers, smooth conversations, and low token usage.
    </motion.p>

    <hr className="border-gray-200" />

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="space-y-4"
    >
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">
        What is GPT-4o-mini?
      </h2>
      <p className="text-gray-700 text-lg leading-relaxed">
        GPT-4o-mini is optimized for speed and affordability. It handles common
        tasks like chatting, writing, and translation with high efficiency while
        keeping token usage low. This makes it the most practical model for
        daily interactions.
      </p>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="space-y-4"
    >
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">
        What is GPT-4o-mini best for?
      </h2>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>✔️ Everyday chat and conversations</li>
        <li>✔️ Writing emails, posts, and messages</li>
        <li>✔️ Text rewriting and summarization</li>
        <li>✔️ Translation between languages</li>
        <li>✔️ Quick answers and simple tasks</li>
      </ul>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="space-y-4"
    >
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">
        When GPT-4o-mini is ideal
      </h2>
      <p className="text-gray-700 text-lg leading-relaxed">
        This model is ideal when you need fast results and want to save tokens.
        If you use AI frequently for simple tasks, this is the most efficient
        option.
      </p>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>✔️ Daily use</li>
        <li>✔️ High-volume messaging</li>
        <li>✔️ Budget-conscious usage</li>
      </ul>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="space-y-4"
    >
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">
        When GPT-4o-mini is not the best choice
      </h2>
      <p className="text-gray-700 text-lg leading-relaxed">
        GPT-4o-mini is not designed for complex reasoning or deep
        problem-solving.
      </p>
      <ul className="list-disc list-inside text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>Complex logic or math problems</li>
        <li>Advanced coding tasks</li>
        <li>Deep analysis or research</li>
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
        <li>✔️ Very fast responses</li>
        <li>✔️ Extremely low token usage</li>
        <li>✔️ Best for frequent usage</li>
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
        <li>Less powerful than advanced models</li>
        <li>Limited reasoning ability</li>
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
        GPT-4o-mini uses approximately{" "}
        <span className="font-semibold">38 tokens per message</span>.
      </p>
      <p className="text-gray-700 text-lg leading-relaxed">
        With 10,000 tokens, you get approximately:
      </p>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>
          👉 <span className="font-semibold">≈ 260 messages</span>
        </li>
      </ul>
      <p className="text-gray-700 text-lg leading-relaxed">
        Compared to other models:
      </p>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>✔️ ~10x cheaper than GPT-5 models</li>
        <li>✔️ ~100x cheaper than O1</li>
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
        Need better quality?
      </h2>
      <p className="text-gray-700 text-lg leading-relaxed">
        If you need more accurate answers, better writing, or stronger
        reasoning, consider upgrading:
      </p>
      <ul className="list-disc list-inside text-lg leading-relaxed space-y-1 pl-5">
        <li>
          <Link
            href="/ai-models-guide/gpt-5-4-mini"
            className="text-blue-600 hover:underline"
          >
            GPT-5.4-mini — best overall balance
          </Link>
        </li>
        <li>
          <Link
            href="/ai-models-guide/gpt-4o"
            className="text-blue-600 hover:underline"
          >
            GPT-4o — more powerful general model
          </Link>
        </li>
        <li>
          <Link
            href="/ai-models-guide/o1"
            className="text-blue-600 hover:underline"
          >
            O1 — advanced reasoning
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
        Compare with other models
      </h2>
      <ul className="list-disc list-inside text-lg leading-relaxed space-y-1 pl-5">
        <li>
          <Link
            href="/ai-models-guide/gpt-5-4-mini-vs-gpt-4o-mini"
            className="text-blue-600 hover:underline"
          >
            GPT-5.4-mini vs GPT-4o-mini
          </Link>
        </li>
        <li>
          <Link
            href="/ai-models-guide/gpt-4o-vs-gpt-5-1"
            className="text-blue-600 hover:underline"
          >
            GPT-4o vs GPT-5.1
          </Link>
        </li>
      </ul>
    </motion.div>
  </>
);

export default Gpt4oMini;
