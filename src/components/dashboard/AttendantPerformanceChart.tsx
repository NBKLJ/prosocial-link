import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Victor S.", atendimentos: 45, conversoes: 12, tempoMedio: "3min" },
  { name: "Ana L.", atendimentos: 38, conversoes: 9, tempoMedio: "4min" },
  { name: "Marcos R.", atendimentos: 52, conversoes: 15, tempoMedio: "2min" },
  { name: "Julia P.", atendimentos: 29, conversoes: 7, tempoMedio: "5min" },
];

export function AttendantPerformanceChart() {
  return (
    <div className="glass-card rounded-xl p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4">Desempenho por Atendente</h3>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis type="number" tick={{ fontSize: 11 }} className="text-muted-foreground" />
          <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={80} className="text-muted-foreground" />
          <Tooltip />
          <Bar dataKey="atendimentos" fill="hsl(205, 85%, 52%)" radius={[0, 4, 4, 0]} name="Atendimentos" />
          <Bar dataKey="conversoes" fill="hsl(160, 84%, 39%)" radius={[0, 4, 4, 0]} name="Conversões" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
