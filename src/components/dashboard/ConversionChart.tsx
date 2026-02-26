import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Sem 1", conversoes: 8, leads: 32 },
  { name: "Sem 2", conversoes: 12, leads: 41 },
  { name: "Sem 3", conversoes: 15, leads: 38 },
  { name: "Sem 4", conversoes: 11, leads: 45 },
  { name: "Sem 5", conversoes: 18, leads: 52 },
  { name: "Sem 6", conversoes: 22, leads: 48 },
];

export function ConversionChart() {
  return (
    <div className="glass-card rounded-xl p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4">Conversões por Período</h3>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis dataKey="name" tick={{ fontSize: 11 }} className="text-muted-foreground" />
          <YAxis tick={{ fontSize: 11 }} className="text-muted-foreground" />
          <Tooltip />
          <Area type="monotone" dataKey="leads" stackId="1" stroke="hsl(205, 85%, 52%)" fill="hsl(205, 85%, 52%)" fillOpacity={0.15} name="Leads" />
          <Area type="monotone" dataKey="conversoes" stackId="2" stroke="hsl(160, 84%, 39%)" fill="hsl(160, 84%, 39%)" fillOpacity={0.2} name="Conversões" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
