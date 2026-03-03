import { AppLayout } from "@/components/AppLayout";
import { Settings, Clock, CalendarDays, Users, Bell, Save, Copy, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

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
  { key: "seg", label: "Segunda-feira" },
  { key: "ter", label: "Terça-feira" },
  { key: "qua", label: "Quarta-feira" },
  { key: "qui", label: "Quinta-feira" },
  { key: "sex", label: "Sexta-feira" },
  { key: "sab", label: "Sábado" },
  { key: "dom", label: "Domingo" },
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
    setSchedule(prev => ({ ...prev, [key]: { ...prev[key], enabled: !prev[key].enabled } }));
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

  const removeSlot = (dayKey: string, slotIdx: number) => {
    setSchedule(prev => {
      const day = { ...prev[dayKey] };
      if (day.slots.length <= 1) return prev;
      return { ...prev, [dayKey]: { ...day, slots: day.slots.filter((_, i) => i !== slotIdx) } };
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

  const handleSave = () => toast.success("Configurações de agendamento salvas!");

  const selectClass = "bg-card border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all appearance-none cursor-pointer";

  return (
    <AppLayout>
      <div className="space-y-8 animate-fade-in w-full">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="glass-card rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <CalendarDays className="w-4 h-4 text-primary" />
              </div>
              <div>
                <span className="text-sm font-semibold text-foreground">Agenda Padrão</span>
                <p className="text-[11px] text-muted-foreground">Onde os agendamentos serão salvos</p>
              </div>
            </div>
            <select value={agendaPadrao} onChange={e => setAgendaPadrao(e.target.value)} className={cn(selectClass, "w-full")}>
              <option value="interna">📅 Agenda Interna</option>
              <option value="google">🔗 Google Agenda</option>
            </select>
          </div>

          <div className="glass-card rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <Clock className="w-4 h-4 text-amber-500" />
              </div>
              <div>
                <span className="text-sm font-semibold text-foreground">Duração Padrão</span>
                <p className="text-[11px] text-muted-foreground">Tempo de cada agendamento</p>
              </div>
            </div>
            <select value={duracao} onChange={e => setDuracao(e.target.value)} className={cn(selectClass, "w-full")}>
              <option value="30min">30 minutos</option>
              <option value="1h">1 hora</option>
              <option value="1h30">1 hora e 30 min</option>
              <option value="2h">2 horas</option>
            </select>
          </div>

          <div className="glass-card rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-accent-foreground/5 flex items-center justify-center">
                <Users className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <span className="text-sm font-semibold text-foreground">Limite por Horário</span>
                <p className="text-[11px] text-muted-foreground">Máximo simultâneo por slot</p>
              </div>
            </div>
            <select value={limite} onChange={e => setLimite(e.target.value)} className={cn(selectClass, "w-full")}>
              <option value="1">1 agendamento</option>
              <option value="2">2 agendamentos</option>
              <option value="3">3 agendamentos</option>
              <option value="5">5 agendamentos</option>
              <option value="10">10 agendamentos</option>
            </select>
          </div>
        </div>

        {/* === HORÁRIOS DISPONÍVEIS === */}
        <div className="glass-card rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">Horários Disponíveis</h2>
                <p className="text-xs text-muted-foreground">Defina os horários em que o agente pode marcar agendamentos</p>
              </div>
            </div>
            <button onClick={replicateAll} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors">
              <Copy className="w-4 h-4" /> Replicar Segunda para todos
            </button>
          </div>

          {/* Day rows */}
          <div className="space-y-2">
            {WEEKDAYS.map((day) => {
              const ds = schedule[day.key];
              return (
                <div
                  key={day.key}
                  className={cn(
                    "flex items-start gap-4 rounded-xl p-4 border transition-all",
                    ds.enabled
                      ? "border-primary/20 bg-primary/[0.02]"
                      : "border-border/40 bg-muted/20 opacity-60"
                  )}
                >
                  {/* Toggle + Day name */}
                  <div className="flex items-center gap-3 min-w-[180px] pt-1">
                    <button
                      onClick={() => toggleDay(day.key)}
                      className={cn(
                        "w-10 h-[22px] rounded-full transition-colors relative flex-shrink-0",
                        ds.enabled ? "bg-primary" : "bg-muted-foreground/20"
                      )}
                    >
                      <span className={cn(
                        "absolute top-[3px] w-4 h-4 rounded-full bg-white shadow-sm transition-transform",
                        ds.enabled ? "translate-x-[22px]" : "translate-x-[3px]"
                      )} />
                    </button>
                    <span className={cn(
                      "text-sm font-semibold",
                      ds.enabled ? "text-foreground" : "text-muted-foreground"
                    )}>
                      {day.label}
                    </span>
                  </div>

                  {/* Time slots */}
                  <div className="flex-1 flex flex-wrap items-center gap-3">
                    {ds.slots.map((slot, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 bg-card border border-border rounded-lg px-1">
                          <select
                            value={slot.start}
                            onChange={e => updateSlot(day.key, idx, "start", e.target.value)}
                            disabled={!ds.enabled}
                            className="bg-transparent border-none text-sm py-2 pl-2 pr-1 text-foreground focus:outline-none cursor-pointer disabled:opacity-40 appearance-none"
                          >
                            {hourOptions.map(h => <option key={h} value={h}>{h}</option>)}
                          </select>
                          <span className="text-muted-foreground text-xs">até</span>
                          <select
                            value={slot.end}
                            onChange={e => updateSlot(day.key, idx, "end", e.target.value)}
                            disabled={!ds.enabled}
                            className="bg-transparent border-none text-sm py-2 pl-1 pr-2 text-foreground focus:outline-none cursor-pointer disabled:opacity-40 appearance-none"
                          >
                            {hourOptions.map(h => <option key={h} value={h}>{h}</option>)}
                          </select>
                        </div>
                        {ds.slots.length > 1 && ds.enabled && (
                          <button
                            onClick={() => removeSlot(day.key, idx)}
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-destructive/60 hover:text-destructive hover:bg-destructive/10 transition-colors"
                            title="Remover horário"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}

                    {ds.enabled && (
                      <button
                        onClick={() => addSlot(day.key)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-dashed border-primary/30 text-xs text-primary font-medium hover:bg-primary/5 transition-colors"
                      >
                        <Plus className="w-3 h-3" /> Intervalo
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* === LEMBRETES DE REUNIÃO === */}
        <div className="glass-card rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <Bell className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">Lembretes de Reunião</h2>
                <p className="text-xs text-muted-foreground">Escolha quando enviar lembretes automáticos ao cliente</p>
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
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {([
                { key: "matinal", label: "Lembrete Matinal", desc: "Envia às 8h no dia da reunião", icon: "🌅" },
                { key: "duasHoras", label: "2 horas antes", desc: "Lembrete antecipado", icon: "⏰" },
                { key: "umaHora", label: "1 hora antes", desc: "Lembrete próximo", icon: "🕐" },
                { key: "trintaMin", label: "30 min antes", desc: "Último aviso", icon: "⚡" },
                { key: "quinzeMin", label: "15 min antes", desc: "Aviso imediato", icon: "🔔" },
              ] as const).map((item) => {
                const active = lembretes[item.key];
                return (
                  <button
                    key={item.key}
                    onClick={() => setLembretes(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                    className={cn(
                      "rounded-xl p-4 border-2 text-left transition-all duration-200 group",
                      active
                        ? "border-primary bg-primary/5"
                        : "border-border/60 hover:border-primary/30"
                    )}
                  >
                    <div className="text-lg mb-2">{item.icon}</div>
                    <div className="flex items-center justify-between mb-1">
                      <span className={cn("text-xs font-bold", active ? "text-primary" : "text-foreground")}>{item.label}</span>
                      <div className={cn(
                        "w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors",
                        active ? "border-primary bg-primary" : "border-muted-foreground/30"
                      )}>
                        {active && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-tight">{item.desc}</p>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default AgendaConfiguracoes;
