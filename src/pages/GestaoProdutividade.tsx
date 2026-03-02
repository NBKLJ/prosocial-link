import { AppLayout } from "@/components/AppLayout";
import { ProGate } from "@/components/ui/ProGate";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { TrendingUp, TrendingDown, Clock, Target, Zap, BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { cn } from "@/lib/utils";

const weeklyData = [
  { day: "Seg", conversas: 45, resolvidas: 38, tempo: 2.1 },
  { day: "Ter", conversas: 52, resolvidas: 47, tempo: 1.8 },
  { day: "Qua", conversas: 49, resolvidas: 44, tempo: 2.3 },
  { day: "Qui", conversas: 61, resolvidas: 55, tempo: 1.9 },
  { day: "Sex", conversas: 38, resolvidas: 35, tempo: 2.0 },
  { day: "Sáb", conversas: 15, resolvidas: 14, tempo: 1.5 },
  { day: "Dom", conversas: 8, resolvidas: 7, tempo: 1.2 },
];

const teamPerformance = [
  { name: "Carlos", score: 92, trend: "up", conversations: 156, avgTime: "1.8min" },
  { name: "Ana", score: 97, trend: "up", conversations: 203, avgTime: "1.2min" },
  { name: "João", score: 78, trend: "down", conversations: 134, avgTime: "3.1min" },
  { name: "Maria", score: 85, trend: "up", conversations: 178, avgTime: "2.4min" },
];

const distributionData = [
  { name: "WhatsApp", value: 72, color: "hsl(var(--primary))" },
  { name: "Email", value: 15, color: "hsl(210, 70%, 55%)" },
  { name: "Telefone", value: 8, color: "hsl(40, 85%, 55%)" },
  { name: "Chat", value: 5, color: "hsl(150, 60%, 45%)" },
];

export default function GestaoProdutividade() {
  return (
    <AppLayout>
      <ProGate>
        <div className="p-6 space-y-6 overflow-y-auto h-full">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Produtividade</h1>
            <p className="text-sm text-muted-foreground">Métricas de performance e produtividade da equipe</p>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Conversas/Dia", value: "38.3", icon: Zap, change: "+12%", up: true },
              { label: "Tempo Médio Resp.", value: "1.9min", icon: Clock, change: "-8%", up: true },
              { label: "Taxa Resolução", value: "91%", icon: Target, change: "+3%", up: true },
              { label: "Score Médio", value: "88", icon: BarChart3, change: "+5pts", up: true },
            ].map((kpi) => (
              <Card key={kpi.label}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <kpi.icon className="w-4 h-4 text-muted-foreground" />
                    <span className={cn("text-xs font-medium flex items-center gap-0.5", kpi.up ? "text-emerald-500" : "text-red-500")}>
                      {kpi.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {kpi.change}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
                  <p className="text-xs text-muted-foreground">{kpi.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Weekly Chart */}
            <Card className="lg:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Conversas da Semana</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                    <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                    <Bar dataKey="conversas" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Recebidas" />
                    <Bar dataKey="resolvidas" fill="hsl(var(--primary) / 0.4)" radius={[4, 4, 0, 0]} name="Resolvidas" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Channel Distribution */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Por Canal</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={distributionData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={3}>
                      {distributionData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-1.5 mt-2">
                  {distributionData.map((d) => (
                    <div key={d.name} className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                        {d.name}
                      </span>
                      <span className="font-medium text-foreground">{d.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Team Ranking */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Ranking da Equipe</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {teamPerformance.sort((a, b) => b.score - a.score).map((member, i) => (
                <div key={member.name} className="flex items-center gap-4">
                  <span className="text-sm font-bold text-muted-foreground w-5">{i + 1}º</span>
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-muted text-foreground text-xs font-semibold">{member.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">{member.name}</p>
                    <p className="text-xs text-muted-foreground">{member.conversations} conversas • {member.avgTime} resp. média</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${member.score}%` }} />
                    </div>
                    <span className="text-sm font-bold text-foreground w-8">{member.score}</span>
                    {member.trend === "up" ? <TrendingUp className="w-4 h-4 text-emerald-500" /> : <TrendingDown className="w-4 h-4 text-red-500" />}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </ProGate>
    </AppLayout>
  );
}
