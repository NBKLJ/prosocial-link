import { AppLayout } from "@/components/AppLayout";
import { useState, useMemo } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Plus, Video, Search, Filter, CheckSquare, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const DAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const DAYS_FULL = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
const MONTHS = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
const HOURS = Array.from({ length: 16 }, (_, i) => i + 6); // 06:00 - 21:00

type ViewMode = "day" | "week" | "month";

const Agenda = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [searchQuery, setSearchQuery] = useState("");

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const today = new Date();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const isSameDay = (d1: Date, d2: Date) =>
    d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear();

  const isToday = (day: number) =>
    today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;

  const calendarDays = useMemo(() => {
    const days: (number | null)[] = [];
    for (let i = 0; i < firstDayOfMonth; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
  }, [firstDayOfMonth, daysInMonth]);

  // Week view helpers
  const getWeekDays = useMemo(() => {
    const dayOfWeek = currentDate.getDay();
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - dayOfWeek);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      return d;
    });
  }, [currentDate]);

  const navigateDate = (dir: number) => {
    const d = new Date(currentDate);
    if (viewMode === "month") d.setMonth(d.getMonth() + dir);
    else if (viewMode === "week") d.setDate(d.getDate() + dir * 7);
    else d.setDate(d.getDate() + dir);
    setCurrentDate(d);
  };

  const goToday = () => setCurrentDate(new Date());

  const getHeaderTitle = () => {
    if (viewMode === "month") return `${MONTHS[month]} ${year}`;
    if (viewMode === "week") {
      const start = getWeekDays[0];
      const end = getWeekDays[6];
      if (start.getMonth() === end.getMonth()) {
        return `${start.getDate()} - ${end.getDate()} de ${MONTHS[start.getMonth()]} ${start.getFullYear()}`;
      }
      return `${start.getDate()} ${MONTHS[start.getMonth()].slice(0, 3)} - ${end.getDate()} ${MONTHS[end.getMonth()].slice(0, 3)} ${end.getFullYear()}`;
    }
    return `${currentDate.getDate()} de ${MONTHS[month]} ${year} — ${DAYS_FULL[currentDate.getDay()]}`;
  };

  // ======= RENDER VIEWS =======

  const renderMonthView = () => (
    <>
      <div className="grid grid-cols-7 border-b border-border">
        {DAYS.map((d) => (
          <div key={d} className="py-3 text-center text-xs font-semibold text-muted-foreground">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {calendarDays.map((day, i) => (
          <div
            key={i}
            onClick={() => { if (day) { const d = new Date(year, month, day); setCurrentDate(d); setViewMode("day"); } }}
            className={cn(
              "min-h-[90px] border-b border-r border-border p-2 transition-colors",
              day && "hover:bg-muted/30 cursor-pointer",
              !day && "bg-muted/10",
              i % 7 === 0 && "border-l"
            )}
          >
            {day && (
              <span className={cn(
                "inline-flex items-center justify-center w-7 h-7 rounded-lg text-sm",
                isToday(day) ? "bg-primary text-primary-foreground font-bold" : "text-foreground"
              )}>
                {day}
              </span>
            )}
          </div>
        ))}
      </div>
    </>
  );

  const renderWeekView = () => (
    <div className="flex flex-col">
      {/* Header row with day names */}
      <div className="grid grid-cols-[64px_repeat(7,1fr)] border-b border-border">
        <div className="py-3" />
        {getWeekDays.map((d, i) => (
          <div
            key={i}
            onClick={() => { setCurrentDate(d); setViewMode("day"); }}
            className={cn(
              "py-3 text-center cursor-pointer hover:bg-muted/30 transition-colors",
              isSameDay(d, today) && "bg-primary/5"
            )}
          >
            <p className="text-xs font-semibold text-muted-foreground">{DAYS[d.getDay()]}</p>
            <p className={cn(
              "text-lg font-bold mt-0.5",
              isSameDay(d, today) ? "text-primary" : "text-foreground"
            )}>
              {d.getDate()}
            </p>
          </div>
        ))}
      </div>

      {/* Time grid */}
      <div className="max-h-[520px] overflow-y-auto">
        {HOURS.map((hour) => (
          <div key={hour} className="grid grid-cols-[64px_repeat(7,1fr)] border-b border-border/50 min-h-[52px]">
            <div className="flex items-start justify-end pr-3 pt-1">
              <span className="text-[11px] text-muted-foreground font-medium">{String(hour).padStart(2, "0")}:00</span>
            </div>
            {getWeekDays.map((d, i) => (
              <div
                key={i}
                className={cn(
                  "border-l border-border/50 hover:bg-primary/5 cursor-pointer transition-colors",
                  isSameDay(d, today) && "bg-primary/[0.02]"
                )}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );

  const renderDayView = () => (
    <div className="flex flex-col">
      <div className="max-h-[560px] overflow-y-auto">
        {HOURS.map((hour) => (
          <div key={hour} className="grid grid-cols-[64px_1fr] border-b border-border/50 min-h-[60px]">
            <div className="flex items-start justify-end pr-3 pt-1">
              <span className="text-[11px] text-muted-foreground font-medium">{String(hour).padStart(2, "0")}:00</span>
            </div>
            <div className="border-l border-border/50 hover:bg-primary/5 cursor-pointer transition-colors" />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Agenda</h1>
            <p className="text-muted-foreground mt-1">Visualize e gerencie suas tarefas no calendário.</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center border border-border rounded-lg overflow-hidden">
              {(["day", "week", "month"] as ViewMode[]).map((mode, idx) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={cn(
                    "px-3 py-2 text-xs font-medium transition-colors",
                    idx > 0 && "border-l border-border",
                    viewMode === mode ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {mode === "day" ? "Dia" : mode === "week" ? "Semana" : "Mês"}
                </button>
              ))}
            </div>
            <span className="text-xs text-muted-foreground bg-muted px-3 py-2 rounded-lg">Agendas 0/0</span>
            <Button size="sm" className="gap-1.5 bg-primary">
              <Video className="w-3.5 h-3.5" /> Nova Reunião
            </Button>
            <Button size="sm" className="gap-1.5">
              <Plus className="w-3.5 h-3.5" /> Nova Tarefa
            </Button>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar tarefas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-muted/50 border border-border rounded-lg pl-9 pr-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
          <Button variant="outline" size="sm" className="gap-1.5">
            <Filter className="w-3.5 h-3.5" /> Filtros
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5">
            <CheckSquare className="w-3.5 h-3.5" /> Subtarefas
          </Button>
        </div>

        {/* Calendar */}
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-foreground">{getHeaderTitle()}</h2>
            <div className="flex items-center gap-1">
              <button onClick={() => navigateDate(-1)} className="p-2 rounded-lg hover:bg-muted transition-colors">
                <ChevronLeft className="w-4 h-4 text-muted-foreground" />
              </button>
              <button onClick={goToday} className="px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors">
                Hoje
              </button>
              <button onClick={() => navigateDate(1)} className="p-2 rounded-lg hover:bg-muted transition-colors">
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>

          {viewMode === "month" && renderMonthView()}
          {viewMode === "week" && renderWeekView()}
          {viewMode === "day" && renderDayView()}
        </div>
      </div>
    </AppLayout>
  );
};

export default Agenda;
