import { motion } from "framer-motion";

export default function LoginButton({ checked }: { checked: boolean }) {
  return (
    <motion.button
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
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
  );
}