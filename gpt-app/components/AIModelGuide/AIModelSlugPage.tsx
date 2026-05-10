"use client";

import type { ReactNode } from "react";

import { useRouter } from "next/navigation";

import ModelCompareTable from "../common/ModelCompareTable/ModelCompareTable";

import { useSelectModel } from "@/hooks/useSelectModel";

import { motion } from "framer-motion";

type Props = {
  title: string;
  content: ReactNode;
  model?: string;
};

const AIModelSlugPage = ({ title, content, model }: Props) => {
  const router = useRouter();
  const selectModel = useSelectModel();

  const handleTryClick = () => {
    if (model) {
      selectModel(model);
    } else {
      router.push("/");
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
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
        <button
          type="button"
          onClick={handleTryClick}
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg px-6 py-3 rounded-xl transition-colors"
        >
          Try GPTiti now
        </button>
      </motion.div>
    </motion.section>
  );
};

export default AIModelSlugPage;
