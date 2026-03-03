import { AppLayout } from "@/components/AppLayout";
import { useState, useMemo } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Plus, Video, Search, Filter, CheckSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const DAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MONTHS = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

type ViewMode = "day" | "week" | "month";

const Agenda = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [searchQuery, setSearchQuery] = useState("");

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const today = new Date();
  const isToday = (day: number) =>
    today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;

  const calendarDays = useMemo(() => {
    const days: (number | null)[] = [];
    for (let i = 0; i < firstDayOfMonth; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
  }, [firstDayOfMonth, daysInMonth]);

  const navigate = (dir: number) => {
    const d = new Date(currentDate);
    d.setMonth(d.getMonth() + dir);
    setCurrentDate(d);
  };

  const goToday = () => setCurrentDate(new Date());

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
            {/* View toggles */}
            <div className="flex items-center border border-border rounded-lg overflow-hidden">
              <button onClick={() => setViewMode("day")} className={cn("flex items-center gap-1.5 px-3 py-2 text-xs font-medium transition-colors", viewMode === "day" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}>
                <CalendarDays className="w-3.5 h-3.5" /> Dia
              </button>
              <button onClick={() => setViewMode("week")} className={cn("px-3 py-2 text-xs font-medium transition-colors border-x border-border", viewMode === "week" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}>
                Semana
              </button>
              <button onClick={() => setViewMode("month")} className={cn("px-3 py-2 text-xs font-medium transition-colors", viewMode === "month" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground")}>
                Mês
              </button>
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
            <h2 className="text-lg font-bold text-foreground">
              {MONTHS[month]} {year}
            </h2>
            <div className="flex items-center gap-1">
              <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-muted transition-colors">
                <ChevronLeft className="w-4 h-4 text-muted-foreground" />
              </button>
              <button onClick={goToday} className="px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors">
                Hoje
              </button>
              <button onClick={() => navigate(1)} className="p-2 rounded-lg hover:bg-muted transition-colors">
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 border-b border-border">
            {DAYS.map((d) => (
              <div key={d} className="py-3 text-center text-xs font-semibold text-muted-foreground">
                {d}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7">
            {calendarDays.map((day, i) => (
              <div
                key={i}
                className={cn(
                  "min-h-[90px] border-b border-r border-border p-2 transition-colors",
                  day && "hover:bg-muted/30 cursor-pointer",
                  !day && "bg-muted/10",
                  i % 7 === 0 && "border-l"
                )}
              >
                {day && (
                  <span
                    className={cn(
                      "inline-flex items-center justify-center w-7 h-7 rounded-lg text-sm",
                      isToday(day)
                        ? "bg-primary text-primary-foreground font-bold"
                        : "text-foreground"
                    )}
                  >
                    {day}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Agenda;
