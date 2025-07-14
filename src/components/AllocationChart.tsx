import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface AllocationChartProps {
  data: {
    livrets: number;
    assuranceVie: number;
    actions: number;
    immo: number;
    autres: number;
  };
}

const COLORS = {
  livrets: '#22d3ee',
  assuranceVie: '#a855f7',
  actions: '#ef4444',
  immo: '#22c55e',
  autres: '#f59e0b'
};

const LABELS = {
  livrets: 'Livrets & trésorerie',
  assuranceVie: 'Assurance-vie fonds €',
  actions: 'Actions / UC',
  immo: 'Immobilier locatif / SCPI',
  autres: 'Autres'
};

export function AllocationChart({ data }: AllocationChartProps) {
  const chartData = Object.entries(data)
    .filter(([, value]) => value > 0)
    .map(([key, value]) => ({
      name: LABELS[key as keyof typeof LABELS],
      value,
      color: COLORS[key as keyof typeof COLORS]
    }));

  interface CustomTooltipProps {
    active?: boolean;
    payload?: { name: string; value: number; color: string }[];
  }

  const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background/95 border rounded-lg p-2 shadow-lg">
          <p className="text-sm font-medium">{payload[0].name}</p>
          <p className="text-sm text-primary font-bold">{payload[0].value}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: '12px' }}
            formatter={(value, entry) => (
              <span style={{ color: (entry as { color?: string }).color }}>
                {value}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}