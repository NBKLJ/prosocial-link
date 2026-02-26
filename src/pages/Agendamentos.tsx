import { AppLayout } from "@/components/AppLayout";
import { CalendarDays, Plus, Clock, MessageSquare, Video, ToggleRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ProGate } from "@/components/ui/ProGate";
import { ProBadge } from "@/components/ui/ProBadge";
import { toast } from "sonner";

const agendamentos = [
  { id: "1", contact: "João Silva", message: "Lembrete de reunião", date: "24/02/2026", time: "09:00", type: "Texto" },
  { id: "2", contact: "Lista: Leads Quentes", message: "Promoção especial", date: "25/02/2026", time: "14:00", type: "Texto + Imagem" },
  { id: "3", contact: "Maria Souza", message: "Follow-up proposta", date: "26/02/2026", time: "10:30", type: "Áudio" },
];

const meetMeetings = [
  { id: "m1", title: "Apresentação de proposta", date: "27/02/2026", time: "10:00", duration: "30min", participants: "joao@empresa.com", link: "https://meet.google.com/abc-defg-hij" },
  { id: "m2", title: "Demo do produto", date: "28/02/2026", time: "14:00", duration: "45min", participants: "maria@startup.io", link: "https://meet.google.com/klm-nopq-rst" },
];

const Agendamentos = () => {
  const navigate = useNavigate();
  const [meetActive, setMeetActive] = useState(true);
  const [meetForm, setMeetForm] = useState({ title: "", duration: "30min", participants: "" });

  const createMeeting = () => {
    if (!meetForm.title.trim()) return;
    toast.success(`Reunião "${meetForm.title}" criada com link do Google Meet`);
    setMeetForm({ title: "", duration: "30min", participants: "" });
  };

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Agendamentos</h1>
            <p className="text-muted-foreground mt-1">Fila de disparos agendados</p>
          </div>
          <button onClick={() => navigate("/disparos/agendamento")} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors">
            <Plus className="w-4 h-4" />
            Novo Agendamento
          </button>
        </div>

        <div className="grid gap-3">
          {agendamentos.map((a) => (
            <div key={a.id} className="glass-card rounded-xl p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <CalendarDays className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-foreground">{a.contact}</h3>
                <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1"><MessageSquare className="w-3 h-3" />{a.message}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">{a.date}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1 justify-end"><Clock className="w-3 h-3" />{a.time}</p>
              </div>
              <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full">{a.type}</span>
            </div>
          ))}
        </div>

        {/* === AGENDAMENTO AUTOMÁTICO GOOGLE MEET (PRO) === */}
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
