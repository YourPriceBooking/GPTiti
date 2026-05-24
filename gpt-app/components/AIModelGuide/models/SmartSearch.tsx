"use client";

import { motion } from "framer-motion";
import Link from "next/link";

import ModelInputLimits from "@/components/common/ModelInputLimits/ModelInputLimits";

const SmartSearch = () => (
  <>
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="text-gray-700 text-lg leading-relaxed"
    >
      Smart Search is an AI-powered search system that lets you find information
      using natural language instead of keywords. Instead of typing exact
      phrases, you can ask questions like a human — and get relevant answers
      instantly.
    </motion.p>

    <motion.p
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="text-gray-700 text-lg leading-relaxed"
    >
      It works across documents, chats, and structured data, making it
      significantly more powerful than traditional search.
    </motion.p>

    <hr className="border-gray-200" />

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="space-y-4"
    >
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">
        How Smart Search works
      </h2>
      <p className="text-gray-700 text-lg leading-relaxed">
        Smart Search combines two core technologies:
      </p>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>
          <span className="font-semibold">Embeddings models</span> — convert
          text into vectors (meaning-based search)
        </li>
        <li>
          <span className="font-semibold">GPT models</span> — understand your
          question and generate answers
        </li>
      </ul>
      <p className="text-gray-700 text-lg leading-relaxed">Step-by-step:</p>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>1. Your data is converted into embeddings (semantic vectors)</li>
        <li>2. Your query is also converted into a vector</li>
        <li>3. The system finds the most relevant matches</li>
        <li>4. GPT generates a clear answer based on the results</li>
      </ul>
      <p className="text-gray-700 text-lg leading-relaxed">
        This approach is often called{" "}
        <span className="font-semibold">semantic search</span> or{" "}
        <span className="font-semibold">
          RAG (Retrieval-Augmented Generation)
        </span>
        .
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
        What models power Smart Search?
      </h2>
      <p className="text-gray-700 text-lg leading-relaxed">
        Smart Search is built using a combination of:
      </p>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>👉 Embedding models (for search relevance)</li>
        <li>👉 GPT models like GPT-5.4-mini or GPT-4o (for answers)</li>
      </ul>
      <p className="text-gray-700 text-lg leading-relaxed">
        Embeddings handle "finding the right information", while GPT handles
        "explaining it clearly".
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
        Why Smart Search is better than traditional search
      </h2>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>✔️ Understands meaning, not just keywords</li>
        <li>✔️ Works with questions, not exact phrases</li>
        <li>✔️ Finds relevant results even if wording is different</li>
        <li>✔️ Can summarize and explain results</li>
        <li>✔️ Works across large datasets</li>
      </ul>
      <p className="text-gray-700 text-lg leading-relaxed">Example:</p>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>Search: "cheap AI model"</li>
        <li>Result: GPT-4o-mini (even if phrase doesn't match exactly)</li>
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
        Best use cases
      </h2>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>✔️ Searching documents and PDFs</li>
        <li>✔️ Knowledge base search</li>
        <li>✔️ Chat history search</li>
        <li>✔️ Product or data search</li>
        <li>✔️ Internal tools and dashboards</li>
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
        Limitations (honest)
      </h2>
      <ul className="list-disc list-inside text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>Requires preprocessing (embeddings)</li>
        <li>Not always 100% accurate</li>
        <li>Depends on data quality</li>
        <li>More expensive than simple keyword search</li>
      </ul>
      <p className="text-gray-700 text-lg leading-relaxed">
        Smart Search is powerful, but it is not a perfect replacement for
        structured databases.
      </p>
    </motion.div>

    <hr className="border-gray-200" />

    <ModelInputLimits model="Smart Search" />

    <hr className="border-gray-200" />

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="space-y-4"
    >
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">
        Smart Search vs Chat AI
      </h2>
      <p className="text-gray-700 text-lg leading-relaxed">
        Chat AI (like GPT) generates answers from general knowledge. Smart
        Search retrieves information from your own data.
      </p>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>Chat AI → general answers</li>
        <li>Smart Search → answers based on your data</li>
      </ul>
      <p className="text-gray-700 text-lg leading-relaxed">
        👉{" "}
        <Link
          href="/ai-models-guide/compare-smart-search-vs-chat"
          className="text-blue-600 hover:underline font-semibold"
        >
          Compare Smart Search vs Chat AI
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
        When to use Smart Search
      </h2>
      <p className="text-gray-700 text-lg leading-relaxed">
        Use Smart Search when:
      </p>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>✔️ You have a lot of data</li>
        <li>✔️ You need accurate answers from your content</li>
        <li>✔️ You want better search UX</li>
      </ul>
      <p className="text-gray-700 text-lg leading-relaxed">
        For simple tasks, regular chat models may be enough.
      </p>
    </motion.div>
  </>
);

export default SmartSearch;
