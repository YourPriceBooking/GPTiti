"use client";

import Link from "next/link";

import Checkbox from "@mui/material/Checkbox";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

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
      <Checkbox
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
        icon={<CheckCircleOutlineIcon sx={{ color: "#00e676" }} />}
        checkedIcon={<CheckCircleIcon sx={{ color: "#00e676" }} />}
        sx={{
          padding: 0,
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
  );
}
