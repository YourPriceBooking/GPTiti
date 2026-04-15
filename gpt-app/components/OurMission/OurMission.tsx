"use client";

import { motion } from "framer-motion";
import PageNav from "../common/PageNav";

export default function OurMission() {
  return (
    <div className="min-h-screen bg-white relative">
      <PageNav />
      <section className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-3xl space-y-10"
        >
          <h1 className="flex-1 text-4xl font-bold text-gray-900 text-center">
            Our Mission
          </h1>

          <motion.p
            className="text-gray-700 text-lg leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            At <span className="font-semibold text-blue-600">GPtiti</span>, we
            believe that access to intelligence should not be a privilege — it
            should be a right. Our global mission is simple yet bold: to gather
            the world’s most advanced AI models in one place and make them
            accessible to every person on Earth, completely free to try.
          </motion.p>

          <motion.p
            className="text-gray-700 text-lg leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            While the AI industry pushes mandatory subscriptions and recurring
            payments, we chose a different path. We eliminated subscriptions
            entirely. No monthly fees. No hidden traps. Just pure access to
            technology that can change lives.
          </motion.p>

          <motion.p
            className="text-gray-700 text-lg leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            If you ever decide to purchase additional access, your tokens will
            never expire. They stay with you — not for a month, not for a year —
            but exactly until you use them. This is how access to knowledge
            should work: fair, transparent, and empowering.
          </motion.p>

          <motion.p
            className="text-gray-700 text-lg leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            Our mission goes beyond technology. We want to give everyone —
            students, creators, researchers, entrepreneurs, dreamers — the
            chance to leverage the world’s smartest AI tools without limits.
            When people have equal access to intelligence, the entire world
            moves forward.
          </motion.p>

          <motion.p
            className="text-gray-700 text-lg leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            GPtiti exists because we believe in a future where advanced AI is
            not locked behind paywalls, but shared freely for the benefit of
            humanity.
          </motion.p>
        </motion.section>
      </section>
    </div>
  );
}
