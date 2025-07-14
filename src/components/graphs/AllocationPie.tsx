import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { motion } from 'framer-motion';

interface AllocationPieProps {
  data: {
    livrets: number;
    assuranceVie: number;
    actions: number;
    immo: number;
    autres: number;
  };
  benchmark?: {
    livrets: number;
    assuranceVie: number;
    actions: number;
    immo: number;
    autres: number;
  };
}

const COLORS = ['#22d3ee', '#6366f1', '#10b981', '#f59e0b', '#ef4444'];

export function AllocationPie({ data, benchmark }: AllocationPieProps) {
  const chartData = [
    { name: 'Livrets & Trésorerie', value: data.livrets, benchmark: benchmark?.livrets || 0 },
    { name: 'Assurance Vie', value: data.assuranceVie, benchmark: benchmark?.assuranceVie || 0 },
    { name: 'Actions / UC', value: data.actions, benchmark: benchmark?.actions || 0 },
    { name: 'Immobilier', value: data.immo, benchmark: benchmark?.immo || 0 },
    { name: 'Autres', value: data.autres, benchmark: benchmark?.autres || 0 },
  ];

  const benchmarkData = benchmark ? [
    { name: 'Livrets & Trésorerie', value: benchmark.livrets },
    { name: 'Assurance Vie', value: benchmark.assuranceVie },
    { name: 'Actions / UC', value: benchmark.actions },
    { name: 'Immobilier', value: benchmark.immo },
    { name: 'Autres', value: benchmark.autres },
  ] : [];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-800 border border-cyan-400/30 rounded-lg p-3 shadow-lg">
          <p className="text-cyan-400 font-medium">{data.name}</p>
          <p className="text-slate-300">
            Actuel: <span className="text-cyan-400 font-semibold">{data.value}%</span>
          </p>
          {benchmark && (
            <p className="text-slate-300">
              Recommandé: <span className="text-indigo-400 font-semibold">{data.benchmark}%</span>
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      className="w-full h-80"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-slate-200 mb-2">Répartition des Actifs</h3>
        {benchmark && (
          <p className="text-sm text-slate-400">Comparaison avec le benchmark recommandé</p>
        )}
      </div>
      
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, value }) => `${name}: ${value}%`}
            labelLine={false}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      {benchmark && (
        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
          {chartData.map((item, index) => (
            <div key={item.name} className="flex items-center justify-between p-2 bg-slate-700/30 rounded">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-slate-300 text-xs">{item.name}</span>
              </div>
              <span className="text-xs">
                <span className="text-cyan-400">{item.value}%</span>
                <span className="text-slate-500"> / </span>
                <span className="text-indigo-400">{item.benchmark}%</span>
              </span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}