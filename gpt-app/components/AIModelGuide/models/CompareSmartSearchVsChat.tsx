"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const CompareSmartSearchVsChat = () => (
  <>
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="text-gray-700 text-lg leading-relaxed"
    >
      Smart Search and Chat AI may look similar, but they solve completely
      different problems. Understanding this difference helps you choose the
      right tool for your use case.
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
          <span className="font-semibold">Smart Search</span> → finds answers
          from your data
        </li>
        <li>
          <span className="font-semibold">Chat AI</span> → generates answers
          from general knowledge
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
        How Smart Search works
      </h2>
      <p className="text-gray-700 text-lg leading-relaxed">
        Smart Search uses embeddings to understand the meaning of your data and
        retrieve the most relevant information.
      </p>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>Converts documents into vectors (embeddings)</li>
        <li>Matches your query based on meaning, not keywords</li>
        <li>Returns the most relevant results</li>
        <li>Optionally uses GPT to generate a final answer</li>
      </ul>
      <p className="text-gray-700 text-lg leading-relaxed">
        This is often called{" "}
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
        How Chat AI works
      </h2>
      <p className="text-gray-700 text-lg leading-relaxed">
        Chat AI models like GPT-5.4-mini or GPT-4o generate answers based on
        training data and context.
      </p>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>Understands your question</li>
        <li>Uses general knowledge</li>
        <li>Generates a response instantly</li>
      </ul>
      <p className="text-gray-700 text-lg leading-relaxed">
        It does not search your documents unless integrated with a search
        system.
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
        Key differences
      </h2>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>
          <span className="font-semibold">Data source:</span> Smart Search →
          your data | Chat AI → general knowledge
        </li>
        <li>
          <span className="font-semibold">Accuracy:</span> Smart Search → higher
          for specific data
        </li>
        <li>
          <span className="font-semibold">Flexibility:</span> Chat AI → more
          flexible conversations
        </li>
        <li>
          <span className="font-semibold">Setup:</span> Smart Search → requires
          embeddings
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
        When to use Smart Search
      </h2>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>✔️ Searching documents or PDFs</li>
        <li>✔️ Internal knowledge base</li>
        <li>✔️ Product or database search</li>
        <li>✔️ Finding exact information</li>
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
        When to use Chat AI
      </h2>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>✔️ General questions</li>
        <li>✔️ Writing and content creation</li>
        <li>✔️ Coding help</li>
        <li>✔️ Brainstorming ideas</li>
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
        Best approach (recommended)
      </h2>
      <p className="text-gray-700 text-lg leading-relaxed">
        The most powerful systems combine both:
      </p>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>1. Smart Search finds relevant data</li>
        <li>2. GPT generates a clear answer</li>
      </ul>
      <p className="text-gray-700 text-lg leading-relaxed">
        This hybrid approach gives both accuracy and usability.
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
        Limitations
      </h2>
      <h3 className="text-lg font-semibold text-gray-800">Smart Search:</h3>
      <ul className="list-disc list-inside text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>Requires setup</li>
        <li>Depends on data quality</li>
      </ul>
      <h3 className="text-lg font-semibold text-gray-800">Chat AI:</h3>
      <ul className="list-disc list-inside text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>May hallucinate</li>
        <li>Not aware of your private data</li>
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
        Smart Search is better when you need answers from your own data.
      </p>
      <p className="text-gray-700 text-lg leading-relaxed">
        Chat AI is better for general tasks and conversations.
      </p>
      <p className="text-gray-700 text-lg leading-relaxed">
        For the best results, use both together.
      </p>
      <p className="text-gray-700 text-lg leading-relaxed">
        👉{" "}
        <Link
          href="/ai-models-guide/smart-search"
          className="text-blue-600 hover:underline font-semibold"
        >
          Learn more about Smart Search
        </Link>
      </p>
    </motion.div>
  </>
);

export default CompareSmartSearchVsChat;
