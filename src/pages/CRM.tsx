import { AppLayout } from "@/components/AppLayout";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Plus, Search, LayoutGrid, List, Settings2, Pencil, ChevronDown, MoreHorizontal } from "lucide-react";

interface Lead {
  id: string;
  name: string;
  company: string;
  value: string;
  valueNum: number;
  tag?: { label: string; color: string };
  alert?: "warning" | "danger";
  progress?: number;
}

interface Column {
  id: string;
  title: string;
  leads: Lead[];
}

const initialColumns: Column[] = [
  {
    id: "qualified",
    title: "Qualificado",
    leads: [
      { id: "1", name: "Bringit media agency deal", company: "Bringit media agency", value: "R$ 1.400", valueNum: 1400, alert: "warning" },
      { id: "2", name: "Dream college deal", company: "Dream college", value: "R$ 3.700", valueNum: 3700 },
      { id: "3", name: "Pet insurance deal", company: "Pet insurance", value: "R$ 1.000", valueNum: 1000 },
    ],
  },
  {
    id: "contact",
    title: "Contato Feito",
    leads: [
      { id: "4", name: "Trip abroad LTD deal", company: "Trip abroad LTD", value: "R$ 3.750", valueNum: 3750, tag: { label: "WON", color: "bg-primary text-primary-foreground" }, alert: "danger" },
      { id: "5", name: "Mindbend Deal", company: "Mindbend LLP", value: "R$ 1.800", valueNum: 1800 },
      { id: "6", name: "Willamette Co deal", company: "Willamette Co", value: "R$ 1.700", valueNum: 1700 },
    ],
  },
  {
    id: "demo",
    title: "Demo Agendada",
    leads: [
      { id: "7", name: "Fantastic hotels LTD deal", company: "Fantastic hotels", value: "R$ 1.900", valueNum: 1900 },
    ],
  },
  {
    id: "proposal",
    title: "Proposta Enviada",
    leads: [
      { id: "8", name: "Deal em andamento", company: "Empresa X", value: "R$ 2.700", valueNum: 2700, progress: 60 },
    ],
  },
  {
    id: "negotiation",
    title: "Negociação Iniciada",
    leads: [
      { id: "9", name: "Enterprise deal", company: "Corp ABC", value: "R$ 3.500", valueNum: 3500, progress: 40 },
      { id: "10", name: "Startup deal", company: "Tech Inc", value: "R$ 2.850", valueNum: 2850, progress: 75 },
    ],
  },
];

const CRM = () => {
  const [columns] = useState<Column[]>(initialColumns);
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");

  const totalValue = columns.reduce((sum, col) => sum + col.leads.reduce((s, l) => s + l.valueNum, 0), 0);
  const totalDeals = columns.reduce((sum, col) => sum + col.leads.length, 0);

  return (
    <AppLayout>
      <div className="space-y-4 animate-fade-in">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("kanban")}
                className={cn(
                  "p-2 transition-colors",
                  viewMode === "kanban" ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/50"
                )}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "p-2 transition-colors",
                  viewMode === "list" ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/50"
                )}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
            <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors">
              <Plus className="w-4 h-4" />
              Deal
            </button>
          </div>

          <div className="relative flex-1 max-w-md mx-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar no CRM..."
              className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm text-foreground">
              <span className="font-semibold">R$ {totalValue.toLocaleString("pt-BR")}</span>
              <span className="text-muted-foreground mx-1">·</span>
              <span className="text-muted-foreground">{totalDeals} deals</span>
            </div>
            <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-sm text-foreground hover:bg-muted transition-colors">
              Pipeline de vendas
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
            <button className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
              <Pencil className="w-4 h-4" />
            </button>
            <button className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
              <Settings2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="flex gap-3 overflow-x-auto pb-4">
          {columns.map((column) => {
            const colTotal = column.leads.reduce((s, l) => s + l.valueNum, 0);
            return (
              <div key={column.id} className="flex-shrink-0 w-[240px]">
                {/* Column Header */}
                <div className="mb-3">
                  <h3 className="text-sm font-bold text-foreground">{column.title}</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-xs text-muted-foreground">
                      R$ {colTotal.toLocaleString("pt-BR")}
                    </span>
                    <span className="text-xs text-muted-foreground">·</span>
                    <span className="text-xs text-muted-foreground">
                      {column.leads.length} {column.leads.length === 1 ? "deal" : "deals"}
                    </span>
                  </div>
                </div>

                {/* Cards */}
                <div className="space-y-2">
                  {column.leads.map((lead) => (
                    <div
                      key={lead.id}
                      className="bg-card border border-border rounded-lg p-3 cursor-grab hover:shadow-md transition-shadow group relative"
                    >
                      {/* Alert indicator */}
                      {lead.alert && (
                        <div className={cn(
                          "absolute top-2 right-2 w-2 h-2 rounded-full",
                          lead.alert === "danger" ? "bg-destructive" : "bg-chart-4"
                        )} />
                      )}

                      <div className="flex items-start justify-between pr-4">
                        <div>
                          <p className="text-sm font-medium text-foreground leading-tight">{lead.name}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{lead.company}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-2">
                        {lead.tag && (
                          <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded", lead.tag.color)}>
                            {lead.tag.label}
                          </span>
                        )}
                        <span className="text-sm font-semibold text-foreground">{lead.value}</span>
                      </div>

                      {/* Progress bar */}
                      {lead.progress !== undefined && (
                        <div className="mt-3 w-full h-1 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all"
                            style={{ width: `${lead.progress}%` }}
                          />
                        </div>
                      )}

                      {/* More button on hover */}
                      <button className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-muted">
                        <MoreHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
};

export default CRM;
