import { AppLayout } from "@/components/AppLayout";
import { CalendarDays, Plus, Clock, MessageSquare, Video, ToggleRight, User, Send, Image, Mic, MoreHorizontal, Trash2, Edit, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ProGate } from "@/components/ui/ProGate";
import { ProBadge } from "@/components/ui/ProBadge";
import { toast } from "sonner";

type AgendamentoStatus = "pendente" | "enviado" | "falha";

interface Agendamento {
  id: string;
  contact: string;
  avatar?: string;
  message: string;
  date: string;
  time: string;
  type: "Texto" | "Áudio" | "Texto + Imagem";
  status: AgendamentoStatus;
  channel: string;
}

const agendamentos: Agendamento[] = [
  { id: "1", contact: "João Silva", message: "Lembrete de reunião amanhã às 10h com a equipe de vendas", date: "24/02/2026", time: "09:00", type: "Texto", status: "pendente", channel: "WhatsApp" },
  { id: "2", contact: "Lista: Leads Quentes", message: "Promoção especial de fim de mês — 30% off em todos os planos", date: "25/02/2026", time: "14:00", type: "Texto + Imagem", status: "pendente", channel: "WhatsApp" },
  { id: "3", contact: "Maria Souza", message: "Follow-up da proposta comercial enviada na última semana", date: "26/02/2026", time: "10:30", type: "Áudio", status: "enviado", channel: "WhatsApp" },
  { id: "4", contact: "Carlos Mendes", message: "Confirmação de presença no evento de networking", date: "27/02/2026", time: "08:00", type: "Texto", status: "falha", channel: "WhatsApp" },
  { id: "5", contact: "Lista: Clientes VIP", message: "Acesso antecipado ao novo recurso de IA", date: "28/02/2026", time: "16:00", type: "Texto + Imagem", status: "pendente", channel: "WhatsApp" },
];

const meetMeetings = [
  { id: "m1", title: "Apresentação de proposta", date: "27/02/2026", time: "10:00", duration: "30min", participants: "joao@empresa.com", link: "https://meet.google.com/abc-defg-hij" },
  { id: "m2", title: "Demo do produto", date: "28/02/2026", time: "14:00", duration: "45min", participants: "maria@startup.io", link: "https://meet.google.com/klm-nopq-rst" },
];

const statusConfig: Record<AgendamentoStatus, { label: string; color: string; bg: string }> = {
  pendente: { label: "Pendente", color: "text-amber-600", bg: "bg-amber-500/10 border-amber-500/20" },
  enviado: { label: "Enviado", color: "text-emerald-600", bg: "bg-emerald-500/10 border-emerald-500/20" },
  falha: { label: "Falha", color: "text-destructive", bg: "bg-destructive/10 border-destructive/20" },
};

const typeIcon: Record<string, React.ReactNode> = {
  "Texto": <Send className="w-3.5 h-3.5" />,
  "Áudio": <Mic className="w-3.5 h-3.5" />,
  "Texto + Imagem": <Image className="w-3.5 h-3.5" />,
};

const Agendamentos = () => {
  const navigate = useNavigate();
  const [meetActive, setMeetActive] = useState(true);
  const [meetForm, setMeetForm] = useState({ title: "", duration: "30min", participants: "" });
  const [filter, setFilter] = useState<"all" | AgendamentoStatus>("all");

  const filtered = filter === "all" ? agendamentos : agendamentos.filter(a => a.status === filter);

  const stats = {
    total: agendamentos.length,
    pendente: agendamentos.filter(a => a.status === "pendente").length,
    enviado: agendamentos.filter(a => a.status === "enviado").length,
    falha: agendamentos.filter(a => a.status === "falha").length,
  };

  const createMeeting = () => {
    if (!meetForm.title.trim()) return;
    toast.success(`Reunião "${meetForm.title}" criada com link do Google Meet`);
    setMeetForm({ title: "", duration: "30min", participants: "" });
  };

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Agendamentos</h1>
            <p className="text-muted-foreground mt-1">Gerencie seus disparos programados</p>
          </div>
          <button onClick={() => navigate("/disparos/agendamento")} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-all shadow-sm hover:shadow-md">
            <Plus className="w-4 h-4" />
            Novo Agendamento
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3">
          {([
            { label: "Total", value: stats.total, color: "text-foreground", bg: "bg-muted/50" },
            { label: "Pendentes", value: stats.pendente, color: "text-amber-600", bg: "bg-amber-500/10" },
            { label: "Enviados", value: stats.enviado, color: "text-emerald-600", bg: "bg-emerald-500/10" },
            { label: "Falhas", value: stats.falha, color: "text-destructive", bg: "bg-destructive/10" },
          ]).map((s) => (
            <div key={s.label} className="glass-card rounded-xl p-4 flex items-center gap-3">
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", s.bg)}>
                <span className={cn("text-lg font-bold", s.color)}>{s.value}</span>
              </div>
              <span className="text-sm font-medium text-muted-foreground">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          {(["all", "pendente", "enviado", "falha"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-semibold transition-all border",
                filter === f
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-muted/50 text-muted-foreground border-border hover:border-primary/30 hover:text-foreground"
              )}
            >
              {f === "all" ? "Todos" : statusConfig[f].label}
            </button>
          ))}
        </div>

        {/* Cards */}
        <div className="grid gap-3">
          {filtered.map((a) => {
            const st = statusConfig[a.status];
            return (
              <div key={a.id} className="glass-card rounded-2xl p-5 hover:shadow-lg transition-all duration-200 group border border-border/50 hover:border-primary/20">
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-primary" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-bold text-foreground truncate">{a.contact}</h3>
                      <span className={cn("text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border", st.bg, st.color)}>
                        {st.label}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1 mb-2">{a.message}</p>
                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <CalendarDays className="w-3 h-3" /> {a.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {a.time}
                      </span>
                      <span className="flex items-center gap-1 px-2 py-0.5 bg-muted rounded-md">
                        {typeIcon[a.type]} {a.type}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 rounded-lg hover:bg-muted transition-colors" title="Visualizar">
                      <Eye className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-muted transition-colors" title="Editar">
                      <Edit className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-destructive/10 transition-colors" title="Excluir">
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* === GOOGLE MEET (PRO) === */}
        <ProGate title="Agendamento Automático" description="Agende reuniões automaticamente com integração ao Google Meet. Disponível no Plano Pro.">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">Google Meet</h3>
                <ProBadge />
              </div>
              <button onClick={() => setMeetActive(!meetActive)} className={cn("flex items-center gap-2 text-xs font-medium px-4 py-2 rounded-full transition-colors", meetActive ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground")}>
                <ToggleRight className="w-4 h-4" />
                {meetActive ? "Integrado" : "Desativado"}
              </button>
            </div>

            {meetActive && (
              <>
                <div className="glass-card rounded-xl p-5 space-y-3">
                  <h4 className="text-xs font-semibold text-foreground">Nova Reunião</h4>
                  <div className="grid grid-cols-3 gap-3">
                    <input value={meetForm.title} onChange={(e) => setMeetForm({ ...meetForm, title: e.target.value })} placeholder="Título da reunião" className="col-span-1 bg-muted/50 border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                    <select value={meetForm.duration} onChange={(e) => setMeetForm({ ...meetForm, duration: e.target.value })} className="bg-muted/50 border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all">
                      <option value="15min">15 min</option><option value="30min">30 min</option><option value="45min">45 min</option><option value="60min">60 min</option>
                    </select>
                    <input value={meetForm.participants} onChange={(e) => setMeetForm({ ...meetForm, participants: e.target.value })} placeholder="E-mails dos participantes" className="bg-muted/50 border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                  </div>
                  <button onClick={createMeeting} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                    <Video className="w-4 h-4" />Criar Reunião
                  </button>
                </div>

                <div className="space-y-2">
                  {meetMeetings.map(m => (
                    <div key={m.id} className="glass-card rounded-xl p-4 flex items-center gap-4">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center"><Video className="w-4 h-4 text-primary" /></div>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-foreground">{m.title}</h4>
                        <p className="text-xs text-muted-foreground">{m.participants} • {m.duration}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-foreground">{m.date}</p>
                        <p className="text-xs text-muted-foreground">{m.time}</p>
                      </div>
                      <a href={m.link} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-primary hover:underline">Abrir Meet</a>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </ProGate>
      </div>
    </AppLayout>
  );
};

export default Agendamentos;
