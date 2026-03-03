import { useState, useMemo } from "react";
import {
  ArrowLeft, Search, ChevronRight, Plus, Users, User,
  FileText, HelpCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Modelo {
  id: string;
  nome: string;
  area: string;
  areaColor: string;
  descricao: string;
  etapas: number;
  faqs: number;
  tipo: "unico" | "multiagente";
}

const RAMOS = [
  "Advocacia / Jurídico",
  "Clínica Médica",
  "Clínica Odontológica",
  "Clínica Estética",
  "Infoprodutor / Produtos Digitais",
  "Imobiliária",
  "Contabilidade",
  "E-commerce",
  "Educação / Cursos",
  "Salão / Barbearia",
];

const MODELOS_POR_RAMO: Record<string, Modelo[]> = {
  "Advocacia / Jurídico": [
    { id: "1", nome: "BPC/Loas", area: "Previdenciário", areaColor: "bg-blue-500/15 text-blue-600 border-blue-500/20", descricao: "Agente completo que faz recepção, análise de viabilidade, oferta e confirmação de assinatura do contrato e agendamento de reunião.", etapas: 1, faqs: 20, tipo: "unico" },
    { id: "2", nome: "Trabalhista reclamante", area: "Trabalhista", areaColor: "bg-emerald-500/15 text-emerald-600 border-emerald-500/20", descricao: "Agente completo que faz recepção, análise de viabilidade, oferta e confirmação de assinatura do contrato e agendamento de reunião.", etapas: 1, faqs: 15, tipo: "unico" },
    { id: "3", nome: "Auxílio Acidente", area: "Previdenciário", areaColor: "bg-blue-500/15 text-blue-600 border-blue-500/20", descricao: "Agente completo que faz recepção, análise de viabilidade, oferta e confirmação de assinatura do contrato e agendamento de reunião.", etapas: 1, faqs: 19, tipo: "unico" },
    { id: "4", nome: "Bancário - Superendividamento", area: "Bancário", areaColor: "bg-amber-500/15 text-amber-600 border-amber-500/20", descricao: "Agente completo que faz recepção, análise de viabilidade, oferta e confirmação de assinatura do contrato e agendamento de reunião.", etapas: 1, faqs: 22, tipo: "multiagente" },
    { id: "5", nome: "Bancário RMC-RCC-Desconto Indevido - Consignado", area: "Bancário", areaColor: "bg-amber-500/15 text-amber-600 border-amber-500/20", descricao: "Agente completo que faz recepção, análise de viabilidade, oferta e confirmação de assinatura do contrato e agendamento de reunião.", etapas: 1, faqs: 10, tipo: "multiagente" },
    { id: "6", nome: "Revisional de Aposentadoria por invalidez", area: "Previdenciário", areaColor: "bg-blue-500/15 text-blue-600 border-blue-500/20", descricao: "Agente completo que faz recepção, análise de viabilidade, oferta e confirmação de assinatura do contrato e agendamento de reunião.", etapas: 1, faqs: 12, tipo: "unico" },
    { id: "7", nome: "Direito do Consumidor", area: "Consumidor", areaColor: "bg-purple-500/15 text-purple-600 border-purple-500/20", descricao: "Agente completo para atendimento de casos de direito do consumidor, análise de viabilidade e encaminhamento.", etapas: 1, faqs: 18, tipo: "multiagente" },
    { id: "8", nome: "Aposentadoria por Idade", area: "Previdenciário", areaColor: "bg-blue-500/15 text-blue-600 border-blue-500/20", descricao: "Agente completo que faz recepção, análise de viabilidade, oferta e confirmação de assinatura do contrato.", etapas: 1, faqs: 16, tipo: "unico" },
    { id: "9", nome: "Pensão por Morte", area: "Previdenciário", areaColor: "bg-blue-500/15 text-blue-600 border-blue-500/20", descricao: "Agente para qualificação de leads de pensão por morte, verificação de requisitos e agendamento.", etapas: 1, faqs: 14, tipo: "multiagente" },
  ],
  "Clínica Médica": [
    { id: "m1", nome: "Agendamento de Consultas", area: "Atendimento", areaColor: "bg-emerald-500/15 text-emerald-600 border-emerald-500/20", descricao: "Agente para agendar consultas, verificar disponibilidade e enviar confirmações.", etapas: 1, faqs: 12, tipo: "unico" },
    { id: "m2", nome: "Pós-consulta e Retorno", area: "Acompanhamento", areaColor: "bg-blue-500/15 text-blue-600 border-blue-500/20", descricao: "Agente que acompanha pacientes pós-consulta e agenda retornos.", etapas: 1, faqs: 8, tipo: "unico" },
  ],
  "Clínica Odontológica": [
    { id: "o1", nome: "Triagem Odontológica", area: "Atendimento", areaColor: "bg-emerald-500/15 text-emerald-600 border-emerald-500/20", descricao: "Agente para triagem inicial, identificação de urgência e agendamento.", etapas: 1, faqs: 10, tipo: "unico" },
  ],
  "Clínica Estética": [
    { id: "e1", nome: "Avaliação Estética", area: "Vendas", areaColor: "bg-pink-500/15 text-pink-600 border-pink-500/20", descricao: "Agente para agendar avaliações, apresentar procedimentos e planos.", etapas: 1, faqs: 15, tipo: "unico" },
  ],
  "Infoprodutor / Produtos Digitais": [
    { id: "i1", nome: "Vendas de Curso", area: "Vendas", areaColor: "bg-purple-500/15 text-purple-600 border-purple-500/20", descricao: "Agente para qualificação de leads, apresentação de cursos e fechamento.", etapas: 1, faqs: 20, tipo: "unico" },
  ],
  "Imobiliária": [
    { id: "im1", nome: "Captação de Imóveis", area: "Vendas", areaColor: "bg-amber-500/15 text-amber-600 border-amber-500/20", descricao: "Agente para captar novos imóveis e qualificar proprietários.", etapas: 1, faqs: 14, tipo: "unico" },
  ],
};

interface ModelosPageProps {
  onClose: () => void;
  onSelectModel: (modelo: Modelo) => void;
}

const ModelosPage = ({ onClose, onSelectModel }: ModelosPageProps) => {
  const [ramoSelecionado, setRamoSelecionado] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filtroTipo, setFiltroTipo] = useState<"todos" | "unico" | "multiagente">("todos");

  const modelos = ramoSelecionado ? (MODELOS_POR_RAMO[ramoSelecionado] || []) : [];

  const filtered = useMemo(() => {
    let result = modelos;
    if (filtroTipo !== "todos") result = result.filter(m => m.tipo === filtroTipo);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(m => m.nome.toLowerCase().includes(q) || m.area.toLowerCase().includes(q) || m.descricao.toLowerCase().includes(q));
    }
    return result;
  }, [modelos, filtroTipo, searchQuery]);

  const unicos = modelos.filter(m => m.tipo === "unico").length;
  const multi = modelos.filter(m => m.tipo === "multiagente").length;

  // Step 1: Select ramo
  if (!ramoSelecionado) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /> Voltar
          </button>
          <div className="w-px h-6 bg-border" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">Modelos Disponíveis</h1>
            <p className="text-xs text-muted-foreground">Selecione seu ramo de atuação para ver os modelos</p>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-base font-bold text-foreground mb-1">Qual é o seu ramo de atuação?</h2>
          <p className="text-xs text-muted-foreground mb-5">Escolha abaixo para ver modelos prontos para o seu segmento</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {RAMOS.map(ramo => (
              <button
                key={ramo}
                onClick={() => setRamoSelecionado(ramo)}
                className="flex items-center justify-between p-4 rounded-xl border border-border bg-background text-left hover:border-primary/30 hover:bg-primary/5 transition-all group"
              >
                <span className="text-sm font-semibold text-foreground">{ramo}</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Show models
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => setRamoSelecionado(null)} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </button>
        <div className="w-px h-6 bg-border" />
        <div>
          <h1 className="text-2xl font-bold text-foreground">Modelos Disponíveis</h1>
          <p className="text-xs text-muted-foreground">{modelos.length} modelos disponíveis para {ramoSelecionado}</p>
        </div>
      </div>

      {/* Type descriptions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-border bg-card p-5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <User className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">Modelos Únicos</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Agentes completos que realizam todo o atendimento de forma autônoma, do início ao fim. Ideais para processos simples e diretos.</p>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
            <Users className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">Multiagentes</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Agentes especializados que trabalham em conjunto. Um agente principal direciona para especialistas conforme a necessidade do caso.</p>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar modelos por nome, área ou descrição..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9 h-10 text-sm bg-card border-border"
          />
        </div>
        <div className="flex gap-1.5">
          {([
            { key: "todos", label: `Todos (${modelos.length})` },
            { key: "unico", label: `Únicos (${unicos})` },
            { key: "multiagente", label: `Multiagentes (${multi})` },
          ] as const).map(f => (
            <button
              key={f.key}
              onClick={() => setFiltroTipo(f.key)}
              className={cn(
                "px-4 py-2 rounded-lg text-xs font-semibold transition-all",
                filtroTipo === f.key
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border text-foreground hover:bg-muted"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Model Cards */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(modelo => (
            <div key={modelo.id} className="rounded-xl border border-border bg-card p-5 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-foreground mb-2">{modelo.nome}</h3>
                <Badge className={cn("text-[10px] font-bold border mb-3", modelo.areaColor)} variant="outline">
                  {modelo.area}
                </Badge>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">{modelo.descricao}</p>
              </div>
              <div>
                <div className="flex items-center gap-4 mt-4 mb-4">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <FileText className="w-3.5 h-3.5" />
                    <span className="font-semibold">{modelo.etapas}</span> etapas
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span className="font-semibold">{modelo.faqs}</span> FAQs
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" className="flex-1 gap-1.5 text-xs" onClick={() => onSelectModel(modelo)}>
                    <Plus className="w-3.5 h-3.5" /> Criar
                  </Button>
                  <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors px-3 py-2">
                    <ChevronRight className="w-3.5 h-3.5" /> Detalhes
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-sm text-muted-foreground">Nenhum modelo encontrado.</p>
        </div>
      )}
    </div>
  );
};

export default ModelosPage;
