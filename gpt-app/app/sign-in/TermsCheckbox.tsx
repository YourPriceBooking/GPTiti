import Checkbox from "@mui/material/Checkbox";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Link from "next/link";
import { motion } from "framer-motion";

export default function TermsCheckbox({
  checked,
  setChecked,
}: {
  checked: boolean;
  setChecked: (val: boolean) => void;
}) {
  return (
    <motion.div
      className="w-full flex items-start gap-2 mt-2 flex-wrap sm:flex-nowrap"
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
          opacity: checked ? 1 : 0.25,
          transition: "opacity 0.3s ease-in-out",
          alignSelf: "flex-start",
        }}
      />
      <span className="text-gray-500 hover:text-gray-700 text-sm leading-snug">
        I have read and agree to the{" "}
        <Link href="/terms-conditions" className="text-blue-600 hover:underline hover:text-blue-800">
          Terms & Conditions
        </Link>{" "}
        and{" "}
        <Link href="/privacy-policy" className="text-blue-600 hover:underline hover:text-blue-800">
          Privacy Policy
        </Link>
      </span>
    </motion.div>
  );
}