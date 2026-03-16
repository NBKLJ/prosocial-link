import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import {
  MessageSquarePlus, Save, Mic, Type, Upload, Plus, X, Megaphone, Smartphone,
  Brain, Sparkles, Image, ChevronDown, ChevronUp, Trash2, Timer, GripVertical,
  Power, PowerOff, FileText, File,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ProGate } from "@/components/ui/ProGate";
import { ProBadge } from "@/components/ui/ProBadge";

// ─── Types ───
type ContentType = "texto" | "audio" | "imagem" | "pdf" | "word";

interface WelcomeItem {
  id: string;
  type: ContentType;
  content: string;
  delaySeconds: number;
}

interface AdRule {
  id: string;
  keyword: string;
  welcomeSequence: WelcomeItem[];
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
];

const getIcon = (type: ContentType) => CONTENT_OPTIONS.find(o => o.value === type)?.icon || Type;

// ─── Sequence Builder (reusable) ───
function SequenceBuilder({
  items,
  onUpdate,
  compact = false,
}: {
  items: WelcomeItem[];
  onUpdate: (items: WelcomeItem[]) => void;
  compact?: boolean;
}) {
  const [addingType, setAddingType] = useState<ContentType | null>(null);
  const [addingContent, setAddingContent] = useState("");

  const addItem = () => {
    if (!addingType) return;
    const content = addingType === "texto" ? addingContent.trim() : (addingContent.trim() || `arquivo.${addingType === "audio" ? "mp3" : addingType === "imagem" ? "jpg" : addingType}`);
    if (addingType === "texto" && !content) return;
    const newItem: WelcomeItem = { id: Date.now().toString(), type: addingType, content, delaySeconds: items.length === 0 ? 0 : 3 };
    onUpdate([...items, newItem]);
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
      {/* Content type buttons */}
      <div className={cn("grid gap-1.5", compact ? "grid-cols-5" : "grid-cols-5")}>
        {CONTENT_OPTIONS.map(opt => (
          <button
            key={opt.value}
            onClick={() => { setAddingType(opt.value); setAddingContent(""); }}
            className={cn(
              "flex flex-col items-center gap-1 p-2.5 rounded-lg border transition-all",
              addingType === opt.value ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:bg-muted/50 hover:border-primary/20"
            )}
          >
            <opt.icon className={cn("w-4 h-4", addingType === opt.value ? "text-primary" : "text-muted-foreground")} />
            <span className={cn("text-[10px] font-medium", addingType === opt.value ? "text-primary" : "text-muted-foreground")}>{opt.label}</span>
          </button>
        ))}
      </div>

      {/* Add form */}
      {addingType && (
        <div className="space-y-2 p-3 rounded-lg border border-primary/20 bg-primary/[0.02]">
          {addingType === "texto" ? (
            <textarea
              value={addingContent}
              onChange={e => setAddingContent(e.target.value)}
              placeholder="Digite a mensagem..."
              rows={2}
              className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
              autoFocus
            />
          ) : (
            <button className="w-full flex items-center gap-2 py-4 border-2 border-dashed border-border rounded-lg hover:border-primary/30 hover:bg-primary/5 transition-all justify-center cursor-pointer">
              <Upload className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Enviar {CONTENT_OPTIONS.find(o => o.value === addingType)?.label} • {CONTENT_OPTIONS.find(o => o.value === addingType)?.hint}</span>
            </button>
          )}
          <div className="flex gap-2 justify-end">
            <button onClick={() => { setAddingType(null); setAddingContent(""); }} className="px-2.5 py-1 rounded-md text-xs text-muted-foreground hover:bg-muted transition-colors">Cancelar</button>
            <button onClick={addItem} className="px-3 py-1 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors">Adicionar</button>
          </div>
        </div>
      )}

      {/* Sequence list */}
      {items.length > 0 && (
        <div className="space-y-0">
          {items.map((item, index) => {
            const Icon = getIcon(item.type);
            return (
              <div key={item.id}>
                {/* Delay between items */}
                {index > 0 && (
                  <div className="flex items-center gap-2 py-1 pl-4">
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
      )}

      {items.length === 0 && !addingType && (
        <div className="flex items-center gap-2 py-4 justify-center text-muted-foreground/50">
          <GripVertical className="w-4 h-4" />
          <span className="text-xs">Clique acima para adicionar conteúdo</span>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───
const DisparoRecepcao = () => {
  const [active, setActive] = useState(true);
  const [selectedConexao, setSelectedConexao] = useState(CONEXOES[0].id);

  // Welcome sequence (replaces the old single text/audio)
  const [welcomeSequence, setWelcomeSequence] = useState<WelcomeItem[]>([
    { id: "w1", type: "texto", content: "Olá! Obrigado por entrar em contato. Em breve um de nossos atendentes irá te responder. 😊", delaySeconds: 0 },
  ]);

  // Ad rules
  const [adRules, setAdRules] = useState<AdRule[]>([
    { id: "1", keyword: "promo", welcomeSequence: [{ id: "ar1", type: "texto", content: "Obrigado pelo interesse na promoção! Um consultor entrará em contato.", delaySeconds: 0 }] },
  ]);
  const [showAdForm, setShowAdForm] = useState(false);
  const [adKeyword, setAdKeyword] = useState("");
  const [adSequence, setAdSequence] = useState<WelcomeItem[]>([]);
  const [expandedRule, setExpandedRule] = useState<string | null>(null);

  // IA state
  const [iaActive, setIaActive] = useState(false);
  const [iaSetor, setIaSetor] = useState<"comercial" | "financeiro" | "suporte">("comercial");

  const addAdRule = () => {
    if (!adKeyword.trim()) return;
    if (adSequence.length === 0) { toast.error("Adicione pelo menos uma mensagem"); return; }
    setAdRules([...adRules, { id: Date.now().toString(), keyword: adKeyword.trim(), welcomeSequence: adSequence }]);
    setAdKeyword(""); setAdSequence([]); setShowAdForm(false);
    toast.success("Regra adicionada");
  };

  const iaPreviewMessages: Record<string, string> = {
    comercial: "Olá! 👋 Sou a IA Comercial. Vi que você demonstrou interesse. Posso ajudá-lo a encontrar a solução ideal para seu negócio.",
    financeiro: "Boa tarde. Sou o assistente financeiro. Posso ajudar com informações sobre faturas, prazos ou negociação de pagamento.",
    suporte: "Olá! Sou o assistente de suporte. Descreva o problema que está enfrentando e vou buscar a solução mais rápida.",
  };

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in max-w-4xl">
        {/* ─── Header ─── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Recepção Automática</h1>
            <p className="text-muted-foreground mt-1">Resposta automática para novos atendimentos</p>
          </div>
          <button
            onClick={() => setActive(!active)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border",
              active
                ? "bg-primary/10 text-primary border-primary/20"
                : "bg-muted text-muted-foreground border-border"
            )}
          >
            {active ? <Power className="w-4 h-4" /> : <PowerOff className="w-4 h-4" />}
            {active ? "Ativo" : "Desativado"}
          </button>
        </div>

        {!active && (
          <div className="glass-card rounded-xl p-8 flex flex-col items-center justify-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-3">
              <PowerOff className="w-6 h-6 text-muted-foreground" />
            </div>
            <h3 className="text-sm font-semibold text-foreground mb-1">Recepção desativada</h3>
            <p className="text-xs text-muted-foreground max-w-sm">Ative para enviar respostas automáticas quando novos contatos chegarem.</p>
          </div>
        )}

        {active && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* ═══════════════════════════════ */}
            {/* LEFT COLUMN                     */}
            {/* ═══════════════════════════════ */}
            <div className="space-y-5">
              {/* ─── 1. Conexão ─── */}
              <div className="glass-card rounded-xl p-5 space-y-3">
                <div className="flex items-center gap-2 mb-1">
                  <Smartphone className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-semibold text-foreground">Conexão</h3>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {CONEXOES.map(c => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedConexao(c.id)}
                      className={cn(
                        "flex items-center gap-2.5 p-3 rounded-xl border transition-all text-left",
                        selectedConexao === c.id ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:bg-muted/60"
                      )}
                    >
                      <Smartphone className={cn("w-4 h-4", selectedConexao === c.id ? "text-primary" : "text-muted-foreground")} />
                      <div>
                        <span className={cn("text-xs font-semibold block", selectedConexao === c.id ? "text-primary" : "text-foreground")}>{c.name}</span>
                        <span className="text-[10px] text-muted-foreground">{c.number}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* ─── 2. Mensagem de Boas-vindas ─── */}
              <div className="glass-card rounded-xl p-5 space-y-3">
                <div className="flex items-center gap-2 mb-1">
                  <MessageSquarePlus className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-semibold text-foreground">Mensagem de Boas-vindas</h3>
                </div>
                <p className="text-xs text-muted-foreground -mt-1">
                  Monte a sequência de conteúdos enviados automaticamente. Combine texto, áudio, imagem e documentos.
                </p>

                <SequenceBuilder items={welcomeSequence} onUpdate={setWelcomeSequence} />

                <div className="pt-2 border-t border-border">
                  <p className="text-[10px] text-muted-foreground">
                    Variáveis: <code className="bg-muted px-1 py-0.5 rounded text-primary text-[10px]">{"{{nome}}"}</code>{" "}
                    <code className="bg-muted px-1 py-0.5 rounded text-primary text-[10px]">{"{{numero}}"}</code>
                  </p>
                </div>
              </div>
            </div>

            {/* ═══════════════════════════════ */}
            {/* RIGHT COLUMN                    */}
            {/* ═══════════════════════════════ */}
            <div className="space-y-5">
              {/* ─── 3. Respostas por Anúncio ─── */}
              <div className="glass-card rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Megaphone className="w-4 h-4 text-primary" />
                    <h3 className="text-sm font-semibold text-foreground">Respostas por Anúncio</h3>
                  </div>
                  <button
                    onClick={() => setShowAdForm(!showAdForm)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-[10px] font-semibold hover:bg-primary/15 transition-colors"
                  >
                    <Plus className="w-3 h-3" /> Nova regra
                  </button>
                </div>
                <p className="text-xs text-muted-foreground -mt-1">
                  Respostas específicas quando o contato chega via anúncio com palavra-chave.
                </p>

                {/* Existing rules */}
                <div className="space-y-2">
                  {adRules.map(rule => (
                    <div key={rule.id} className="border border-border rounded-xl overflow-hidden">
                      <div
                        className="flex items-center gap-3 p-3 cursor-pointer hover:bg-muted/30 transition-colors"
                        onClick={() => setExpandedRule(expandedRule === rule.id ? null : rule.id)}
                      >
                        <div className="w-7 h-7 rounded-lg bg-chart-4/10 flex items-center justify-center flex-shrink-0">
                          <Megaphone className="w-3.5 h-3.5 text-chart-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-foreground">Gatilho:</span>
                            <code className="bg-muted px-1.5 py-0.5 rounded text-primary text-[10px] font-mono">{rule.keyword}</code>
                          </div>
                          <span className="text-[10px] text-muted-foreground">{rule.welcomeSequence.length} {rule.welcomeSequence.length === 1 ? "mensagem" : "mensagens"} na sequência</span>
                        </div>
                        <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform", expandedRule === rule.id && "rotate-180")} />
                        <button onClick={(e) => { e.stopPropagation(); setAdRules(adRules.filter(r => r.id !== rule.id)); }} className="p-1 rounded hover:bg-destructive/10 transition-colors">
                          <X className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive" />
                        </button>
                      </div>
                      {expandedRule === rule.id && (
                        <div className="border-t border-border p-3 bg-muted/20">
                          {rule.welcomeSequence.map((item, i) => {
                            const Icon = getIcon(item.type);
                            return (
                              <div key={item.id} className="flex items-center gap-2 py-1">
                                <div className="w-4 h-4 rounded bg-primary/10 flex items-center justify-center"><span className="text-[8px] font-bold text-primary">{i + 1}</span></div>
                                <Icon className="w-3 h-3 text-primary" />
                                <span className="text-[11px] text-foreground truncate">{item.content}</span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Add rule form */}
                {showAdForm && (
                  <div className="border border-primary/20 rounded-xl p-4 space-y-3 bg-primary/[0.02]">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-foreground">Palavra-chave / Gatilho</label>
                      <input value={adKeyword} onChange={e => setAdKeyword(e.target.value)} placeholder="Ex: promo, desconto, oferta" className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-foreground">Sequência de resposta</label>
                      <SequenceBuilder items={adSequence} onUpdate={setAdSequence} compact />
                    </div>
                    <div className="flex gap-2 justify-end pt-1">
                      <button onClick={() => { setShowAdForm(false); setAdKeyword(""); setAdSequence([]); }} className="px-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:bg-muted transition-colors">Cancelar</button>
                      <button onClick={addAdRule} className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors">Adicionar</button>
                    </div>
                  </div>
                )}
              </div>

              {/* ─── 4. IA de Recepção (PRO) ─── */}
              <ProGate title="IA de Recepção Inteligente" description="IA que entende a necessidade do cliente. Disponível no Plano Pro.">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Brain className="w-4 h-4 text-primary" />
                      <h3 className="text-sm font-semibold text-foreground">IA de Recepção</h3>
                      <ProBadge />
                    </div>
                    <button onClick={() => setIaActive(!iaActive)} className={cn("flex items-center gap-2 text-[10px] font-semibold px-3 py-1.5 rounded-full transition-colors", iaActive ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground")}>
                      {iaActive ? <Power className="w-3 h-3" /> : <PowerOff className="w-3 h-3" />}
                      {iaActive ? "Ativo" : "Inativo"}
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {([
                      { value: "comercial" as const, label: "Comercial" },
                      { value: "financeiro" as const, label: "Financeiro" },
                      { value: "suporte" as const, label: "Suporte" },
                    ]).map(s => (
                      <button key={s.value} onClick={() => setIaSetor(s.value)} className={cn("p-2.5 rounded-xl border text-center transition-all", iaSetor === s.value ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:bg-muted/60")}>
                        <span className={cn("text-xs font-medium", iaSetor === s.value ? "text-primary" : "text-muted-foreground")}>{s.label}</span>
                      </button>
                    ))}
                  </div>

                  {iaActive && (
                    <div className="bg-muted/30 rounded-lg p-3 border border-border/50">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <Sparkles className="w-3 h-3 text-primary" />
                        <span className="text-[10px] font-medium text-foreground">Preview ({iaSetor})</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">{iaPreviewMessages[iaSetor]}</p>
                    </div>
                  )}
                </div>
              </ProGate>
            </div>
          </div>
        )}

        {/* ─── Save ─── */}
        {active && (
          <div className="flex justify-end">
            <button onClick={() => toast.success("Configuração salva com sucesso")} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all shadow-sm hover:shadow-md">
              <Save className="w-4 h-4" />
              Salvar Configuração
            </button>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default DisparoRecepcao;
