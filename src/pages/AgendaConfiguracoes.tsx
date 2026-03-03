import { AppLayout } from "@/components/AppLayout";
import { Settings, Clock, CalendarDays, Users, Bell, Save, Copy, Plus } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Generate hour options from 06:00 to 22:00

// Generate hour options from 06:00 to 22:00
const hourOptions: string[] = [];
for (let h = 6; h <= 22; h++) {
  hourOptions.push(`${String(h).padStart(2, "0")}:00`);
  if (h < 22) hourOptions.push(`${String(h).padStart(2, "0")}:30`);
}

interface DaySchedule {
  enabled: boolean;
  slots: { start: string; end: string }[];
}

const WEEKDAYS = [
  { key: "seg", label: "SEG", full: "Segunda" },
  { key: "ter", label: "TER", full: "Terça" },
  { key: "qua", label: "QUA", full: "Quarta" },
  { key: "qui", label: "QUI", full: "Quinta" },
  { key: "sex", label: "SEX", full: "Sexta" },
  { key: "sab", label: "SÁB", full: "Sábado" },
  { key: "dom", label: "DOM", full: "Domingo" },
];

const defaultSchedule: Record<string, DaySchedule> = {
  seg: { enabled: true, slots: [{ start: "08:00", end: "18:00" }] },
  ter: { enabled: true, slots: [{ start: "08:00", end: "18:00" }] },
  qua: { enabled: true, slots: [{ start: "08:00", end: "18:00" }] },
  qui: { enabled: true, slots: [{ start: "08:00", end: "18:00" }] },
  sex: { enabled: true, slots: [{ start: "08:00", end: "18:00" }] },
  sab: { enabled: false, slots: [{ start: "08:00", end: "17:00" }] },
  dom: { enabled: false, slots: [{ start: "08:00", end: "17:00" }] },
};

const AgendaConfiguracoes = () => {
  const [agendaPadrao, setAgendaPadrao] = useState("interna");
  const [duracao, setDuracao] = useState("1h");
  const [limite, setLimite] = useState("1");
  const [schedule, setSchedule] = useState<Record<string, DaySchedule>>(defaultSchedule);
  const [lembretesAtivo, setLembretesAtivo] = useState(true);
  const [lembretes, setLembretes] = useState({ matinal: true, duasHoras: false, umaHora: true, trintaMin: false, quinzeMin: true });

  const toggleDay = (key: string) => {
    setSchedule(prev => ({
      ...prev,
      [key]: { ...prev[key], enabled: !prev[key].enabled },
    }));
  };

  const updateSlot = (dayKey: string, slotIdx: number, field: "start" | "end", value: string) => {
    setSchedule(prev => {
      const day = { ...prev[dayKey] };
      const slots = [...day.slots];
      slots[slotIdx] = { ...slots[slotIdx], [field]: value };
      return { ...prev, [dayKey]: { ...day, slots } };
    });
  };

  const addSlot = (dayKey: string) => {
    setSchedule(prev => {
      const day = { ...prev[dayKey] };
      return { ...prev, [dayKey]: { ...day, slots: [...day.slots, { start: "12:00", end: "14:00" }] } };
    });
  };

  const replicateAll = () => {
    const ref = schedule.seg;
    const updated = { ...schedule };
    WEEKDAYS.forEach(d => {
      if (d.key !== "seg") {
        updated[d.key] = { ...updated[d.key], slots: [...ref.slots.map(s => ({ ...s }))] };
        if (d.key !== "sab" && d.key !== "dom") updated[d.key].enabled = true;
      }
    });
    setSchedule(updated);
    toast.success("Horários de Segunda replicados para todos os dias");
  };

  const handleSave = () => {
    toast.success("Configurações de agendamento salvas!");
  };

  const selectClass = "w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all appearance-none cursor-pointer";

  return (
    <AppLayout>
      <div className="space-y-8 animate-fade-in max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
              <Settings className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Configurações de Agendamento</h1>
              <p className="text-muted-foreground text-sm mt-0.5">Configure como o agente gerencia os agendamentos</p>
            </div>
          </div>
          <button onClick={handleSave} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-all shadow-sm">
            <Save className="w-4 h-4" /> Salvar configurações
          </button>
        </div>

        {/* === ROW 1: Agenda Padrão / Duração / Limite === */}
        <div className="grid grid-cols-3 gap-4">
          {/* Agenda Padrão */}
          <div className="glass-card rounded-2xl p-5 space-y-3 border border-border/60">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <CalendarDays className="w-4 h-4 text-primary" /> Agenda Padrão
            </div>
            <select value={agendaPadrao} onChange={e => setAgendaPadrao(e.target.value)} className={selectClass}>
              <option value="interna">Agenda Interna</option>
              <option value="google">Google Agenda</option>
            </select>
          </div>

          {/* Duração */}
          <div className="glass-card rounded-2xl p-5 space-y-3 border border-border/60">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Clock className="w-4 h-4 text-amber-500" /> Duração
            </div>
            <select value={duracao} onChange={e => setDuracao(e.target.value)} className={selectClass}>
              <option value="30min">30 minutos</option>
              <option value="1h">1 hora</option>
              <option value="1h30">1 hora e 30 min</option>
              <option value="2h">2 horas</option>
            </select>
          </div>

          {/* Limite/horário */}
          <div className="glass-card rounded-2xl p-5 space-y-3 border border-border/60">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Users className="w-4 h-4 text-violet-500" /> Limite / horário
            </div>
            <select value={limite} onChange={e => setLimite(e.target.value)} className={selectClass}>
              <option value="1">1 agendamento</option>
              <option value="2">2 agendamentos</option>
              <option value="3">3 agendamentos</option>
              <option value="5">5 agendamentos</option>
              <option value="10">10 agendamentos</option>
            </select>
          </div>
        </div>

        {/* === HORÁRIOS DISPONÍVEIS === */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">Horários Disponíveis</h2>
                <p className="text-xs text-muted-foreground">Clique nos dias para ativar e configure os horários</p>
              </div>
            </div>
            <button onClick={replicateAll} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors">
              <Copy className="w-4 h-4" /> Replicar para todos
            </button>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {WEEKDAYS.map((day) => {
              const ds = schedule[day.key];
              return (
                <div
                  key={day.key}
                  className={cn(
                    "rounded-2xl p-4 border-2 transition-all duration-200",
                    ds.enabled
                      ? "border-primary/30 bg-primary/[0.03]"
                      : "border-border/60 bg-muted/20 opacity-60"
                  )}
                >
                  {/* Day header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-bold text-foreground">{day.label}</span>
                    </div>
                    <button
                      onClick={() => toggleDay(day.key)}
                      className={cn(
                        "w-11 h-6 rounded-full transition-colors relative flex-shrink-0",
                        ds.enabled ? "bg-primary" : "bg-muted-foreground/20"
                      )}
                    >
                      <span className={cn(
                        "absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform",
                        ds.enabled ? "translate-x-[22px]" : "translate-x-0.5"
                      )} />
                    </button>
                  </div>

                  {/* Time slots */}
                  <div className="space-y-2">
                    {ds.slots.map((slot, idx) => (
                      <div key={idx} className="space-y-1.5">
                        <select
                          value={slot.start}
                          onChange={e => updateSlot(day.key, idx, "start", e.target.value)}
                          disabled={!ds.enabled}
                          className={cn(selectClass, "text-xs py-2", !ds.enabled && "opacity-50")}
                        >
                          {hourOptions.map(h => <option key={h} value={h}>{h}</option>)}
                        </select>
                        <select
                          value={slot.end}
                          onChange={e => updateSlot(day.key, idx, "end", e.target.value)}
                          disabled={!ds.enabled}
                          className={cn(selectClass, "text-xs py-2", !ds.enabled && "opacity-50")}
                        >
                          {hourOptions.map(h => <option key={h} value={h}>{h}</option>)}
                        </select>
                      </div>
                    ))}
                  </div>

                  {/* Add slot */}
                  {ds.enabled && (
                    <button
                      onClick={() => addSlot(day.key)}
                      className="w-full mt-3 flex items-center justify-center gap-1 py-1.5 rounded-lg border border-dashed border-primary/30 text-xs text-primary font-medium hover:bg-primary/5 transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* === LEMBRETES DE REUNIÃO === */}
        <div className="glass-card rounded-2xl p-6 border border-border/60 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <Bell className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">Lembretes de Reunião</h2>
                <p className="text-xs text-muted-foreground">Escolha quando enviar lembretes automáticos</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={cn("text-xs font-semibold", lembretesAtivo ? "text-primary" : "text-muted-foreground")}>
                {lembretesAtivo ? "Ativado" : "Desativado"}
              </span>
              <button
                onClick={() => setLembretesAtivo(!lembretesAtivo)}
                className={cn(
                  "w-11 h-6 rounded-full transition-colors relative",
                  lembretesAtivo ? "bg-primary" : "bg-muted-foreground/20"
                )}
              >
                <span className={cn(
                  "absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform",
                  lembretesAtivo ? "translate-x-[22px]" : "translate-x-0.5"
                )} />
              </button>
            </div>
          </div>

          {lembretesAtivo && (
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
              {([
                { key: "matinal", label: "Lembrete Matinal", desc: "Envia às 8h no dia" },
                { key: "duasHoras", label: "2 horas antes", desc: "Envio antecipado" },
                { key: "umaHora", label: "1 hora antes", desc: "Lembrete próximo" },
                { key: "trintaMin", label: "30 min antes", desc: "Último aviso" },
                { key: "quinzeMin", label: "15 min antes", desc: "Imediato" },
              ] as const).map((item) => {
                const active = lembretes[item.key];
                return (
                  <button
                    key={item.key}
                    onClick={() => setLembretes(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                    className={cn(
                      "rounded-xl p-4 border-2 text-left transition-all duration-200",
                      active
                        ? "border-primary bg-primary/5"
                        : "border-border/60 hover:border-primary/20"
                    )}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={cn("text-sm font-bold", active ? "text-primary" : "text-foreground")}>{item.label}</span>
                      <div className={cn(
                        "w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors",
                        active ? "border-primary bg-primary" : "border-muted-foreground/30"
                      )}>
                        {active && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </div>
                    <p className="text-[11px] text-muted-foreground">{item.desc}</p>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Save bottom */}
        <div className="flex justify-end pb-4">
          <button onClick={handleSave} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-all shadow-sm">
            <Save className="w-4 h-4" /> Salvar configurações
          </button>
        </div>
      </div>
    </AppLayout>
  );
};

export default AgendaConfiguracoes;
