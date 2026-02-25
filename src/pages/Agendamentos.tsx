import { AppLayout } from "@/components/AppLayout";
import { CalendarDays, Plus, Clock, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

const agendamentos = [
  { id: "1", contact: "João Silva", message: "Lembrete de reunião", date: "24/02/2026", time: "09:00", type: "Texto" },
  { id: "2", contact: "Lista: Leads Quentes", message: "Promoção especial", date: "25/02/2026", time: "14:00", type: "Texto + Imagem" },
  { id: "3", contact: "Maria Souza", message: "Follow-up proposta", date: "26/02/2026", time: "10:30", type: "Áudio" },
];

const Agendamentos = () => {
  const navigate = useNavigate();
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
              <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                <MessageSquare className="w-3 h-3" />
                {a.message}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">{a.date}</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                <Clock className="w-3 h-3" />
                {a.time}
              </p>
            </div>
            <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full">{a.type}</span>
          </div>
        ))}
      </div>
    </div>
  </AppLayout>
  );
};

export default Agendamentos;
