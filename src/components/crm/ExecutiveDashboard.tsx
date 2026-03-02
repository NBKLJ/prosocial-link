import { Pipeline, Lead } from "./types";
import {
  TrendingUp, Users, Target, DollarSign, ArrowUpRight, ArrowDownRight,
  Clock, Zap, BarChart3, Activity, Brain, ShieldCheck, AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ExecutiveDashboardProps {
  pipelines: Pipeline[];
}

const formatCurrency = (v: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(v);

const formatPercent = (v: number) => `${v.toFixed(1)}%`;

export function ExecutiveDashboard({ pipelines }: ExecutiveDashboardProps) {
  const totalLeads = pipelines.reduce((s, p) => s + p.leads.length, 0);
  const totalValue = pipelines.reduce((s, p) => s + p.leads.reduce((a, l) => a + l.value, 0), 0);
  const closedLeads = pipelines.find(p => p.id === "closed")?.leads || [];
  const closedValue = closedLeads.reduce((s, l) => s + l.value, 0);
  const lostLeads = pipelines.find(p => p.id === "lost")?.leads || [];
  const conversionRate = totalLeads > 0 ? (closedLeads.length / totalLeads) * 100 : 0;
  const avgTicket = closedLeads.length > 0 ? closedValue / closedLeads.length : 0;
  const weightedPipeline = pipelines.reduce((s, p) => s + p.leads.reduce((a, l) => a + l.value * ((l.probability || 0) / 100), 0), 0);
  const avgProbability = totalLeads > 0 ? pipelines.reduce((s, p) => s + p.leads.reduce((a, l) => a + (l.probability || 0), 0), 0) / totalLeads : 0;

  // Mock advanced metrics
  const avgCloseTimeDays = 12.4;
  const cac = 320;
  const ltv = 4800;
  const roiCampanha = 340;
  const nps = 72;
  const firstResponseTime = "2m 15s";
  const avgResponseTime = "4m 32s";
  const slaCompliance = 94.2;

  // Mock per-attendant data
  const attendantData = [
    { name: "Ana Silva", leads: 28, closed: 12, revenue: 48000, avgTime: "3m", rate: 42.8, score: 92 },
    { name: "Carlos Mendes", leads: 22, closed: 8, revenue: 32000, avgTime: "5m", rate: 36.4, score: 78 },
    { name: "Julia Costa", leads: 18, closed: 9, revenue: 41000, avgTime: "2m", rate: 50.0, score: 95 },
    { name: "Pedro Rocha", leads: 15, closed: 5, revenue: 18000, avgTime: "7m", rate: 33.3, score: 65 },
  ];

  // Mock origin data
  const originData = [
    { name: "WhatsApp", leads: 45, revenue: 89000, conversion: 38.2, color: "bg-emerald-500" },
    { name: "Site", leads: 22, revenue: 42000, conversion: 28.1, color: "bg-blue-500" },
    { name: "Indicação", leads: 12, revenue: 36000, conversion: 52.3, color: "bg-purple-500" },
    { name: "Anúncio", leads: 8, revenue: 12000, conversion: 18.7, color: "bg-amber-500" },
  ];

  // Mock AI predictions
  const predictedRevenue = 142000;
  const highPriorityLeads = 8;
  const atRiskLeads = 3;

  const kpis = [
    { label: "Receita Fechada", value: formatCurrency(closedValue), change: "+12.4%", up: true, icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Taxa de Conversão", value: formatPercent(conversionRate), change: "+3.2%", up: true, icon: Target, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Ticket Médio", value: formatCurrency(avgTicket), change: "+8.1%", up: true, icon: TrendingUp, color: "text-purple-500", bg: "bg-purple-500/10" },
    { label: "Tempo Médio Fechamento", value: `${avgCloseTimeDays} dias`, change: "-2.1 dias", up: true, icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "CAC", value: formatCurrency(cac), change: "-15%", up: true, icon: Users, color: "text-rose-500", bg: "bg-rose-500/10" },
    { label: "LTV", value: formatCurrency(ltv), change: "+22%", up: true, icon: Zap, color: "text-cyan-500", bg: "bg-cyan-500/10" },
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

      <div className="grid grid-cols-3 gap-4">
        {/* SLA & Performance */}
        <div className="bg-card border border-border/50 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground">SLA & Performance</h3>
            <ShieldCheck className="w-4 h-4 text-primary" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Primeira Resposta</span>
              <span className="text-sm font-bold text-foreground">{firstResponseTime}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Tempo Médio Resposta</span>
              <span className="text-sm font-bold text-foreground">{avgResponseTime}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Compliance SLA</span>
              <span className={cn("text-sm font-bold", slaCompliance >= 90 ? "text-emerald-500" : "text-destructive")}>{slaCompliance}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
              <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${slaCompliance}%` }} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">NPS</span>
              <span className={cn("text-sm font-bold", nps >= 70 ? "text-emerald-500" : nps >= 50 ? "text-amber-500" : "text-destructive")}>{nps}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">ROI por Campanha</span>
              <span className="text-sm font-bold text-emerald-500">{roiCampanha}%</span>
            </div>
          </div>
        </div>

        {/* Revenue by Origin */}
        <div className="bg-card border border-border/50 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground">Receita por Origem</h3>
            <BarChart3 className="w-4 h-4 text-primary" />
          </div>
          <div className="space-y-3">
            {originData.map((origin) => (
              <div key={origin.name} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={cn("w-2.5 h-2.5 rounded-full", origin.color)} />
                    <span className="text-xs font-medium text-foreground">{origin.name}</span>
                  </div>
                  <span className="text-xs font-bold text-foreground">{formatCurrency(origin.revenue)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className={cn("h-full rounded-full", origin.color)} style={{ width: `${(origin.revenue / 89000) * 100}%` }} />
                  </div>
                  <span className="text-[10px] text-muted-foreground w-10 text-right">{origin.leads} leads</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pipeline Funnel */}
        <div className="bg-card border border-border/50 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground">Funil de Conversão</h3>
            <Activity className="w-4 h-4 text-primary" />
          </div>
          <div className="space-y-2">
            {pipelines.filter(p => p.id !== "lost").map((stage, i) => {
              const width = totalLeads > 0 ? Math.max(20, ((stage.leads.length / totalLeads) * 100)) : 20;
              const stageValue = stage.leads.reduce((s, l) => s + l.value, 0);
              return (
                <div key={stage.id} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-medium text-foreground">{stage.title}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-muted-foreground">{stage.leads.length} leads</span>
                      <span className="text-[10px] font-bold text-foreground">{formatCurrency(stageValue)}</span>
                    </div>
                  </div>
                  <div className="h-6 rounded-lg bg-primary/5 overflow-hidden relative" style={{ width: `${width}%` }}>
                    <div className="h-full rounded-lg bg-gradient-to-r from-primary/30 to-primary/10 flex items-center px-2">
                      <span className="text-[9px] font-bold text-primary">{width.toFixed(0)}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Attendant Performance Table */}
      <div className="bg-card border border-border/50 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-foreground">Performance por Atendente</h3>
          <Users className="w-4 h-4 text-primary" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-[11px] font-semibold text-muted-foreground py-2 pr-4">Atendente</th>
                <th className="text-center text-[11px] font-semibold text-muted-foreground py-2 px-3">Leads</th>
                <th className="text-center text-[11px] font-semibold text-muted-foreground py-2 px-3">Fechados</th>
                <th className="text-center text-[11px] font-semibold text-muted-foreground py-2 px-3">Conversão</th>
                <th className="text-center text-[11px] font-semibold text-muted-foreground py-2 px-3">Receita</th>
                <th className="text-center text-[11px] font-semibold text-muted-foreground py-2 px-3">Tempo Resp.</th>
                <th className="text-center text-[11px] font-semibold text-muted-foreground py-2 px-3">Score</th>
              </tr>
            </thead>
            <tbody>
              {attendantData.map((att) => (
                <tr key={att.name} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-[10px] font-bold text-primary">{att.name.split(" ").map(n => n[0]).join("")}</span>
                      </div>
                      <span className="text-sm font-medium text-foreground">{att.name}</span>
                    </div>
                  </td>
                  <td className="text-center text-sm text-foreground py-3 px-3">{att.leads}</td>
                  <td className="text-center text-sm text-foreground py-3 px-3">{att.closed}</td>
                  <td className="text-center py-3 px-3">
                    <span className={cn("text-sm font-semibold", att.rate >= 40 ? "text-emerald-500" : att.rate >= 30 ? "text-amber-500" : "text-destructive")}>
                      {att.rate.toFixed(1)}%
                    </span>
                  </td>
                  <td className="text-center text-sm font-semibold text-foreground py-3 px-3">{formatCurrency(att.revenue)}</td>
                  <td className="text-center text-sm text-foreground py-3 px-3">{att.avgTime}</td>
                  <td className="text-center py-3 px-3">
                    <div className="flex items-center justify-center gap-1.5">
                      <div className="w-8 h-1.5 rounded-full bg-muted overflow-hidden">
                        <div className={cn("h-full rounded-full", att.score >= 85 ? "bg-emerald-500" : att.score >= 70 ? "bg-amber-500" : "bg-destructive")} style={{ width: `${att.score}%` }} />
                      </div>
                      <span className="text-[11px] font-bold text-foreground">{att.score}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Lead Priority Engine */}
      <div className="bg-card border border-border/50 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-bold text-foreground">Engine de Prioridade (IA)</h3>
          </div>
          <span className="text-[10px] px-2 py-1 rounded-full bg-primary/10 text-primary font-semibold">Auto-atualizado</span>
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
