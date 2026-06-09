import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['hsl(150 60% 45%)', 'hsl(40 90% 55%)', 'hsl(0 75% 55%)'];

export function TimeInRangeDonut({ data }: { data: { name: string; value: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie data={data} dataKey="value" innerRadius={70} outerRadius={105} paddingAngle={3}>
          {data.map((entry, index) => (
            <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}

