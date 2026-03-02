import {
  Zap, Eye, Clock, MessageCircle, Brain, TrendingUp,
  Send, RefreshCw, AlertTriangle, CheckCircle2, Pause, Play,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useState } from "react";

const automationFlows = [
  {
    id: "1", name: "Follow-up Proposta Não Respondida",
    trigger: "Visualizou proposta mas não respondeu", delay: "24h",
    action: "Enviar mensagem de follow-up personalizada",
    status: "active" as const, executions: 142, conversions: 38, rate: 26.8,
  },
  {
    id: "2", name: "Reengajamento 7 Dias",
    trigger: "Sem resposta há 7 dias", delay: "7 dias",
    action: "Entrar em fluxo de reengajamento com oferta",
    status: "active" as const, executions: 89, conversions: 15, rate: 16.9,
  },
  {
    id: "3", name: "Alerta Proposta Visualizada 3x",
    trigger: "Cliente abriu proposta 3 vezes", delay: "Imediato",
    action: "Notificar vendedor com prioridade alta",
    status: "active" as const, executions: 34, conversions: 22, rate: 64.7,
  },
  {
    id: "4", name: "Qualificação Automática",
    trigger: "Novo lead via WhatsApp", delay: "Imediato",
    action: "IA classifica por intenção e direciona",
    status: "active" as const, executions: 256, conversions: 89, rate: 34.8,
  },
  {
    id: "5", name: "Pós-Venda Automático",
    trigger: "Lead marcado como fechado", delay: "48h",
    action: "Enviar pesquisa de satisfação + onboarding",
    status: "paused" as const, executions: 67, conversions: 52, rate: 77.6,
  },
  {
    id: "6", name: "Recuperação de Perdidos",
    trigger: "Lead marcado como perdido há 30 dias", delay: "30 dias",
    action: "Enviar oferta especial de reativação",
    status: "paused" as const, executions: 23, conversions: 4, rate: 17.4,
  },
];

const aiInsights = [
  { icon: Brain, label: "Resumo de Conversas", desc: "IA resume conversas longas automaticamente para atendentes", status: "active" as const },
  { icon: MessageCircle, label: "Sugestão de Respostas", desc: "Sugere respostas baseadas no contexto e histórico do lead", status: "active" as const },
  { icon: TrendingUp, label: "Detecção de Intenção", desc: "Identifica intenção de compra, dúvida ou reclamação", status: "active" as const },
  { icon: Zap, label: "Classificação Automática", desc: "Classifica leads por temperatura (frio, morno, quente)", status: "active" as const },
  { icon: Eye, label: "Probabilidade de Fechamento", desc: "Calcula score de probabilidade baseado em comportamento", status: "beta" as const },
  { icon: AlertTriangle, label: "Detecção de Churn", desc: "Identifica sinais de perda antes que aconteça", status: "beta" as const },
];

const recentExecutions = [
  { flow: "Follow-up Proposta", lead: "João Silva", time: "2 min atrás", result: "Mensagem enviada" },
  { flow: "Qualificação IA", lead: "Maria Costa", time: "5 min atrás", result: "Classificado: Quente 🔥" },
  { flow: "Alerta Proposta 3x", lead: "Pedro Lima", time: "12 min atrás", result: "Vendedor notificado" },
  { flow: "Reengajamento", lead: "Ana Ferreira", time: "1h atrás", result: "Cliente respondeu ✅" },
  { flow: "Qualificação IA", lead: "Carlos Dias", time: "2h atrás", result: "Classificado: Morno" },
];

export function BehavioralAutomation() {
  const [flows, setFlows] = useState(automationFlows);

  const toggleFlow = (id: string) => {
    setFlows(prev => prev.map(f => f.id === id ? { ...f, status: f.status === "active" ? "paused" as const : "active" as const } : f));
    const flow = flows.find(f => f.id === id);
    toast.success(`${flow?.name} ${flow?.status === "active" ? "pausada" : "ativada"}`);
  };

  const totalExecutions = flows.reduce((s, f) => s + f.executions, 0);
  const totalConversions = flows.reduce((s, f) => s + f.conversions, 0);
  const avgRate = totalExecutions > 0 ? (totalConversions / totalExecutions) * 100 : 0;

  return (
    <div className="space-y-6 overflow-y-auto pb-6">
      {/* Metrics */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Automações Ativas", value: flows.filter(f => f.status === "active").length.toString(), icon: Zap, color: "text-primary", bg: "bg-primary/10" },
          { label: "Execuções Totais", value: totalExecutions.toString(), icon: RefreshCw, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Conversões", value: totalConversions.toString(), icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "Taxa Média", value: `${avgRate.toFixed(1)}%`, icon: TrendingUp, color: "text-purple-500", bg: "bg-purple-500/10" },
        ].map((m) => (
          <div key={m.label} className="bg-card border border-border/50 rounded-xl p-4 flex items-center gap-3">
            <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", m.bg)}>
              <m.icon className={cn("w-5 h-5", m.color)} />
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">{m.value}</p>
              <p className="text-[11px] text-muted-foreground">{m.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Automation Flows */}
      <div className="bg-card border border-border/50 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-foreground">Fluxos de Automação Comportamental</h3>
          <Zap className="w-4 h-4 text-primary" />
        </div>
        <div className="space-y-3">
          {flows.map((flow) => (
            <div key={flow.id} className={cn("border rounded-xl p-4 transition-all", flow.status === "active" ? "border-primary/20 bg-primary/5" : "border-border/50")}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-foreground">{flow.name}</span>
                    <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-semibold", flow.status === "active" ? "bg-emerald-500/10 text-emerald-500" : "bg-muted text-muted-foreground")}>
                      {flow.status === "active" ? "Ativa" : "Pausada"}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1.5">
                      <Eye className="w-3 h-3 text-muted-foreground" />
                      <span className="text-[11px] text-muted-foreground">Gatilho: {flow.trigger}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      <span className="text-[11px] text-muted-foreground">Delay: {flow.delay}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Send className="w-3 h-3 text-muted-foreground" />
                    <span className="text-[11px] text-muted-foreground">Ação: {flow.action}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right space-y-0.5">
                    <div className="flex items-center gap-3 text-[11px]">
                      <span className="text-muted-foreground">{flow.executions} exec.</span>
                      <span className="text-muted-foreground">{flow.conversions} conv.</span>
                      <span className={cn("font-bold", flow.rate >= 30 ? "text-emerald-500" : flow.rate >= 15 ? "text-amber-500" : "text-muted-foreground")}>{flow.rate}%</span>
                    </div>
                  </div>
                  <button onClick={() => toggleFlow(flow.id)} className={cn("p-2 rounded-lg transition-colors", flow.status === "active" ? "hover:bg-destructive/10 text-muted-foreground hover:text-destructive" : "hover:bg-emerald-500/10 text-muted-foreground hover:text-emerald-500")}>
                    {flow.status === "active" ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* AI Capabilities */}
        <div className="bg-card border border-border/50 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground">IA Integrada</h3>
            <Brain className="w-4 h-4 text-primary" />
          </div>
          <div className="space-y-3">
            {aiInsights.map((ai, i) => (
              <div key={i} className="flex items-start gap-3 py-2 border-b border-border/20 last:border-0">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <ai.icon className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">{ai.label}</span>
                    <span className={cn("text-[9px] px-1.5 py-0.5 rounded font-semibold", ai.status === "active" ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500")}>
                      {ai.status === "active" ? "Ativo" : "Beta"}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{ai.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Executions */}
        <div className="bg-card border border-border/50 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground">Execuções Recentes</h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-semibold animate-pulse">● Tempo real</span>
          </div>
          <div className="space-y-3">
            {recentExecutions.map((exec, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-border/20 last:border-0">
                <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-foreground">{exec.flow}</span>
                    <span className="text-[10px] text-muted-foreground">→ {exec.lead}</span>
                  </div>
                  <span className="text-[11px] text-muted-foreground">{exec.result}</span>
                </div>
                <span className="text-[10px] text-muted-foreground flex-shrink-0">{exec.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
