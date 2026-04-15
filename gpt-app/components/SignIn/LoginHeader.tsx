import { motion } from "framer-motion";

export default function LoginHeader() {
  return (
    <>
      <motion.h1
        className="text-4xl font-bold text-gray-900 flex justify-between"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Access the Smartest AI Models Instantly
      </motion.h1>

      <motion.p
        className="text-gray-600 text-lg"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        No subscriptions. No monthly fees. Enjoy free test access to the world’s
        most powerful AI chat models.
      </motion.p>
    </>
  );
}
