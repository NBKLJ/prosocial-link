import { useState, useMemo } from "react";
import { AppLayout } from "@/components/AppLayout";
import {
  Brain, Search, Power, ChevronDown, ChevronRight,
  Wand2, Settings2, LayoutGrid, AlertTriangle, Link2,
  DollarSign, Headphones, ShieldCheck, ArrowRightLeft
} from "lucide-react";
import CreationWizard from "@/components/ias/CreationWizard";
import AdvancedCreator from "@/components/ias/AdvancedCreator";
import ModelosPage from "@/components/ias/ModelosPage";
import IADetailPanel from "@/components/ias/IADetailPanel";
import { cn } from "@/lib/utils";

import { ProGate } from "@/components/ui/ProGate";
import { ProBadge } from "@/components/ui/ProBadge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

interface SectorIA {
  id: string;
  name: string;
  icon: typeof DollarSign;
  description: string;
  prompt: string;
  tone: "formal" | "amigavel" | "tecnico";
  active: boolean;
  triggers: boolean;
  rules: boolean;
  steps: boolean;
  faq: boolean;
  connectionId: string | null;
  isReception?: boolean;
}

const CONNECTIONS = [
  { id: "conn-1", name: "Comercial — +55 11 91234-5678" },
  { id: "conn-2", name: "Suporte — +55 11 98765-4321" },
  { id: "conn-3", name: "Financeiro — +55 11 95555-1234" },
];

const StatusIndicator = ({ label, configured }: { label: string; configured: boolean }) => (
  <div className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-muted/40">
    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</span>
    <span
      className={cn(
        "text-[10px] font-bold uppercase tracking-wider",
        configured ? "text-emerald-500" : "text-red-400"
      )}
    >
      {configured ? "CONFIGURADO" : "NÃO CONFIG."}
    </span>
  </div>
);

const IACard = ({
  sector,
  onToggle,
  onConnectionChange,
  onClick,
}: {
  sector: SectorIA;
  onToggle: () => void;
  onConnectionChange: (value: string) => void;
  onClick: () => void;
}) => (
  <div className={cn(
    "rounded-xl border p-5 space-y-4 transition-shadow hover:shadow-md cursor-pointer",
    sector.isReception
      ? "border-primary/30 bg-gradient-to-br from-primary/5 to-card"
      : "border-border bg-card"
  )} onClick={onClick}>
    {/* Header */}
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center",
          sector.isReception
            ? "bg-primary/15"
            : sector.active ? "bg-primary/10" : "bg-muted"
        )}>
          <sector.icon className={cn("w-5 h-5", sector.active ? "text-primary" : "text-muted-foreground")} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-foreground">{sector.name}</h3>
            {sector.isReception && (
              <Badge className="bg-primary/10 text-primary border-primary/20 text-[9px] px-1.5 py-0 font-bold hover:bg-primary/10">
                Obrigatória
              </Badge>
            )}
          </div>
          <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">{sector.description}</p>
        </div>
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); onToggle(); }}
        className={cn(
          "w-9 h-9 rounded-lg flex items-center justify-center border transition-all",
          sector.active
            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20"
            : "border-border bg-muted text-muted-foreground hover:bg-muted/80"
        )}
        title={sector.active ? "Desativar" : "Ativar"}
      >
        <Power className="w-4 h-4" />
      </button>
    </div>

    {/* Reception-specific info */}
    {sector.isReception && (
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/5 border border-primary/10">
        <ArrowRightLeft className="w-3.5 h-3.5 text-primary flex-shrink-0" />
        <span className="text-[11px] text-muted-foreground">
          Direciona o cliente para as <span className="font-semibold text-foreground">IAs setoriais</span> ou <span className="font-semibold text-foreground">colaboradores</span>
        </span>
      </div>
    )}

    {/* Status Indicators */}
    <div className="grid grid-cols-2 gap-1.5">
      <StatusIndicator label="Gatilhos" configured={sector.triggers} />
      <StatusIndicator label="Regras" configured={sector.rules} />
      <StatusIndicator label="Etapas" configured={sector.steps} />
      <StatusIndicator label="FAQ" configured={sector.faq} />
    </div>

    {/* Connection */}
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5">
        <Link2 className="w-3 h-3 text-muted-foreground" />
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Vincular Conexão</span>
      </div>
      {sector.isReception ? (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/5 border border-primary/10">
          <ShieldCheck className="w-3.5 h-3.5 text-primary flex-shrink-0" />
          <span className="text-[11px] text-foreground font-medium">Todas as conexões</span>
          <span className="text-[10px] text-muted-foreground ml-auto">{CONNECTIONS.length} ativas</span>
        </div>
      ) : (
        <Select
          value={sector.connectionId || ""}
          onValueChange={(v) => { onConnectionChange(v); }}
        >
          <SelectTrigger className="h-9 text-xs bg-muted/30 border-border" onClick={(e) => e.stopPropagation()}>
            <SelectValue placeholder="Selecione uma conexão..." />
          </SelectTrigger>
          <SelectContent>
            {CONNECTIONS.map((c) => (
              <SelectItem key={c.id} value={c.id} className="text-xs">
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  </div>
);

const IAsSetoriais = () => {
  const [sectors, setSectors] = useState<SectorIA[]>([
    {
      id: "recepcao", name: "IA de Recepção", icon: ShieldCheck,
      description: "Recepciona o cliente e direciona para a IA setorial adequada ou para um colaborador.",
      prompt: "", tone: "amigavel", active: true,
      triggers: true, rules: true, steps: true, faq: false, connectionId: "conn-1",
      isReception: true,
    },
    {
      id: "comercial", name: "Comercial", icon: DollarSign,
      description: "IA focada em vendas, qualificação de leads e apresentação de produtos.",
      prompt: "", tone: "amigavel", active: true,
      triggers: true, rules: true, steps: false, faq: true, connectionId: "conn-1",
    },
    {
      id: "financeiro", name: "Financeiro", icon: DollarSign,
      description: "IA para cobranças, negociações de pagamento e questões financeiras.",
      prompt: "", tone: "formal", active: false,
      triggers: false, rules: false, steps: false, faq: false, connectionId: null,
    },
    {
      id: "suporte", name: "Suporte", icon: Headphones,
      description: "IA para atendimento ao cliente, resolução de problemas e dúvidas técnicas.",
      prompt: "", tone: "tecnico", active: true,
      triggers: true, rules: false, steps: true, faq: true, connectionId: null,
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeOpen, setActiveOpen] = useState(true);
  const [inactiveOpen, setInactiveOpen] = useState(false);
  const [selectedSectorId, setSelectedSectorId] = useState<string | null>(null);
  const [showWizard, setShowWizard] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showModelos, setShowModelos] = useState(false);

  const selectedSector = sectors.find(s => s.id === selectedSectorId) || null;

  const updateSector = (id: string, updates: Partial<SectorIA>) => {
    setSectors(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return sectors;
    const q = searchQuery.toLowerCase();
    return sectors.filter(s => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q));
  }, [sectors, searchQuery]);

  const sortReceptionFirst = (list: SectorIA[]) =>
    [...list].sort((a, b) => (a.isReception ? -1 : b.isReception ? 1 : 0));

  const activeSectors = sortReceptionFirst(filtered.filter(s => s.active));
  const inactiveSectors = sortReceptionFirst(filtered.filter(s => !s.active));

  const hasUnlinkedActive = sectors.some(s => s.active && !s.connectionId);

  if (showModelos) {
    return (
      <AppLayout>
        <ProGate title="IAs Setoriais" description="Configure IAs personalizadas por setor com o Plano Pro.">
          <ModelosPage
            onClose={() => setShowModelos(false)}
            onSelectModel={(modelo) => {
              const newSector: SectorIA = {
                id: Date.now().toString(),
                name: modelo.nome,
                icon: DollarSign,
                description: modelo.descricao,
                prompt: "",
                tone: "amigavel",
                active: true,
                triggers: false, rules: false, steps: true, faq: modelo.faqs > 0,
                connectionId: null,
              };
              setSectors(prev => [...prev, newSector]);
              setShowModelos(false);
            }}
          />
        </ProGate>
      </AppLayout>
    );
  }

  if (showAdvanced) {
    return (
      <AppLayout>
        <ProGate title="IAs Setoriais" description="Configure IAs personalizadas por setor com o Plano Pro.">
          <AdvancedCreator
            onClose={() => setShowAdvanced(false)}
            onFinish={(prompt) => {
              const newSector: SectorIA = {
                id: Date.now().toString(),
                name: "Novo Agente",
                icon: DollarSign,
                description: "Agente criado via prompt avançado",
                prompt,
                tone: "amigavel",
                active: true,
                triggers: false, rules: false, steps: false, faq: false,
                connectionId: null,
              };
              setSectors(prev => [...prev, newSector]);
              setShowAdvanced(false);
            }}
          />
        </ProGate>
      </AppLayout>
    );
  }

  if (selectedSector) {
    return (
      <AppLayout>
        <ProGate title="IAs Setoriais" description="Configure IAs personalizadas por setor com o Plano Pro.">
          <IADetailPanel
            sector={selectedSector}
            onBack={() => setSelectedSectorId(null)}
            onUpdate={(updates) => updateSector(selectedSector.id, updates)}
          />
        </ProGate>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <ProGate title="IAs Setoriais" description="Configure IAs personalizadas por setor com o Plano Pro.">
        <div className="space-y-6 animate-fade-in">
          {/* Page Header */}
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-foreground">IAs Setoriais</h1>
            <ProBadge size="md" />
          </div>

          {/* Creator Block */}
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Brain className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-base font-bold text-foreground">Criador de IAs Setoriais</h2>
                <p className="text-xs text-muted-foreground">Crie sua IA setorial personalizada</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => setShowWizard(true)}
                className="group rounded-xl border border-border bg-muted/20 p-5 text-left transition-all hover:border-primary/30 hover:bg-primary/5"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Wand2 className="w-4 h-4 text-primary" />
                  <span className="text-sm font-bold text-foreground">Assistente de Criação</span>
                  <Badge className="bg-emerald-500/15 text-emerald-600 border-emerald-500/20 text-[10px] px-1.5 py-0 font-bold hover:bg-emerald-500/15">
                    Recomendado
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Responda perguntas simples e criaremos a IA perfeita para você
                </p>
              </button>

              <button
                onClick={() => setShowAdvanced(true)}
                className="group rounded-xl border border-border bg-muted/20 p-5 text-left transition-all hover:border-primary/30 hover:bg-primary/5"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Settings2 className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  <span className="text-sm font-bold text-foreground">Criação Avançada</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Configure manualmente prompt, tom de voz e regras
                </p>
              </button>
            </div>
          </div>

          {/* Search & Actions Bar */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar IAs setoriais..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-10 text-sm bg-card border-border"
              />
            </div>
            <Button variant="outline" size="default" className="gap-2 text-xs font-semibold" onClick={() => setShowModelos(true)}>
              <LayoutGrid className="w-4 h-4" />
              Modelos
            </Button>
          </div>

          {/* Warning Banner */}
          {hasUnlinkedActive && (
            <div className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
              <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-foreground">Nenhuma IA vinculada a uma conexão</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Para que uma IA faça o primeiro atendimento, vincule-a a uma conexão do WhatsApp.
                </p>
              </div>
            </div>
          )}

          {/* Active Section */}
          <Collapsible open={activeOpen} onOpenChange={setActiveOpen}>
            <CollapsibleTrigger className="flex items-center gap-2 w-full text-left py-2 group">
              {activeOpen ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
              <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                IAs Ativas ({activeSectors.length})
              </span>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3">
              {activeSectors.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {activeSectors.map((s) => (
                    <IACard
                      key={s.id}
                      sector={s}
                      onToggle={() => updateSector(s.id, { active: false })}
                      onConnectionChange={(v) => updateSector(s.id, { connectionId: v })}
                      onClick={() => setSelectedSectorId(s.id)}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground py-6 text-center">Nenhuma IA ativa encontrada.</p>
              )}
            </CollapsibleContent>
          </Collapsible>

          {/* Inactive Section */}
          <Collapsible open={inactiveOpen} onOpenChange={setInactiveOpen}>
            <CollapsibleTrigger className="flex items-center gap-2 w-full text-left py-2 group">
              {inactiveOpen ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
              <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                IAs Inativas ({inactiveSectors.length})
              </span>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3">
              {inactiveSectors.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {inactiveSectors.map((s) => (
                    <IACard
                      key={s.id}
                      sector={s}
                      onToggle={() => updateSector(s.id, { active: true })}
                      onConnectionChange={(v) => updateSector(s.id, { connectionId: v })}
                      onClick={() => setSelectedSectorId(s.id)}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground py-6 text-center">Nenhuma IA inativa.</p>
              )}
            </CollapsibleContent>
          </Collapsible>
        </div>

        {showWizard && (
          <CreationWizard
            onClose={() => setShowWizard(false)}
            onFinish={(wizardData) => {
              const newSector: SectorIA = {
                id: Date.now().toString(),
                name: wizardData.nomeAgente || "Novo Agente",
                icon: DollarSign,
                description: `IA para ${wizardData.segmento || wizardData.segmentoCustom || "atendimento"}`,
                prompt: wizardData.mensagemBoasVindas,
                tone: (wizardData.tom as "formal" | "amigavel" | "tecnico") || "amigavel",
                active: true,
                triggers: false,
                rules: wizardData.regras.filter(r => r).length > 0,
                steps: false,
                faq: wizardData.faqInicial.filter(f => f.pergunta).length > 0,
                connectionId: null,
              };
              setSectors(prev => [...prev, newSector]);
              setShowWizard(false);
            }}
          />
        )}
      </ProGate>
    </AppLayout>
  );
};

export default IAsSetoriais;
