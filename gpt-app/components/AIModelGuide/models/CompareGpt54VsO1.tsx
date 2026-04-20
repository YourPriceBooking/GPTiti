"use client";

import { motion } from "framer-motion";

const CompareGpt54VsO1 = () => (
  <>
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="text-gray-700 text-lg leading-relaxed"
    >
      GPT-5.4 excels at creative writing, long-context tasks, and
      general-purpose generation. O1 is optimized for deep reasoning, math, and
      science problems.
    </motion.p>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="space-y-4"
    >
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">Overview</h2>
      <p className="text-gray-700 text-lg leading-relaxed">
        GPT-5.4 and O1 are both high-end models, but they are built for
        different purposes. GPT-5.4 is a general-purpose powerhouse — fast,
        fluent, and capable across almost any task. O1 is a specialist reasoning
        model that takes more time to think and excels at structured,
        logic-heavy problems.
      </p>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="space-y-4"
    >
      <h2 className="text-xl md:text-2xl font-bold text-blue-600">
        GPT-5.4 strengths
      </h2>
      <ul className="list-disc list-inside text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>Faster response times</li>
        <li>Better for creative and long-form writing</li>
        <li>Stronger at following nuanced instructions</li>
        <li>Handles very long contexts (200K tokens)</li>
        <li>More natural and fluent language output</li>
      </ul>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="space-y-4"
    >
      <h2 className="text-xl md:text-2xl font-bold text-red-600">
        O1 strengths
      </h2>
      <ul className="list-disc list-inside text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>Superior multi-step reasoning</li>
        <li>Better at math, physics, and science</li>
        <li>More reliable on logic puzzles</li>
        <li>Catches its own errors more effectively</li>
        <li>Designed for depth over speed</li>
      </ul>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="space-y-4"
    >
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">
        Which should you choose?
      </h2>
      <p className="text-gray-700 text-lg leading-relaxed">
        Choose GPT-5.4 for writing, analysis, coding assistance, and general
        tasks. Choose O1 when you need to solve a hard math problem, debug
        complex logic, or work through a technical challenge that requires
        careful step-by-step thinking. When in doubt, start with GPT-5.4 — it
        handles the majority of tasks exceptionally well.
      </p>
    </motion.div>
  </>
);

export default CompareGpt54VsO1;
