import { AppLayout } from "@/components/AppLayout";
import { useState } from "react";
import {
  Megaphone, Plus, Clock, CheckCircle2, X, Type, Mic, Image, Users, Tag, Send, Smartphone,
  CalendarDays, Trash2, FileText, File, ChevronUp, ChevronDown, Timer, GripVertical,
  AlertCircle, History, UserRoundPen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { getTagStore } from "@/lib/tagStore";
import ContactSelector from "@/components/disparos/ContactSelector";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// ─── Types ───
type ContentType = "texto" | "audio" | "imagem" | "pdf" | "word";
type TabType = "novo-disparo" | "historico";

interface SequenceItem {
  id: string;
  type: ContentType;
  content: string; // text body, file name, etc.
  delaySeconds: number; // delay BEFORE this item is sent (0 for the first)
}

interface HistoricoItem {
  id: string;
  title: string;
  sequence: { type: ContentType; content: string }[];
  date: string;
  time: string;
  target: string;
  conexao: string;
  status: "agendado" | "enviando" | "enviado" | "falha";
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
  { value: 3, label: "3 segundos" },
  { value: 5, label: "5 segundos" },
  { value: 10, label: "10 segundos" },
  { value: 15, label: "15 segundos" },
  { value: 30, label: "30 segundos" },
  { value: 60, label: "1 minuto" },
  { value: 120, label: "2 minutos" },
  { value: 300, label: "5 minutos" },
];

const statusConfig: Record<string, { icon: typeof CheckCircle2; label: string; class: string }> = {
  agendado: { icon: Clock, label: "Agendado", class: "text-chart-4 bg-chart-4/10" },
  enviando: { icon: Send, label: "Enviando", class: "text-blue-500 bg-blue-500/10" },
  enviado: { icon: CheckCircle2, label: "Enviado", class: "text-primary bg-primary/10" },
  falha: { icon: AlertCircle, label: "Falha", class: "text-destructive bg-destructive/10" },
};

const INITIAL_HISTORICO: HistoricoItem[] = [
  {
    id: "h1", title: "Promoção Black Friday", date: "22/02/2026", time: "09:00", target: "Todos os contatos", conexao: "Comercial 1", status: "enviado",
    sequence: [{ type: "texto", content: "Aproveite 50% de desconto em todos os planos!" }, { type: "imagem", content: "promo-blackfriday.jpg" }],
  },
  {
    id: "h2", title: "Boas-vindas novos leads", date: "24/02/2026", time: "10:00", target: "Lead Quente", conexao: "Comercial 1", status: "agendado",
    sequence: [{ type: "texto", content: "Olá! Seja bem-vindo(a) à nossa empresa." }, { type: "audio", content: "boas-vindas.mp3" }],
  },
  {
    id: "h3", title: "Catálogo de produtos", date: "25/02/2026", time: "14:00", target: "Cliente VIP", conexao: "Suporte", status: "agendado",
    sequence: [{ type: "texto", content: "Segue nosso catálogo atualizado." }, { type: "pdf", content: "catalogo-2026.pdf" }],
  },
  {
    id: "h4", title: "Reativação de clientes", date: "20/02/2026", time: "11:00", target: "Lead Frio", conexao: "Comercial 1", status: "falha",
    sequence: [{ type: "texto", content: "Sentimos sua falta! Temos novidades para você." }],
  },
];

// ─── Component ───
const Disparos = () => {
  const [tab, setTab] = useState<TabType>("novo-disparo");

  // ── New dispatch form state ──
  const [title, setTitle] = useState("");
  const [selectedConexao, setSelectedConexao] = useState(CONEXOES[0].id);
  const [targetType, setTargetType] = useState<"tags" | "manual">("tags");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>([]);
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState("09:00");
  const [sequence, setSequence] = useState<SequenceItem[]>([]);

  // Adding item state
  const [addingType, setAddingType] = useState<ContentType | null>(null);
  const [addingContent, setAddingContent] = useState("");

  // ── Historico state ──
  const [historico, setHistorico] = useState<HistoricoItem[]>(INITIAL_HISTORICO);
  const [filterStatus, setFilterStatus] = useState<"all" | string>("all");

  // ── Sequence operations ──
  const addToSequence = () => {
    if (!addingType) return;
    const content = addingType === "texto" ? addingContent.trim() : (addingContent.trim() || `arquivo-${Date.now()}.${addingType}`);
    if (addingType === "texto" && !content) return;
    const newItem: SequenceItem = {
      id: Date.now().toString(),
      type: addingType,
      content,
      delaySeconds: sequence.length === 0 ? 0 : 5,
    };
    setSequence([...sequence, newItem]);
    setAddingType(null);
    setAddingContent("");
  };

  const removeFromSequence = (id: string) => {
    setSequence(prev => {
      const updated = prev.filter(s => s.id !== id);
      if (updated.length > 0) updated[0] = { ...updated[0], delaySeconds: 0 };
      return updated;
    });
  };

  const moveItem = (index: number, direction: "up" | "down") => {
    const newSeq = [...sequence];
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newSeq.length) return;
    [newSeq[index], newSeq[targetIdx]] = [newSeq[targetIdx], newSeq[index]];
    // First item always has delay 0
    newSeq[0] = { ...newSeq[0], delaySeconds: 0 };
    setSequence(newSeq);
  };

  const updateDelay = (id: string, delay: number) => {
    setSequence(prev => prev.map(s => s.id === id ? { ...s, delaySeconds: delay } : s));
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const resetForm = () => {
    setTitle(""); setSelectedConexao(CONEXOES[0].id); setTargetType("todos");
    setSelectedTags([]); setDate(undefined); setTime("09:00"); setSequence([]);
    setAddingType(null); setAddingContent("");
  };

  const handleCreateDisparo = () => {
    if (!title.trim()) { toast.error("Informe o título do disparo"); return; }
    if (sequence.length === 0) { toast.error("Adicione pelo menos um item à sequência"); return; }
    if (!date) { toast.error("Selecione a data de envio"); return; }

    const newHistorico: HistoricoItem = {
      id: Date.now().toString(),
      title: title.trim(),
      sequence: sequence.map(s => ({ type: s.type, content: s.content })),
      date: format(date, "dd/MM/yyyy"),
      time,
      target: targetType === "todos" ? "Todos os contatos" : selectedTags.join(", "),
      conexao: CONEXOES.find(c => c.id === selectedConexao)?.name || "",
      status: "agendado",
    };
    setHistorico([newHistorico, ...historico]);
    resetForm();
    toast.success(`Disparo "${newHistorico.title}" agendado com ${sequence.length} ${sequence.length === 1 ? "mensagem" : "mensagens"} na sequência`);
    setTab("historico");
  };

  const removeHistorico = (id: string) => setHistorico(historico.filter(h => h.id !== id));

  const filteredHistorico = filterStatus === "all" ? historico : historico.filter(h => h.status === filterStatus);

  const getContentIcon = (type: ContentType) => {
    const opt = CONTENT_OPTIONS.find(o => o.value === type);
    return opt ? opt.icon : Type;
  };

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Disparos</h1>
            <p className="text-muted-foreground mt-1">Programe envios com sequência de mensagens</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-xl w-fit">
          {([
            { key: "novo-disparo" as TabType, label: "Novo Disparo", icon: Plus },
            { key: "historico" as TabType, label: "Agendamentos", icon: History },
          ]).map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} className={cn("flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all", tab === t.key ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}>
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          ))}
        </div>

        {/* ═══════════════════════════════════════════ */}
        {/* TAB: NOVO DISPARO                          */}
        {/* ═══════════════════════════════════════════ */}
        {tab === "novo-disparo" && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Left: form (3 cols) */}
            <div className="lg:col-span-3 space-y-5">
              {/* Title */}
              <div className="glass-card rounded-xl p-5 space-y-4">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Megaphone className="w-4 h-4 text-primary" /> Configuração do Disparo
                </h3>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Título</label>
                  <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Ex: Promoção de Natal" className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all" />
                </div>

                {/* Conexão */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Conexão de envio</label>
                  <div className="grid grid-cols-2 gap-2">
                    {CONEXOES.map(c => (
                      <button key={c.id} onClick={() => setSelectedConexao(c.id)} className={cn("flex items-center gap-2 p-2.5 rounded-xl border transition-all text-left", selectedConexao === c.id ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:bg-muted/60")}>
                        <Smartphone className={cn("w-4 h-4", selectedConexao === c.id ? "text-primary" : "text-muted-foreground")} />
                        <div>
                          <span className={cn("text-xs font-medium block", selectedConexao === c.id ? "text-primary" : "text-foreground")}>{c.name}</span>
                          <span className="text-[10px] text-muted-foreground">{c.number}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Data de envio</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <button className={cn("w-full flex items-center gap-2 bg-muted/50 border border-border rounded-lg px-3 py-2.5 text-sm text-left transition-all", !date ? "text-muted-foreground/50" : "text-foreground")}>
                          <CalendarDays className="w-4 h-4 text-muted-foreground" />
                          {date ? format(date, "dd/MM/yyyy") : "Selecionar"}
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={date} onSelect={setDate} disabled={d => d < new Date()} initialFocus className="p-3 pointer-events-auto" />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Horário</label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input type="time" value={time} onChange={e => setTime(e.target.value)} className="w-full bg-muted/50 border border-border rounded-lg pl-9 pr-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                    </div>
                  </div>
                </div>

                {/* Destinatários */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Destinatários</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => { setTargetType("todos"); setSelectedTags([]); }} className={cn("flex items-center gap-2 p-2.5 rounded-xl border transition-all", targetType === "todos" ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:bg-muted/60")}>
                      <Users className={cn("w-4 h-4", targetType === "todos" ? "text-primary" : "text-muted-foreground")} />
                      <span className={cn("text-xs font-medium", targetType === "todos" ? "text-primary" : "text-muted-foreground")}>Todos</span>
                    </button>
                    <button onClick={() => setTargetType("tags")} className={cn("flex items-center gap-2 p-2.5 rounded-xl border transition-all", targetType === "tags" ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:bg-muted/60")}>
                      <Tag className={cn("w-4 h-4", targetType === "tags" ? "text-primary" : "text-muted-foreground")} />
                      <span className={cn("text-xs font-medium", targetType === "tags" ? "text-primary" : "text-muted-foreground")}>Por tags</span>
                    </button>
                  </div>
                  {targetType === "tags" && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {getTagStore().map(tagItem => (
                        <button key={tagItem.name} onClick={() => toggleTag(tagItem.name)} className={cn("text-[10px] font-medium px-2.5 py-1 rounded-full border transition-colors", selectedTags.includes(tagItem.name) ? "text-white border-transparent" : "bg-muted text-muted-foreground border-border hover:border-primary/20")} style={selectedTags.includes(tagItem.name) ? { backgroundColor: tagItem.color } : {}}>
                          {tagItem.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Add content buttons */}
              <div className="glass-card rounded-xl p-5 space-y-4">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Plus className="w-4 h-4 text-primary" /> Adicionar à Sequência
                </h3>
                <div className="grid grid-cols-5 gap-2">
                  {CONTENT_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => { setAddingType(opt.value); setAddingContent(""); }}
                      className={cn(
                        "flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all",
                        addingType === opt.value ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:bg-muted/50 hover:border-primary/20"
                      )}
                    >
                      <opt.icon className={cn("w-5 h-5", addingType === opt.value ? "text-primary" : "text-muted-foreground")} />
                      <span className={cn("text-[11px] font-medium", addingType === opt.value ? "text-primary" : "text-muted-foreground")}>{opt.label}</span>
                    </button>
                  ))}
                </div>

                {/* Input for selected type */}
                {addingType && (
                  <div className="space-y-3 pt-2 border-t border-border">
                    {addingType === "texto" ? (
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-muted-foreground">Mensagem de texto</label>
                        <textarea
                          value={addingContent}
                          onChange={e => setAddingContent(e.target.value)}
                          placeholder="Digite a mensagem..."
                          rows={3}
                          className="w-full bg-muted/50 border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                          autoFocus
                        />
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-muted-foreground">{CONTENT_OPTIONS.find(o => o.value === addingType)?.label}</label>
                        <button className="w-full flex flex-col items-center gap-2 py-6 border-2 border-dashed border-border rounded-lg hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer">
                          {(() => { const Icon = getContentIcon(addingType); return <Icon className="w-7 h-7 text-muted-foreground" />; })()}
                          <p className="text-sm font-medium text-foreground">Clique para enviar</p>
                          <p className="text-xs text-muted-foreground">{CONTENT_OPTIONS.find(o => o.value === addingType)?.hint}</p>
                        </button>
                      </div>
                    )}
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => { setAddingType(null); setAddingContent(""); }} className="px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:bg-muted transition-colors">Cancelar</button>
                      <button onClick={addToSequence} className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors">
                        Adicionar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right: sequence preview (2 cols) */}
            <div className="lg:col-span-2 space-y-4">
              <div className="glass-card rounded-xl p-5 space-y-4 sticky top-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Send className="w-4 h-4 text-primary" /> Sequência de Envio
                  </h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-primary/10 text-primary">
                    {sequence.length} {sequence.length === 1 ? "item" : "itens"}
                  </span>
                </div>

                {sequence.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <div className="w-12 h-12 rounded-xl bg-muted/80 flex items-center justify-center mb-3">
                      <GripVertical className="w-5 h-5 text-muted-foreground/50" />
                    </div>
                    <p className="text-xs text-muted-foreground">Adicione itens à sequência usando os botões ao lado</p>
                  </div>
                ) : (
                  <div className="space-y-0">
                    {sequence.map((item, index) => {
                      const Icon = getContentIcon(item.type);
                      const opt = CONTENT_OPTIONS.find(o => o.value === item.type);
                      return (
                        <div key={item.id}>
                          {/* Delay indicator between items */}
                          {index > 0 && (
                            <div className="flex items-center gap-2 py-1.5 pl-5">
                              <div className="w-px h-4 bg-border" />
                              <div className="flex items-center gap-1.5">
                                <Timer className="w-3 h-3 text-muted-foreground" />
                                <select
                                  value={item.delaySeconds}
                                  onChange={e => updateDelay(item.id, Number(e.target.value))}
                                  className="text-[10px] font-medium bg-muted/50 border border-border rounded-md px-1.5 py-0.5 text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/20"
                                >
                                  {DELAY_OPTIONS.map(d => (
                                    <option key={d.value} value={d.value}>{d.label}</option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          )}

                          {/* Item card */}
                          <div className="group flex items-start gap-2 p-3 rounded-xl border border-border bg-background hover:border-primary/20 transition-all">
                            {/* Order number */}
                            <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-[10px] font-bold text-primary">{index + 1}</span>
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 mb-0.5">
                                <Icon className="w-3.5 h-3.5 text-primary" />
                                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">{opt?.label}</span>
                              </div>
                              <p className="text-xs text-muted-foreground line-clamp-2">{item.content}</p>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => moveItem(index, "up")}
                                disabled={index === 0}
                                className="p-1 rounded hover:bg-muted disabled:opacity-30 transition-colors"
                              >
                                <ChevronUp className="w-3 h-3 text-muted-foreground" />
                              </button>
                              <button
                                onClick={() => moveItem(index, "down")}
                                disabled={index === sequence.length - 1}
                                className="p-1 rounded hover:bg-muted disabled:opacity-30 transition-colors"
                              >
                                <ChevronDown className="w-3 h-3 text-muted-foreground" />
                              </button>
                              <button
                                onClick={() => removeFromSequence(item.id)}
                                className="p-1 rounded hover:bg-destructive/10 transition-colors"
                              >
                                <Trash2 className="w-3 h-3 text-destructive" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Submit button */}
                <button
                  onClick={handleCreateDisparo}
                  disabled={sequence.length === 0 || !title.trim() || !date}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <Send className="w-4 h-4" />
                  Agendar Disparo
                </button>

                {(!title.trim() || sequence.length === 0 || !date) && (
                  <p className="text-[10px] text-muted-foreground text-center">
                    {!title.trim() ? "Informe o título • " : ""}
                    {sequence.length === 0 ? "Adicione itens • " : ""}
                    {!date ? "Selecione a data" : ""}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════ */}
        {/* TAB: HISTÓRICO / AGENDAMENTOS              */}
        {/* ═══════════════════════════════════════════ */}
        {tab === "historico" && (
          <div className="space-y-4">
            {/* Status filters */}
            <div className="flex items-center gap-2">
              {[
                { key: "all", label: "Todos" },
                { key: "agendado", label: "Agendados" },
                { key: "enviando", label: "Enviando" },
                { key: "enviado", label: "Enviados" },
                { key: "falha", label: "Falhas" },
              ].map(f => (
                <button
                  key={f.key}
                  onClick={() => setFilterStatus(f.key)}
                  className={cn(
                    "px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all border",
                    filterStatus === f.key
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-muted/50 text-muted-foreground border-border hover:border-primary/30"
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {filteredHistorico.length === 0 ? (
              <div className="glass-card rounded-xl p-12 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                  <History className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Nenhum agendamento</h3>
                <p className="text-sm text-muted-foreground max-w-md">Os disparos programados aparecerão aqui como histórico.</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {filteredHistorico.map(item => {
                  const st = statusConfig[item.status] || statusConfig.agendado;
                  const StIcon = st.icon;
                  return (
                    <div key={item.id} className="glass-card rounded-xl p-5 hover:shadow-md transition-all group">
                      <div className="flex items-start gap-4">
                        {/* Icon */}
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Megaphone className="w-5 h-5 text-primary" />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-sm font-bold text-foreground">{item.title}</h3>
                            <span className={cn("inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md", st.class)}>
                              <StIcon className="w-3 h-3" />{st.label}
                            </span>
                          </div>

                          {/* Sequence preview */}
                          <div className="flex items-center gap-1.5 mb-2">
                            {item.sequence.map((s, i) => {
                              const SIcon = getContentIcon(s.type);
                              return (
                                <span key={i} className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
                                  <SIcon className="w-3 h-3" />
                                  {CONTENT_OPTIONS.find(o => o.value === s.type)?.label}
                                </span>
                              );
                            })}
                            <span className="text-[10px] text-muted-foreground">
                              ({item.sequence.length} {item.sequence.length === 1 ? "mensagem" : "mensagens"})
                            </span>
                          </div>

                          <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                            <span className="flex items-center gap-1"><CalendarDays className="w-3 h-3" />{item.date}</span>
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{item.time}</span>
                            <span className="flex items-center gap-1"><Users className="w-3 h-3" />{item.target}</span>
                            <span className="flex items-center gap-1"><Smartphone className="w-3 h-3" />{item.conexao}</span>
                          </div>
                        </div>

                        {/* Delete */}
                        {item.status === "agendado" && (
                          <button onClick={() => removeHistorico(item.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Disparos;
