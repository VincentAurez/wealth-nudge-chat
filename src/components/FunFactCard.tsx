import { motion } from "framer-motion";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export function FunFactCard({ text, source }: { text: string; source: string }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 p-3 rounded-xl text-sm italic"
      role="note"
    >
      {text}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <p className="text-xs text-right mt-1 underline decoration-dotted cursor-help text-blue-600 dark:text-blue-400">
            source
          </p>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2">
          <p className="text-xs text-muted-foreground">{source}</p>
        </PopoverContent>
      </Popover>
    </motion.div>
  );
}