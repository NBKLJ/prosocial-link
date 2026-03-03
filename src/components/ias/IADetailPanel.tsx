import { useState, useRef, useEffect } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowLeft, Shield, ListOrdered, HelpCircle, Database,
  Building2, Settings, Upload, Plus, Trash2, GripVertical,
  FileText, MessageSquare, Tag, Users, FolderOpen, Bell,
  Package, Volume2, CalendarDays, Power
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
    if (val[pos - 1] === "=" && (pos === 1 || val[pos - 2] === "\n" || val[pos - 2] === " ")) {
      const ta = e.target;
      const rect = ta.getBoundingClientRect();
      // Approximate position based on cursor
      const lines = val.substring(0, pos).split("\n");
      const lineHeight = 22;
      const top = Math.min(lines.length * lineHeight, ta.scrollHeight - ta.scrollTop);
      setMenuPos({ top: rect.top + top - ta.scrollTop + 8, left: rect.left + 24 });
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

/* ─── Tab: Perguntas Frequentes ─── */
const FAQTab = () => {
  const [faqs, setFaqs] = useState([
    { id: "1", question: "Qual o horário de funcionamento?", answer: "Nosso horário de atendimento é de segunda a sexta, das 8h às 18h." },
    { id: "2", question: "Quais formas de pagamento vocês aceitam?", answer: "Aceitamos PIX, cartão de crédito, débito e boleto bancário." },
    { id: "3", question: "Qual o prazo de entrega?", answer: "O prazo padrão é de 3 a 5 dias úteis após a confirmação do pagamento." },
  ]);
  const [newQ, setNewQ] = useState("");
  const [newA, setNewA] = useState("");

  const addFaq = () => {
    if (!newQ.trim() || !newA.trim()) return;
    setFaqs(prev => [...prev, { id: Date.now().toString(), question: newQ.trim(), answer: newA.trim() }]);
    setNewQ("");
    setNewA("");
    toast.success("Pergunta adicionada");
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-foreground">Perguntas e Respostas</h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">Respostas prontas para dúvidas comuns</p>
          </div>
          <Badge variant="outline" className="text-[10px]">{faqs.length} perguntas</Badge>
        </div>
        <div className="space-y-3">
          {faqs.map((faq) => (
            <div key={faq.id} className="p-4 rounded-lg bg-muted/20 border border-border/50 space-y-2 group">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2">
                  <MessageSquare className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                  <span className="text-sm font-semibold text-foreground">{faq.question}</span>
                </div>
                <button className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-xs text-muted-foreground pl-5.5 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-dashed border-border bg-card p-5 space-y-3">
        <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Adicionar Pergunta</h4>
        <Input value={newQ} onChange={(e) => setNewQ(e.target.value)} placeholder="Pergunta..." className="text-sm bg-muted/20 border-border" />
        <Textarea value={newA} onChange={(e) => setNewA(e.target.value)} placeholder="Resposta..." className="text-sm bg-muted/20 border-border min-h-[60px] resize-none" />
        <Button size="sm" onClick={addFaq} className="gap-1.5 text-xs">
          <Plus className="w-3.5 h-3.5" /> Adicionar
        </Button>
      </div>
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
    nome: "Escritório Central",
    endereco: "Av. Paulista, 1000 — São Paulo, SP",
    telefone: "+55 11 3000-0000",
    email: "contato@empresa.com.br",
    horario: "Segunda a Sexta, 08:00 às 18:00",
    site: "https://www.empresa.com.br",
    descricao: "Somos um escritório especializado em soluções empresariais com mais de 10 anos de experiência no mercado.",
  });

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-foreground">Dados do Escritório</h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">Informações que a IA usará quando o cliente perguntar sobre o escritório</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Nome do Escritório</label>
            <Input value={info.nome} onChange={(e) => setInfo(p => ({ ...p, nome: e.target.value }))} className="text-sm bg-muted/20 border-border" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Telefone</label>
            <Input value={info.telefone} onChange={(e) => setInfo(p => ({ ...p, telefone: e.target.value }))} className="text-sm bg-muted/20 border-border" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">E-mail</label>
            <Input value={info.email} onChange={(e) => setInfo(p => ({ ...p, email: e.target.value }))} className="text-sm bg-muted/20 border-border" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Website</label>
            <Input value={info.site} onChange={(e) => setInfo(p => ({ ...p, site: e.target.value }))} className="text-sm bg-muted/20 border-border" />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Endereço</label>
            <Input value={info.endereco} onChange={(e) => setInfo(p => ({ ...p, endereco: e.target.value }))} className="text-sm bg-muted/20 border-border" />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Horário de Funcionamento</label>
            <Input value={info.horario} onChange={(e) => setInfo(p => ({ ...p, horario: e.target.value }))} className="text-sm bg-muted/20 border-border" />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Descrição da Empresa</label>
            <Textarea value={info.descricao} onChange={(e) => setInfo(p => ({ ...p, descricao: e.target.value }))} className="text-sm bg-muted/20 border-border min-h-[80px] resize-none" />
          </div>
        </div>
        <Button size="sm" className="text-xs gap-1.5" onClick={() => toast.success("Informações salvas!")}>
          Salvar informações
        </Button>
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
