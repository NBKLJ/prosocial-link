import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { getTagStore } from "@/lib/tagStore";
import {
  MessageSquare, Plus, Clock, X, Users, Tag, Trash2, Send, Smartphone, CalendarDays,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const CONEXOES = [
  { id: "1", name: "Comercial 1", number: "(11) 99999-1234" },
  { id: "2", name: "Suporte", number: "(21) 98888-5678" },
];

type TargetType = "todos" | "tags";

interface MensagemProgramada {
  id: string;
  title: string;
  message: string;
  date: string;
  time: string;
  target: string;
  status: "agendado" | "enviado";
}

const initialMensagens: MensagemProgramada[] = [
  { id: "1", title: "Lembrete de pagamento", message: "Olá! Lembramos que seu boleto vence amanhã.", date: "25/02/2026", time: "08:00", target: "Cliente VIP", status: "agendado" },
  { id: "2", title: "Boas-vindas novo lead", message: "Seja bem-vindo! Estamos à disposição.", date: "24/02/2026", time: "10:00", target: "Todos os contatos", status: "enviado" },
  { id: "3", title: "Follow-up proposta", message: "Gostaria de saber se teve a oportunidade de analisar nossa proposta.", date: "26/02/2026", time: "14:30", target: "Lead Quente", status: "agendado" },
];

const DisparoMensagem = () => {
  const [mensagens, setMensagens] = useState<MensagemProgramada[]>(initialMensagens);
  const [showModal, setShowModal] = useState(false);

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState("09:00");
  const [targetType, setTargetType] = useState<TargetType>("todos");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedConexao, setSelectedConexao] = useState(CONEXOES[0].id);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const resetForm = () => {
    setTitle("");
    setMessage("");
    setDate(undefined);
    setTime("09:00");
    setTargetType("todos");
    setSelectedTags([]);
    setSelectedConexao(CONEXOES[0].id);
  };

  const handleSave = () => {
    if (!title.trim() || !message.trim() || !date) return;
    const newItem: MensagemProgramada = {
      id: Date.now().toString(),
      title: title.trim(),
      message: message.trim(),
      date: format(date, "dd/MM/yyyy"),
      time,
      target: targetType === "todos" ? "Todos os contatos" : selectedTags.join(", "),
      status: "agendado",
    };
    setMensagens([newItem, ...mensagens]);
    resetForm();
    setShowModal(false);
  };

  const removeMensagem = (id: string) => {
    setMensagens(mensagens.filter((m) => m.id !== id));
  };

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Mensagem Programada</h1>
            <p className="text-muted-foreground mt-1">Programe o envio de mensagens de texto com data e hora</p>
          </div>
          <button onClick={() => setShowModal(true)} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors">
            <Plus className="w-4 h-4" />
            Nova Mensagem
          </button>
        </div>

        {mensagens.length === 0 ? (
          <div className="glass-card rounded-xl p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <MessageSquare className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Nenhuma mensagem programada</h3>
            <p className="text-sm text-muted-foreground max-w-md">Programe o envio de mensagens de texto para seus contatos.</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {mensagens.map((m) => (
              <div key={m.id} className="glass-card rounded-xl p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
                <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", m.status === "enviado" ? "bg-muted" : "bg-primary/10")}>
                  <MessageSquare className={cn("w-5 h-5", m.status === "enviado" ? "text-muted-foreground" : "text-primary")} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-foreground">{m.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2">
                    <span className="truncate max-w-[200px]">{m.message}</span>
                    <span>•</span>
                    <Users className="w-3 h-3 inline flex-shrink-0" />
                    <span className="truncate">{m.target}</span>
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-medium text-foreground">{m.date}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                    <Clock className="w-3 h-3" />{m.time}
                  </p>
                </div>
                <span className={cn("text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0", m.status === "agendado" ? "bg-chart-4/10 text-chart-4" : "bg-primary/10 text-primary")}>
                  {m.status === "agendado" ? "Agendado" : "Enviado"}
                </span>
                {m.status === "agendado" && (
                  <button onClick={() => removeMensagem(m.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors flex-shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-card rounded-2xl p-6 w-full max-w-lg mx-4 shadow-xl space-y-5 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">Nova Mensagem Programada</h2>
                <button onClick={() => { resetForm(); setShowModal(false); }} className="p-1 rounded-lg hover:bg-muted transition-colors">
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Conexão de envio</label>
                <div className="grid grid-cols-2 gap-2">
                  {CONEXOES.map(c => (
                    <button key={c.id} onClick={() => setSelectedConexao(c.id)} className={cn("flex items-center gap-2 p-3 rounded-xl border transition-all text-left", selectedConexao === c.id ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:bg-muted/60")}>
                      <Smartphone className={cn("w-5 h-5", selectedConexao === c.id ? "text-primary" : "text-muted-foreground")} />
                      <div>
                        <span className={cn("text-sm font-medium block", selectedConexao === c.id ? "text-primary" : "text-foreground")}>{c.name}</span>
                        <span className="text-xs text-muted-foreground">{c.number}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Título</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex: Lembrete de pagamento" className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Mensagem</label>
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Digite a mensagem que será enviada..." rows={4} className="w-full bg-muted/50 border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all resize-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Data</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className={cn("w-full flex items-center gap-2 bg-muted/50 border border-border rounded-lg px-4 py-2.5 text-sm text-left transition-all", !date ? "text-muted-foreground/50" : "text-foreground")}>
                        <CalendarDays className="w-4 h-4 text-muted-foreground" />
                        {date ? format(date, "dd/MM/yyyy") : "Selecionar data"}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={date} onSelect={setDate} disabled={(d) => d < new Date()} initialFocus className="p-3 pointer-events-auto" />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Horário</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full bg-muted/50 border border-border rounded-lg pl-9 pr-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all" />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">Destinatários</label>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => { setTargetType("todos"); setSelectedTags([]); }} className={cn("flex items-center gap-2 p-3 rounded-xl border transition-all", targetType === "todos" ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:bg-muted/60")}>
                    <Users className={cn("w-5 h-5", targetType === "todos" ? "text-primary" : "text-muted-foreground")} />
                    <span className={cn("text-sm font-medium", targetType === "todos" ? "text-primary" : "text-muted-foreground")}>Todos os contatos</span>
                  </button>
                  <button onClick={() => setTargetType("tags")} className={cn("flex items-center gap-2 p-3 rounded-xl border transition-all", targetType === "tags" ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:bg-muted/60")}>
                    <Tag className={cn("w-5 h-5", targetType === "tags" ? "text-primary" : "text-muted-foreground")} />
                    <span className={cn("text-sm font-medium", targetType === "tags" ? "text-primary" : "text-muted-foreground")}>Filtrar por tags</span>
                  </button>
                </div>
                {targetType === "tags" && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {getTagStore().map(tagItem => (
                      <button key={tagItem.name} onClick={() => toggleTag(tagItem.name)} className={cn("text-xs font-medium px-3 py-1.5 rounded-full border transition-colors", selectedTags.includes(tagItem.name) ? "text-white border-transparent" : "bg-muted text-muted-foreground border-border hover:border-primary/20")} style={selectedTags.includes(tagItem.name) ? { backgroundColor: tagItem.color } : {}}>
                        {tagItem.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button onClick={() => { resetForm(); setShowModal(false); }} className="px-4 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted transition-colors">Cancelar</button>
                <button onClick={handleSave} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                  <Send className="w-4 h-4" />
                  Programar Mensagem
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default DisparoMensagem;
