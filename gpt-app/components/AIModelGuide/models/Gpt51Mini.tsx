"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const Gpt51Mini = () => (
  <>
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="text-gray-700 text-lg leading-relaxed"
    >
      GPT-5.1-mini is a balanced AI model that delivers strong performance,
      better reasoning than basic models, and lower cost than full GPT-5 models.
      It is designed for users who want reliable results without high token
      usage.
    </motion.p>

    <hr className="border-gray-200" />

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
        GPT-5.1-mini is a lightweight version of the GPT-5.1 model. It provides
        structured, accurate, and high-quality responses while keeping token
        usage efficient.
      </p>
      <p className="text-gray-700 text-lg leading-relaxed">
        Compared to models like GPT-4o-mini, it offers better reasoning and more
        detailed answers, making it a strong mid-tier option.
      </p>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="space-y-4"
    >
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">
        What is GPT-5.1-mini best for?
      </h2>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>✔️ Writing structured content</li>
        <li>✔️ Coding and technical tasks</li>
        <li>✔️ Business and productivity workflows</li>
        <li>✔️ More accurate answers than basic models</li>
        <li>✔️ Daily work with moderate complexity</li>
      </ul>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="space-y-4"
    >
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">
        When GPT-5.1-mini is ideal
      </h2>
      <p className="text-gray-700 text-lg leading-relaxed">
        GPT-5.1-mini is ideal when you need better quality than basic AI models
        but want to keep costs under control.
      </p>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>✔️ Daily work and productivity</li>
        <li>✔️ Content creation</li>
        <li>✔️ Coding assistance</li>
        <li>✔️ Structured problem-solving</li>
      </ul>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="space-y-4"
    >
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">
        When GPT-5.1-mini is not the best choice
      </h2>
      <ul className="list-disc list-inside text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>Cheap high-volume usage (use gpt-4o-mini)</li>
        <li>Maximum performance tasks (use GPT-5.4)</li>
        <li>Deep reasoning problems (use o1)</li>
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
        <li>✔️ Strong balance of cost and performance</li>
        <li>✔️ Better reasoning than basic models</li>
        <li>✔️ More affordable than GPT-5.1</li>
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
        <li>Less powerful than GPT-5.1</li>
        <li>Not the cheapest option</li>
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
        GPT-5.1-mini uses approximately{" "}
        <span className="font-semibold">200 tokens per message</span>.
      </p>
      <p className="text-gray-700 text-lg leading-relaxed">
        With 10,000 tokens, you get approximately:
      </p>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>
          👉 <span className="font-semibold">≈ 50 messages</span>
        </li>
      </ul>
      <p className="text-gray-700 text-lg leading-relaxed">
        Compared to other models:
      </p>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>✔️ more powerful than GPT-4o-mini</li>
        <li>✔️ cheaper than GPT-5.1</li>
        <li>✔️ significantly cheaper than GPT-5.4</li>
      </ul>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="space-y-4"
    >
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">
        GPT-5.1-mini vs other models
      </h2>

      <p className="text-gray-700 text-lg leading-relaxed font-semibold">
        vs GPT-4o-mini:
      </p>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>✔️ Better quality and reasoning</li>
      </ul>
      <ul className="list-disc list-inside text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>Higher cost</li>
      </ul>

      <p className="text-gray-700 text-lg leading-relaxed font-semibold">
        vs GPT-5.1:
      </p>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>✔️ Cheaper</li>
      </ul>
      <ul className="list-disc list-inside text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>Less powerful</li>
      </ul>

      <p className="text-gray-700 text-lg leading-relaxed font-semibold">
        vs GPT-5.4-mini:
      </p>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>✔️ Slightly cheaper</li>
      </ul>
      <ul className="list-disc list-inside text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>Less capable</li>
      </ul>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="space-y-4"
    >
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">
        When to choose GPT-5.1-mini
      </h2>
      <p className="text-gray-700 text-lg leading-relaxed">
        Choose GPT-5.1-mini if you want a reliable AI model with good reasoning
        and structured answers, without paying for premium-level models.
      </p>
      <p className="text-gray-700 text-lg leading-relaxed">
        It is the best choice for users who need consistent quality for everyday
        tasks at a reasonable cost.
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
            href="/ai-models-guide/compare-gpt-4o-vs-gpt-5-1"
            className="text-blue-600 hover:underline"
          >
            GPT-4o vs GPT-5.1
          </Link>
        </li>
        <li>
          <Link
            href="/ai-models-guide/compare-gpt-5-4-mini-vs-gpt-4o-mini"
            className="text-blue-600 hover:underline"
          >
            GPT-5.4-mini vs GPT-4o-mini
          </Link>
        </li>
      </ul>
    </motion.div>
  </>
);

export default Gpt51Mini;
