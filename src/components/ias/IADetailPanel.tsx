import { useState, useRef, useEffect } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowLeft, Shield, ListOrdered, HelpCircle, Database,
  Building2, Settings, Upload, Plus, Trash2, GripVertical,
  FileText, MessageSquare, Tag, Users, FolderOpen, Bell,
  Package, Volume2, CalendarDays, Power, ChevronUp, ChevronDown, Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface SectorIA {
  id: string;
  name: string;
  description: string;
  prompt: string;
  tone: "formal" | "amigavel" | "tecnico";
  active: boolean;
  triggers: boolean;
  rules: boolean;
  steps: boolean;
  faq: boolean;
  connectionId: string | null;
  icon: LucideIcon;
}

interface IADetailPanelProps {
  sector: SectorIA;
  onBack: () => void;
  onUpdate: (updates: Partial<SectorIA>) => void;
}

/* ─── Tab: Regras Gerais ─── */
const RegrasGeraisTab = ({ sector, onUpdate }: { sector: SectorIA; onUpdate: (u: Partial<SectorIA>) => void }) => {
  const [rules, setRules] = useState([
    { id: "1", text: "Sempre cumprimentar o cliente pelo nome", active: true },
    { id: "2", text: "Não fornecer informações sobre preços sem consultar tabela", active: true },
    { id: "3", text: "Encaminhar para humano após 3 tentativas sem resolução", active: true },
    { id: "4", text: "Nunca compartilhar dados de outros clientes", active: true },
  ]);
  const [newRule, setNewRule] = useState("");

  const addRule = () => {
    if (!newRule.trim()) return;
    setRules(prev => [...prev, { id: Date.now().toString(), text: newRule.trim(), active: true }]);
    setNewRule("");
    toast.success("Regra adicionada");
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-foreground">Prompt Principal</h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">Instrução base que define o comportamento da IA</p>
          </div>
          <Badge variant="outline" className="text-[10px]">Obrigatório</Badge>
        </div>
        <Textarea
          value={sector.prompt || "Você é um assistente inteligente do setor comercial. Seu objetivo é qualificar leads, apresentar produtos e agendar reuniões."}
          onChange={(e) => onUpdate({ prompt: e.target.value })}
          className="min-h-[120px] text-sm bg-muted/20 border-border resize-none"
          placeholder="Descreva como a IA deve se comportar..."
        />
      </div>

      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-foreground">Tom de Voz</h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">Define como a IA se comunica com os clientes</p>
        </div>
        <Select value={sector.tone} onValueChange={(v: "formal" | "amigavel" | "tecnico") => onUpdate({ tone: v })}>
          <SelectTrigger className="h-10 text-sm bg-muted/20 border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="formal">🎩 Formal — Linguagem corporativa e respeitosa</SelectItem>
            <SelectItem value="amigavel">😊 Amigável — Próximo e acolhedor</SelectItem>
            <SelectItem value="tecnico">🔧 Técnico — Preciso e objetivo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-foreground">Regras de Comportamento</h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">Diretrizes que a IA deve seguir em todas as interações</p>
        </div>
        <div className="space-y-2">
          {rules.map((rule) => (
            <div key={rule.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/20 border border-border/50 group">
              <GripVertical className="w-3.5 h-3.5 text-muted-foreground/40 cursor-grab" />
              <span className="flex-1 text-xs text-foreground">{rule.text}</span>
              <Switch
                checked={rule.active}
                onCheckedChange={(checked) => setRules(prev => prev.map(r => r.id === rule.id ? { ...r, active: checked } : r))}
                className="scale-75"
              />
              <button
                onClick={() => setRules(prev => prev.filter(r => r.id !== rule.id))}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={newRule}
            onChange={(e) => setNewRule(e.target.value)}
            placeholder="Adicionar nova regra..."
            className="text-sm bg-muted/20 border-border"
            onKeyDown={(e) => e.key === "Enter" && addRule()}
          />
          <Button size="sm" onClick={addRule} className="gap-1.5 text-xs shrink-0">
            <Plus className="w-3.5 h-3.5" /> Adicionar
          </Button>
        </div>
      </div>
    </div>
  );
};

/* ─── Actions Menu Items ─── */
const ACTION_ITEMS = [
  { id: "etiqueta", label: "Adicionar Etiqueta", icon: Tag, color: "text-primary" },
  { id: "transferir-agente", label: "Transferir para Agente", icon: ArrowLeft, color: "text-blue-500" },
  { id: "transferir-usuario", label: "Transferir para Usuário", icon: Users, color: "text-emerald-500" },
  { id: "atribuir-origem", label: "Atribuir Origem", icon: FolderOpen, color: "text-amber-500" },
  { id: "mudar-etapa", label: "Mudar Etapa no CRM", icon: ListOrdered, color: "text-purple-500" },
  { id: "notificar-equipe", label: "Notificar Equipe", icon: Bell, color: "text-orange-500" },
  { id: "atribuir-produto", label: "Atribuir Produto", icon: Package, color: "text-pink-500" },
  { id: "atribuir-departamento", label: "Atribuir Departamento", icon: Building2, color: "text-teal-500" },
  { id: "enviar-audio", label: "Enviar em Áudio", icon: Volume2, color: "text-indigo-500" },
  { id: "consultar-agenda", label: "Consultar Agenda", icon: CalendarDays, color: "text-cyan-500" },
  { id: "desativar-agente", label: "Desativar Agente", icon: Power, color: "text-red-500" },
];

/* ─── Tab: Roteiro de Atendimento ─── */
const RoteiroTab = () => {
  const [content, setContent] = useState(
`**Recepção**
🚩 Caso o cliente envie qualquer mensagem inicial (pergunta, relato de doença etc.):
👉 Ignorar o conteúdo e **iniciar sempre com a mensagem institucional abaixo**.

💬 Mensagem inicial:
"Olá! Seja bem-vindo ao escritório [[NOME_DO_ESCRITORIO]], CNPJ: [[CNPJ_DO_ESCRITORIO]].

Somos especialistas em BPC/LOAS (Benefício de Prestação Continuada) e atendemos clientes em todo o Brasil.

Pra eu te atender melhor, qual é o seu primeiro nome?"

---

🚩 Caso o cliente informe o nome:

💬 Mensagem de apresentação:
"Oi, [Nome]! Eu sou [[NOME_DO_AGENTE]], analista jurídica da [[NOME_DO_ESCRITORIO]].

O BPC/LOAS é um benefício do governo que paga R$ 1.518,00 por mês (1 salário mínimo) para pessoas com deficiência, doença de longo prazo ou idosos com 65 anos ou mais que tenham baixa renda familiar.

Você gostaria que eu faça uma análise gratuita do seu caso para verificar se pode ter direito?"

👉 Após essa mensagem, avançar para **Etapa 2 – Qualificação**, onde será tratada a resposta (aceita / dúvida / recusa).`
  );

  const [showMenu, setShowMenu] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const [cursorPos, setCursorPos] = useState(0);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    const pos = e.target.selectionStart;
    setContent(val);
    setCursorPos(pos);

    // Check if user just typed "="
    if (val[pos - 1] === "=") {
      const ta = e.target;
      const rect = ta.getBoundingClientRect();
      // Calculate approximate position using a hidden measurement
      const textBefore = val.substring(0, pos);
      const lines = textBefore.split("\n");
      const lineIndex = lines.length - 1;
      const lineHeight = 22;
      const topOffset = (lineIndex + 1) * lineHeight - ta.scrollTop;
      const clampedTop = Math.max(40, Math.min(topOffset, rect.height - 40));
      setMenuPos({ top: rect.top + clampedTop + 8, left: rect.left + 40 });
      setShowMenu(true);
      setSelectedAction(null);
    }
  };

  const insertAction = (actionLabel: string) => {
    const before = content.substring(0, cursorPos);
    const after = content.substring(cursorPos);
    // Replace the "=" with the action tag
    const newContent = before.slice(0, -1) + `[AÇÃO: ${actionLabel}]` + after;
    setContent(newContent);
    setShowMenu(false);
    setSelectedAction(null);
    setSelectedTag("");
    textareaRef.current?.focus();
    toast.success(`Ação "${actionLabel}" inserida`);
  };

  const insertActionWithTag = (actionLabel: string, tag: string) => {
    const before = content.substring(0, cursorPos);
    const after = content.substring(cursorPos);
    const newContent = before.slice(0, -1) + `[AÇÃO: ${actionLabel} → ${tag}]` + after;
    setContent(newContent);
    setShowMenu(false);
    setSelectedAction(null);
    setSelectedTag("");
    textareaRef.current?.focus();
    toast.success(`Ação "${actionLabel}" inserida`);
  };

  // Close menu on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
        setSelectedAction(null);
      }
    };
    if (showMenu) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showMenu]);

  return (
    <div className="space-y-4">
      {/* Hint bar */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          Digite <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border text-[10px] font-mono">=</kbd> no editor para inserir uma ação inteligente
        </span>
        <Button size="sm" variant="outline" className="gap-1.5 text-xs" onClick={() => toast.success("Roteiro salvo!")}>
          <FileText className="w-3.5 h-3.5" /> Salvar
        </Button>
      </div>

      {/* Editor area */}
      <div className="relative rounded-xl border border-border bg-card">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleChange}
          className="w-full min-h-[500px] p-6 text-sm text-foreground bg-transparent resize-none focus:outline-none leading-relaxed font-mono"
          placeholder="Escreva o roteiro de atendimento da IA aqui..."
        />
      </div>

      {/* Actions popup menu */}
      {showMenu && (
        <div
          ref={menuRef}
          className="fixed z-50 w-[420px] max-h-[460px] overflow-y-auto rounded-xl border border-border bg-card shadow-xl p-4 space-y-3 animate-fade-in"
          style={{ top: menuPos.top, left: menuPos.left }}
        >
          {!selectedAction ? (
            <>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-1">Tipo de Decisão</p>
              <div className="grid grid-cols-2 gap-2">
                {ACTION_ITEMS.map((action) => (
                  <button
                    key={action.id}
                    onClick={() => {
                      if (action.id === "etiqueta") {
                        setSelectedAction(action.id);
                      } else {
                        insertAction(action.label);
                      }
                    }}
                    className="flex items-center gap-2.5 p-3 rounded-lg border border-border bg-background text-left hover:border-primary/30 hover:bg-primary/5 transition-all group"
                  >
                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center bg-muted/50", action.color)}>
                      <action.icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-semibold text-foreground">{action.label}</span>
                  </button>
                ))}
              </div>
              <div className="flex justify-end pt-2">
                <Button size="sm" variant="ghost" className="text-xs" onClick={() => setShowMenu(false)}>
                  Cancelar
                </Button>
              </div>
            </>
          ) : (
            <>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-1">Selecione a Etiqueta</p>
              <Select value={selectedTag} onValueChange={setSelectedTag}>
                <SelectTrigger className="h-10 text-sm bg-muted/20 border-border">
                  <SelectValue placeholder="Selecione uma opção..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lead-quente">🔥 Lead Quente</SelectItem>
                  <SelectItem value="qualificado">✅ Qualificado</SelectItem>
                  <SelectItem value="aguardando">⏳ Aguardando Retorno</SelectItem>
                  <SelectItem value="sem-interesse">❌ Sem Interesse</SelectItem>
                  <SelectItem value="vip">⭐ VIP</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex justify-end gap-2 pt-2">
                <Button size="sm" variant="ghost" className="text-xs" onClick={() => { setSelectedAction(null); }}>
                  Cancelar
                </Button>
                <Button
                  size="sm"
                  className="text-xs"
                  disabled={!selectedTag}
                  onClick={() => insertActionWithTag("Adicionar Etiqueta", selectedTag)}
                >
                  Inserir
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

/* ─── Rich Text Toolbar ─── */
const RichTextToolbar = () => (
  <div className="flex items-center gap-0.5 px-3 py-2 border-b border-border">
    <Select defaultValue="normal">
      <SelectTrigger className="h-7 w-24 text-xs border-0 bg-transparent shadow-none px-2">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="normal" className="text-xs">Normal</SelectItem>
        <SelectItem value="h1" className="text-xs">Título 1</SelectItem>
        <SelectItem value="h2" className="text-xs">Título 2</SelectItem>
        <SelectItem value="h3" className="text-xs">Título 3</SelectItem>
      </SelectContent>
    </Select>
    <div className="w-px h-4 bg-border mx-1" />
    {[
      { label: "B", style: "font-bold" },
      { label: "I", style: "italic" },
      { label: "U", style: "underline" },
    ].map((btn) => (
      <button
        key={btn.label}
        className={cn("w-7 h-7 rounded flex items-center justify-center text-sm hover:bg-muted transition-colors text-foreground", btn.style)}
      >
        {btn.label}
      </button>
    ))}
    <div className="w-px h-4 bg-border mx-1" />
    <button className="w-7 h-7 rounded flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground">
      <ListOrdered className="w-3.5 h-3.5" />
    </button>
    <button className="w-7 h-7 rounded flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground">
      <ListOrdered className="w-3.5 h-3.5" />
    </button>
    <div className="w-px h-4 bg-border mx-1" />
    <button className="w-7 h-7 rounded flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground text-xs font-mono">
      T<sub className="text-[8px]">x</sub>
    </button>
  </div>
);

/* ─── FAQ Item Component ─── */
const FAQItem = ({
  faq,
  index,
  onUpdate,
  onDelete,
}: {
  faq: { id: string; question: string; answer: string };
  index: number;
  onUpdate: (id: string, updates: Partial<{ question: string; answer: string }>) => void;
  onDelete: (id: string) => void;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-border rounded-xl bg-card overflow-hidden">
      {/* Collapsed header */}
      <div
        className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-muted/30 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <div className="w-7 h-7 rounded-full bg-foreground text-background flex items-center justify-center text-xs font-bold shrink-0">
          {index + 1}
        </div>
        <button className="text-muted-foreground hover:text-foreground transition-colors shrink-0">
          {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        <MessageSquare className="w-4 h-4 text-muted-foreground shrink-0" />
        <span className="text-sm text-foreground flex-1 truncate">{faq.question || "Nova pergunta..."}</span>
        <div className="flex items-center gap-1 shrink-0">
          <button className="w-7 h-7 rounded flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
            <GripVertical className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(faq.id); }}
            className="w-7 h-7 rounded flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Expanded content */}
      {open && (
        <div className="px-5 pb-5 pt-2 space-y-4 border-t border-border animate-fade-in">
          {/* Pergunta */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Pergunta</label>
            <Input
              value={faq.question}
              onChange={(e) => onUpdate(faq.id, { question: e.target.value })}
              className="text-sm bg-muted/20 border-border"
              placeholder="Ex: O escritório é especializado em BPC/Loas?"
            />
          </div>

          {/* Resposta */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-muted-foreground">Resposta</label>
              <Button size="sm" variant="outline" className="h-7 gap-1.5 text-[11px]" onClick={() => toast.info("Upload de mídia em breve!")}>
                <Upload className="w-3 h-3" /> Adicionar Mídia
              </Button>
            </div>
            <div className="rounded-lg border border-border overflow-hidden">
              <RichTextToolbar />
              <textarea
                value={faq.answer}
                onChange={(e) => onUpdate(faq.id, { answer: e.target.value })}
                className="w-full min-h-[140px] p-4 text-sm text-foreground bg-transparent resize-none focus:outline-none leading-relaxed"
                placeholder="Escreva a resposta que a IA deve enviar automaticamente..."
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ─── Tab: Perguntas Frequentes ─── */
const FAQTab = () => {
  const [faqs, setFaqs] = useState([
    {
      id: "1",
      question: "O escritório realmente é especializado em BPC/Loas?",
      answer: "Sim. O escritório é especializado em demandas previdenciárias, com foco específico no benefício assistencial BPC/Loas, tanto para pessoas com deficiência quanto para idosos. Atendemos centenas de casos todos os meses em todo o Brasil.",
    },
    {
      id: "2",
      question: "Quem vai cuidar do meu caso? Vou falar com o advogado mesmo?",
      answer: "Sim! Seu caso será acompanhado diretamente por um advogado especialista. Você terá contato direto com ele durante todo o processo.",
    },
    {
      id: "3",
      question: "Qual o horário de funcionamento?",
      answer: "Nosso horário de atendimento é de segunda a sexta, das 8h às 18h. Aos sábados atendemos das 9h às 13h.",
    },
    {
      id: "4",
      question: "Quais formas de pagamento vocês aceitam?",
      answer: "Aceitamos PIX, cartão de crédito (até 12x), débito e boleto bancário.",
    },
  ]);

  const updateFaq = (id: string, updates: Partial<{ question: string; answer: string }>) => {
    setFaqs(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const deleteFaq = (id: string) => {
    setFaqs(prev => prev.filter(f => f.id !== id));
    toast.success("Pergunta removida");
  };

  const addFaq = () => {
    const newFaq = { id: Date.now().toString(), question: "", answer: "" };
    setFaqs(prev => [...prev, newFaq]);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-bold text-foreground">Perguntas Frequentes</h3>
          </div>
          <p className="text-[11px] text-muted-foreground mt-1">
            Quando a IA identificar uma dessas perguntas durante o atendimento, enviará automaticamente a resposta programada.
          </p>
        </div>
        <Button size="sm" className="gap-1.5 text-xs" onClick={addFaq}>
          <Plus className="w-3.5 h-3.5" /> Nova pergunta
        </Button>
      </div>

      {/* FAQ Items */}
      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <FAQItem
            key={faq.id}
            faq={faq}
            index={i}
            onUpdate={updateFaq}
            onDelete={deleteFaq}
          />
        ))}
      </div>

      {faqs.length === 0 && (
        <div className="text-center py-10">
          <MessageSquare className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Nenhuma pergunta frequente cadastrada</p>
          <Button size="sm" className="gap-1.5 text-xs mt-3" onClick={addFaq}>
            <Plus className="w-3.5 h-3.5" /> Adicionar primeira pergunta
          </Button>
        </div>
      )}
    </div>
  );
};

/* ─── Tab: Base de Conhecimento ─── */
const BaseConhecimentoTab = () => {
  const [files, setFiles] = useState([
    { id: "1", name: "catalogo-produtos-2024.pdf", size: "2.4 MB", date: "12/01/2025" },
    { id: "2", name: "tabela-precos.xlsx", size: "580 KB", date: "15/01/2025" },
    { id: "3", name: "manual-atendimento.pdf", size: "1.1 MB", date: "20/01/2025" },
  ]);

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-foreground">Arquivos de Referência</h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">A IA usará esses documentos como base para responder perguntas</p>
        </div>

        {/* Upload area */}
        <div
          className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all"
          onClick={() => toast.info("Upload de arquivos em breve!")}
        >
          <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm font-semibold text-foreground">Arraste arquivos ou clique para enviar</p>
          <p className="text-[11px] text-muted-foreground mt-1">PDF, DOCX, XLSX, TXT — Máx. 20MB por arquivo</p>
        </div>

        {/* File list */}
        <div className="space-y-2">
          {files.map((file) => (
            <div key={file.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/20 border border-border/50 group">
              <FileText className="w-4 h-4 text-primary shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-foreground truncate">{file.name}</p>
                <p className="text-[10px] text-muted-foreground">{file.size} · Enviado em {file.date}</p>
              </div>
              <button
                onClick={() => {
                  setFiles(prev => prev.filter(f => f.id !== file.id));
                  toast.success("Arquivo removido");
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─── Tab: Informações do Escritório ─── */
const InfoEscritorioTab = () => {
  const [info, setInfo] = useState({
    nomeEscritorio: "",
    nomeAgente: "",
    cnpj: "",
    areaAtuacao: "",
    endereco: "",
    advogadoResponsavel: "",
    oab: "",
    honorarios: "",
    multaDesistencia: "",
    salarioMinimo: "",
    linkContrato: "",
    telefone: "",
    email: "",
    site: "",
    horario: "",
    redesSociais: "",
    descricao: "",
  });

  const u = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setInfo(p => ({ ...p, [field]: e.target.value }));

  const Field = ({ label, field, placeholder, colSpan }: { label: string; field: string; placeholder: string; colSpan?: boolean }) => (
    <div className={cn("space-y-1.5", colSpan && "md:col-span-2")}>
      <label className="text-xs font-semibold text-foreground">{label}</label>
      <Input
        value={(info as any)[field]}
        onChange={u(field)}
        placeholder={placeholder}
        className="text-sm border-amber-300/60 focus:border-primary bg-background"
      />
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-card p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-foreground">Informações do Escritório</h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">A IA usará essas informações para responder perguntas dos clientes sobre o escritório</p>
          </div>
          <Button size="sm" className="gap-1.5 text-xs" onClick={() => toast.success("Informações salvas!")}>
            <FileText className="w-3.5 h-3.5" /> Salvar Informações
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Nome do Escritório" field="nomeEscritorio" placeholder="Ex: Silva & Associados Advocacia" />
          <Field label="Nome do Agente" field="nomeAgente" placeholder="Ex: Ana, Carlos, etc." />
          <Field label="CNPJ" field="cnpj" placeholder="00.000.000/0000-00" />
          <Field label="OAB" field="oab" placeholder="Ex: OAB/SP 123456" />
          <Field label="Área de Atuação" field="areaAtuacao" placeholder="Ex: Direito Civil e Família" colSpan />
          <Field label="Endereço" field="endereco" placeholder="Ex: Rua das Flores, 123, Centro, São Paulo-SP" colSpan />
          <Field label="Advogado Responsável" field="advogadoResponsavel" placeholder="Ex: Dr. João Silva" />
          <Field label="Telefone" field="telefone" placeholder="Ex: (11) 3000-0000" />
          <Field label="Honorários" field="honorarios" placeholder="Ex: 20% do êxito + 4 parcelas de um salário mínimo" />
          <Field label="Multa de Desistência" field="multaDesistencia" placeholder="R$ 0.000,00" />
          <Field label="Salário Mínimo Vigente" field="salarioMinimo" placeholder="R$ 0.000,00" />
          <Field label="Link do Contrato" field="linkContrato" placeholder="Ex: https://app.zapsign.com.br/..." />
          <Field label="E-mail" field="email" placeholder="Ex: contato@escritorio.com.br" />
          <Field label="Website" field="site" placeholder="Ex: https://www.escritorio.com.br" />
          <Field label="Redes Sociais" field="redesSociais" placeholder="Ex: @escritorio no Instagram" colSpan />
          <Field label="Horário de Funcionamento" field="horario" placeholder="Ex: Segunda a Sexta, 08:00 às 18:00" colSpan />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">Descrição do Escritório</label>
          <Textarea
            value={info.descricao}
            onChange={u("descricao")}
            placeholder="Descreva o escritório, especialidades, diferenciais e tempo de atuação..."
            className="text-sm border-amber-300/60 focus:border-primary bg-background min-h-[100px] resize-none"
          />
          <p className="text-[10px] text-muted-foreground">A IA usará essa descrição quando o cliente perguntar sobre o escritório</p>
        </div>
      </div>
    </div>
  );
};

/* ─── Tab: Configurações Gerais ─── */
const ConfiguracoesTab = ({ sector, onUpdate }: { sector: SectorIA; onUpdate: (u: Partial<SectorIA>) => void }) => (
  <div className="space-y-4">
    <div className="rounded-xl border border-border bg-card p-5 space-y-5">
      <div>
        <h3 className="text-sm font-bold text-foreground">Configurações da IA</h3>
        <p className="text-[11px] text-muted-foreground mt-0.5">Parâmetros gerais de funcionamento</p>
      </div>

      <div className="space-y-4">
        {[
          { label: "Ativar IA", desc: "Quando ativa, a IA responde automaticamente", checked: sector.active, key: "active" },
          { label: "Fallback para humano", desc: "Transferir para atendente se a IA não souber responder", checked: true, key: "fallback" },
          { label: "Horário comercial", desc: "IA funciona apenas no horário de expediente", checked: false, key: "horario" },
          { label: "Coletar feedback", desc: "Pedir avaliação ao final do atendimento", checked: true, key: "feedback" },
          { label: "Log de conversas", desc: "Registrar todas as interações para análise", checked: true, key: "logs" },
        ].map((item) => (
          <div key={item.key} className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border/50">
            <div>
              <p className="text-sm font-semibold text-foreground">{item.label}</p>
              <p className="text-[11px] text-muted-foreground">{item.desc}</p>
            </div>
            <Switch
              checked={item.key === "active" ? sector.active : item.checked}
              onCheckedChange={(checked) => {
                if (item.key === "active") onUpdate({ active: checked });
              }}
            />
          </div>
        ))}
      </div>
    </div>

    <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-5 space-y-3">
      <h3 className="text-sm font-bold text-destructive">Zona de Perigo</h3>
      <p className="text-[11px] text-muted-foreground">Ações irreversíveis para esta IA setorial</p>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="text-xs border-destructive/30 text-destructive hover:bg-destructive/10">
          Resetar configurações
        </Button>
        <Button variant="outline" size="sm" className="text-xs border-destructive/30 text-destructive hover:bg-destructive/10">
          Excluir IA
        </Button>
      </div>
    </div>
  </div>
);

/* ─── Main Detail Panel ─── */
const IADetailPanel = ({ sector, onBack, onUpdate }: IADetailPanelProps) => {
  const tabs = [
    { value: "regras", label: "Regras Gerais", icon: Shield },
    { value: "roteiro", label: "Roteiro", icon: ListOrdered },
    { value: "faq", label: "Perguntas Frequentes", icon: HelpCircle },
    { value: "base", label: "Base de Conhecimento", icon: Database },
    { value: "escritorio", label: "Info. Escritório", icon: Building2 },
    { value: "config", label: "Configurações", icon: Settings },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-lg border border-border bg-card flex items-center justify-center hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-foreground" />
        </button>
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center",
            sector.active ? "bg-primary/10" : "bg-muted"
          )}>
            <sector.icon className={cn("w-5 h-5", sector.active ? "text-primary" : "text-muted-foreground")} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">{sector.name}</h1>
            <p className="text-xs text-muted-foreground">{sector.description}</p>
          </div>
        </div>
        <Badge className={cn(
          "ml-auto text-[10px] font-bold",
          sector.active
            ? "bg-emerald-500/15 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/15"
            : "bg-muted text-muted-foreground border-border hover:bg-muted"
        )}>
          {sector.active ? "ATIVA" : "INATIVA"}
        </Badge>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="regras" className="w-full">
        <TabsList className="w-full h-auto flex-wrap justify-start gap-1 bg-muted/30 p-1.5 rounded-xl">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm"
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="regras" className="mt-5">
          <RegrasGeraisTab sector={sector} onUpdate={onUpdate} />
        </TabsContent>
        <TabsContent value="roteiro" className="mt-5">
          <RoteiroTab />
        </TabsContent>
        <TabsContent value="faq" className="mt-5">
          <FAQTab />
        </TabsContent>
        <TabsContent value="base" className="mt-5">
          <BaseConhecimentoTab />
        </TabsContent>
        <TabsContent value="escritorio" className="mt-5">
          <InfoEscritorioTab />
        </TabsContent>
        <TabsContent value="config" className="mt-5">
          <ConfiguracoesTab sector={sector} onUpdate={onUpdate} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IADetailPanel;
