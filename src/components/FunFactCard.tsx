import { motion } from "framer-motion";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export function FunFactCard({ text, source }: { text: string; source: string }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, rotateX: -10 }}
      animate={{ opacity: 1, scale: 1, rotateX: 0 }}
      transition={{ 
        duration: 0.6,
        type: "spring",
        stiffness: 100,
        damping: 15
      }}
      whileHover={{ 
        scale: 1.02,
        boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
      }}
      className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border border-blue-200 dark:border-blue-700 p-4 rounded-xl text-sm italic relative overflow-hidden"
      role="note"
    >
      {/* Animated background sparkles */}
      <motion.div
        className="absolute top-2 right-2 text-yellow-400 text-xs"
        animate={{ 
          rotate: [0, 10, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      >
        ✨
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {text}
      </motion.div>
      
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <motion.p 
            className="text-xs text-right mt-2 underline decoration-dotted cursor-help text-blue-600 dark:text-blue-400 hover:text-blue-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            📊 source
          </motion.p>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-3 bg-white/95 backdrop-blur">
          <motion.p 
            className="text-xs text-muted-foreground"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {source}
          </motion.p>
        </PopoverContent>
      </Popover>
    </motion.div>
  );
}