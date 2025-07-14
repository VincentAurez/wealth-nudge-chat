import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { motion } from 'framer-motion';

interface RiskHorizonLineProps {
  data: Array<{
    name: string;
    risque: number;
    rendement: number;
  }>;
}

export function RiskHorizonLine({ data }: RiskHorizonLineProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 border border-cyan-400/30 rounded-lg p-3 shadow-lg">
          <p className="text-cyan-400 font-medium">{label}</p>
          {payload.map((item: any, index: number) => (
            <p key={index} className="text-slate-300">
              {item.name}: <span className="font-semibold" style={{ color: item.color }}>{item.value}%</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      className="w-full h-64 bg-slate-800/30 rounded-lg p-4 border border-cyan-400/20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <h4 className="text-slate-200 font-medium mb-4 text-center">Risque vs Rendement dans le Temps</h4>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis 
            dataKey="name" 
            stroke="#94a3b8"
            fontSize={12}
          />
          <YAxis 
            stroke="#94a3b8"
            fontSize={12}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="risque" 
            stroke="#ef4444"
            strokeWidth={2}
            dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
            name="Risque"
          />
          <Line 
            type="monotone" 
            dataKey="rendement" 
            stroke="#22d3ee"
            strokeWidth={2}
            dot={{ fill: '#22d3ee', strokeWidth: 2, r: 4 }}
            name="Rendement"
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
}