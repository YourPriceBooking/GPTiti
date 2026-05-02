"use client";

import type { ReactNode } from "react";

import Link from "next/link";

import ModelCompareTable from "../common/ModelCompareTable/ModelCompareTable";

import { motion } from "framer-motion";

type Props = {
  title: string;
  content: ReactNode;
};

const AIModelSlugPage = ({ title, content }: Props) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="w-full max-w-3xl mx-auto space-y-10 p-6"
    >
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 text-center">
        {title}
      </h1>

      {content}

      <hr className="border-gray-200" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="space-y-4"
      >
        <ModelCompareTable />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="space-y-4"
      >
        <p className="text-gray-700 text-lg leading-relaxed">
          You get{" "}
          <span className="font-semibold text-blue-600">
            10,000 free tokens
          </span>{" "}
          after sign-in.
          <br />
          No subscriptions • Tokens never expire.
        </p>
        <Link
          href="/sign-in"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg px-6 py-3 rounded-xl transition-colors"
        >
          Try GPTiti now
        </Link>
      </motion.div>
    </motion.section>
  );
};

export default AIModelSlugPage;
