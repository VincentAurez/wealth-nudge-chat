import { motion } from 'framer-motion';

interface LossBarProps {
  value: number; // Percentage of maximum acceptable loss
  max?: number;
}

export function LossBar({ value, max = 25 }: LossBarProps) {
  const percentage = (value / max) * 100;
  
  const getColor = (val: number) => {
    if (val <= 5) return '#22d3ee'; // cyan
    if (val <= 10) return '#10b981'; // green
    if (val <= 15) return '#f59e0b'; // yellow
    return '#ef4444'; // red
  };

  const getLabel = (val: number) => {
    if (val <= 5) return 'Très Prudent';
    if (val <= 10) return 'Prudent';
    if (val <= 15) return 'Modéré';
    return 'Risqué';
  };

  return (
    <motion.div
      className="w-full bg-slate-800/30 rounded-lg p-4 border border-cyan-400/20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-slate-200 font-medium">Perte Maximale Acceptable</h4>
        <span className="text-sm text-slate-400">{getLabel(value)}</span>
      </div>
      
      <div className="relative">
        <div className="w-full bg-slate-700 rounded-full h-6 overflow-hidden">
          <motion.div
            className="h-full rounded-full relative"
            style={{ backgroundColor: getColor(value) }}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20" />
          </motion.div>
        </div>
        
        <div className="flex justify-between text-xs text-slate-400 mt-2">
          <span>0%</span>
          <span className="font-semibold text-slate-200">{value}%</span>
          <span>{max}%</span>
        </div>
      </div>
      
      <div className="mt-3 text-xs text-slate-400">
        Vous acceptez une perte maximale de <span className="text-cyan-400 font-semibold">{value}%</span> de votre capital
      </div>
    </motion.div>
  );
}