import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const data = [
  { name: "WhatsApp", value: 45, color: "hsl(205, 85%, 52%)" },
  { name: "Site", value: 25, color: "hsl(262, 83%, 58%)" },
  { name: "Indicação", value: 18, color: "hsl(160, 84%, 39%)" },
  { name: "Anúncio", value: 12, color: "hsl(38, 92%, 50%)" },
];

export function LeadOriginPieChart() {
  return (
    <div className="glass-card rounded-xl p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4">Leads por Origem</h3>
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value">
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => [`${value} leads`, ""]} />
          <Legend iconType="circle" iconSize={8} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
