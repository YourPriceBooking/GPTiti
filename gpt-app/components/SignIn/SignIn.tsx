"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import LoginHeader from "@/components/SignIn/LoginHeader";
import LoginButton from "@/components/SignIn/LoginButton";
import TermsCheckbox from "@/components/SignIn/TermsCheckbox";
import ModelsSection from "@/components/SignIn/ModelsSection";
import FooterNote from "@/components/SignIn/FooterNote";

export default function LoginPage() {
  const [checked, setChecked] = useState(false);

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="w-full max-w-xl mx-auto text-center space-y-8 p-6"
    >
      <LoginHeader />
      <LoginButton checked={checked} />
      <TermsCheckbox checked={checked} setChecked={setChecked} />
      <ModelsSection />
      <FooterNote />
    </motion.section>
  );
}
