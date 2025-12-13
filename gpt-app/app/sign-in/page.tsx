"use client";

import { useState } from "react";
import Head from "next/head";
import { motion } from "framer-motion";
import LoginHeader from "@/app/sign-in/LoginHeader";
import LoginButton from "@/app/sign-in/LoginButton";
import TermsCheckbox from "@/app/sign-in/TermsCheckbox";
import ModelsSection from "@/app/sign-in/ModelsSection";
import FooterNote from "@/app/sign-in/FooterNote";

export default function LoginPage() {
  const [checked, setChecked] = useState(false);

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
          <LoginHeader />

          <LoginButton checked={checked} />

          <TermsCheckbox checked={checked} setChecked={setChecked} />

          <ModelsSection />

          <FooterNote />
        </motion.section>
      </div>
    </>
  );
}


























