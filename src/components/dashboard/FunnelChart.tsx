import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Novo Lead", value: 184, fill: "hsl(262, 83%, 58%)" },
  { name: "Negociação", value: 92, fill: "hsl(211, 100%, 50%)" },
  { name: "Fechado", value: 47, fill: "hsl(160, 84%, 39%)" },
  { name: "Perdido", value: 28, fill: "hsl(0, 84%, 60%)" },
];

export function FunnelChart() {
  return (
    <div className="glass-card rounded-xl p-6">
      <h3 className="text-base font-semibold text-foreground mb-4">Leads por Etapa do Funil</h3>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" barSize={28}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 90%)" strokeOpacity={0.3} horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 12, fill: "hsl(220, 10%, 46%)" }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: "hsl(220, 10%, 46%)" }} axisLine={false} tickLine={false} width={100} />
            <Tooltip
              contentStyle={{
                background: "hsl(220, 25%, 8%)",
                border: "1px solid hsl(220, 20%, 15%)",
                borderRadius: "8px",
                color: "hsl(0, 0%, 95%)",
                fontSize: "13px",
              }}
            />
            <Bar dataKey="value" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
