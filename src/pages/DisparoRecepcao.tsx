import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import {
  MessageSquarePlus, Save, Mic, Type, Upload, Plus, X, Smartphone,
  Brain, Sparkles, Image, ChevronDown, ChevronUp, Trash2, Timer, GripVertical,
  Power, PowerOff, FileText, File, ToggleLeft, ToggleRight, Edit2, EyeOff,
  MessageCircle, Zap, Copy,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ProGate } from "@/components/ui/ProGate";
import { ProBadge } from "@/components/ui/ProBadge";

// ─── Types ───
type ContentType = "texto" | "audio" | "imagem" | "pdf" | "word";

interface SequenceItem {
  id: string;
  type: ContentType;
  content: string;
  delaySeconds: number;
}

interface WelcomeRule {
  id: string;
  name: string;
  keywords: string[];
  active: boolean;
  sequence: SequenceItem[];
  conexaoId: string;
}

// ─── Constants ───
const CONEXOES = [
  { id: "1", name: "Comercial 1", number: "(11) 99999-1234" },
  { id: "2", name: "Suporte", number: "(21) 98888-5678" },
];

const CONTENT_OPTIONS: { value: ContentType; label: string; icon: typeof Type; hint: string }[] = [
  { value: "texto", label: "Texto", icon: Type, hint: "Mensagem de texto" },
  { value: "audio", label: "Áudio", icon: Mic, hint: "MP3, OGG, WAV" },
  { value: "imagem", label: "Imagem", icon: Image, hint: "JPG, PNG, WEBP" },
  { value: "pdf", label: "PDF", icon: FileText, hint: "Documento PDF" },
  { value: "word", label: "Word", icon: File, hint: "DOCX, DOC" },
];

const DELAY_OPTIONS = [
  { value: 0, label: "Sem pausa" },
  { value: 3, label: "3s" },
  { value: 5, label: "5s" },
  { value: 10, label: "10s" },
  { value: 15, label: "15s" },
  { value: 30, label: "30s" },
  { value: 60, label: "1min" },
  { value: 120, label: "2min" },
];

const getContentIcon = (type: ContentType) => CONTENT_OPTIONS.find(o => o.value === type)?.icon || Type;
const getContentLabel = (type: ContentType) => CONTENT_OPTIONS.find(o => o.value === type)?.label || type;

const INITIAL_RULES: WelcomeRule[] = [
  {
    id: "r1",
    name: "Saudação Geral",
    keywords: ["olá", "oi", "bom dia", "boa tarde", "boa noite", "tudo bem"],
    active: true,
    conexaoId: "1",
    sequence: [
      { id: "s1", type: "texto", content: "Olá! 😊 Obrigado por entrar em contato. Em breve um de nossos atendentes irá te responder!", delaySeconds: 0 },
    ],
  },
  {
    id: "r2",
    name: "Consulta de Auxílio",
    keywords: ["auxílio", "benefício", "ajuda financeira"],
    active: true,
    conexaoId: "1",
    sequence: [
      { id: "s2a", type: "audio", content: "orientacao-auxilio.mp3", delaySeconds: 0 },
      { id: "s2b", type: "texto", content: "Para dar andamento à sua consulta sobre auxílio, precisamos de alguns dados. Por favor, envie seu CPF e nome completo.", delaySeconds: 5 },
      { id: "s2c", type: "imagem", content: "documentos-necessarios.jpg", delaySeconds: 3 },
    ],
  },
  {
    id: "r3",
    name: "Promoção / Desconto",
    keywords: ["promo", "promoção", "desconto", "oferta"],
    active: false,
    conexaoId: "2",
    sequence: [
      { id: "s3", type: "texto", content: "Obrigado pelo interesse! 🎉 Temos condições especiais este mês. Um consultor entrará em contato em instantes.", delaySeconds: 0 },
    ],
  },
];

// ─── Inline Sequence Builder ───
function SequenceBuilder({ items, onUpdate }: { items: SequenceItem[]; onUpdate: (items: SequenceItem[]) => void }) {
  const [addingType, setAddingType] = useState<ContentType | null>(null);
  const [addingContent, setAddingContent] = useState("");

  const addItem = () => {
    if (!addingType) return;
    const content = addingType === "texto" ? addingContent.trim() : (addingContent.trim() || `arquivo.${addingType === "audio" ? "mp3" : addingType === "imagem" ? "jpg" : addingType}`);
    if (addingType === "texto" && !content) return;
    onUpdate([...items, { id: Date.now().toString(), type: addingType, content, delaySeconds: items.length === 0 ? 0 : 5 }]);
    setAddingType(null);
    setAddingContent("");
  };

  const remove = (id: string) => {
    const updated = items.filter(i => i.id !== id);
    if (updated.length > 0) updated[0] = { ...updated[0], delaySeconds: 0 };
    onUpdate(updated);
  };

  const move = (index: number, dir: "up" | "down") => {
    const arr = [...items];
    const t = dir === "up" ? index - 1 : index + 1;
    if (t < 0 || t >= arr.length) return;
    [arr[index], arr[t]] = [arr[t], arr[index]];
    arr[0] = { ...arr[0], delaySeconds: 0 };
    onUpdate(arr);
  };

  const updateDelay = (id: string, delay: number) => onUpdate(items.map(i => i.id === id ? { ...i, delaySeconds: delay } : i));

  return (
    <div className="space-y-3">
      {/* Add buttons */}
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] font-medium text-muted-foreground mr-1">Adicionar:</span>
        {CONTENT_OPTIONS.map(opt => (
          <button
            key={opt.value}
            onClick={() => { setAddingType(opt.value); setAddingContent(""); }}
            className={cn(
              "flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-[10px] font-medium transition-all",
              addingType === opt.value ? "border-primary bg-primary/5 text-primary ring-1 ring-primary" : "border-border text-muted-foreground hover:bg-muted/50 hover:border-primary/20"
            )}
          >
            <opt.icon className="w-3 h-3" />
            {opt.label}
          </button>
        ))}
      </div>

      {/* Add form */}
      {addingType && (
        <div className="p-3 rounded-lg border border-primary/20 bg-primary/[0.02] space-y-2">
          {addingType === "texto" ? (
            <textarea value={addingContent} onChange={e => setAddingContent(e.target.value)} placeholder="Digite a mensagem..." rows={2} className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none" autoFocus />
          ) : (
            <button className="w-full flex items-center gap-2 py-4 border-2 border-dashed border-border rounded-lg hover:border-primary/30 hover:bg-primary/5 transition-all justify-center cursor-pointer">
              <Upload className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Enviar {getContentLabel(addingType)} • {CONTENT_OPTIONS.find(o => o.value === addingType)?.hint}</span>
            </button>
          )}
          <div className="flex gap-2 justify-end">
            <button onClick={() => { setAddingType(null); setAddingContent(""); }} className="px-2.5 py-1 rounded-md text-xs text-muted-foreground hover:bg-muted">Cancelar</button>
            <button onClick={addItem} className="px-3 py-1 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90">Adicionar</button>
          </div>
        </div>
      )}

      {/* Sequence list */}
      {items.length > 0 ? (
        <div className="space-y-0">
          {items.map((item, index) => {
            const Icon = getContentIcon(item.type);
            return (
              <div key={item.id}>
                {index > 0 && (
                  <div className="flex items-center gap-2 py-1 pl-5">
                    <div className="w-px h-3 bg-border" />
                    <Timer className="w-3 h-3 text-muted-foreground" />
                    <select value={item.delaySeconds} onChange={e => updateDelay(item.id, Number(e.target.value))} className="text-[10px] bg-muted/50 border border-border rounded px-1.5 py-0.5 text-muted-foreground focus:outline-none">
                      {DELAY_OPTIONS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                    </select>
                  </div>
                )}
                <div className="group flex items-center gap-2 p-2.5 rounded-lg border border-border bg-background hover:border-primary/20 transition-all">
                  <div className="w-5 h-5 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-[9px] font-bold text-primary">{index + 1}</span>
                  </div>
                  <Icon className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-primary/70">{getContentLabel(item.type)}</span>
                  <p className="text-xs text-foreground flex-1 truncate">{item.content}</p>
                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => move(index, "up")} disabled={index === 0} className="p-0.5 rounded hover:bg-muted disabled:opacity-30"><ChevronUp className="w-3 h-3 text-muted-foreground" /></button>
                    <button onClick={() => move(index, "down")} disabled={index === items.length - 1} className="p-0.5 rounded hover:bg-muted disabled:opacity-30"><ChevronDown className="w-3 h-3 text-muted-foreground" /></button>
                    <button onClick={() => remove(item.id)} className="p-0.5 rounded hover:bg-destructive/10"><Trash2 className="w-3 h-3 text-destructive" /></button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : !addingType ? (
        <div className="flex items-center gap-2 py-3 justify-center text-muted-foreground/40">
          <GripVertical className="w-4 h-4" />
          <span className="text-xs">Nenhum conteúdo na sequência</span>
        </div>
      ) : null}
    </div>
  );
}

// ─── Main Component ───
const DisparoRecepcao = () => {
  const [globalActive, setGlobalActive] = useState(true);
  const [rules, setRules] = useState<WelcomeRule[]>(INITIAL_RULES);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);

  // New rule form
  const [newName, setNewName] = useState("");
  const [newKeywords, setNewKeywords] = useState("");
  const [newConexao, setNewConexao] = useState(CONEXOES[0].id);
  const [newSequence, setNewSequence] = useState<SequenceItem[]>([]);

  // IA state
  const [iaActive, setIaActive] = useState(false);
  const [iaSetor, setIaSetor] = useState<"comercial" | "financeiro" | "suporte">("comercial");

  const toggleRule = (id: string) => setRules(rules.map(r => r.id === id ? { ...r, active: !r.active } : r));
  const deleteRule = (id: string) => { setRules(rules.filter(r => r.id !== id)); if (editingId === id) setEditingId(null); };
  const duplicateRule = (id: string) => {
    const rule = rules.find(r => r.id === id);
    if (!rule) return;
    const dup: WelcomeRule = { ...rule, id: Date.now().toString(), name: `${rule.name} (cópia)`, active: false, sequence: rule.sequence.map(s => ({ ...s, id: `${s.id}-${Date.now()}` })) };
    setRules([...rules, dup]);
    toast.success("Regra duplicada");
  };

  const updateRuleSequence = (ruleId: string, seq: SequenceItem[]) => {
    setRules(rules.map(r => r.id === ruleId ? { ...r, sequence: seq } : r));
  };

  const createRule = () => {
    if (!newName.trim()) { toast.error("Informe o nome da regra"); return; }
    if (!newKeywords.trim()) { toast.error("Informe pelo menos uma palavra-chave"); return; }
    if (newSequence.length === 0) { toast.error("Adicione pelo menos um item à sequência"); return; }
    const rule: WelcomeRule = {
      id: Date.now().toString(),
      name: newName.trim(),
      keywords: newKeywords.split(",").map(k => k.trim()).filter(Boolean),
      active: true,
      conexaoId: newConexao,
      sequence: newSequence,
    };
    setRules([...rules, rule]);
    setNewName(""); setNewKeywords(""); setNewConexao(CONEXOES[0].id); setNewSequence([]);
    setShowNewForm(false);
    toast.success(`Regra "${rule.name}" criada`);
  };

  const iaPreviewMessages: Record<string, string> = {
    comercial: "Olá! 👋 Sou a IA Comercial. Vi que você demonstrou interesse. Posso ajudá-lo a encontrar a solução ideal.",
    financeiro: "Boa tarde. Sou o assistente financeiro. Posso ajudar com faturas, prazos ou pagamento.",
    suporte: "Olá! Sou o assistente de suporte. Descreva o problema e vou buscar a solução mais rápida.",
  };

  const activeCount = rules.filter(r => r.active).length;

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* ─── Header ─── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Recepção Automática</h1>
            <p className="text-muted-foreground mt-1">Configure respostas automáticas com base no assunto da mensagem recebida</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setGlobalActive(!globalActive)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border",
                globalActive ? "bg-primary/10 text-primary border-primary/20" : "bg-muted text-muted-foreground border-border"
              )}
            >
              {globalActive ? <Power className="w-4 h-4" /> : <PowerOff className="w-4 h-4" />}
              {globalActive ? "Ativo" : "Desativado"}
            </button>
          </div>
        </div>

        {!globalActive ? (
          <div className="glass-card rounded-xl p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <PowerOff className="w-7 h-7 text-muted-foreground" />
            </div>
            <h3 className="text-base font-semibold text-foreground mb-1">Recepção desativada</h3>
            <p className="text-sm text-muted-foreground max-w-md">Ative para enviar respostas automáticas quando novos contatos chegarem.</p>
          </div>
        ) : (
          <>
            {/* ─── Stats Row ─── */}
            <div className="grid grid-cols-3 gap-4">
              <div className="glass-card rounded-xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-lg font-bold text-foreground">{rules.length}</p>
                  <p className="text-xs text-muted-foreground">Regras criadas</p>
                </div>
              </div>
              <div className="glass-card rounded-xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-lg font-bold text-foreground">{activeCount}</p>
                  <p className="text-xs text-muted-foreground">Ativas</p>
                </div>
              </div>
              <div className="glass-card rounded-xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                  <EyeOff className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-lg font-bold text-foreground">{rules.length - activeCount}</p>
                  <p className="text-xs text-muted-foreground">Inativas</p>
                </div>
              </div>
            </div>

            {/* ─── New Rule Button ─── */}
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground">Mensagens de Boas-vindas</h2>
              <button
                onClick={() => { setShowNewForm(!showNewForm); setNewName(""); setNewKeywords(""); setNewSequence([]); }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-all"
              >
                <Plus className="w-4 h-4" />
                Nova Regra
              </button>
            </div>

            {/* ─── New Rule Form ─── */}
            {showNewForm && (
              <div className="glass-card rounded-xl p-6 space-y-5 border-2 border-primary/20">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Plus className="w-4 h-4 text-primary" /> Criar Nova Regra
                  </h3>
                  <button onClick={() => setShowNewForm(false)} className="p-1 rounded-lg hover:bg-muted"><X className="w-4 h-4 text-muted-foreground" /></button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {/* Left: config */}
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground">Nome da regra</label>
                      <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Ex: Saudação Geral, Consulta de Auxílio..." className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground">Palavras-chave (separadas por vírgula)</label>
                      <input value={newKeywords} onChange={e => setNewKeywords(e.target.value)} placeholder="Ex: olá, bom dia, oi, tudo bem" className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                      <p className="text-[10px] text-muted-foreground">Quando a mensagem do cliente contiver uma dessas palavras, esta regra será acionada.</p>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground">Conexão de envio</label>
                      <div className="grid grid-cols-2 gap-2">
                        {CONEXOES.map(c => (
                          <button key={c.id} onClick={() => setNewConexao(c.id)} className={cn("flex items-center gap-2 p-2.5 rounded-xl border transition-all text-left", newConexao === c.id ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:bg-muted/60")}>
                            <Smartphone className={cn("w-4 h-4", newConexao === c.id ? "text-primary" : "text-muted-foreground")} />
                            <div>
                              <span className={cn("text-xs font-medium block", newConexao === c.id ? "text-primary" : "text-foreground")}>{c.name}</span>
                              <span className="text-[10px] text-muted-foreground">{c.number}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right: sequence */}
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">Sequência de respostas</label>
                    <SequenceBuilder items={newSequence} onUpdate={setNewSequence} />
                  </div>
                </div>

                <div className="flex gap-3 justify-end pt-2 border-t border-border">
                  <button onClick={() => setShowNewForm(false)} className="px-4 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted transition-colors">Cancelar</button>
                  <button onClick={createRule} className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                    <Plus className="w-4 h-4" /> Criar Regra
                  </button>
                </div>
              </div>
            )}

            {/* ─── Rules List ─── */}
            <div className="space-y-3">
              {rules.map(rule => {
                const isEditing = editingId === rule.id;
                const conexao = CONEXOES.find(c => c.id === rule.conexaoId);
                return (
                  <div key={rule.id} className={cn("glass-card rounded-xl overflow-hidden transition-all", isEditing && "ring-1 ring-primary/30")}>
                    {/* Header row */}
                    <div className="flex items-center gap-4 p-5">
                      {/* Toggle */}
                      <button onClick={() => toggleRule(rule.id)} className="flex-shrink-0">
                        {rule.active ? (
                          <ToggleRight className="w-7 h-7 text-primary" />
                        ) : (
                          <ToggleLeft className="w-7 h-7 text-muted-foreground" />
                        )}
                      </button>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={cn("text-sm font-bold", rule.active ? "text-foreground" : "text-muted-foreground")}>{rule.name}</h3>
                          <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md", rule.active ? "bg-emerald-500/10 text-emerald-600" : "bg-muted text-muted-foreground")}>
                            {rule.active ? "Ativa" : "Inativa"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          {rule.keywords.map(kw => (
                            <span key={kw} className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-primary/5 text-primary border border-primary/10">{kw}</span>
                          ))}
                        </div>
                      </div>

                      {/* Sequence preview badges */}
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {rule.sequence.map((s, i) => {
                          const SIcon = getContentIcon(s.type);
                          return (
                            <div key={i} className="w-7 h-7 rounded-lg bg-muted/80 flex items-center justify-center" title={getContentLabel(s.type)}>
                              <SIcon className="w-3.5 h-3.5 text-muted-foreground" />
                            </div>
                          );
                        })}
                        <span className="text-[10px] text-muted-foreground ml-1">
                          {rule.sequence.length} {rule.sequence.length === 1 ? "msg" : "msgs"}
                        </span>
                      </div>

                      {/* Conexão */}
                      <div className="flex items-center gap-1.5 flex-shrink-0 px-2.5 py-1 rounded-lg bg-muted/50 border border-border">
                        <Smartphone className="w-3 h-3 text-muted-foreground" />
                        <span className="text-[10px] font-medium text-muted-foreground">{conexao?.name}</span>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button onClick={() => setEditingId(isEditing ? null : rule.id)} className={cn("p-2 rounded-lg transition-colors", isEditing ? "bg-primary/10 text-primary" : "hover:bg-muted text-muted-foreground")} title="Editar sequência">
                          {isEditing ? <EyeOff className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                        </button>
                        <button onClick={() => duplicateRule(rule.id)} className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors" title="Duplicar">
                          <Copy className="w-4 h-4" />
                        </button>
                        <button onClick={() => deleteRule(rule.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors" title="Excluir">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Expanded sequence editor */}
                    {isEditing && (
                      <div className="border-t border-border p-5 bg-muted/[0.03]">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                          <div className="space-y-3">
                            <label className="text-xs font-medium text-muted-foreground">Palavras-chave</label>
                            <div className="flex flex-wrap gap-1.5">
                              {rule.keywords.map(kw => (
                                <span key={kw} className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-primary/5 text-primary border border-primary/10">{kw}</span>
                              ))}
                            </div>
                            <p className="text-[10px] text-muted-foreground">
                              Variáveis: <code className="bg-muted px-1 py-0.5 rounded text-primary text-[10px]">{"{{nome}}"}</code>{" "}
                              <code className="bg-muted px-1 py-0.5 rounded text-primary text-[10px]">{"{{numero}}"}</code>
                            </p>
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-medium text-muted-foreground">Sequência de respostas</label>
                            <SequenceBuilder items={rule.sequence} onUpdate={(seq) => updateRuleSequence(rule.id, seq)} />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {rules.length === 0 && (
                <div className="glass-card rounded-xl p-12 flex flex-col items-center justify-center text-center">
                  <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-3">
                    <MessageSquarePlus className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground mb-1">Nenhuma regra criada</h3>
                  <p className="text-xs text-muted-foreground max-w-sm">Crie regras de boas-vindas para responder automaticamente seus contatos.</p>
                </div>
              )}
            </div>

            {/* ─── IA de Recepção (PRO) ─── */}
            <ProGate title="IA de Recepção Inteligente" description="IA que entende a necessidade do cliente. Disponível no Plano Pro.">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Brain className="w-4 h-4 text-primary" />
                    <h3 className="text-sm font-semibold text-foreground">IA de Recepção</h3>
                    <ProBadge />
                  </div>
                  <button onClick={() => setIaActive(!iaActive)} className={cn("flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full transition-colors", iaActive ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground")}>
                    {iaActive ? <Power className="w-3 h-3" /> : <PowerOff className="w-3 h-3" />}
                    {iaActive ? "Ativo" : "Inativo"}
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {([{ value: "comercial" as const, label: "Comercial" }, { value: "financeiro" as const, label: "Financeiro" }, { value: "suporte" as const, label: "Suporte" }]).map(s => (
                    <button key={s.value} onClick={() => setIaSetor(s.value)} className={cn("p-2.5 rounded-xl border text-center transition-all", iaSetor === s.value ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:bg-muted/60")}>
                      <span className={cn("text-xs font-medium", iaSetor === s.value ? "text-primary" : "text-muted-foreground")}>{s.label}</span>
                    </button>
                  ))}
                </div>
                {iaActive && (
                  <div className="bg-muted/30 rounded-lg p-3 border border-border/50">
                    <div className="flex items-center gap-1.5 mb-1.5"><Sparkles className="w-3 h-3 text-primary" /><span className="text-[10px] font-medium text-foreground">Preview ({iaSetor})</span></div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed">{iaPreviewMessages[iaSetor]}</p>
                  </div>
                )}
              </div>
            </ProGate>

            {/* ─── Save ─── */}
            <div className="flex justify-end">
              <button onClick={() => toast.success("Configuração salva com sucesso")} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all shadow-sm hover:shadow-md">
                <Save className="w-4 h-4" />
                Salvar Configuração
              </button>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
};

export default DisparoRecepcao;
