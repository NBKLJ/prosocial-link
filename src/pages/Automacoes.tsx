import { AppLayout } from "@/components/AppLayout";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ProGate } from "@/components/ui/ProGate";
import { ProBadge } from "@/components/ui/ProBadge";
import {
  RefreshCw, History, BarChart3, Plus, ChevronDown, ChevronUp,
  Trash2, GripVertical, Clock, Eye, Pause, XCircle,
  CalendarDays, MessageSquare, Zap, Send, Bot
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
  type: string;
  active: boolean;
};

type IAState = "ativa" | "pausada" | "desativada";

const funnelStages: FunnelStage[] = [
  { id: "1", name: "Recepção", color: "bg-amber-400", active: false },
  { id: "2", name: "Análise de Viabilidade", color: "bg-gray-400", active: false },
  { id: "3", name: "Oferta do Contrato", color: "bg-blue-400", active: false },
  { id: "4", name: "Enviou Contrato", color: "bg-emerald-500", active: false },
  { id: "5", name: "Contrato Assinado", color: "bg-emerald-500", active: false },
  { id: "6", name: "Aguardando Agendamento", color: "bg-emerald-500", active: false },
  { id: "7", name: "Agendamento Feito", color: "bg-amber-500", active: false },
  { id: "8", name: "Desqualificado", color: "bg-red-500", active: false },
  { id: "9", name: "Não Tem Interesse", color: "bg-red-500", active: false },
  { id: "10", name: "Já é Cliente do Escritório", color: "bg-gray-400", active: false },
];

const initialFollowUps: FollowUp[] = [
  { id: "1", name: "Follow-up #1", delay: "30 minutos", type: "Texto padrão", active: true },
  { id: "2", name: "Follow-up #2", delay: "2 horas", type: "Texto padrão", active: true },
];

type SidebarItem = { id: string; label: string; icon: React.ElementType; section: string; pro?: boolean; soon?: boolean };

const sidebarItems: SidebarItem[] = [
  { id: "followup", label: "Follow-up", icon: RefreshCw, section: "ACOMPANHAMENTO" },
  { id: "followup-pro", label: "Follow-up PRO", icon: Clock, section: "ACOMPANHAMENTO", pro: true, soon: true },
  { id: "agendadas", label: "Mensagens Agendadas", icon: CalendarDays, section: "MENSAGENS" },
  { id: "rapidas", label: "Mensagens Rápidas", icon: MessageSquare, section: "MENSAGENS" },
  { id: "sequencias", label: "Sequências", icon: Zap, section: "MENSAGENS" },
  { id: "palavras", label: "Automação por Palavras", icon: Bot, section: "GATILHOS" },
  { id: "massa", label: "Envios em Massa", icon: Send, section: "ENVIOS" },
  { id: "relatorios", label: "Relatórios", icon: BarChart3, section: "RELATÓRIOS" },
];

type TabKey = "followups" | "historico" | "dashboard";

const Automacoes = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("followups");
  const [activeSidebar, setActiveSidebar] = useState("followup");
  const [stages, setStages] = useState(funnelStages);
  const [followUps, setFollowUps] = useState(initialFollowUps);
  const [showStages, setShowStages] = useState(true);
  const [iaStates, setIaStates] = useState<Record<IAState, boolean>>({
    ativa: true,
    pausada: false,
    desativada: false,
  });
  const [expandedFollowUp, setExpandedFollowUp] = useState<string | null>(null);

  const toggleStage = (id: string) => {
    setStages(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s));
  };

  const toggleIA = (state: IAState) => {
    setIaStates(prev => ({ ...prev, [state]: !prev[state] }));
  };

  const deleteFollowUp = (id: string) => {
    setFollowUps(prev => prev.filter(f => f.id !== id));
  };

  const activeStagesCount = stages.filter(s => s.active).length;

  // Group sidebar items by section
  const sections = sidebarItems.reduce<Record<string, SidebarItem[]>>((acc, item) => {
    if (!acc[item.section]) acc[item.section] = [];
    acc[item.section].push(item);
    return acc;
  }, {});

  const tabs: { key: TabKey; label: string; icon: React.ElementType }[] = [
    { key: "followups", label: "Follow-ups", icon: RefreshCw },
    { key: "historico", label: "Histórico", icon: History },
    { key: "dashboard", label: "Dashboard", icon: BarChart3 },
  ];

  return (
    <AppLayout>
      <div className="animate-fade-in flex h-[calc(100vh-4rem)]">
        {/* Left Sidebar */}
        <div className="w-56 border-r border-border bg-background flex-shrink-0 overflow-y-auto">
          <div className="p-4 pb-2">
            <h1 className="text-lg font-bold text-foreground">Automações</h1>
            <p className="text-xs text-muted-foreground">Gerencie suas automações</p>
          </div>

          <nav className="px-2 pb-4 space-y-4">
            {Object.entries(sections).map(([section, items]) => (
              <div key={section}>
                <p className="px-3 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">{section}</p>
                <div className="space-y-0.5">
                  {items.map(item => (
                    <button
                      key={item.id}
                      onClick={() => !item.soon && setActiveSidebar(item.id)}
                      className={cn(
                        "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors text-left",
                        activeSidebar === item.id
                          ? "bg-primary text-primary-foreground font-medium"
                          : "text-foreground hover:bg-muted",
                        item.soon && "opacity-60 cursor-default"
                      )}
                    >
                      <item.icon className="w-4 h-4 flex-shrink-0" />
                      <span className="flex-1">{item.label}</span>
                      {item.pro && <ProBadge />}
                      {item.soon && <span className="text-[9px] text-muted-foreground">em breve</span>}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Tabs + Actions */}
          <div className="flex items-center justify-between border-b border-border px-6 py-3">
            <div className="flex items-center gap-1">
              {tabs.map(t => (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                    activeTab === t.key
                      ? "text-primary border-b-2 border-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <t.icon className="w-4 h-4" />
                  {t.label}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                <RefreshCw className="w-4 h-4" />
              </button>
              <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors">
                <Plus className="w-4 h-4" />
                Novo Follow-up
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6 space-y-4">
            {activeTab === "followups" && (
              <>
                {/* Funnel Stages Card */}
                <div className="rounded-xl border border-border bg-card p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-primary" />
                      <span className="text-sm font-semibold text-foreground">Etapas com follow-up</span>
                      <span className={cn(
                        "text-xs font-medium px-2 py-0.5 rounded-full",
                        activeStagesCount > 0 ? "bg-primary/10 text-primary" : "bg-amber-500/10 text-amber-600"
                      )}>
                        {activeStagesCount > 0 ? `${activeStagesCount} ativas` : "Nenhuma"}
                      </span>
                    </div>
                    <button
                      onClick={() => setShowStages(!showStages)}
                      className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                    >
                      {showStages ? "Ocultar" : "Mostrar"}
                      {showStages ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                  </div>

                  {showStages && (
                    <>
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">FUNIL PREVIDENCIÁRIO</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {stages.map(stage => (
                          <button
                            key={stage.id}
                            onClick={() => toggleStage(stage.id)}
                            className={cn(
                              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                              stage.active
                                ? "border-primary/30 bg-primary/5 text-primary"
                                : "border-border bg-background text-foreground hover:border-primary/20"
                            )}
                          >
                            <span className={cn("w-2 h-2 rounded-full", stage.color)} />
                            {stage.name}
                          </button>
                        ))}
                      </div>
                      <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <Eye className="w-3 h-3" /> Clique para ativar/desativar
                      </p>
                    </>
                  )}
                </div>

                {/* IA State Selection */}
                <div className="rounded-xl border border-border bg-card p-5">
                  <p className="text-sm text-foreground mb-3">Selecione os estados de IA que receberão follow-up automático</p>
                  <div className="flex flex-wrap gap-4">
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                      <span className="flex items-center gap-1.5 text-sm">
                        <Eye className="w-4 h-4 text-emerald-500" />
                        IA Ativa
                      </span>
                      <Switch checked={iaStates.ativa} onCheckedChange={() => toggleIA("ativa")} />
                    </label>
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                      <span className="flex items-center gap-1.5 text-sm">
                        <Pause className="w-4 h-4 text-amber-500" />
                        IA Pausada
                      </span>
                      <Switch checked={iaStates.pausada} onCheckedChange={() => toggleIA("pausada")} />
                    </label>
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                      <span className="flex items-center gap-1.5 text-sm">
                        <XCircle className="w-4 h-4 text-red-500" />
                        IA Desativada
                      </span>
                      <Switch checked={iaStates.desativada} onCheckedChange={() => toggleIA("desativada")} />
                    </label>
                  </div>
                </div>

                {/* Follow-up Items */}
                <div className="space-y-3">
                  {followUps.map(fu => (
                    <div
                      key={fu.id}
                      className={cn(
                        "rounded-xl border bg-card p-4 flex items-center gap-3 transition-all",
                        fu.active ? "border-emerald-500/30" : "border-border"
                      )}
                    >
                      <span className={cn("w-2.5 h-2.5 rounded-full flex-shrink-0", fu.active ? "bg-emerald-500" : "bg-muted-foreground")} />
                      <div className="flex-1">
                        <span className="text-sm font-semibold text-foreground">{fu.name}</span>
                        <span className="ml-2 inline-flex items-center gap-1 text-xs text-primary">
                          <Clock className="w-3 h-3" />
                          {fu.delay}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">{fu.type}</span>
                      <div className="flex items-center gap-1">
                        <button className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                          <GripVertical className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteFollowUp(fu.id)}
                          className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setExpandedFollowUp(expandedFollowUp === fu.id ? null : fu.id)}
                          className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                        >
                          <ChevronDown className={cn("w-4 h-4 transition-transform", expandedFollowUp === fu.id && "rotate-180")} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pro Automations */}
                <ProGate title="Automações por Gatilho" description="Follow-ups automáticos, alertas de inatividade e integração com CRM. Disponível no Plano Pro.">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-foreground">Automações Avançadas</h3>
                      <ProBadge />
                    </div>
                    <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-foreground">Follow-up Automático</span>
                          <ProBadge />
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">Lead sem interação por 48h → Enviar mensagem de acompanhamento</p>
                      </div>
                    </div>
                    <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-foreground">Alerta de Inatividade</span>
                          <ProBadge />
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">Sem resposta em 72h → Notificar responsável + escalar</p>
                      </div>
                    </div>
                    <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
                      <span className="w-2.5 h-2.5 rounded-full bg-muted-foreground" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-foreground">Mover Lead no CRM</span>
                          <ProBadge />
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">Resposta positiva detectada → Mover para 'Em Negociação'</p>
                      </div>
                    </div>
                  </div>
                </ProGate>
              </>
            )}

            {activeTab === "historico" && (
              <div className="rounded-xl border border-border bg-card p-8 text-center">
                <History className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <h3 className="text-sm font-semibold text-foreground mb-1">Histórico de Follow-ups</h3>
                <p className="text-xs text-muted-foreground">Registro de todas as automações executadas aparecerá aqui.</p>
              </div>
            )}

            {activeTab === "dashboard" && (
              <div className="rounded-xl border border-border bg-card p-8 text-center">
                <BarChart3 className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                <h3 className="text-sm font-semibold text-foreground mb-1">Dashboard de Automações</h3>
                <p className="text-xs text-muted-foreground">Métricas e gráficos de desempenho das automações.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Automacoes;
