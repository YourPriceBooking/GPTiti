import { motion } from "framer-motion";

export default function FooterNote() {
  return (
    <motion.p
      className="text-gray-600 text-base mt-8"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      Get instant access without limits. If you decide to purchase extra usage, your tokens never expire — use them anytime.
    </motion.p>
  );
}