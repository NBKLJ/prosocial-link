import { Pipeline } from "./types";
import {
  TrendingUp, Users, Target, DollarSign, ArrowUpRight, ArrowDownRight,
  Clock, Zap, BarChart3, Activity, Brain,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area,
} from "recharts";

interface ExecutiveDashboardProps {
  pipelines: Pipeline[];
}

const formatCurrency = (v: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(v);

// Mock chart data
const revenueData = [
  { month: "Set", atual: 38000, anterior: 32000 },
  { month: "Out", atual: 45000, anterior: 36000 },
  { month: "Nov", atual: 52000, anterior: 41000 },
  { month: "Dez", atual: 61000, anterior: 48000 },
  { month: "Jan", atual: 58000, anterior: 52000 },
  { month: "Fev", atual: 72000, anterior: 55000 },
];

const forecastData = [
  { week: "S1", real: 18000, previsto: 17000 },
  { week: "S2", real: 22000, previsto: 21000 },
  { week: "S3", real: 19000, previsto: 23000 },
  { week: "S4", real: null, previsto: 25000 },
];

const originPieData = [
  { name: "WhatsApp", value: 45, color: "hsl(152, 69%, 40%)" },
  { name: "Site", value: 22, color: "hsl(262, 83%, 58%)" },
  { name: "Indicação", value: 18, color: "hsl(205, 85%, 52%)" },
  { name: "Anúncio", value: 12, color: "hsl(38, 92%, 50%)" },
];

const attendantPerf = [
  { name: "Ana S.", leads: 28, closed: 12, rate: 42.8, revenue: 48000 },
  { name: "Julia C.", leads: 18, closed: 9, rate: 50.0, revenue: 41000 },
  { name: "Carlos M.", leads: 22, closed: 8, rate: 36.4, revenue: 32000 },
  { name: "Pedro R.", leads: 15, closed: 5, rate: 33.3, revenue: 18000 },
];

const cycleData = [
  { stage: "Qualificação", days: 2.1 },
  { stage: "Contato", days: 3.4 },
  { stage: "Proposta", days: 4.2 },
  { stage: "Negociação", days: 2.7 },
];

export function ExecutiveDashboard({ pipelines }: ExecutiveDashboardProps) {
  const totalLeads = pipelines.reduce((s, p) => s + p.leads.length, 0);
  const closedLeads = pipelines.find(p => p.id === "closed")?.leads || [];
  const closedValue = closedLeads.reduce((s, l) => s + l.value, 0);
  const conversionRate = totalLeads > 0 ? (closedLeads.length / totalLeads) * 100 : 0;
  const avgTicket = closedLeads.length > 0 ? closedValue / closedLeads.length : 0;

  const predictedRevenue = 142000;
  const highPriorityLeads = 8;
  const atRiskLeads = 3;

  const kpis = [
    { label: "Receita Fechada", value: formatCurrency(closedValue), change: "+12.4%", up: true, icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Taxa de Conversão", value: `${conversionRate.toFixed(1)}%`, change: "+3.2%", up: true, icon: Target, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Ticket Médio", value: formatCurrency(avgTicket), change: "+8.1%", up: true, icon: TrendingUp, color: "text-purple-500", bg: "bg-purple-500/10" },
    { label: "Tempo Fechamento", value: "12.4 dias", change: "-2.1d", up: true, icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "CAC", value: formatCurrency(320), change: "-15%", up: true, icon: Users, color: "text-rose-500", bg: "bg-rose-500/10" },
    { label: "LTV", value: formatCurrency(4800), change: "+22%", up: true, icon: Zap, color: "text-cyan-500", bg: "bg-cyan-500/10" },
  ];

  return (
    <div className="space-y-6 overflow-y-auto pb-6">
      {/* AI Prediction Banner */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-2xl p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <Brain className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">Previsão de Receita com IA</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Baseada em histórico, perfil do cliente e comportamento</p>
            </div>
          </div>
          <div className="flex items-center gap-8">
            <div className="text-right">
              <p className="text-2xl font-bold text-foreground">{formatCurrency(predictedRevenue)}</p>
              <p className="text-xs text-muted-foreground">Receita prevista (30 dias)</p>
            </div>
            <div className="h-12 w-px bg-border" />
            <div className="text-center">
              <p className="text-lg font-bold text-primary">{highPriorityLeads}</p>
              <p className="text-[11px] text-muted-foreground">Alta prioridade</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-destructive">{atRiskLeads}</p>
              <p className="text-[11px] text-muted-foreground">Em risco</p>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-6 gap-3">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="bg-card border border-border/50 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center", kpi.bg)}>
                <kpi.icon className={cn("w-4 h-4", kpi.color)} />
              </div>
              <div className={cn("flex items-center gap-0.5 text-[11px] font-semibold", kpi.up ? "text-emerald-500" : "text-destructive")}>
                {kpi.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {kpi.change}
              </div>
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">{kpi.value}</p>
              <p className="text-[11px] text-muted-foreground">{kpi.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row 1: Revenue + Forecast */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card border border-border/50 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground">Receita por Período</h3>
            <div className="flex items-center gap-3 text-[10px]">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary" /> Atual</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-muted-foreground/30" /> Anterior</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => formatCurrency(v)} />
              <Area type="monotone" dataKey="anterior" stroke="hsl(var(--muted-foreground))" fill="hsl(var(--muted-foreground) / 0.08)" strokeWidth={1.5} strokeDasharray="4 4" />
              <Area type="monotone" dataKey="atual" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.1)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border border-border/50 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground">Previsão Semanal (IA)</h3>
            <Brain className="w-4 h-4 text-primary" />
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={forecastData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="week" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => formatCurrency(v)} />
              <Line type="monotone" dataKey="real" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} connectNulls={false} />
              <Line type="monotone" dataKey="previsto" stroke="hsl(var(--muted-foreground))" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2: Funnel + Origin + Cycle */}
      <div className="grid grid-cols-3 gap-4">
        {/* Funnel */}
        <div className="bg-card border border-border/50 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground">Funil de Conversão</h3>
            <Activity className="w-4 h-4 text-primary" />
          </div>
          <div className="space-y-2">
            {pipelines.filter(p => p.id !== "lost").map((stage) => {
              const width = totalLeads > 0 ? Math.max(20, (stage.leads.length / totalLeads) * 100) : 20;
              const stageValue = stage.leads.reduce((s, l) => s + l.value, 0);
              return (
                <div key={stage.id} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium text-foreground">{stage.title}</span>
                    <span className="text-[10px] font-bold text-foreground">{stage.leads.length}</span>
                  </div>
                  <div className="h-6 rounded-lg bg-primary/5 overflow-hidden" style={{ width: `${width}%` }}>
                    <div className="h-full rounded-lg bg-gradient-to-r from-primary/30 to-primary/10 flex items-center px-2">
                      <span className="text-[9px] font-bold text-primary">{formatCurrency(stageValue)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Origin Pie */}
        <div className="bg-card border border-border/50 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground">Leads por Origem</h3>
            <BarChart3 className="w-4 h-4 text-primary" />
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={originPieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={4} dataKey="value">
                {originPieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={(v: number) => [`${v} leads`, ""]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4">
            {originPieData.map(o => (
              <span key={o.name} className="text-[10px] text-muted-foreground flex items-center gap-1">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: o.color }} />{o.name}
              </span>
            ))}
          </div>
        </div>

        {/* Cycle Time */}
        <div className="bg-card border border-border/50 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground">Ciclo de Venda (dias)</h3>
            <Clock className="w-4 h-4 text-primary" />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={cycleData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis dataKey="stage" type="category" tick={{ fontSize: 10 }} width={80} stroke="hsl(var(--muted-foreground))" />
              <Tooltip formatter={(v: number) => [`${v} dias`, ""]} />
              <Bar dataKey="days" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Attendant Performance */}
      <div className="bg-card border border-border/50 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-foreground">Performance por Atendente</h3>
          <Users className="w-4 h-4 text-primary" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={attendantPerf}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip />
              <Bar dataKey="leads" fill="hsl(var(--primary) / 0.3)" name="Leads" radius={[4, 4, 0, 0]} />
              <Bar dataKey="closed" fill="hsl(var(--primary))" name="Fechados" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="space-y-3">
            {attendantPerf.map(att => (
              <div key={att.name} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-primary">{att.name.split(" ").map(n => n[0]).join("")}</span>
                  </div>
                  <span className="text-sm font-medium text-foreground">{att.name}</span>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <span className={cn("font-bold", att.rate >= 40 ? "text-emerald-500" : "text-amber-500")}>{att.rate}%</span>
                  <span className="font-semibold text-foreground">{formatCurrency(att.revenue)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Priority Engine */}
      <div className="bg-card border border-border/50 rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-bold text-foreground">Engine de Prioridade (IA)</h3>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold ml-auto">Auto-atualizado</span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Alta Prioridade", desc: "Probabilidade > 70%, resposta rápida", count: highPriorityLeads, color: "border-emerald-500/30 bg-emerald-500/5", badge: "bg-emerald-500/10 text-emerald-500" },
            { label: "Atenção Necessária", desc: "Sem resposta > 24h, proposta aberta", count: 5, color: "border-amber-500/30 bg-amber-500/5", badge: "bg-amber-500/10 text-amber-500" },
            { label: "Em Risco", desc: "Sem interação > 7 dias, score baixo", count: atRiskLeads, color: "border-destructive/30 bg-destructive/5", badge: "bg-destructive/10 text-destructive" },
          ].map((cat) => (
            <div key={cat.label} className={cn("border rounded-xl p-4 space-y-2", cat.color)}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground">{cat.label}</span>
                <span className={cn("text-lg font-bold px-2 py-0.5 rounded-lg", cat.badge)}>{cat.count}</span>
              </div>
              <p className="text-[11px] text-muted-foreground">{cat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
