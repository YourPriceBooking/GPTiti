"use client";

import { motion } from "framer-motion";

const Gpt51Mini = () => (
  <>
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="text-gray-700 text-lg leading-relaxed"
    >
      GPT-5.1-mini is a lightweight version of GPT-5.1. It is optimized for
      speed and cost while maintaining solid response quality for common use
      cases.
    </motion.p>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="space-y-4"
    >
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">
        What is GPT-5.1-mini?
      </h2>
      <p className="text-gray-700 text-lg leading-relaxed">
        GPT-5.1-mini is the compact, budget-friendly version of GPT-5.1. It is
        designed for fast responses and low token consumption, making it ideal
        for lightweight applications and high-frequency use cases.
      </p>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="space-y-4"
    >
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">
        Key capabilities
      </h2>
      <ul className="list-disc list-inside text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>Very fast response generation</li>
        <li>Low token cost per request</li>
        <li>Good at short-form tasks</li>
        <li>Reliable for simple instructions</li>
        <li>Suitable for automation pipelines</li>
      </ul>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="space-y-4"
    >
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">Best for</h2>
      <ul className="list-disc list-inside text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>Quick answers and lookups</li>
        <li>Simple text transformations</li>
        <li>Chatbot applications with high volume</li>
        <li>Automated content tagging or classification</li>
        <li>Users on a tight token budget</li>
      </ul>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="space-y-4"
    >
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">
        Limitations
      </h2>
      <p className="text-gray-700 text-lg leading-relaxed">
        GPT-5.1-mini is not ideal for complex reasoning, long documents, or
        tasks requiring deep analysis. For those cases, consider GPT-5.1 or
        GPT-5.4. It works best when the task is clear, short, and well-defined.
      </p>
    </motion.div>
  </>
);

export default Gpt51Mini;
