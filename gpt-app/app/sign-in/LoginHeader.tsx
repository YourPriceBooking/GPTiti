'use client';

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function LoginHeader() {
  return (
    <div className="space-y-4">
      <motion.h1
        className="text-4xl font-bold text-gray-900 flex justify-between"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Link href="/" className="shrink-0">
          <Image
            src="/icons/rabbit.svg"
            alt="logo-rabbit"
            width={47}
            height={47}
            className="shrink-0"
          />
        </Link>
        Access the Smartest AI Models Instantly
      </motion.h1>

      <motion.p
        className="text-gray-600 text-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        No subscriptions. No monthly fees. Enjoy free test access to the world’s
        most powerful AI chat models.
      </motion.p>
    </div>
  );
}
