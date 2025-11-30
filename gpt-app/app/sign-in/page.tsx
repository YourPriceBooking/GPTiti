"use client";

import { useState } from "react";
import Head from "next/head";
import Checkbox from "@mui/material/Checkbox";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { motion } from "framer-motion";
import Link from "next/link";

export default function LoginPage() {
  const [checked, setChecked] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };

  return (
    <>
      <Head>
        <title>
          GPT-5.1, GPT-4o, o1 Without ChatGPT Plus – GPTiti (Free Start)
        </title>
        <meta
          name="description"
          content="GPTiti = all OpenAI models (GPT-5.1, 4o, o1, o3) without paying $20/month."
        />
      </Head>

      <div className="min-h-screen bg-[#ffffff] flex flex-col items-center justify-center p-6">
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="w-full max-w-xl text-center space-y-8"
        >
          <motion.h1
            className="text-4xl font-bold text-gray-900"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Access the Smartest AI Models Instantly
          </motion.h1>

          <motion.p
            className="text-gray-600 text-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            No subscriptions. No monthly fees. Enjoy free test access to the
            world’s most powerful AI chat models.
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className={`w-full py-3 rounded-xl text-white font-semibold text-lg transition-all focus:ring-4 ${
              checked
                ? "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 focus:ring-blue-300"
                : "bg-gray-400 cursor-not-allowed"
            }`}
            disabled={!checked}
          >
            Sign in with Google
          </motion.button>

          <motion.div
            className="w-full flex items-start gap-2 mt-2 flex-wrap sm:flex-nowrap"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Checkbox
              checked={checked}
              onChange={handleChange}
              icon={<CheckCircleOutlineIcon sx={{ color: "#00e676" }} />}
              checkedIcon={<CheckCircleIcon sx={{ color: "#00e676" }} />}
              sx={{
                padding: 0,
                opacity: checked ? 1 : 0.25,
                transition: "opacity 0.3s ease-in-out",
                alignSelf: "flex-start",
              }}
            />
            <span className="text-gray-500 hover:text-gray-700 text-sm leading-snug">
              I have read and agree to the{" "}
              <Link
                href="/terms-conditions"
                className="text-blue-600 hover:underline hover:text-blue-800"
              >
                Terms & Conditions
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy-policy"
                className="text-blue-600 hover:underline hover:text-blue-800"
              >
                Privacy Policy
              </Link>
            </span>
          </motion.div>
          {/* sections with models */}
          <motion.div
            className="text-left space-y-6 mt-10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7 }}
          >
            <motion.h2
              className="text-2xl font-semibold text-gray-900"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Available Models
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-blue-600 font-semibold text-lg">
                🔵 Category 1 — GPT-5.1 (Premium)
              </h3>
              <ul className="text-gray-700 ml-4 list-disc">
                <li>gpt-5.1</li>
                <li>gpt-5.1-mini</li>
                <li>gpt-5.1-realtime</li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-purple-600 font-semibold text-lg">
                🟣 Category 2 — GPT-4o (Balanced)
              </h3>
              <ul className="text-gray-700 ml-4 list-disc">
                <li>gpt-4o</li>
                <li>gpt-4o-mini</li>
                <li>gpt-4o-realtime</li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-red-600 font-semibold text-lg">
                🔴 Category 3 — O-Series (Reasoning)
              </h3>
              <ul className="text-gray-700 ml-4 list-disc">
                <li>o1</li>
                <li>o1-mini</li>
                <li>o3-mini</li>
              </ul>
            </motion.div>
          </motion.div>

          <motion.p
            className="text-gray-600 text-base mt-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Get instant access without limits. If you decide to purchase extra
            usage, your tokens never expire — use them anytime.
          </motion.p>
        </motion.section>
      </div>
    </>
  );
}
































