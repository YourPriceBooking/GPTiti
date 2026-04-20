"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const Gpt51Realtime = () => (
  <>
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="text-gray-700 text-lg leading-relaxed"
    >
      GPT-5.1-realtime is a real-time AI model for voice, live chat, and instant
      interaction. It is designed for applications where speed and
      responsiveness matter more than cost.
    </motion.p>

    <motion.p
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="text-gray-700 text-lg leading-relaxed"
    >
      Unlike standard AI models, it streams responses instantly, making
      conversations feel natural and continuous.
    </motion.p>

    <hr className="border-gray-200" />

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="space-y-4"
    >
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">
        What is GPT-5.1-realtime?
      </h2>
      <p className="text-gray-700 text-lg leading-relaxed">
        GPT-5.1-realtime is a streaming AI model that delivers responses in real
        time as they are generated. It is optimized for live interaction,
        including voice assistants, real-time chat, and interactive tools.
      </p>
      <p className="text-gray-700 text-lg leading-relaxed">
        This model prioritizes low latency and smooth communication rather than
        token efficiency.
      </p>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="space-y-4"
    >
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">
        What is GPT-5.1-realtime best for?
      </h2>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>✔️ Voice conversations</li>
        <li>✔️ Real-time chat</li>
        <li>✔️ Live assistants</li>
        <li>✔️ Interactive applications</li>
        <li>✔️ Instant responses without delay</li>
      </ul>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="space-y-4"
    >
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">
        When GPT-5.1-realtime is ideal
      </h2>
      <p className="text-gray-700 text-lg leading-relaxed">
        This model is ideal when you need immediate responses and continuous
        interaction.
      </p>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>✔️ Voice-based use cases</li>
        <li>✔️ Live chat experiences</li>
        <li>✔️ Real-time tools and apps</li>
      </ul>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="space-y-4"
    >
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">
        When GPT-5.1-realtime is not the best choice
      </h2>
      <ul className="list-disc list-inside text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>Text-based tasks (use GPT-5.1 or GPT-5.4-mini)</li>
        <li>Cheap usage (high token consumption)</li>
        <li>Deep reasoning (use O1)</li>
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
        <li>✔️ Instant responses</li>
        <li>✔️ Real-time streaming</li>
        <li>✔️ Best for interactive use</li>
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
        <li>Higher token usage</li>
        <li>More expensive than standard models</li>
        <li>Not optimized for complex reasoning</li>
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
        GPT-5.1-realtime uses approximately{" "}
        <span className="font-semibold">600 tokens per interaction</span>.
      </p>
      <p className="text-gray-700 text-lg leading-relaxed">
        With 10,000 tokens, you get approximately:
      </p>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>
          👉 <span className="font-semibold">≈ 16 interactions</span>
        </li>
      </ul>
      <p className="text-gray-700 text-lg leading-relaxed">
        For voice or streaming usage, this is roughly:
      </p>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>
          👉{" "}
          <span className="font-semibold">
            ≈ 10–20 minutes of real-time interaction
          </span>
        </li>
      </ul>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="space-y-4"
    >
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">
        GPT-5.1-realtime vs other models
      </h2>

      <p className="text-gray-700 text-lg leading-relaxed font-semibold">
        vs GPT-5.1:
      </p>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>✔️ Real-time responses</li>
      </ul>
      <ul className="list-disc list-inside text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>Less efficient for text tasks</li>
      </ul>

      <p className="text-gray-700 text-lg leading-relaxed font-semibold">
        vs GPT-4o-realtime:
      </p>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>✔️ Better quality</li>
      </ul>
      <ul className="list-disc list-inside text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>Higher cost</li>
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
        Compare with other models
      </h2>
      <p className="text-gray-700 text-lg leading-relaxed">
        Not sure if this model is right for you? Explore alternatives:
      </p>
      <ul className="list-disc list-inside text-lg leading-relaxed space-y-1 pl-5">
        <li>
          <Link
            href="/ai-models-guide/gpt-4o-realtime"
            className="text-blue-600 hover:underline"
          >
            GPT-4o-realtime — cheaper realtime option
          </Link>
        </li>
        <li>
          <Link
            href="/ai-models-guide/gpt-5-1"
            className="text-blue-600 hover:underline"
          >
            GPT-5.1 — better for text tasks
          </Link>
        </li>
        <li>
          <Link
            href="/ai-models-guide/o1"
            className="text-blue-600 hover:underline"
          >
            O1 — deep reasoning model
          </Link>
        </li>
      </ul>
    </motion.div>
  </>
);

export default Gpt51Realtime;
