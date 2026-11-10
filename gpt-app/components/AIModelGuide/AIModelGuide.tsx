"use client";

import Link from "next/link";

import ModelCompareTable from "../common/ModelCompareTable/ModelCompareTable";

import { motion } from "framer-motion";

const AIModelGuide = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full max-w-3xl mx-auto space-y-10 p-6"
    >
      <div>
        <h1 className="flex-1 text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 text-center">
          AI Models Guide
        </h1>
      </div>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="text-gray-700 text-lg leading-relaxed"
      >
        Explore all AI models available on{" "}
        <span className="font-semibold text-blue-600">GPTiti</span>. Compare
        GPT-5.4-mini, GPT-5.4, and GPT-5.5 by speed, cost, and performance.
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="text-gray-700 text-lg leading-relaxed"
      >
        Whether you need fast chat, advanced reasoning, or high-quality content
        generation, this guide helps you choose the right AI model.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="space-y-4"
      >
        <ModelCompareTable />
      </motion.div>

      {/* GPT-5 Series */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="space-y-4"
      >
        <h2 className="text-xl md:text-2xl font-bold text-blue-600">
          🔵 GPT-5 Series — Most powerful AI models
        </h2>
        <ul className="list-disc list-inside text-gray-700 text-lg leading-relaxed space-y-3 pl-5">
          <li>
            <Link
              href="/ai-models-guide/gpt-5-5"
              className="text-blue-600 hover:underline font-medium"
            >
              GPT-5.5{" "}
              <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded ml-1">
                New
              </span>{" "}
              <span className="inline-block bg-amber-100 text-amber-700 text-xs font-semibold px-2 py-0.5 rounded ml-1">
                Premium
              </span>
            </Link>
            <br />
            <span className="text-sm pl-4 text-gray-500">
              Best for advanced reasoning, serious work, coding, analysis, and
              high-quality answers
            </span>
            <br />
            <span className="text-sm pl-4">
              <Link
                href="/ai-models-guide/compare-gpt-5-5-vs-gpt-5-4"
                className="text-gray-500 hover:underline"
              >
                Compare with GPT-5.4
              </Link>
            </span>
          </li>
          <li>
            <Link
              href="/ai-models-guide/gpt-5-4"
              className="text-blue-600 hover:underline font-medium"
            >
              GPT-5.4{" "}
            </Link>
            <br />
          </li>
          <li>
            <Link
              href="/ai-models-guide/gpt-5-4-mini"
              className="text-blue-600 hover:underline font-medium"
            >
              GPT-5.4-mini{" "}
              <span className="inline-block bg-orange-100 text-orange-700 text-xs font-semibold px-2 py-0.5 rounded ml-1">
                Best value 🔥
              </span>
            </Link>
            <br />
          </li>
        </ul>
      </motion.div>

      <Link
        href="/ai-models-guide/best-ai-model-for-chat"
        className="text-sm font-bold text-[#2F6BFF] px-2.5 py-1.5 rounded-lg bg-[var(--main-white)] inline-block"
      >
        🔥 Compare best AI models for chat →
      </Link>

      <hr className="border-gray-200" />

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="space-y-4"
      >
        <p className="text-gray-700 text-lg leading-relaxed">
          You get{" "}
          <span className="font-semibold text-blue-600">
            10,000 free tokens
          </span>{" "}
          after sign-in.
          <br />
          No subscriptions • Tokens never expire.
        </p>
        <Link
          href="/"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg px-6 py-3 rounded-xl transition-colors"
        >
          Try GPTiti now
        </Link>
      </motion.div>
    </motion.section>
  );
};

export default AIModelGuide;
