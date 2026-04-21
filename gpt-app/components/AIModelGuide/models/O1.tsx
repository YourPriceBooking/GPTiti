"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const O1 = () => (
  <>
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="text-gray-700 text-lg leading-relaxed"
    >
      O1 is the most powerful reasoning AI model available on GPTiti. It is
      designed for complex problems, deep analysis, and advanced logic. If other
      models give incomplete or shallow answers, O1 is built to handle the
      hardest tasks with structured thinking.
    </motion.p>

    <hr className="border-gray-200" />

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
        O1 is a high-performance AI model focused on deep reasoning and
        multi-step problem solving. It is optimized for accuracy, logical
        consistency, and detailed explanations.
      </p>
      <p className="text-gray-700 text-lg leading-relaxed">
        Unlike general-purpose models, O1 is specifically built for complex
        technical and analytical tasks.
      </p>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="space-y-4"
    >
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">
        What is O1 best for?
      </h2>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>✔️ Complex problem solving</li>
        <li>✔️ Advanced coding and debugging</li>
        <li>✔️ Deep analysis and research</li>
        <li>✔️ Step-by-step logical reasoning</li>
        <li>✔️ Difficult questions that other models fail to answer</li>
      </ul>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="space-y-4"
    >
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">
        When O1 is ideal
      </h2>
      <p className="text-gray-700 text-lg leading-relaxed">
        O1 is ideal when accuracy and depth matter more than speed or cost.
      </p>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>✔️ Hard technical problems</li>
        <li>✔️ Advanced development tasks</li>
        <li>✔️ Research and analysis</li>
        <li>✔️ Complex workflows</li>
      </ul>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="space-y-4"
    >
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">
        When O1 is not the best choice
      </h2>
      <ul className="list-disc list-inside text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>Casual chat (use gpt-4o-mini)</li>
        <li>Cheap high-volume usage</li>
        <li>Quick simple answers</li>
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
        <li>✔️ Maximum reasoning capability</li>
        <li>✔️ Best for complex tasks</li>
        <li>✔️ Highly structured answers</li>
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
        <li>Very high token usage</li>
        <li>Expensive compared to other models</li>
        <li>Slower responses</li>
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
        O1 uses approximately{" "}
        <span className="font-semibold">3800 tokens per message</span>.
      </p>
      <p className="text-gray-700 text-lg leading-relaxed">
        With 10,000 tokens, you get approximately:
      </p>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>
          👉 <span className="font-semibold">≈ 3 messages</span>
        </li>
      </ul>
      <p className="text-gray-700 text-lg leading-relaxed">
        Compared to other models:
      </p>
      <ul className="list-disc list-inside text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>~100x more expensive than gpt-4o-mini</li>
        <li>~10x more expensive than gpt-5.4-mini</li>
      </ul>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="space-y-4"
    >
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">
        O1 vs other models
      </h2>

      <p className="text-gray-700 text-lg leading-relaxed font-semibold">
        vs GPT-5.4:
      </p>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>✔️ Better for deep reasoning</li>
      </ul>
      <ul className="list-disc list-inside text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>Less efficient for general tasks</li>
      </ul>

      <p className="text-gray-700 text-lg leading-relaxed font-semibold">
        vs GPT-5.4-mini:
      </p>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>✔️ Much stronger reasoning</li>
      </ul>
      <ul className="list-disc list-inside text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>Much higher cost</li>
      </ul>

      <p className="text-gray-700 text-lg leading-relaxed font-semibold">
        vs O3-mini:
      </p>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>✔️ More powerful reasoning</li>
      </ul>
      <ul className="list-disc list-inside text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>More expensive</li>
      </ul>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="space-y-4"
    >
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">
        When to choose O1
      </h2>
      <p className="text-gray-700 text-lg leading-relaxed">
        Choose O1 only when you need the highest level of reasoning and other
        models are not enough.
      </p>
      <p className="text-gray-700 text-lg leading-relaxed">
        It is best used for critical tasks where correctness and depth are more
        important than cost.
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
        Compare with other models
      </h2>
      <ul className="list-disc list-inside text-lg leading-relaxed space-y-1 pl-5">
        <li>
          <Link
            href="/ai-models-guide/compare-o1-vs-o3-mini"
            className="text-blue-600 hover:underline"
          >
            O1 vs O3-mini
          </Link>
        </li>
        <li>
          <Link
            href="/ai-models-guide/compare-gpt-5-4-vs-o1"
            className="text-blue-600 hover:underline"
          >
            GPT-5.4 vs O1
          </Link>
        </li>
      </ul>
    </motion.div>
  </>
);

export default O1;
