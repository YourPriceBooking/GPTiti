"use client";

import { motion } from "framer-motion";
import Link from "next/link";

import ModelInputLimits from "@/components/common/ModelInputLimits/ModelInputLimits";

const Gpt54Mini = () => (
  <>
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="text-gray-700 text-lg leading-relaxed"
    >
      GPT-5.4-mini is one of the best AI models for chat, writing, coding, and
      everyday work. It offers the perfect balance between cost, speed, and
      quality, making it the recommended choice for most users.
    </motion.p>

    <hr className="border-gray-200" />

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="space-y-4"
    >
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">
        What is GPT-5.4-mini?
      </h2>
      <p className="text-gray-700 text-lg leading-relaxed">
        GPT-5.4-mini is an advanced AI model designed to provide better quality
        than basic models while remaining affordable. It is significantly more
        capable than GPT-4o-mini, especially for structured tasks,
        problem-solving, and detailed responses.
      </p>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="space-y-4"
    >
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">
        What is GPT-5.4-mini best for?
      </h2>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>✔️ Writing high-quality content</li>
        <li>✔️ Coding and technical tasks</li>
        <li>✔️ Structured answers and explanations</li>
        <li>✔️ Business and productivity tasks</li>
        <li>✔️ More accurate and detailed responses</li>
      </ul>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="space-y-4"
    >
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">
        When GPT-5.4-mini is ideal
      </h2>
      <p className="text-gray-700 text-lg leading-relaxed">
        This model is ideal when you need better quality than basic AI, but
        don't want to spend too many tokens.
      </p>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>✔️ Daily work with higher expectations</li>
        <li>✔️ Content creation</li>
        <li>✔️ Coding assistance</li>
        <li>✔️ Problem-solving tasks</li>
      </ul>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="space-y-4"
    >
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">
        When GPT-5.4-mini is not the best choice
      </h2>
      <p className="text-gray-700 text-lg leading-relaxed">
        GPT-5.4-mini is not the cheapest option and may be unnecessary for very
        simple tasks.
      </p>
      <ul className="list-disc list-inside text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>Simple chat (use GPT-4o-mini instead)</li>
        <li>High-volume cheap usage</li>
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
        <li>✔️ Strong balance of cost and quality</li>
        <li>✔️ Better reasoning than basic models</li>
        <li>✔️ High-quality outputs</li>
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
        <li>More expensive than mini/basic models</li>
        <li>Not as powerful as full GPT-5.4</li>
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
        GPT-5.4-mini uses approximately{" "}
        <span className="font-semibold">130 tokens per message</span>.
      </p>
      <p className="text-gray-700 text-lg leading-relaxed">
        With 10,000 tokens, you get approximately:
      </p>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>
          👉 <span className="font-semibold">≈ 75 messages</span>
        </li>
      </ul>
      <p className="text-gray-700 text-lg leading-relaxed">
        Compared to other models:
      </p>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>✔️ ~3x more powerful than GPT-4o-mini</li>
        <li>✔️ ~4x cheaper than GPT-5.4</li>
        <li>✔️ ~10x cheaper than O1</li>
      </ul>
    </motion.div>

    <hr className="border-gray-200" />

    <ModelInputLimits model="gpt-5.4-mini" />

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
            href="/ai-models-guide/compare-gpt-5-4-mini-vs-gpt-4o-mini"
            className="text-blue-600 hover:underline"
          >
            GPT-5.4-mini vs GPT-4o-mini
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

    <hr className="border-gray-200" />

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="space-y-4"
    >
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">
        Explore alternatives
      </h2>
      <ul className="list-disc list-inside text-lg leading-relaxed space-y-1 pl-5">
        <li>
          <Link
            href="/ai-models-guide/gpt-4o-mini"
            className="text-blue-600 hover:underline"
          >
            GPT-4o-mini — cheapest option
          </Link>
        </li>
        <li>
          <Link
            href="/ai-models-guide/gpt-4o"
            className="text-blue-600 hover:underline"
          >
            GPT-4o — balanced option
          </Link>
        </li>
        <li>
          <Link
            href="/ai-models-guide/gpt-5-4"
            className="text-blue-600 hover:underline"
          >
            GPT-5.4 — maximum performance
          </Link>
        </li>
        <li>
          <Link
            href="/ai-models-guide/o1"
            className="text-blue-600 hover:underline"
          >
            O1 — deep reasoning
          </Link>
        </li>
      </ul>
    </motion.div>
  </>
);

export default Gpt54Mini;
