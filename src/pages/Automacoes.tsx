import { AppLayout } from "@/components/AppLayout";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ProGate } from "@/components/ui/ProGate";
import { ProBadge } from "@/components/ui/ProBadge";
import {
  RefreshCw, BarChart3, Plus, ChevronDown, ChevronUp,
  Trash2, GripVertical, Clock, Eye, Pause, XCircle,
  CalendarDays, MessageSquare, Zap, Send, Bot, Settings2,
  Play, Edit3, Copy, Filter, Search,
  ArrowRight, CheckCircle2, TrendingUp
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

type FunnelStage = {
  id: string;
  name: string;
  color: string;
  active: boolean;
};

type FollowUp = {
  id: string;
  name: string;
  delay: string;
  type: "texto" | "audio" | "imagem";
  message: string;
  active: boolean;
  stats: { sent: number; opened: number; replied: number };
};

type IAState = "ativa" | "pausada" | "desativada";

const funnelStages: FunnelStage[] = [
  { id: "1", name: "Recepção", color: "bg-amber-400", active: true },
  { id: "2", name: "Análise de Viabilidade", color: "bg-slate-400", active: false },
  { id: "3", name: "Oferta do Contrato", color: "bg-blue-400", active: true },
  { id: "4", name: "Enviou Contrato", color: "bg-emerald-500", active: false },
  { id: "5", name: "Contrato Assinado", color: "bg-emerald-500", active: false },
  { id: "6", name: "Aguardando Agendamento", color: "bg-emerald-500", active: true },
  { id: "7", name: "Agendamento Feito", color: "bg-amber-500", active: false },
  { id: "8", name: "Desqualificado", color: "bg-red-500", active: false },
  { id: "9", name: "Não Tem Interesse", color: "bg-red-500", active: false },
  { id: "10", name: "Já é Cliente do Escritório", color: "bg-slate-400", active: false },
];

const initialFollowUps: FollowUp[] = [
  {
    id: "1", name: "Primeiro contato", delay: "30 min", type: "texto",
    message: "Olá! Vi que você demonstrou interesse em nossos serviços. Posso te ajudar?",
    active: true, stats: { sent: 342, opened: 289, replied: 156 }
  },
  {
    id: "2", name: "Lembrete de proposta", delay: "2 horas", type: "texto",
    message: "Oi! Enviei uma proposta para você. Conseguiu dar uma olhada?",
    active: true, stats: { sent: 198, opened: 145, replied: 87 }
  },
  {
    id: "3", name: "Reengajamento", delay: "24 horas", type: "texto",
    message: "Olá novamente! Quero garantir que não ficou nenhuma dúvida. Posso ajudar?",
    active: false, stats: { sent: 120, opened: 78, replied: 34 }
  },
];

type SidebarItem = { id: string; label: string; icon: React.ElementType; section: string; pro?: boolean; soon?: boolean; count?: number };

const sidebarItems: SidebarItem[] = [
  { id: "followup", label: "Follow-up", icon: RefreshCw, section: "ACOMPANHAMENTO", count: 3 },
  { id: "followup-pro", label: "Follow-up PRO", icon: Clock, section: "ACOMPANHAMENTO", pro: true, soon: true },
  { id: "agendadas", label: "Msg. Agendadas", icon: CalendarDays, section: "MENSAGENS" },
  { id: "rapidas", label: "Msg. Rápidas", icon: MessageSquare, section: "MENSAGENS" },
  { id: "sequencias", label: "Sequências", icon: Zap, section: "MENSAGENS", soon: true },
  { id: "palavras", label: "Automação por Palavras", icon: Bot, section: "GATILHOS" },
  { id: "massa", label: "Envios em Massa", icon: Send, section: "ENVIOS" },
  { id: "relatorios", label: "Relatórios", icon: BarChart3, section: "RELATÓRIOS" },
];

const Automacoes = () => {
  const [activeSidebar, setActiveSidebar] = useState("followup");
  const [stages, setStages] = useState(funnelStages);
  const [followUps, setFollowUps] = useState(initialFollowUps);
  const [showStages, setShowStages] = useState(true);
  const [iaStates, setIaStates] = useState<Record<IAState, boolean>>({
    ativa: true, pausada: false, desativada: false,
  });
  const [expandedFollowUp, setExpandedFollowUp] = useState<string | null>("1");
  const [searchQuery, setSearchQuery] = useState("");

  const toggleStage = (id: string) => {
    setStages(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s));
  };

  const toggleIA = (state: IAState) => {
    setIaStates(prev => ({ ...prev, [state]: !prev[state] }));
  };

  const toggleFollowUp = (id: string) => {
    setFollowUps(prev => prev.map(f => f.id === id ? { ...f, active: !f.active } : f));
  };

  const deleteFollowUp = (id: string) => {
    setFollowUps(prev => prev.filter(f => f.id !== id));
  };

  const activeStagesCount = stages.filter(s => s.active).length;
  const activeFollowUpsCount = followUps.filter(f => f.active).length;

  const sections = sidebarItems.reduce<Record<string, SidebarItem[]>>((acc, item) => {
    if (!acc[item.section]) acc[item.section] = [];
    acc[item.section].push(item);
    return acc;
  }, {});

  return (
    <AppLayout>
      <div className="animate-fade-in flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <div className="w-60 border-r border-border bg-card/50 flex-shrink-0 overflow-y-auto flex flex-col">
          <div className="p-4 pb-3 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Zap className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-foreground">Automações</h1>
                <p className="text-[10px] text-muted-foreground">Centro de controle</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 px-2 py-3 space-y-4">
            {Object.entries(sections).map(([section, items]) => (
              <div key={section}>
                <p className="px-3 text-[9px] font-bold text-muted-foreground/70 uppercase tracking-[0.15em] mb-1.5">{section}</p>
                <div className="space-y-0.5">
                  {items.map(item => (
                    <button
                      key={item.id}
                      onClick={() => !item.soon && setActiveSidebar(item.id)}
                      className={cn(
                        "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] transition-all text-left group",
                        activeSidebar === item.id
                          ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
                        item.soon && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      <item.icon className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="flex-1 truncate">{item.label}</span>
                      {item.count && (
                        <span className={cn(
                          "text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full",
                          activeSidebar === item.id ? "bg-primary-foreground/20 text-primary-foreground" : "bg-primary/10 text-primary"
                        )}>{item.count}</span>
                      )}
                      {item.pro && <ProBadge />}
                      {item.soon && <span className="text-[8px] font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded">SOON</span>}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          <div className="p-3 border-t border-border">
            <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all">
              <Settings2 className="w-3.5 h-3.5" />
              <span>Configurações</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top bar */}
          <div className="flex items-center justify-between border-b border-border px-6 py-3 bg-background">
            <div className="flex items-center gap-3">
              <h2 className="text-base font-bold text-foreground">Follow-up Automático</h2>
              <Badge variant="outline" className="text-[10px] gap-1 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {activeFollowUpsCount} ativos
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Buscar..."
                  className="h-8 w-40 pl-8 pr-3 rounded-lg border border-border bg-background text-xs focus:outline-none focus:ring-1 focus:ring-primary/30 placeholder:text-muted-foreground/60"
                />
              </div>
              <button className="h-8 px-3 rounded-lg border border-border text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex items-center gap-1.5">
                <Filter className="w-3 h-3" />
                Filtros
              </button>
              <button className="h-8 px-4 rounded-lg bg-primary text-primary-foreground font-semibold text-xs hover:bg-primary/90 transition-colors flex items-center gap-1.5 shadow-sm">
                <Plus className="w-3.5 h-3.5" />
                Novo Follow-up
              </button>
            </div>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-5 max-w-4xl">

              {/* Stats row */}
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: "Total enviados", value: "660", icon: Send, change: "+12%", color: "text-primary" },
                  { label: "Aberturas", value: "512", icon: Eye, change: "77.6%", color: "text-emerald-500" },
                  { label: "Respostas", value: "277", icon: MessageSquare, change: "42%", color: "text-blue-500" },
                  { label: "Conversões", value: "89", icon: TrendingUp, change: "13.5%", color: "text-amber-500" },
                ].map(stat => (
                  <div key={stat.label} className="rounded-xl border border-border bg-card p-4">
                    <div className="flex items-center justify-between mb-2">
                      <stat.icon className={cn("w-4 h-4", stat.color)} />
                      <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded">{stat.change}</span>
                    </div>
                    <p className="text-xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Funnel Stages */}
              <div className="rounded-xl border border-border bg-card">
                <button
                  onClick={() => setShowStages(!showStages)}
                  className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors rounded-xl"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Zap className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <div className="text-left">
                      <span className="text-sm font-semibold text-foreground">Etapas do Funil</span>
                      <p className="text-[11px] text-muted-foreground">Selecione em quais etapas os follow-ups serão disparados</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-[10px] font-semibold">
                      {activeStagesCount}/{stages.length}
                    </Badge>
                    {showStages ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                  </div>
                </button>

                {showStages && (
                  <div className="px-4 pb-4 pt-0">
                    <div className="h-px bg-border mb-3" />
                    <div className="flex flex-wrap gap-2">
                      {stages.map(stage => (
                        <button
                          key={stage.id}
                          onClick={() => toggleStage(stage.id)}
                          className={cn(
                            "inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border transition-all",
                            stage.active
                              ? "border-primary/40 bg-primary/5 text-primary shadow-sm shadow-primary/5"
                              : "border-border bg-background text-muted-foreground hover:border-primary/20 hover:text-foreground"
                          )}
                        >
                          <span className={cn("w-2 h-2 rounded-full flex-shrink-0", stage.color)} />
                          {stage.name}
                          {stage.active && <CheckCircle2 className="w-3 h-3 text-primary" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* IA States */}
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                    <Bot className="w-3.5 h-3.5 text-emerald-500" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-foreground">Estado da IA</span>
                    <p className="text-[11px] text-muted-foreground">Defina quando os follow-ups devem ser enviados</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {([
                    { key: "ativa" as IAState, label: "IA Ativa", desc: "Enviar quando IA está respondendo", icon: Play, color: "emerald" },
                    { key: "pausada" as IAState, label: "IA Pausada", desc: "Enviar quando IA está em pausa", icon: Pause, color: "amber" },
                    { key: "desativada" as IAState, label: "IA Desativada", desc: "Enviar quando IA está desligada", icon: XCircle, color: "red" },
                  ]).map(state => (
                    <div
                      key={state.key}
                      className={cn(
                        "rounded-lg border p-3 transition-all cursor-pointer",
                        iaStates[state.key]
                          ? `border-${state.color}-500/30 bg-${state.color}-500/5`
                          : "border-border bg-background hover:border-border/80"
                      )}
                      onClick={() => toggleIA(state.key)}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-1.5">
                          <state.icon className={cn("w-3.5 h-3.5", `text-${state.color}-500`)} />
                          <span className="text-xs font-semibold text-foreground">{state.label}</span>
                        </div>
                        <Switch
                          checked={iaStates[state.key]}
                          onCheckedChange={() => toggleIA(state.key)}
                          className="scale-75"
                        />
                      </div>
                      <p className="text-[10px] text-muted-foreground leading-relaxed">{state.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Follow-ups list */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-foreground">Sequência de Follow-ups</h3>
                  <span className="text-[11px] text-muted-foreground">{followUps.length} configurados</span>
                </div>

                <div className="space-y-2">
                  {followUps.map((fu, index) => (
                    <div key={fu.id} className="group">
                      {/* Connector line */}
                      {index > 0 && (
                        <div className="flex items-center gap-2 py-1 pl-5">
                          <div className="w-px h-4 bg-border" />
                          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                            <Clock className="w-2.5 h-2.5" />
                            aguardar {fu.delay}
                          </div>
                          <ArrowRight className="w-2.5 h-2.5 text-muted-foreground" />
                        </div>
                      )}

                      <div className={cn(
                        "rounded-xl border bg-card transition-all",
                        fu.active ? "border-emerald-500/20" : "border-border opacity-60",
                        expandedFollowUp === fu.id && "shadow-sm"
                      )}>
                        {/* Header row */}
                        <div
                          className="flex items-center gap-3 p-4 cursor-pointer"
                          onClick={() => setExpandedFollowUp(expandedFollowUp === fu.id ? null : fu.id)}
                        >
                          <button className="cursor-grab text-muted-foreground/40 hover:text-muted-foreground">
                            <GripVertical className="w-4 h-4" />
                          </button>

                          <div className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0",
                            fu.active ? "bg-emerald-500/10 text-emerald-600" : "bg-muted text-muted-foreground"
                          )}>
                            #{index + 1}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-foreground">{fu.name}</span>
                              <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4 font-medium">
                                {fu.type}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-3 mt-0.5">
                              <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {fu.delay}
                              </span>
                              <span className="text-[11px] text-muted-foreground">
                                {fu.stats.sent} enviados · {fu.stats.replied} respostas
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={e => { e.stopPropagation(); deleteFollowUp(fu.id); }}
                              className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <Switch
                            checked={fu.active}
                            onCheckedChange={() => toggleFollowUp(fu.id)}
                            onClick={e => e.stopPropagation()}
                          />

                          <ChevronDown className={cn(
                            "w-4 h-4 text-muted-foreground transition-transform",
                            expandedFollowUp === fu.id && "rotate-180"
                          )} />
                        </div>

                        {/* Expanded content */}
                        {expandedFollowUp === fu.id && (
                          <div className="px-4 pb-4 pt-0">
                            <div className="h-px bg-border mb-3" />

                            <div className="grid grid-cols-2 gap-4">
                              {/* Message preview */}
                              <div>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Mensagem</p>
                                <div className="rounded-lg bg-muted/50 p-3 text-xs text-foreground leading-relaxed border border-border">
                                  {fu.message}
                                </div>
                              </div>

                              {/* Mini stats */}
                              <div>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Desempenho</p>
                                <div className="space-y-2">
                                  {[
                                    { label: "Enviados", value: fu.stats.sent, total: fu.stats.sent, color: "bg-primary" },
                                    { label: "Aberturas", value: fu.stats.opened, total: fu.stats.sent, color: "bg-emerald-500" },
                                    { label: "Respostas", value: fu.stats.replied, total: fu.stats.sent, color: "bg-blue-500" },
                                  ].map(s => (
                                    <div key={s.label}>
                                      <div className="flex items-center justify-between mb-1">
                                        <span className="text-[11px] text-muted-foreground">{s.label}</span>
                                        <span className="text-[11px] font-semibold text-foreground">
                                          {s.value} <span className="text-muted-foreground font-normal">({Math.round(s.value / s.total * 100)}%)</span>
                                        </span>
                                      </div>
                                      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                                        <div
                                          className={cn("h-full rounded-full transition-all", s.color)}
                                          style={{ width: `${Math.round(s.value / s.total * 100)}%` }}
                                        />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add button */}
                <button className="w-full mt-3 py-3 rounded-xl border-2 border-dashed border-border hover:border-primary/30 text-muted-foreground hover:text-primary text-xs font-medium flex items-center justify-center gap-2 transition-all">
                  <Plus className="w-3.5 h-3.5" />
                  Adicionar follow-up à sequência
                </button>
              </div>

              {/* Pro Automations */}
              <ProGate title="Automações por Gatilho" description="Follow-ups automáticos, alertas de inatividade e integração com CRM. Disponível no Plano Pro.">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-bold text-foreground">Automações Avançadas</h3>
                    <ProBadge />
                  </div>
                  {[
                    { title: "Follow-up Automático", desc: "Lead sem interação por 48h → Enviar mensagem de acompanhamento", active: true },
                    { title: "Alerta de Inatividade", desc: "Sem resposta em 72h → Notificar responsável + escalar", active: true },
                    { title: "Mover Lead no CRM", desc: "Resposta positiva detectada → Mover para 'Em Negociação'", active: false },
                  ].map(item => (
                    <div key={item.title} className="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
                      <span className={cn("w-2.5 h-2.5 rounded-full flex-shrink-0", item.active ? "bg-emerald-500" : "bg-muted-foreground")} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-foreground">{item.title}</span>
                          <ProBadge />
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ProGate>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Automacoes;
