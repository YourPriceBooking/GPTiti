"use client";

import { motion } from "framer-motion";
import Link from "next/link";

import ModelInputLimits from "@/components/common/ModelInputLimits/ModelInputLimits";

const Gpt54 = () => (
  <>
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="text-gray-700 text-lg leading-relaxed"
    >
      GPT-5.4 is the most powerful AI model available on GPTiti. It delivers the
      highest quality responses, advanced reasoning, and top-tier performance
      for complex and high-value tasks.
    </motion.p>

    <hr className="border-gray-200" />

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="space-y-4"
    >
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">
        What is GPT-5.4?
      </h2>
      <p className="text-gray-700 text-lg leading-relaxed">
        GPT-5.4 is a flagship AI model designed for maximum performance. It is
        significantly more capable than previous models and can handle complex
        tasks with high accuracy, depth, and structure.
      </p>
      <p className="text-gray-700 text-lg leading-relaxed">
        This model is built for users who need the best possible results —
        regardless of cost.
      </p>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="space-y-4"
    >
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">
        What is GPT-5.4 best for?
      </h2>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>✔️ Complex problem solving</li>
        <li>✔️ Advanced coding and development</li>
        <li>✔️ High-quality content creation</li>
        <li>✔️ Detailed explanations and analysis</li>
        <li>✔️ Professional and business use</li>
      </ul>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="space-y-4"
    >
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">
        When GPT-5.4 is ideal
      </h2>
      <p className="text-gray-700 text-lg leading-relaxed">
        GPT-5.4 is ideal when quality matters more than speed or cost.
      </p>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>✔️ Important tasks where accuracy is critical</li>
        <li>✔️ Complex workflows and projects</li>
        <li>✔️ Professional usage</li>
        <li>✔️ Situations where other models are not enough</li>
      </ul>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="space-y-4"
    >
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">
        When GPT-5.4 is not the best choice
      </h2>
      <p className="text-gray-700 text-lg leading-relaxed">
        GPT-5.4 is not optimized for cheap or high-volume usage.
      </p>
      <ul className="list-disc list-inside text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>Simple chat (use gpt-4o-mini)</li>
        <li>Budget usage (use gpt-4o-mini)</li>
        <li>Frequent everyday tasks</li>
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
        <li>✔️ Highest quality outputs</li>
        <li>✔️ Strong reasoning and logic</li>
        <li>✔️ Best performance across tasks</li>
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
        <li>High token usage</li>
        <li>More expensive than other models</li>
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
        GPT-5.4 uses approximately{" "}
        <span className="font-semibold">800 tokens per message</span>.
      </p>
      <p className="text-gray-700 text-lg leading-relaxed">
        With 10,000 tokens, you get approximately:
      </p>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>
          👉 <span className="font-semibold">≈ 12 messages</span>
        </li>
      </ul>
      <p className="text-gray-700 text-lg leading-relaxed">
        Compared to other models:
      </p>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li className="list-disc ml-5">~6x more expensive than gpt-5.4-mini</li>
        <li className="list-disc ml-5">~40x more expensive than gpt-4o-mini</li>
        <li>✔️ cheaper than o1 for most tasks</li>
      </ul>
    </motion.div>

    <hr className="border-gray-200" />

    <ModelInputLimits model="gpt-5.4" />

    <hr className="border-gray-200" />

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="space-y-4"
    >
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">
        GPT-5.4 vs other models
      </h2>

      <p className="text-gray-700 text-lg leading-relaxed font-semibold">
        vs gpt-5.4-mini:
      </p>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>✔️ Higher quality and deeper reasoning</li>
      </ul>
      <ul className="list-disc list-inside text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>Much higher cost</li>
      </ul>

      <p className="text-gray-700 text-lg leading-relaxed font-semibold">
        vs gpt-4o:
      </p>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>✔️ Significantly better performance</li>
      </ul>
      <ul className="list-disc list-inside text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>More expensive</li>
      </ul>

      <p className="text-gray-700 text-lg leading-relaxed font-semibold">
        vs o1:
      </p>
      <ul className="list-none text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>✔️ Faster</li>
        <li>✔️ Better general performance</li>
      </ul>
      <ul className="list-disc list-inside text-gray-700 text-lg leading-relaxed space-y-1 pl-5">
        <li>Slightly less deep reasoning</li>
      </ul>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="space-y-4"
    >
      <h2 className="text-xl md:text-2xl font-bold text-gray-900">
        When to choose GPT-5.4
      </h2>
      <p className="text-gray-700 text-lg leading-relaxed">
        Choose GPT-5.4 when you need the best possible results and other models
        are not enough. It is the right choice for important, complex, or
        high-value tasks.
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
            href="/ai-models-guide/compare-gpt-5-4-vs-o1"
            className="text-blue-600 hover:underline"
          >
            GPT-5.4 vs o1
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

export default Gpt54;
