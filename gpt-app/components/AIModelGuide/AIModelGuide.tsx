"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import PageNav from "../common/PageNav";

const AIModelGuide = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      <PageNav />
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-3xl space-y-10 p-6"
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
          GPT, O-series, and realtime models by speed, cost, and performance.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-gray-700 text-lg leading-relaxed"
        >
          Whether you need fast chat, advanced reasoning, or high-quality
          content generation, this guide helps you choose the right AI model.
        </motion.p>

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
                href="/ai-models-guide/gpt-5-4"
                className="text-blue-600 hover:underline font-medium"
              >
                GPT-5.4{" "}
                <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded ml-1">
                  New
                </span>
              </Link>
              <br />
              <span className="text-sm pl-4">
                <Link
                  href="/ai-models-guide/compare-gpt-5-4-vs-o1"
                  className="text-gray-500 hover:underline"
                >
                  Compare with O1
                </Link>
              </span>
            </li>
            <li>
              <Link
                href="/ai-models-guide/gpt-5-4-mini"
                className="text-blue-600 hover:underline font-medium"
              >
                GPT-5.4-mini{" "}
                <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded ml-1">
                  New
                </span>{" "}
                <span className="inline-block bg-orange-100 text-orange-700 text-xs font-semibold px-2 py-0.5 rounded ml-1">
                  Best value 🔥
                </span>
              </Link>
              <br />
              <span className="text-sm pl-4">
                <Link
                  href="/ai-models-guide/compare-gpt-5-4-mini-vs-gpt-4o-mini"
                  className="text-gray-500 hover:underline"
                >
                  Compare with GPT-4o-mini
                </Link>
              </span>
            </li>
            <li>
              <Link
                href="/ai-models-guide/gpt-5-1"
                className="text-blue-600 hover:underline font-medium"
              >
                GPT-5.1
              </Link>
              <br />
              <span className="text-sm pl-4">
                <Link
                  href="/ai-models-guide/compare-gpt-4o-vs-gpt-5-1"
                  className="text-gray-500 hover:underline"
                >
                  Compare with GPT-4o
                </Link>
              </span>
            </li>
            <li>
              <Link
                href="/ai-models-guide/gpt-5-1-mini"
                className="text-blue-600 hover:underline font-medium"
              >
                GPT-5.1-mini
              </Link>
            </li>
            <li>
              <Link
                href="/ai-models-guide/gpt-5-1-realtime"
                className="text-blue-600 hover:underline font-medium"
              >
                GPT-5.1-realtime
              </Link>
            </li>
          </ul>
        </motion.div>

        {/* GPT-4o Series */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="space-y-4"
        >
          <h2 className="text-xl md:text-2xl font-bold text-purple-600">
            🟣 GPT-4o Series — Fast &amp; balanced
          </h2>
          <ul className="list-disc list-inside text-gray-700 text-lg leading-relaxed space-y-3 pl-5">
            <li>
              <Link
                href="/ai-models-guide/gpt-4o"
                className="text-blue-600 hover:underline font-medium"
              >
                GPT-4o
              </Link>
              <br />
              <span className="text-sm pl-4">
                <Link
                  href="/ai-models-guide/compare-gpt-4o-vs-gpt-5-1"
                  className="text-gray-500 hover:underline"
                >
                  Compare with GPT-5.1
                </Link>
              </span>
            </li>
            <li>
              <Link
                href="/ai-models-guide/gpt-4o-mini"
                className="text-blue-600 hover:underline font-medium"
              >
                GPT-4o-mini
              </Link>
              <br />
              <span className="text-sm pl-4">
                <Link
                  href="/ai-models-guide/compare-gpt-5-4-mini-vs-gpt-4o-mini"
                  className="text-gray-500 hover:underline"
                >
                  Compare with GPT-5.4-mini
                </Link>
              </span>
            </li>
            <li>
              <Link
                href="/ai-models-guide/gpt-4o-realtime"
                className="text-blue-600 hover:underline font-medium"
              >
                GPT-4o-realtime
              </Link>
            </li>
          </ul>
        </motion.div>

        {/* O-Series */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="space-y-4"
        >
          <h2 className="text-xl md:text-2xl font-bold text-red-600">
            🔴 O-Series — Advanced reasoning
          </h2>
          <ul className="list-disc list-inside text-gray-700 text-lg leading-relaxed space-y-3 pl-5">
            <li>
              <Link
                href="/ai-models-guide/o1"
                className="text-blue-600 hover:underline font-medium"
              >
                O1
              </Link>
              <br />
              <span className="text-sm pl-4">
                <Link
                  href="/ai-models-guide/compare-o1-vs-o3-mini"
                  className="text-gray-500 hover:underline"
                >
                  Compare with O3-mini
                </Link>
              </span>
            </li>
            <li>
              <Link
                href="/ai-models-guide/o1-mini"
                className="text-blue-600 hover:underline font-medium"
              >
                O1-mini
              </Link>
            </li>
            <li>
              <Link
                href="/ai-models-guide/o3-mini"
                className="text-blue-600 hover:underline font-medium"
              >
                O3-mini
              </Link>
              <br />
              <span className="text-sm pl-4">
                <Link
                  href="/ai-models-guide/compare-o1-vs-o3-mini"
                  className="text-gray-500 hover:underline"
                >
                  Compare with O1
                </Link>
              </span>
            </li>
          </ul>
        </motion.div>

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
            href="/sign-in"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg px-6 py-3 rounded-xl transition-colors"
          >
            Try GPTiti now
          </Link>
        </motion.div>
      </motion.section>
    </div>
  );
};

export default AIModelGuide;
