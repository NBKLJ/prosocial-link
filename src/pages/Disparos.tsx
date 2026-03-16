import { AppLayout } from "@/components/AppLayout";
import { useState } from "react";
import {
  Megaphone, Plus, Clock, CheckCircle2, AlertCircle, X, Type, Mic, Image, Users, Tag, Send, Smartphone,
  CalendarDays, Trash2, FileText, File,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { getTagStore } from "@/lib/tagStore";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type ContentType = "texto" | "audio" | "imagem" | "pdf" | "word";
type TabType = "disparos" | "agendamentos";

const CONEXOES = [
  { id: "1", name: "Comercial 1", number: "(11) 99999-1234" },
  { id: "2", name: "Suporte", number: "(21) 98888-5678" },
];

interface Disparo {
  id: string;
  title: string;
  type: string;
  contacts: number;
  status: string;
  date: string;
  conexao?: string;
}

interface Agendamento {
  id: string;
  title: string;
  contentTypes: ContentType[];
  date: string;
  time: string;
  target: string;
  status: "agendado" | "enviado";
}

const statusConfig: Record<string, { icon: typeof CheckCircle2; label: string; class: string }> = {
  enviado: { icon: CheckCircle2, label: "Enviado", class: "text-primary bg-primary/10" },
  agendado: { icon: Clock, label: "Agendado", class: "text-chart-4 bg-chart-4/10" },
  rascunho: { icon: AlertCircle, label: "Rascunho", class: "text-muted-foreground bg-muted" },
};

const contentTypeOptions: { value: ContentType; label: string; icon: typeof Type }[] = [
  { value: "texto", label: "Texto", icon: Type },
  { value: "audio", label: "Áudio", icon: Mic },
  { value: "imagem", label: "Imagem", icon: Image },
  { value: "pdf", label: "PDF", icon: FileText },
  { value: "word", label: "Word", icon: File },
];

const Disparos = () => {
  const [tab, setTab] = useState<TabType>("disparos");

  // === DISPAROS STATE ===
  const [disparos, setDisparos] = useState<Disparo[]>([
    { id: "1", title: "Promoção Black Friday", type: "Texto + Imagem", contacts: 450, status: "enviado", date: "22/02/2026" },
    { id: "2", title: "Boas-vindas novos leads", type: "Texto", contacts: 120, status: "agendado", date: "24/02/2026" },
    { id: "3", title: "Reativação de clientes", type: "Áudio", contacts: 85, status: "rascunho", date: "-" },
  ]);
  const [showDisparoModal, setShowDisparoModal] = useState(false);
  const [dTitle, setDTitle] = useState("");
  const [dContentTypes, setDContentTypes] = useState<ContentType[]>(["texto"]);
  const [dMessage, setDMessage] = useState("");
  const [dTargetType, setDTargetType] = useState<"todos" | "tags">("todos");
  const [dSelectedTags, setDSelectedTags] = useState<string[]>([]);
  const [dSelectedConexao, setDSelectedConexao] = useState(CONEXOES[0].id);

  // === AGENDAMENTOS STATE ===
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([
    { id: "1", title: "Promoção Black Friday", contentTypes: ["texto"], date: "25/02/2026", time: "09:00", target: "Todos os contatos", status: "agendado" },
    { id: "2", title: "Catálogo de produtos", contentTypes: ["pdf"], date: "26/02/2026", time: "14:00", target: "Lead Quente, Cliente VIP", status: "agendado" },
    { id: "3", title: "Áudio de boas-vindas", contentTypes: ["audio"], date: "22/02/2026", time: "10:00", target: "Lead Quente", status: "enviado" },
  ]);
  const [showAgendModal, setShowAgendModal] = useState(false);
  const [aTitle, setATitle] = useState("");
  const [aContentTypes, setAContentTypes] = useState<ContentType[]>(["texto"]);
  const [aMessage, setAMessage] = useState("");
  const [aDate, setADate] = useState<Date>();
  const [aTime, setATime] = useState("09:00");
  const [aTargetType, setATargetType] = useState<"todos" | "tags">("todos");
  const [aSelectedTags, setASelectedTags] = useState<string[]>([]);
  const [aSelectedConexao, setASelectedConexao] = useState(CONEXOES[0].id);

  // === DISPARO HANDLERS ===
  const resetDisparoForm = () => { setDTitle(""); setDContentTypes(["texto"]); setDMessage(""); setDTargetType("todos"); setDSelectedTags([]); setDSelectedConexao(CONEXOES[0].id); };
  const handleCreateDisparo = () => {
    if (!dTitle.trim()) return;
    const typeLabel = dContentTypes.map(t => t === "texto" ? "Texto" : t === "audio" ? "Áudio" : t === "imagem" ? "Imagem" : t === "pdf" ? "PDF" : "Word").join(" + ");
    const newDisparo: Disparo = { id: Date.now().toString(), title: dTitle.trim(), type: typeLabel, contacts: dTargetType === "todos" ? 450 : dSelectedTags.length * 30, status: "rascunho", date: new Date().toLocaleDateString("pt-BR"), conexao: CONEXOES.find(c => c.id === dSelectedConexao)?.name };
    setDisparos([newDisparo, ...disparos]);
    resetDisparoForm(); setShowDisparoModal(false);
    toast.success(`Disparo "${newDisparo.title}" criado`);
  };

  // === AGENDAMENTO HANDLERS ===
  const resetAgendForm = () => { setATitle(""); setAContentTypes(["texto"]); setAMessage(""); setADate(undefined); setATime("09:00"); setATargetType("todos"); setASelectedTags([]); setASelectedConexao(CONEXOES[0].id); };
  const handleCreateAgend = () => {
    if (!aTitle.trim() || !aDate) return;
    const newItem: Agendamento = { id: Date.now().toString(), title: aTitle.trim(), contentTypes: aContentTypes, date: format(aDate, "dd/MM/yyyy"), time: aTime, target: aTargetType === "todos" ? "Todos os contatos" : aSelectedTags.join(", "), status: "agendado" };
    setAgendamentos([newItem, ...agendamentos]);
    resetAgendForm(); setShowAgendModal(false);
    toast.success(`Agendamento "${newItem.title}" criado`);
  };
  const removeAgendamento = (id: string) => setAgendamentos(agendamentos.filter(a => a.id !== id));

  const toggleTag = (tag: string, setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Disparos</h1>
            <p className="text-muted-foreground mt-1">Gerencie suas campanhas e agendamentos</p>
          </div>
          <button
            onClick={() => { tab === "disparos" ? (resetDisparoForm(), setShowDisparoModal(true)) : (resetAgendForm(), setShowAgendModal(true)); }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            {tab === "disparos" ? "Novo Disparo" : "Novo Agendamento"}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-xl w-fit">
          {([
            { key: "disparos" as TabType, label: "Disparos", icon: Megaphone },
            { key: "agendamentos" as TabType, label: "Agendamentos", icon: Clock },
          ]).map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} className={cn("flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all", tab === t.key ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}>
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          ))}
        </div>

        {/* === TAB: DISPAROS === */}
        {tab === "disparos" && (
          <div className="glass-card rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Campanha</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Tipo</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Contatos</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Status</th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Data</th>
                </tr>
              </thead>
              <tbody>
                {disparos.map((d) => {
                  const st = statusConfig[d.status] || statusConfig.rascunho;
                  const StIcon = st.icon;
                  return (
                    <tr key={d.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors cursor-pointer">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center"><Megaphone className="w-4 h-4 text-primary" /></div>
                          <span className="text-sm font-medium text-foreground">{d.title}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-muted-foreground">{d.type}</td>
                      <td className="px-5 py-4 text-sm text-foreground font-medium">{d.contacts}</td>
                      <td className="px-5 py-4">
                        <span className={cn("inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full", st.class)}>
                          <StIcon className="w-3.5 h-3.5" />{st.label}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-muted-foreground">{d.date}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* === TAB: AGENDAMENTOS === */}
        {tab === "agendamentos" && (
          agendamentos.length === 0 ? (
            <div className="glass-card rounded-xl p-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4"><CalendarDays className="w-8 h-8 text-primary" /></div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Nenhum agendamento</h3>
              <p className="text-sm text-muted-foreground max-w-md">Programe o envio de mensagens, áudios e arquivos para seus contatos.</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {agendamentos.map((a) => {
                const icons = a.contentTypes.map(ct => contentTypeOptions.find(c => c.value === ct)?.icon || Type);
                const FirstIcon = icons[0];
                return (
                  <div key={a.id} className="glass-card rounded-xl p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
                    <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", a.status === "enviado" ? "bg-muted" : "bg-primary/10")}>
                      <FirstIcon className={cn("w-5 h-5", a.status === "enviado" ? "text-muted-foreground" : "text-primary")} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-foreground">{a.title}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2">
                        <span>{a.contentTypes.map(ct => ct.charAt(0).toUpperCase() + ct.slice(1)).join(" + ")}</span>
                        <span>•</span>
                        <Users className="w-3 h-3 inline" />
                        <span className="truncate">{a.target}</span>
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-medium text-foreground">{a.date}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 justify-end"><Clock className="w-3 h-3" />{a.time}</p>
                    </div>
                    <span className={cn("text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0", a.status === "agendado" ? "bg-chart-4/10 text-chart-4" : "bg-primary/10 text-primary")}>
                      {a.status === "agendado" ? "Agendado" : "Enviado"}
                    </span>
                    {a.status === "agendado" && (
                      <button onClick={() => removeAgendamento(a.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors flex-shrink-0">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )
        )}
      </div>

      {/* === MODAL: NOVO DISPARO === */}
      <Dialog open={showDisparoModal} onOpenChange={setShowDisparoModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Novo Disparo</DialogTitle>
            <DialogDescription>Crie uma nova campanha de disparo de mensagens.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Conexão de envio</label>
              <div className="grid grid-cols-2 gap-2">
                {CONEXOES.map(c => (
                  <button key={c.id} onClick={() => setDSelectedConexao(c.id)} className={cn("flex items-center gap-2 p-3 rounded-xl border transition-all text-left", dSelectedConexao === c.id ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:bg-muted/60")}>
                    <Smartphone className={cn("w-5 h-5", dSelectedConexao === c.id ? "text-primary" : "text-muted-foreground")} />
                    <div>
                      <span className={cn("text-sm font-medium block", dSelectedConexao === c.id ? "text-primary" : "text-foreground")}>{c.name}</span>
                      <span className="text-xs text-muted-foreground">{c.number}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Título da campanha</label>
              <input value={dTitle} onChange={(e) => setDTitle(e.target.value)} placeholder="Ex: Promoção de Natal" className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Tipo de conteúdo</label>
              <div className="flex gap-2">
                {contentTypeOptions.filter(o => ["texto", "audio", "imagem"].includes(o.value)).map(opt => {
                  const isActive = dContentTypes.includes(opt.value);
                  return (
                    <button key={opt.value} onClick={() => setDContentTypes(prev => prev.includes(opt.value) ? prev.filter(t => t !== opt.value) : [...prev, opt.value])} className={cn("flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-medium transition-all", isActive ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:bg-muted")}>
                      <opt.icon className="w-4 h-4" />{opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
            {dContentTypes.includes("texto") && (
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Mensagem</label>
                <textarea value={dMessage} onChange={(e) => setDMessage(e.target.value)} placeholder="Digite a mensagem..." rows={3} className="w-full bg-muted/50 border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all resize-none" />
              </div>
            )}
            {dContentTypes.includes("audio") && (
              <button className="w-full flex items-center gap-2 py-4 border-2 border-dashed border-border rounded-lg hover:border-primary/30 hover:bg-primary/5 transition-all justify-center">
                <Mic className="w-5 h-5 text-muted-foreground" /><span className="text-sm text-muted-foreground">Enviar áudio (MP3, OGG, WAV)</span>
              </button>
            )}
            {dContentTypes.includes("imagem") && (
              <button className="w-full flex items-center gap-2 py-4 border-2 border-dashed border-border rounded-lg hover:border-primary/30 hover:bg-primary/5 transition-all justify-center">
                <Image className="w-5 h-5 text-muted-foreground" /><span className="text-sm text-muted-foreground">Enviar imagem (JPG, PNG, WEBP)</span>
              </button>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Destinatários</label>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => { setDTargetType("todos"); setDSelectedTags([]); }} className={cn("flex items-center gap-2 p-3 rounded-xl border transition-all", dTargetType === "todos" ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:bg-muted/60")}>
                  <Users className={cn("w-5 h-5", dTargetType === "todos" ? "text-primary" : "text-muted-foreground")} />
                  <span className={cn("text-sm font-medium", dTargetType === "todos" ? "text-primary" : "text-muted-foreground")}>Todos</span>
                </button>
                <button onClick={() => setDTargetType("tags")} className={cn("flex items-center gap-2 p-3 rounded-xl border transition-all", dTargetType === "tags" ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:bg-muted/60")}>
                  <Tag className={cn("w-5 h-5", dTargetType === "tags" ? "text-primary" : "text-muted-foreground")} />
                  <span className={cn("text-sm font-medium", dTargetType === "tags" ? "text-primary" : "text-muted-foreground")}>Por tags</span>
                </button>
              </div>
              {dTargetType === "tags" && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {getTagStore().map(tagItem => (
                    <button key={tagItem.name} onClick={() => toggleTag(tagItem.name, setDSelectedTags)} className={cn("text-xs font-medium px-3 py-1.5 rounded-full border transition-colors", dSelectedTags.includes(tagItem.name) ? "text-white border-transparent" : "bg-muted text-muted-foreground border-border hover:border-primary/20")} style={dSelectedTags.includes(tagItem.name) ? { backgroundColor: tagItem.color } : {}}>
                      {tagItem.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDisparoModal(false)}>Cancelar</Button>
            <Button onClick={handleCreateDisparo} disabled={!dTitle.trim()}><Send className="w-4 h-4 mr-1.5" />Criar Disparo</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* === MODAL: NOVO AGENDAMENTO === */}
      {showAgendModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-card rounded-2xl p-6 w-full max-w-lg mx-4 shadow-xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Novo Agendamento</h2>
              <button onClick={() => { resetAgendForm(); setShowAgendModal(false); }} className="p-1 rounded-lg hover:bg-muted transition-colors"><X className="w-5 h-5 text-muted-foreground" /></button>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Conexão de envio</label>
              <div className="grid grid-cols-2 gap-2">
                {CONEXOES.map(c => (
                  <button key={c.id} onClick={() => setASelectedConexao(c.id)} className={cn("flex items-center gap-2 p-3 rounded-xl border transition-all text-left", aSelectedConexao === c.id ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:bg-muted/60")}>
                    <Smartphone className={cn("w-5 h-5", aSelectedConexao === c.id ? "text-primary" : "text-muted-foreground")} />
                    <div>
                      <span className={cn("text-sm font-medium block", aSelectedConexao === c.id ? "text-primary" : "text-foreground")}>{c.name}</span>
                      <span className="text-xs text-muted-foreground">{c.number}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Título</label>
              <input type="text" value={aTitle} onChange={(e) => setATitle(e.target.value)} placeholder="Ex: Promoção de Natal" className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Tipo de conteúdo</label>
              <div className="grid grid-cols-5 gap-2">
                {contentTypeOptions.map(ct => {
                  const isActive = aContentTypes.includes(ct.value);
                  return (
                    <button key={ct.value} onClick={() => setAContentTypes(prev => prev.includes(ct.value) ? prev.filter(t => t !== ct.value) : [...prev, ct.value])} className={cn("flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all text-center", isActive ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:bg-muted/60")}>
                      <ct.icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-muted-foreground")} />
                      <span className={cn("text-[11px] font-medium", isActive ? "text-primary" : "text-muted-foreground")}>{ct.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            {aContentTypes.includes("texto") && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Mensagem</label>
                <textarea value={aMessage} onChange={(e) => setAMessage(e.target.value)} placeholder="Digite a mensagem..." rows={3} className="w-full bg-muted/50 border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all resize-none" />
              </div>
            )}
            {aContentTypes.filter(t => t !== "texto").map(ct => {
              const ctInfo = contentTypeOptions.find(c => c.value === ct);
              const Icon = ctInfo?.icon || File;
              return (
                <button key={ct} className="w-full flex flex-col items-center gap-2 py-6 border-2 border-dashed border-border rounded-lg hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer">
                  <Icon className="w-7 h-7 text-muted-foreground" />
                  <p className="text-sm font-medium text-foreground">Enviar {ctInfo?.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {ct === "audio" && "MP3, OGG ou WAV • Máx. 5MB"}
                    {ct === "imagem" && "JPG, PNG ou WEBP • Máx. 5MB"}
                    {ct === "pdf" && "PDF • Máx. 10MB"}
                    {ct === "word" && "DOCX ou DOC • Máx. 10MB"}
                  </p>
                </button>
              );
            })}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Data</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <button className={cn("w-full flex items-center gap-2 bg-muted/50 border border-border rounded-lg px-4 py-2.5 text-sm text-left transition-all", !aDate ? "text-muted-foreground/50" : "text-foreground")}>
                      <CalendarDays className="w-4 h-4 text-muted-foreground" />
                      {aDate ? format(aDate, "dd/MM/yyyy") : "Selecionar data"}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={aDate} onSelect={setADate} disabled={(d) => d < new Date()} initialFocus className="p-3 pointer-events-auto" />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Horário</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input type="time" value={aTime} onChange={(e) => setATime(e.target.value)} className="w-full bg-muted/50 border border-border rounded-lg pl-9 pr-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all" />
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">Destinatários</label>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => { setATargetType("todos"); setASelectedTags([]); }} className={cn("flex items-center gap-2 p-3 rounded-xl border transition-all", aTargetType === "todos" ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:bg-muted/60")}>
                  <Users className={cn("w-5 h-5", aTargetType === "todos" ? "text-primary" : "text-muted-foreground")} />
                  <span className={cn("text-sm font-medium", aTargetType === "todos" ? "text-primary" : "text-muted-foreground")}>Todos os contatos</span>
                </button>
                <button onClick={() => setATargetType("tags")} className={cn("flex items-center gap-2 p-3 rounded-xl border transition-all", aTargetType === "tags" ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:bg-muted/60")}>
                  <Tag className={cn("w-5 h-5", aTargetType === "tags" ? "text-primary" : "text-muted-foreground")} />
                  <span className={cn("text-sm font-medium", aTargetType === "tags" ? "text-primary" : "text-muted-foreground")}>Filtrar por tags</span>
                </button>
              </div>
              {aTargetType === "tags" && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {getTagStore().map(tagItem => (
                    <button key={tagItem.name} onClick={() => toggleTag(tagItem.name, setASelectedTags)} className={cn("text-xs font-medium px-3 py-1.5 rounded-full border transition-colors", aSelectedTags.includes(tagItem.name) ? "text-white border-transparent" : "bg-muted text-muted-foreground border-border hover:border-primary/20")} style={aSelectedTags.includes(tagItem.name) ? { backgroundColor: tagItem.color } : {}}>
                      {tagItem.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <button onClick={() => { resetAgendForm(); setShowAgendModal(false); }} className="px-4 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted transition-colors">Cancelar</button>
              <button onClick={handleCreateAgend} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                <Send className="w-4 h-4" />Agendar Envio
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
};

export default Disparos;
