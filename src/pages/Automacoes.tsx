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
      <div className="animate-fade-in flex h-[calc(100vh-4rem)] bg-gradient-to-br from-[#0f172a] to-[#1e293b] rounded-xl overflow-hidden">
        {/* Sidebar */}
        <div className="w-60 bg-[#0f172a]/80 backdrop-blur-xl border-r border-white/10 flex-shrink-0 overflow-y-auto flex flex-col">
          <div className="p-4 pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#2563eb]/15 flex items-center justify-center">
                <Zap className="w-4 h-4 text-[#2563eb]" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-white">Automações</h1>
                <p className="text-[10px] text-slate-400">Centro de controle</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 px-2 py-3 space-y-4">
            {Object.entries(sections).map(([section, items]) => (
              <div key={section}>
                <p className="px-3 text-[9px] font-bold text-slate-500 uppercase tracking-[0.15em] mb-1.5">{section}</p>
                <div className="space-y-0.5">
                  {items.map(item => (
                    <button
                      key={item.id}
                      onClick={() => !item.soon && setActiveSidebar(item.id)}
                      className={cn(
                        "w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[13px] transition-all text-left group",
                        activeSidebar === item.id
                          ? "bg-[#2563eb]/15 text-[#2563eb] font-semibold"
                          : "text-slate-400 hover:text-white hover:bg-white/5",
                        item.soon && "opacity-40 cursor-not-allowed"
                      )}
                    >
                      <item.icon className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="flex-1 truncate">{item.label}</span>
                      {item.count && (
                        <span className={cn(
                          "text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full",
                          activeSidebar === item.id ? "bg-[#2563eb]/20 text-[#2563eb]" : "bg-white/10 text-slate-400"
                        )}>{item.count}</span>
                      )}
                      {item.pro && <ProBadge />}
                      {item.soon && <span className="text-[8px] font-medium text-slate-500 bg-white/5 px-1.5 py-0.5 rounded">SOON</span>}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          <div className="p-3 border-t border-white/10">
            <button className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[13px] text-slate-400 hover:text-white hover:bg-white/5 transition-all">
              <Settings2 className="w-3.5 h-3.5" />
              <span>Configurações</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top bar */}
          <div className="flex items-center justify-between border-b border-white/10 px-6 py-3 bg-white/[0.02] backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <h2 className="text-base font-bold text-white">Follow-up Automático</h2>
              <span className="inline-flex items-center gap-1.5 text-[10px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-lg">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                {activeFollowUpsCount} ativos
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                <input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Buscar..."
                  className="h-8 w-40 pl-8 pr-3 rounded-xl border-none bg-[#0f172a] text-white text-xs focus:outline-none focus:ring-1 focus:ring-[#2563eb]/40 placeholder:text-slate-500"
                />
              </div>
              <button className="h-8 px-3 rounded-xl border border-white/10 text-xs text-slate-400 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-1.5">
                <Filter className="w-3 h-3" />
                Filtros
              </button>
              <button className="h-8 px-4 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-lg shadow-[#2563eb]/20">
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
                  { label: "Total enviados", value: "660", icon: Send, change: "+12%", color: "text-[#2563eb]" },
                  { label: "Aberturas", value: "512", icon: Eye, change: "77.6%", color: "text-emerald-400" },
                  { label: "Respostas", value: "277", icon: MessageSquare, change: "42%", color: "text-blue-400" },
                  { label: "Conversões", value: "89", icon: TrendingUp, change: "13.5%", color: "text-amber-400" },
                ].map(stat => (
                  <div key={stat.label} className="rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 p-4 shadow-lg">
                    <div className="flex items-center justify-between mb-2">
                      <stat.icon className={cn("w-4 h-4", stat.color)} />
                      <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">{stat.change}</span>
                    </div>
                    <p className="text-xl font-bold text-white">{stat.value}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Funnel Stages */}
              <div className="rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg">
                <button
                  onClick={() => setShowStages(!showStages)}
                  className="w-full flex items-center justify-between p-4 hover:bg-white/[0.03] transition-colors rounded-xl"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#2563eb]/15 flex items-center justify-center">
                      <Zap className="w-3.5 h-3.5 text-[#2563eb]" />
                    </div>
                    <div className="text-left">
                      <span className="text-sm font-semibold text-white">Etapas do Funil</span>
                      <p className="text-[11px] text-slate-400">Selecione em quais etapas os follow-ups serão disparados</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-semibold text-slate-300 bg-white/10 px-2 py-0.5 rounded-lg">
                      {activeStagesCount}/{stages.length}
                    </span>
                    {showStages ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                </button>

                {showStages && (
                  <div className="px-4 pb-4 pt-0">
                    <div className="h-px bg-white/10 mb-3" />
                    <div className="flex flex-wrap gap-2">
                      {stages.map(stage => (
                        <button
                          key={stage.id}
                          onClick={() => toggleStage(stage.id)}
                          className={cn(
                            "inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border transition-all",
                            stage.active
                              ? "border-[#2563eb]/40 bg-[#2563eb]/10 text-[#2563eb] shadow-sm shadow-[#2563eb]/5"
                              : "border-white/10 bg-white/[0.02] text-slate-400 hover:border-white/20 hover:text-slate-300"
                          )}
                        >
                          <span className={cn("w-2 h-2 rounded-full flex-shrink-0", stage.color)} />
                          {stage.name}
                          {stage.active && <CheckCircle2 className="w-3 h-3 text-[#2563eb]" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* IA States */}
              <div className="rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 p-4 shadow-lg">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/15 flex items-center justify-center">
                    <Bot className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-white">Estado da IA</span>
                    <p className="text-[11px] text-slate-400">Defina quando os follow-ups devem ser enviados</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {([
                    { key: "ativa" as IAState, label: "IA Ativa", desc: "Enviar quando IA está respondendo", icon: Play, borderColor: "border-emerald-500/30", bgColor: "bg-emerald-500/5", iconColor: "text-emerald-400" },
                    { key: "pausada" as IAState, label: "IA Pausada", desc: "Enviar quando IA está em pausa", icon: Pause, borderColor: "border-amber-500/30", bgColor: "bg-amber-500/5", iconColor: "text-amber-400" },
                    { key: "desativada" as IAState, label: "IA Desativada", desc: "Enviar quando IA está desligada", icon: XCircle, borderColor: "border-red-500/30", bgColor: "bg-red-500/5", iconColor: "text-red-400" },
                  ]).map(state => (
                    <div
                      key={state.key}
                      className={cn(
                        "rounded-xl border p-3 transition-all cursor-pointer",
                        iaStates[state.key]
                          ? `${state.borderColor} ${state.bgColor}`
                          : "border-white/10 bg-white/[0.02] hover:bg-white/[0.04]"
                      )}
                      onClick={() => toggleIA(state.key)}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-1.5">
                          <state.icon className={cn("w-3.5 h-3.5", state.iconColor)} />
                          <span className="text-xs font-semibold text-white">{state.label}</span>
                        </div>
                        <Switch
                          checked={iaStates[state.key]}
                          onCheckedChange={() => toggleIA(state.key)}
                          className="scale-75"
                        />
                      </div>
                      <p className="text-[10px] text-slate-400 leading-relaxed">{state.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Follow-ups list */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-white">Sequência de Follow-ups</h3>
                  <span className="text-[11px] text-slate-400">{followUps.length} configurados</span>
                </div>

                <div className="space-y-2">
                  {followUps.map((fu, index) => (
                    <div key={fu.id} className="group">
                      {/* Connector line */}
                      {index > 0 && (
                        <div className="flex items-center gap-2 py-1 pl-5">
                          <div className="w-px h-4 bg-white/10" />
                          <div className="flex items-center gap-1 text-[10px] text-slate-500">
                            <Clock className="w-2.5 h-2.5" />
                            aguardar {fu.delay}
                          </div>
                          <ArrowRight className="w-2.5 h-2.5 text-slate-500" />
                        </div>
                      )}

                      <div className={cn(
                        "rounded-xl border bg-white/5 backdrop-blur-xl transition-all shadow-lg",
                        fu.active ? "border-emerald-500/20" : "border-white/10 opacity-60",
                        expandedFollowUp === fu.id && "shadow-xl shadow-black/20"
                      )}>
                        {/* Header row */}
                        <div
                          className="flex items-center gap-3 p-4 cursor-pointer"
                          onClick={() => setExpandedFollowUp(expandedFollowUp === fu.id ? null : fu.id)}
                        >
                          <button className="cursor-grab text-slate-600 hover:text-slate-400">
                            <GripVertical className="w-4 h-4" />
                          </button>

                          <div className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0",
                            fu.active ? "bg-emerald-500/15 text-emerald-400" : "bg-white/5 text-slate-500"
                          )}>
                            #{index + 1}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-white">{fu.name}</span>
                              <span className="text-[9px] px-1.5 py-0 h-4 inline-flex items-center rounded-md border border-white/10 text-slate-400 font-medium">
                                {fu.type}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 mt-0.5">
                              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {fu.delay}
                              </span>
                              <span className="text-[11px] text-slate-500">
                                {fu.stats.sent} enviados · {fu.stats.replied} respostas
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-1.5 rounded-md text-slate-500 hover:text-white hover:bg-white/10 transition-colors">
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button className="p-1.5 rounded-md text-slate-500 hover:text-white hover:bg-white/10 transition-colors">
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={e => { e.stopPropagation(); deleteFollowUp(fu.id); }}
                              className="p-1.5 rounded-md text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
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
                            "w-4 h-4 text-slate-500 transition-transform",
                            expandedFollowUp === fu.id && "rotate-180"
                          )} />
                        </div>

                        {/* Expanded content */}
                        {expandedFollowUp === fu.id && (
                          <div className="px-4 pb-4 pt-0">
                            <div className="h-px bg-white/10 mb-3" />

                            <div className="grid grid-cols-2 gap-4">
                              {/* Message preview */}
                              <div>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Mensagem</p>
                                <div className="rounded-xl bg-[#0f172a] p-3 text-xs text-slate-300 leading-relaxed border border-white/5">
                                  {fu.message}
                                </div>
                              </div>

                              {/* Mini stats */}
                              <div>
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Desempenho</p>
                                <div className="space-y-2">
                                  {[
                                    { label: "Enviados", value: fu.stats.sent, total: fu.stats.sent, color: "bg-[#2563eb]" },
                                    { label: "Aberturas", value: fu.stats.opened, total: fu.stats.sent, color: "bg-emerald-500" },
                                    { label: "Respostas", value: fu.stats.replied, total: fu.stats.sent, color: "bg-blue-400" },
                                  ].map(s => (
                                    <div key={s.label}>
                                      <div className="flex items-center justify-between mb-1">
                                        <span className="text-[11px] text-slate-400">{s.label}</span>
                                        <span className="text-[11px] font-semibold text-white">
                                          {s.value} <span className="text-slate-500 font-normal">({Math.round(s.value / s.total * 100)}%)</span>
                                        </span>
                                      </div>
                                      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
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
                <button className="w-full mt-3 py-3 rounded-xl border-2 border-dashed border-white/10 hover:border-[#2563eb]/30 text-slate-500 hover:text-[#2563eb] text-xs font-medium flex items-center justify-center gap-2 transition-all">
                  <Plus className="w-3.5 h-3.5" />
                  Adicionar follow-up à sequência
                </button>
              </div>

              {/* Pro Automations */}
              <ProGate title="Automações por Gatilho" description="Follow-ups automáticos, alertas de inatividade e integração com CRM. Disponível no Plano Pro.">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-bold text-white">Automações Avançadas</h3>
                    <ProBadge />
                  </div>
                  {[
                    { title: "Follow-up Automático", desc: "Lead sem interação por 48h → Enviar mensagem de acompanhamento", active: true },
                    { title: "Alerta de Inatividade", desc: "Sem resposta em 72h → Notificar responsável + escalar", active: true },
                    { title: "Mover Lead no CRM", desc: "Resposta positiva detectada → Mover para 'Em Negociação'", active: false },
                  ].map(item => (
                    <div key={item.title} className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl p-4 flex items-center gap-3 shadow-lg">
                      <span className={cn("w-2.5 h-2.5 rounded-full flex-shrink-0", item.active ? "bg-emerald-400" : "bg-slate-500")} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-white">{item.title}</span>
                          <ProBadge />
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
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
