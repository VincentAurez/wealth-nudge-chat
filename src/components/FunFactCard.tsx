import { motion } from "framer-motion";

export function FunFactCard({ text }: { text: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 p-3 rounded-xl text-sm italic"
      role="note"
    >
      {text}
    </motion.div>
  );
}