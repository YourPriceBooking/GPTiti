"use client";

import { motion } from "framer-motion";

const O3Mini = () => (
  <>
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="text-gray-700 text-lg leading-relaxed"
    >
      O3-mini is the latest compact reasoning model in the O-series. It
      delivers improved reasoning over O1-mini with better efficiency and lower
      cost.
    </motion.p>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="space-y-4"
    >
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">
        What is O3-mini?
      </h2>
      <p className="text-gray-700 text-lg leading-relaxed">
        O3-mini is the newest compact reasoning model from OpenAI&apos;s
        O-series. It represents a significant step forward from O1-mini —
        offering better reasoning, faster responses, and improved efficiency.
        O3-mini is now the recommended starting point for most reasoning tasks.
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
        <li>Improved reasoning over O1-mini</li>
        <li>Fast response for a reasoning model</li>
        <li>Strong math, science, and coding performance</li>
        <li>Better efficiency per token</li>
        <li>More reliable on complex multi-step problems</li>
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
        <li>Math and logic tasks</li>
        <li>Programming challenges</li>
        <li>Scientific problem solving</li>
        <li>Users who need O-series reasoning at low cost</li>
        <li>Replacing O1-mini in most workflows</li>
      </ul>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="space-y-4"
    >
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">
        Why choose O3-mini over O1-mini?
      </h2>
      <p className="text-gray-700 text-lg leading-relaxed">
        O3-mini is newer, smarter, and more efficient than O1-mini. In most
        benchmarks, O3-mini outperforms O1-mini while costing the same or less.
        Unless you have a specific reason to use O1-mini, O3-mini is the better
        default choice for compact reasoning tasks.
      </p>
    </motion.div>
  </>
);

export default O3Mini;
