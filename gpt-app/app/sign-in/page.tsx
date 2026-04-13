import { buildMetadata } from "@/lib/metadata";
import LoginPage from "./LoginPage";

import { useState } from "react";
import Head from "next/head";
import { motion } from "framer-motion";
import LoginHeader from "@/app/sign-in/LoginHeader";
import LoginButton from "@/app/sign-in/LoginButton";
import TermsCheckbox from "@/app/sign-in/TermsCheckbox";
import ModelsSection from "@/app/sign-in/ModelsSection";
import FooterNote from "@/app/sign-in/FooterNote";
import Link from "next/link";

export default function LoginPage() {
  const [checked, setChecked] = useState(false);

  return (
    <>
      <Head>
        <title>GPT-5.1, GPT-4o, o1 Without ChatGPT Plus – GPTiti (Free Start)</title>
      </Head>

      <div className="min-h-screen bg-white relative">
        <nav className="fixed top-0 left-0 z-50 w-full bg-white border-b border-slate-100 p-4">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <Link href="/" className="text-blue-600 font-medium hover:underline">← Back</Link>
            <div className="flex items-center gap-2">
              <img src="/icons/rabbit.svg" alt="logo" className="w-8 h-8" />
              <span className="font-bold text-xl tracking-tighter">GPT<span className="text-blue-600">iti</span></span>
            </div>
          </div>
        </nav>

        <div className="min-h-screen flex flex-col items-center justify-center p-6 pt-24">
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
      </div>
    </>
  );
}
