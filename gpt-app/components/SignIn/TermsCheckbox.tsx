"use client";

import Link from "next/link";

import { useAppSelector } from "@/redux/hooks";
import { selectIsLoggedIn } from "@/redux/auth/selectors";

import { motion } from "framer-motion";

export default function TermsCheckbox({
  checked,
  setChecked,
}: {
  checked: boolean;
  setChecked: (val: boolean) => void;
}) {
  const isLoggedIn = useAppSelector(selectIsLoggedIn);

  if (isLoggedIn) {
    return (
      <motion.div
        className="w-full flex items-center justify-center gap-2 mt-2 text-sm"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Link
          href="/terms-conditions"
          className="text-blue-600 hover:underline hover:text-blue-800"
        >
          Terms & Conditions
        </Link>
        <span className="text-gray-500">·</span>
        <Link
          href="/privacy-policy"
          className="text-blue-600 hover:underline hover:text-blue-800"
        >
          Privacy Policy
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="w-full flex items-start gap-2 mt-2 flex-nowrap sm:flex-nowrap"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <label className="relative flex shrink-0 self-start cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
          className="peer absolute inset-0 h-full w-full cursor-pointer opacity-0"
          aria-label="I have read and agree to the Terms & Conditions and Privacy Policy"
        />
        <svg
          viewBox="0 0 24 24"
          width="24"
          height="24"
          aria-hidden="true"
          focusable="false"
          className="rounded-full text-[#00e676] peer-focus-visible:ring-2 peer-focus-visible:ring-[#00e676]"
        >
          <use
            href={`/icons/ui-sprite.svg#${
              checked ? "ui-check-circle" : "ui-check-circle-outline"
            }`}
          />
        </svg>
      </label>
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
  );
}
