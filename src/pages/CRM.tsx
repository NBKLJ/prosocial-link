import { AppLayout } from "@/components/AppLayout";
import { useState, useRef, DragEvent } from "react";
import { cn } from "@/lib/utils";
import { Plus, MoreHorizontal, Phone, Clock, Users, GripVertical, Search } from "lucide-react";

interface Lead {
  id: string;
  name: string;
  phone: string;
  value: string;
  lastContact: string;
  tag?: string;
  avatar?: string;
}

interface Column {
  id: string;
  title: string;
  color: string;
  dotColor: string;
  leads: Lead[];
}

const initialColumns: Column[] = [
  {
    id: "new",
    title: "Novo Lead",
    color: "border-t-primary",
    dotColor: "bg-primary",
    leads: [
      { id: "1", name: "João Silva", phone: "(11) 99999-1234", value: "R$ 2.500", lastContact: "Há 2h", tag: "Quente" },
      { id: "2", name: "Maria Souza", phone: "(21) 98888-5678", value: "R$ 1.800", lastContact: "Há 5h" },
      { id: "3", name: "Carlos Lima", phone: "(31) 97777-9012", value: "R$ 4.200", lastContact: "Há 1d", tag: "Indicação" },
    ],
  },
  {
    id: "negotiation",
    title: "Em Negociação",
    color: "border-t-chart-2",
    dotColor: "bg-chart-2",
    leads: [
      { id: "4", name: "Ana Costa", phone: "(41) 96666-3456", value: "R$ 5.000", lastContact: "Há 3h", tag: "VIP" },
      { id: "5", name: "Pedro Rocha", phone: "(51) 95555-7890", value: "R$ 3.200", lastContact: "Há 1d" },
    ],
  },
  {
    id: "closed",
    title: "Fechado",
    color: "border-t-chart-4",
    dotColor: "bg-chart-4",
    leads: [
      { id: "6", name: "Lucia Santos", phone: "(61) 94444-1234", value: "R$ 8.500", lastContact: "Há 2d", tag: "Recorrente" },
    ],
  },
  {
    id: "lost",
    title: "Perdido",
    color: "border-t-destructive",
    dotColor: "bg-destructive",
    leads: [
      { id: "7", name: "Roberto Dias", phone: "(71) 93333-5678", value: "R$ 1.200", lastContact: "Há 5d" },
    ],
  },
];

const tagColors: Record<string, string> = {
  Quente: "bg-destructive/15 text-destructive border border-destructive/20",
  Indicação: "bg-primary/15 text-primary border border-primary/20",
  VIP: "bg-chart-4/15 text-chart-4 border border-chart-4/20",
  Recorrente: "bg-chart-2/15 text-chart-2 border border-chart-2/20",
};

const getInitials = (name: string) =>
  name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

const CRM = () => {
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [draggedLead, setDraggedLead] = useState<{ lead: Lead; fromColumnId: string } | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const dragCounter = useRef<Record<string, number>>({});

  const filteredColumns = columns.map((col) => ({
    ...col,
    leads: col.leads.filter((lead) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        lead.name.toLowerCase().includes(q) ||
        lead.value.toLowerCase().includes(q) ||
        (lead.tag && lead.tag.toLowerCase().includes(q))
      );
    }),
  }));

  const totalLeads = columns.reduce((sum, col) => sum + col.leads.length, 0);
  const totalValue = columns.reduce(
    (sum, col) => sum + col.leads.reduce((s, l) => s + parseFloat(l.value.replace(/[^\d,]/g, "").replace(",", ".")), 0),
    0
  );
  const closedLeads = columns.find((c) => c.id === "closed")?.leads.length || 0;

  const handleDragStart = (e: DragEvent, lead: Lead, columnId: string) => {
    setDraggedLead({ lead, fromColumnId: columnId });
    e.dataTransfer.effectAllowed = "move";
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = "0.5";
    }
  };

  const handleDragEnd = (e: DragEvent) => {
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = "1";
    }
    setDraggedLead(null);
    setDragOverColumn(null);
    dragCounter.current = {};
  };

  const handleDragEnter = (e: DragEvent, columnId: string) => {
    e.preventDefault();
    dragCounter.current[columnId] = (dragCounter.current[columnId] || 0) + 1;
    setDragOverColumn(columnId);
  };

  const handleDragLeave = (e: DragEvent, columnId: string) => {
    e.preventDefault();
    dragCounter.current[columnId] = (dragCounter.current[columnId] || 0) - 1;
    if (dragCounter.current[columnId] <= 0) {
      dragCounter.current[columnId] = 0;
      if (dragOverColumn === columnId) setDragOverColumn(null);
    }
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: DragEvent, toColumnId: string) => {
    e.preventDefault();
    if (!draggedLead || draggedLead.fromColumnId === toColumnId) return;

    setColumns((prev) =>
      prev.map((col) => {
        if (col.id === draggedLead.fromColumnId) {
          return { ...col, leads: col.leads.filter((l) => l.id !== draggedLead.lead.id) };
        }
        if (col.id === toColumnId) {
          return { ...col, leads: [...col.leads, draggedLead.lead] };
        }
        return col;
      })
    );

    setDraggedLead(null);
    setDragOverColumn(null);
    dragCounter.current = {};
  };

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">CRM</h1>
            <p className="text-muted-foreground mt-1">Gerencie seus leads no Kanban</p>
          </div>
          <div className="relative w-[420px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
            <input
              type="text"
              placeholder="Buscar por nome, valor ou tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-5 py-3 rounded-2xl bg-muted/50 border-none text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-muted/80 transition-all shadow-sm"
            />
          </div>
          <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors shadow-sm">
            <Plus className="w-4 h-4" />
            Novo Lead
          </button>
        </div>

        {/* Kanban */}
        <div className="flex gap-4 overflow-x-auto pb-4">
          {filteredColumns.map((column) => (
            <div
              key={column.id}
              className={cn(
                "flex-shrink-0 w-[300px] rounded-xl border-t-[3px] transition-all duration-200",
                column.color,
                dragOverColumn === column.id && draggedLead?.fromColumnId !== column.id
                  ? "bg-primary/5 ring-2 ring-primary/30"
                  : ""
              )}
              onDragEnter={(e) => handleDragEnter(e, column.id)}
              onDragLeave={(e) => handleDragLeave(e, column.id)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between px-3 py-3">
                <div className="flex items-center gap-2">
                  <div className={cn("w-2.5 h-2.5 rounded-full", column.dotColor)} />
                  <h3 className="text-sm font-semibold text-foreground">{column.title}</h3>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full font-medium">
                    {column.leads.length}
                  </span>
                </div>
                <button className="p-1 rounded-md hover:bg-muted transition-colors">
                  <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>

              {/* Cards */}
              <div className="space-y-2.5 px-2 pb-3 min-h-[100px]">
                {column.leads.map((lead) => (
                  <div
                    key={lead.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, lead, column.id)}
                    onDragEnd={handleDragEnd}
                    className={cn(
                      "bg-card rounded-lg p-3.5 cursor-grab active:cursor-grabbing border border-border",
                      "hover:shadow-md hover:border-primary/20 transition-all duration-200 group",
                      "select-none"
                    )}
                  >
                    {/* Top row: avatar + name + grip */}
                    <div className="flex items-center gap-2.5 mb-2.5">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-semibold text-primary">{getInitials(lead.name)}</span>
                      </div>
                      <span className="font-medium text-sm text-foreground flex-1 truncate">{lead.name}</span>
                      <GripVertical className="w-4 h-4 text-muted-foreground/30 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                    </div>

                    {/* Phone */}
                    <div className="flex items-center gap-1.5 mb-2">
                      <Phone className="w-3 h-3 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">{lead.phone}</p>
                    </div>

                    {/* Value + time */}
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-bold text-primary">{lead.value}</span>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{lead.lastContact}</span>
                      </div>
                    </div>

                    {/* Tag */}
                    {lead.tag && (
                      <span
                        className={cn(
                          "inline-block mt-2 text-[10px] px-2 py-0.5 rounded-full font-semibold",
                          tagColors[lead.tag] || "bg-muted text-muted-foreground"
                        )}
                      >
                        {lead.tag}
                      </span>
                    )}
                  </div>
                ))}

                {/* Empty state */}
                {column.leads.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-8 text-muted-foreground/50">
                    <Users className="w-8 h-8 mb-2" />
                    <p className="text-xs">Nenhum lead</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default CRM;
