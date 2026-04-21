"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const BestAiModelForChat = () => (
  <>
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="text-gray-700 text-lg leading-relaxed"
    >
      Choosing the best AI model for chat depends on your needs: speed, cost, or
      quality. Different AI models are optimized for different types of
      conversations — from simple daily chat to advanced reasoning and
      professional use.
    </motion.p>

    <motion.p
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="text-gray-700 text-lg leading-relaxed"
    >
      This guide will help you choose the right AI model based on your use case.
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
          👉 <span className="font-semibold">Best overall:</span> GPT-5.4-mini
        </li>
        <li>
          👉 <span className="font-semibold">Best cheap option:</span>{" "}
          GPT-4o-mini
        </li>
        <li>
          👉 <span className="font-semibold">Best for reasoning:</span> O1
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
        Best AI models for chat
      </h2>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="space-y-4"
    >
      <h3 className="text-lg md:text-xl font-bold text-gray-900">
        GPT-5.4-mini — Best balance
      </h3>
      <p className="text-gray-700 text-lg leading-relaxed">
        GPT-5.4-mini is the best choice for most users. It provides high-quality
        responses, strong reasoning, and efficient token usage.
      </p>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>✔️ High-quality answers</li>
        <li>✔️ Good reasoning</li>
        <li>✔️ Balanced cost</li>
      </ul>
      <p className="text-gray-700 text-lg leading-relaxed">
        👉{" "}
        <Link
          href="/ai-models-guide/gpt-5-4-mini"
          className="text-blue-600 hover:underline font-semibold"
        >
          Try GPT-5.4-mini
        </Link>
      </p>
    </motion.div>

    <hr className="border-gray-200" />

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="space-y-4"
    >
      <h3 className="text-lg md:text-xl font-bold text-gray-900">
        GPT-4o-mini — Best for cheap chat
      </h3>
      <p className="text-gray-700 text-lg leading-relaxed">
        GPT-4o-mini is ideal for fast and affordable everyday chat. It is the
        best option for high-volume usage.
      </p>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>✔️ Very cheap</li>
        <li>✔️ Fast responses</li>
        <li>✔️ Best for frequent use</li>
      </ul>
      <p className="text-gray-700 text-lg leading-relaxed">
        👉{" "}
        <Link
          href="/ai-models-guide/gpt-4o-mini"
          className="text-blue-600 hover:underline font-semibold"
        >
          Try GPT-4o-mini
        </Link>
      </p>
    </motion.div>

    <hr className="border-gray-200" />

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="space-y-4"
    >
      <h3 className="text-lg md:text-xl font-bold text-gray-900">
        GPT-5.4 — Best quality
      </h3>
      <p className="text-gray-700 text-lg leading-relaxed">
        GPT-5.4 delivers the highest quality responses and is ideal for
        important conversations or professional use.
      </p>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>✔️ Best overall performance</li>
        <li>✔️ Highest quality output</li>
      </ul>
      <p className="text-gray-700 text-lg leading-relaxed">
        👉{" "}
        <Link
          href="/ai-models-guide/gpt-5-4"
          className="text-blue-600 hover:underline font-semibold"
        >
          Try GPT-5.4
        </Link>
      </p>
    </motion.div>

    <hr className="border-gray-200" />

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="space-y-4"
    >
      <h3 className="text-lg md:text-xl font-bold text-gray-900">
        O1 — Best for complex questions
      </h3>
      <p className="text-gray-700 text-lg leading-relaxed">
        O1 is designed for deep reasoning and complex problem solving. It is not
        ideal for everyday chat but excels at difficult tasks.
      </p>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>✔️ Deep reasoning</li>
        <li>✔️ Complex questions</li>
      </ul>
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

    <hr className="border-gray-200" />

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="space-y-4"
    >
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">
        How to choose the right AI model
      </h2>
      <p className="text-gray-700 text-lg leading-relaxed">
        If you are not sure which model to use, follow this simple guide:
      </p>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>
          👉 For daily chat → use{" "}
          <span className="font-semibold">GPT-4o-mini</span>
        </li>
        <li>
          👉 For better quality → use{" "}
          <span className="font-semibold">GPT-5.4-mini</span>
        </li>
        <li>
          👉 For the best results → use{" "}
          <span className="font-semibold">GPT-5.4</span>
        </li>
        <li>
          👉 For complex tasks → use <span className="font-semibold">O1</span>
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
        Final recommendation
      </h2>
      <p className="text-gray-700 text-lg leading-relaxed">
        For most users, <span className="font-semibold">GPT-5.4-mini</span> is
        the best AI model for chat.
      </p>
      <p className="text-gray-700 text-lg leading-relaxed">
        It offers the best balance between cost, speed, and quality.
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
        Explore AI models
      </h2>
      <p className="text-gray-700 text-lg leading-relaxed">
        Want to learn more about each model? Explore detailed guides:
      </p>
      <ul className="list-disc list-inside text-lg leading-relaxed space-y-1 pl-5">
        <li>
          <Link
            href="/ai-models-guide/gpt-5-4-mini"
            className="text-blue-600 hover:underline"
          >
            GPT-5.4-mini
          </Link>
        </li>
        <li>
          <Link
            href="/ai-models-guide/gpt-4o-mini"
            className="text-blue-600 hover:underline"
          >
            GPT-4o-mini
          </Link>
        </li>
        <li>
          <Link
            href="/ai-models-guide/gpt-5-4"
            className="text-blue-600 hover:underline"
          >
            GPT-5.4
          </Link>
        </li>
        <li>
          <Link
            href="/ai-models-guide/o1"
            className="text-blue-600 hover:underline"
          >
            O1
          </Link>
        </li>
      </ul>
    </motion.div>
  </>
);

export default BestAiModelForChat;
