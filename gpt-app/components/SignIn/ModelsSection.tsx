import { motion } from "framer-motion";

export default function ModelsSection() {
  return (
    <motion.div
      className="text-left space-y-6 mt-10"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
    >
      <motion.h2
        className="text-2xl font-semibold text-gray-900"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Available Models
      </motion.h2>

      <Category
        title="🔵 GPT-5 Series — Most powerful AI models"
        color="text-blue-600"
        models={[
          "gpt-5.4",
          "gpt-5.4-mini",
          "gpt-5.5",
        ]}
      />

    </motion.div>
  );
}

function Category({
  title,
  color,
  models,
}: {
  title: string;
  color: string;
  models: string[];
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h3 className={`${color} font-semibold text-lg`}>{title}</h3>
      <ul className="text-gray-700 ml-4 list-disc">
        {models.map((m) => (
          <li key={m}>{m}</li>
        ))}
      </ul>
    </motion.div>
  );
}
