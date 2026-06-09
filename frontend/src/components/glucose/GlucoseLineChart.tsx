import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export function GlucoseLineChart({ data }: { data: { time: string; value: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis domain={[0, 350]} />
        <Tooltip />
        <Line type="monotone" dataKey="value" stroke="hsl(210 80% 50%)" strokeWidth={3} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

