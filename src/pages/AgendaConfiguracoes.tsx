import { AppLayout } from "@/components/AppLayout";
import { Settings, Bell, Clock, Globe, Palette } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const AgendaConfiguracoes = () => {
  const [timezone, setTimezone] = useState("America/Sao_Paulo");
  const [reminderMinutes, setReminderMinutes] = useState("15");
  const [autoConfirm, setAutoConfirm] = useState(true);

  const handleSave = () => {
    toast.success("Configurações da agenda salvas!");
  };

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in max-w-2xl">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Configurações da Agenda</h1>
          <p className="text-muted-foreground mt-1">Personalize o comportamento da sua agenda</p>
        </div>

        <div className="space-y-4">
          {/* Timezone */}
          <div className="glass-card rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">Fuso Horário</h3>
            </div>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            >
              <option value="America/Sao_Paulo">Brasília (GMT-3)</option>
              <option value="America/Manaus">Manaus (GMT-4)</option>
              <option value="America/Noronha">Fernando de Noronha (GMT-2)</option>
              <option value="America/Rio_Branco">Rio Branco (GMT-5)</option>
            </select>
          </div>

          {/* Reminders */}
          <div className="glass-card rounded-xl p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">Lembretes</h3>
            </div>
            <select
              value={reminderMinutes}
              onChange={(e) => setReminderMinutes(e.target.value)}
              className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            >
              <option value="5">5 minutos antes</option>
              <option value="10">10 minutos antes</option>
              <option value="15">15 minutos antes</option>
              <option value="30">30 minutos antes</option>
              <option value="60">1 hora antes</option>
            </select>
          </div>

          {/* Auto confirm */}
          <div className="glass-card rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Confirmação Automática</h3>
                  <p className="text-xs text-muted-foreground">Confirmar agendamentos automaticamente</p>
                </div>
              </div>
              <button
                onClick={() => setAutoConfirm(!autoConfirm)}
                className={cn(
                  "w-11 h-6 rounded-full transition-colors relative",
                  autoConfirm ? "bg-primary" : "bg-muted"
                )}
              >
                <span className={cn(
                  "absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform",
                  autoConfirm ? "translate-x-[22px]" : "translate-x-0.5"
                )} />
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          Salvar Configurações
        </button>
      </div>
    </AppLayout>
  );
};

export default AgendaConfiguracoes;
