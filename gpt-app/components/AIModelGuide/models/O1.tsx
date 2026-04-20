"use client";

import { motion } from "framer-motion";

const O1 = () => (
  <>
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="text-gray-700 text-lg leading-relaxed"
    >
      O1 is a powerful reasoning model designed for complex, multi-step
      problems. It thinks before responding, making it ideal for math, science,
      and advanced logic tasks.
    </motion.p>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="space-y-4"
    >
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">
        What is O1?
      </h2>
      <p className="text-gray-700 text-lg leading-relaxed">
        O1 is OpenAI&apos;s dedicated reasoning model. Unlike GPT models that
        generate responses directly, O1 uses an internal chain-of-thought
        process — it &quot;thinks&quot; through the problem before answering.
        This makes it significantly better at tasks that require logic,
        planning, or multi-step reasoning.
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
        <li>Advanced multi-step reasoning</li>
        <li>Excellent at math and science problems</li>
        <li>Strong logical and analytical thinking</li>
        <li>Better at catching its own mistakes</li>
        <li>High accuracy on complex coding challenges</li>
        <li>Reliable for structured problem solving</li>
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
        <li>Mathematics and physics problems</li>
        <li>Algorithm design and competitive programming</li>
        <li>Scientific research and hypothesis analysis</li>
        <li>Complex legal or financial reasoning</li>
        <li>Tasks where being correct matters more than being fast</li>
      </ul>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="space-y-4"
    >
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">
        O1 vs GPT models
      </h2>
      <p className="text-gray-700 text-lg leading-relaxed">
        O1 is slower and more expensive per request than GPT models because it
        spends extra computation on reasoning before responding. For simple
        writing or chat tasks, GPT models are faster and cheaper. But for tasks
        where accuracy and logical depth are critical, O1 is in a class of its
        own.
      </p>
    </motion.div>
  </>
);

export default O1;
