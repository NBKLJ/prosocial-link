import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Seg", enviadas: 420, recebidas: 310 },
  { name: "Ter", enviadas: 380, recebidas: 290 },
  { name: "Qua", enviadas: 510, recebidas: 380 },
  { name: "Qui", enviadas: 470, recebidas: 350 },
  { name: "Sex", enviadas: 540, recebidas: 410 },
  { name: "Sáb", enviadas: 290, recebidas: 200 },
  { name: "Dom", enviadas: 237, recebidas: 183 },
];

export function MessagesChart() {
  return (
    <div className="glass-card rounded-xl p-6">
      <h3 className="text-base font-semibold text-foreground mb-4">Mensagens por Dia</h3>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(211, 100%, 50%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(211, 100%, 50%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(168, 76%, 42%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(168, 76%, 42%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 90%)" strokeOpacity={0.3} />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: "hsl(220, 10%, 46%)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: "hsl(220, 10%, 46%)" }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{
                background: "hsl(220, 25%, 8%)",
                border: "1px solid hsl(220, 20%, 15%)",
                borderRadius: "8px",
                color: "hsl(0, 0%, 95%)",
                fontSize: "13px",
              }}
            />
            <Area type="monotone" dataKey="enviadas" stroke="hsl(211, 100%, 50%)" fill="url(#greenGrad)" strokeWidth={2} />
            <Area type="monotone" dataKey="recebidas" stroke="hsl(168, 76%, 42%)" fill="url(#blueGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
