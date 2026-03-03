import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { ProGate } from "@/components/ui/ProGate";
import {
  TrendingUp, TrendingDown, Users, MessageCircle, Clock, Target,
  BarChart3, PieChart, Activity, AlertTriangle, CheckCircle2,
  Lightbulb, Brain, ArrowUpRight, ArrowDownRight, Zap, Shield,
  RefreshCw, ChevronRight, Sparkles, Eye, ThumbsUp, ThumbsDown,
  Timer, UserCheck, MessageSquare, Phone, Bot, Award,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart as RechartsPie, Pie, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from "recharts";

// ── MOCK BI DATA ──────────────────────────────────────────

const MONTHLY_REVENUE = [
  { month: "Set", value: 42000 }, { month: "Out", value: 48500 },
  { month: "Nov", value: 51200 }, { month: "Dez", value: 55800 },
  { month: "Jan", value: 62000 }, { month: "Fev", value: 68500 },
  { month: "Mar", value: 72300 },
];

const CONVERSATIONS_DATA = [
  { month: "Set", atendidas: 320, naoAtendidas: 45, ia: 180 },
  { month: "Out", atendidas: 380, naoAtendidas: 32, ia: 220 },
  { month: "Nov", atendidas: 410, naoAtendidas: 28, ia: 260 },
  { month: "Dez", atendidas: 390, naoAtendidas: 35, ia: 240 },
  { month: "Jan", atendidas: 450, naoAtendidas: 22, ia: 310 },
  { month: "Fev", atendidas: 520, naoAtendidas: 18, ia: 370 },
  { month: "Mar", atendidas: 540, naoAtendidas: 15, ia: 400 },
];

const LEAD_SOURCES = [
  { name: "WhatsApp Orgânico", value: 38, color: "hsl(142, 71%, 45%)" },
  { name: "Google Ads", value: 25, color: "hsl(217, 91%, 60%)" },
  { name: "Instagram", value: 20, color: "hsl(280, 67%, 55%)" },
  { name: "Indicação", value: 12, color: "hsl(38, 92%, 50%)" },
  { name: "Site", value: 5, color: "hsl(0, 84%, 60%)" },
];

const PERFORMANCE_RADAR = [
  { metric: "Tempo Resposta", atual: 85, meta: 90 },
  { metric: "Satisfação", atual: 92, meta: 95 },
  { metric: "Conversão", atual: 68, meta: 80 },
  { metric: "Retenção", atual: 78, meta: 85 },
  { metric: "Automação", atual: 74, meta: 70 },
  { metric: "Produtividade", atual: 81, meta: 85 },
];

const ATTENDANT_RANKING = [
  { name: "Ana Paula", conversations: 186, conversion: 32, avgTime: "2min", satisfaction: 96 },
  { name: "Carlos Silva", conversations: 154, conversion: 28, avgTime: "3min", satisfaction: 91 },
  { name: "Maria Santos", conversations: 142, conversion: 24, avgTime: "4min", satisfaction: 88 },
  { name: "Pedro Alves", conversations: 118, conversion: 19, avgTime: "5min", satisfaction: 85 },
];

const HOURLY_HEATMAP = [
  { hour: "08h", seg: 12, ter: 15, qua: 18, qui: 14, sex: 20 },
  { hour: "09h", seg: 25, ter: 30, qua: 28, qui: 32, sex: 35 },
  { hour: "10h", seg: 38, ter: 42, qua: 45, qui: 40, sex: 48 },
  { hour: "11h", seg: 45, ter: 48, qua: 50, qui: 52, sex: 55 },
  { hour: "12h", seg: 20, ter: 18, qua: 22, qui: 15, sex: 25 },
  { hour: "13h", seg: 15, ter: 12, qua: 18, qui: 10, sex: 20 },
  { hour: "14h", seg: 42, ter: 45, qua: 48, qui: 44, sex: 50 },
  { hour: "15h", seg: 50, ter: 52, qua: 55, qui: 48, sex: 58 },
  { hour: "16h", seg: 48, ter: 50, qua: 52, qui: 46, sex: 55 },
  { hour: "17h", seg: 35, ter: 38, qua: 40, qui: 36, sex: 42 },
  { hour: "18h", seg: 22, ter: 25, qua: 28, qui: 20, sex: 30 },
];

// ── AI INSIGHTS ───────────────────────────────────────────
interface AIInsight {
  id: string;
  type: "critical" | "warning" | "opportunity" | "success";
  title: string;
  description: string;
  action: string;
  impact: string;
  metric?: string;
}

const AI_INSIGHTS: AIInsight[] = [
  {
    id: "ins-1", type: "critical",
    title: "Gargalo no horário de pico (10h-11h)",
    description: "O volume de conversas entre 10h e 11h ultrapassa a capacidade de atendimento em 23%. Isso resulta em 15% dos leads não respondidos nesse horário, gerando perda estimada de R$ 8.500/mês em conversões.",
    action: "Recomendação: Ativar a IA Setorial de Recepção com prioridade máxima nesse horário ou redistribuir 2 atendentes do turno da tarde.",
    impact: "Alto", metric: "-23% capacidade",
  },
  {
    id: "ins-2", type: "warning",
    title: "Taxa de conversão abaixo da meta",
    description: "A taxa de conversão atual é de 68%, enquanto a meta definida é 80%. Os leads provenientes do Google Ads apresentam a menor taxa (42%), indicando possível desalinhamento entre a campanha e o público-alvo.",
    action: "Recomendação: Revisar segmentação de anúncios no Google Ads e alinhar scripts da IA Comercial para leads pagos.",
    impact: "Alto", metric: "68% vs 80%",
  },
  {
    id: "ins-3", type: "opportunity",
    title: "Automação pode absorver +35% do volume",
    description: "Análise das últimas 2.000 conversas mostra que 35% das interações são perguntas repetitivas já mapeadas na FAQ. A IA responde apenas 74% do possível.",
    action: "Recomendação: Adicionar 12 novos gatilhos de FAQ identificados e ativar modo proativo na IA de Recepção.",
    impact: "Médio", metric: "+35% automação",
  },
  {
    id: "ins-4", type: "success",
    title: "Satisfação do cliente em tendência de alta",
    description: "O índice de satisfação subiu de 87% para 92% nos últimos 3 meses. O principal fator foi a redução do tempo médio de resposta de 5min para 3min.",
    action: "Manter a estratégia atual. Considerar implementar pesquisa NPS automatizada pós-atendimento.",
    impact: "Positivo", metric: "92% satisfação",
  },
  {
    id: "ins-5", type: "warning",
    title: "Pedro Alves precisa de capacitação",
    description: "O atendente Pedro Alves apresenta tempo médio de resposta de 5min (meta: 3min) e taxa de satisfação de 85% (meta: 90%). O desempenho está 18% abaixo da média da equipe.",
    action: "Recomendação: Agendar treinamento individual com foco em agilidade e qualidade de atendimento. Sugerir acompanhamento de atendimentos da Ana Paula como benchmark.",
    impact: "Médio", metric: "85% satisfação",
  },
  {
    id: "ins-6", type: "opportunity",
    title: "WhatsApp orgânico é o canal mais rentável",
    description: "Leads de WhatsApp orgânico convertem 2.4x mais que leads pagos, com custo de aquisição R$ 0. Representam 38% do volume mas 52% das conversões.",
    action: "Recomendação: Investir em estratégias de indicação e conteúdo para aumentar volume orgânico em 20%.",
    impact: "Alto", metric: "2.4x conversão",
  },
];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

const insightConfig = {
  critical: { icon: AlertTriangle, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20", label: "Crítico" },
  warning: { icon: AlertTriangle, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", label: "Atenção" },
  opportunity: { icon: Lightbulb, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", label: "Oportunidade" },
  success: { icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", label: "Sucesso" },
};

// ── KPI CARDS ─────────────────────────────────────────────
function KPICards() {
  const kpis = [
    { label: "Receita Mensal", value: formatCurrency(72300), change: "+5.5%", positive: true, icon: TrendingUp, accent: "text-emerald-400" },
    { label: "Conversas Atendidas", value: "540", change: "+3.8%", positive: true, icon: MessageCircle, accent: "text-blue-400" },
    { label: "Taxa de Conversão", value: "68%", change: "-2.1%", positive: false, icon: Target, accent: "text-amber-400" },
    { label: "Tempo Médio Resposta", value: "3min", change: "-12%", positive: true, icon: Timer, accent: "text-purple-400" },
    { label: "Satisfação", value: "92%", change: "+5.2%", positive: true, icon: ThumbsUp, accent: "text-emerald-400" },
    { label: "Leads Não Atendidos", value: "15", change: "-16%", positive: true, icon: ThumbsDown, accent: "text-red-400" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
      {kpis.map((k, i) => (
        <motion.div key={k.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
          className="bg-card border border-border/50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <k.icon className={cn("w-4 h-4", k.accent)} />
            <span className={cn("text-[10px] font-bold flex items-center gap-0.5", k.positive ? "text-emerald-400" : "text-red-400")}>
              {k.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {k.change}
            </span>
          </div>
          <p className="text-xl font-bold text-foreground">{k.value}</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">{k.label}</p>
        </motion.div>
      ))}
    </div>
  );
}

// ── AI STRATEGY PANEL ─────────────────────────────────────
function AIStrategyPanel() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const handleReanalyze = () => {
    setAnalyzing(true);
    setTimeout(() => setAnalyzing(false), 3000);
  };

  const criticalCount = AI_INSIGHTS.filter(i => i.type === "critical").length;
  const warningCount = AI_INSIGHTS.filter(i => i.type === "warning").length;
  const opportunityCount = AI_INSIGHTS.filter(i => i.type === "opportunity").length;

  return (
    <div className="space-y-4">
      <div className="bg-card border border-border/50 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
              <Brain className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Estrategista IA</h3>
              <p className="text-xs text-muted-foreground">Análise inteligente baseada nos seus dados em tempo real</p>
            </div>
          </div>
          <button onClick={handleReanalyze} disabled={analyzing}
            className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
              analyzing ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary hover:bg-primary/15")}>
            <RefreshCw className={cn("w-3 h-3", analyzing && "animate-spin")} />
            {analyzing ? "Analisando..." : "Reanalisar"}
          </button>
        </div>

        {/* Summary counters */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="flex items-center gap-2 bg-red-500/5 border border-red-500/15 rounded-lg px-3 py-2">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <div>
              <p className="text-lg font-bold text-foreground">{criticalCount}</p>
              <p className="text-[10px] text-muted-foreground">Críticos</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-amber-500/5 border border-amber-500/15 rounded-lg px-3 py-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <div>
              <p className="text-lg font-bold text-foreground">{warningCount}</p>
              <p className="text-[10px] text-muted-foreground">Atenção</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-blue-500/5 border border-blue-500/15 rounded-lg px-3 py-2">
            <Lightbulb className="w-4 h-4 text-blue-400" />
            <div>
              <p className="text-lg font-bold text-foreground">{opportunityCount}</p>
              <p className="text-[10px] text-muted-foreground">Oportunidades</p>
            </div>
          </div>
        </div>
      </div>

      {/* Insights list */}
      <div className="space-y-3">
        {AI_INSIGHTS.map((insight, i) => {
          const config = insightConfig[insight.type];
          const Icon = config.icon;
          const isExpanded = expandedId === insight.id;

          return (
            <motion.div key={insight.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className={cn("bg-card border rounded-xl overflow-hidden transition-all", config.border)}>
              <button onClick={() => setExpandedId(isExpanded ? null : insight.id)}
                className="w-full flex items-start gap-3 p-4 text-left hover:bg-muted/10 transition-colors">
                <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5", config.bg)}>
                  <Icon className={cn("w-4 h-4", config.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-semibold text-foreground">{insight.title}</h4>
                    <Badge variant="outline" className={cn("text-[9px] px-1.5 py-0", config.color, config.border)}>{config.label}</Badge>
                    {insight.metric && (
                      <span className="text-[10px] font-mono font-bold text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded">{insight.metric}</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">{insight.description}</p>
                </div>
                <ChevronRight className={cn("w-4 h-4 text-muted-foreground flex-shrink-0 mt-2 transition-transform", isExpanded && "rotate-90")} />
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden">
                    <div className="px-4 pb-4 pt-0 ml-12 space-y-3">
                      <p className="text-sm text-foreground/80 leading-relaxed">{insight.description}</p>
                      <div className={cn("rounded-lg p-3 border", config.bg, config.border)}>
                        <div className="flex items-start gap-2">
                          <Sparkles className={cn("w-4 h-4 flex-shrink-0 mt-0.5", config.color)} />
                          <div>
                            <p className="text-xs font-bold text-foreground mb-1">Plano de Ação IA</p>
                            <p className="text-xs text-foreground/80 leading-relaxed">{insight.action}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-muted-foreground">Impacto: <strong className="text-foreground">{insight.impact}</strong></span>
                        <button className="text-[10px] font-semibold text-primary hover:underline">Aplicar recomendação →</button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ── CHARTS ────────────────────────────────────────────────
function RevenueChart() {
  return (
    <div className="bg-card border border-border/50 rounded-xl p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4">Receita Mensal</h3>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={MONTHLY_REVENUE}>
          <defs>
            <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
          <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
          <Tooltip formatter={(v: number) => formatCurrency(v)} contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
          <Area type="monotone" dataKey="value" stroke="hsl(142, 71%, 45%)" strokeWidth={2} fill="url(#revenueGrad)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function ConversationsChart() {
  return (
    <div className="bg-card border border-border/50 rounded-xl p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4">Volume de Conversas</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={CONVERSATIONS_DATA}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
          <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
          <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
          <Bar dataKey="atendidas" stackId="a" fill="hsl(217, 91%, 60%)" radius={[0, 0, 0, 0]} name="Atendidas" />
          <Bar dataKey="ia" stackId="a" fill="hsl(280, 67%, 55%)" radius={[0, 0, 0, 0]} name="IA" />
          <Bar dataKey="naoAtendidas" stackId="a" fill="hsl(0, 84%, 60%)" radius={[4, 4, 0, 0]} name="Não Atendidas" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function LeadSourcesChart() {
  return (
    <div className="bg-card border border-border/50 rounded-xl p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4">Origem dos Leads</h3>
      <div className="flex items-center gap-6">
        <ResponsiveContainer width={180} height={180}>
          <RechartsPie>
            <Pie data={LEAD_SOURCES} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
              {LEAD_SOURCES.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
          </RechartsPie>
        </ResponsiveContainer>
        <div className="flex-1 space-y-2">
          {LEAD_SOURCES.map(s => (
            <div key={s.name} className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: s.color }} />
              <span className="text-xs text-foreground flex-1">{s.name}</span>
              <span className="text-xs font-bold text-foreground">{s.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PerformanceRadar() {
  return (
    <div className="bg-card border border-border/50 rounded-xl p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4">Radar de Performance</h3>
      <ResponsiveContainer width="100%" height={220}>
        <RadarChart data={PERFORMANCE_RADAR}>
          <PolarGrid stroke="hsl(var(--border))" opacity={0.3} />
          <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
          <PolarRadiusAxis tick={false} axisLine={false} />
          <Radar name="Atual" dataKey="atual" stroke="hsl(217, 91%, 60%)" fill="hsl(217, 91%, 60%)" fillOpacity={0.2} />
          <Radar name="Meta" dataKey="meta" stroke="hsl(142, 71%, 45%)" fill="hsl(142, 71%, 45%)" fillOpacity={0.1} strokeDasharray="4 4" />
        </RadarChart>
      </ResponsiveContainer>
      <div className="flex items-center justify-center gap-6 mt-2">
        <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground"><span className="w-3 h-0.5 bg-blue-500 rounded" /> Atual</span>
        <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground"><span className="w-3 h-0.5 bg-emerald-500 rounded border-dashed" /> Meta</span>
      </div>
    </div>
  );
}

// ── HEATMAP ───────────────────────────────────────────────
function ConversationHeatmap() {
  const days = ["seg", "ter", "qua", "qui", "sex"];
  const getColor = (val: number) => {
    if (val >= 50) return "bg-blue-500/80";
    if (val >= 40) return "bg-blue-500/60";
    if (val >= 30) return "bg-blue-500/40";
    if (val >= 20) return "bg-blue-500/25";
    return "bg-blue-500/10";
  };

  return (
    <div className="bg-card border border-border/50 rounded-xl p-5">
      <h3 className="text-sm font-semibold text-foreground mb-4">Mapa de Calor — Conversas por Horário</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-[10px] font-medium text-muted-foreground py-1 px-2 text-left">Hora</th>
              {days.map(d => <th key={d} className="text-[10px] font-medium text-muted-foreground py-1 px-2 uppercase">{d}</th>)}
            </tr>
          </thead>
          <tbody>
            {HOURLY_HEATMAP.map(row => (
              <tr key={row.hour}>
                <td className="text-[10px] text-muted-foreground py-1 px-2 font-mono">{row.hour}</td>
                {days.map(d => (
                  <td key={d} className="py-1 px-1">
                    <div className={cn("w-full h-7 rounded flex items-center justify-center text-[9px] font-bold text-foreground/80", getColor((row as any)[d]))}>
                      {(row as any)[d]}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── ATTENDANT RANKING ─────────────────────────────────────
function AttendantRanking() {
  return (
    <div className="bg-card border border-border/50 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Award className="w-4 h-4 text-amber-400" />
        <h3 className="text-sm font-semibold text-foreground">Ranking de Atendentes</h3>
      </div>
      <div className="space-y-3">
        {ATTENDANT_RANKING.map((att, i) => (
          <div key={att.name} className="flex items-center gap-3">
            <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold",
              i === 0 ? "bg-amber-500/15 text-amber-400" : "bg-muted/50 text-muted-foreground")}>
              {i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{att.name}</p>
              <p className="text-[10px] text-muted-foreground">{att.conversations} conversas • {att.avgTime} resp.</p>
            </div>
            <div className="flex items-center gap-3 text-right">
              <div>
                <p className="text-xs font-bold text-foreground">{att.conversion}%</p>
                <p className="text-[9px] text-muted-foreground">Conversão</p>
              </div>
              <div>
                <p className={cn("text-xs font-bold", att.satisfaction >= 90 ? "text-emerald-400" : "text-amber-400")}>{att.satisfaction}%</p>
                <p className="text-[9px] text-muted-foreground">Satisfação</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── MAIN PAGE ─────────────────────────────────────────────
export default function Relatorios() {
  const [activeTab, setActiveTab] = useState("visao-geral");

  const content = (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Relatórios & BI</h1>
          <p className="text-sm text-muted-foreground mt-1">Inteligência de negócios com análise estratégica por IA</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Dados em tempo real
          </span>
        </div>
      </div>

      <KPICards />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-muted/30 border border-border/50 p-1 rounded-xl">
          <TabsTrigger value="visao-geral" className="rounded-lg text-xs data-[state=active]:bg-card data-[state=active]:shadow-sm">
            <BarChart3 className="w-3 h-3 mr-1" /> Visão Geral
          </TabsTrigger>
          <TabsTrigger value="ia-estrategista" className="rounded-lg text-xs data-[state=active]:bg-card data-[state=active]:shadow-sm">
            <Brain className="w-3 h-3 mr-1" /> IA Estrategista
          </TabsTrigger>
          <TabsTrigger value="atendimento" className="rounded-lg text-xs data-[state=active]:bg-card data-[state=active]:shadow-sm">
            <MessageCircle className="w-3 h-3 mr-1" /> Atendimento
          </TabsTrigger>
          <TabsTrigger value="equipe" className="rounded-lg text-xs data-[state=active]:bg-card data-[state=active]:shadow-sm">
            <Users className="w-3 h-3 mr-1" /> Equipe
          </TabsTrigger>
        </TabsList>

        <TabsContent value="visao-geral" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <RevenueChart />
            <ConversationsChart />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <LeadSourcesChart />
            <PerformanceRadar />
          </div>
        </TabsContent>

        <TabsContent value="ia-estrategista">
          <AIStrategyPanel />
        </TabsContent>

        <TabsContent value="atendimento" className="space-y-4">
          <ConversationHeatmap />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ConversationsChart />
            <LeadSourcesChart />
          </div>
        </TabsContent>

        <TabsContent value="equipe" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <AttendantRanking />
            <PerformanceRadar />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );

  return (
    <AppLayout>
      <ProGate title="Relatórios & BI" description="Disponível no plano Premium. Inteligência de negócios com análise estratégica por IA.">
        {content}
      </ProGate>
    </AppLayout>
  );
}
