import { AppLayout } from "@/components/AppLayout";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { GripVertical, Plus, MoreHorizontal } from "lucide-react";

interface Lead {
  id: string;
  name: string;
  phone: string;
  value: string;
  lastContact: string;
  tag?: string;
}

interface Column {
  id: string;
  title: string;
  color: string;
  leads: Lead[];
}

const initialColumns: Column[] = [
  {
    id: "new",
    title: "Novo Lead",
    color: "bg-primary",
    leads: [
      { id: "1", name: "João Silva", phone: "(11) 99999-1234", value: "R$ 2.500", lastContact: "Há 2h", tag: "Quente" },
      { id: "2", name: "Maria Souza", phone: "(21) 98888-5678", value: "R$ 1.800", lastContact: "Há 5h" },
      { id: "3", name: "Carlos Lima", phone: "(31) 97777-9012", value: "R$ 4.200", lastContact: "Há 1d", tag: "Indicação" },
    ],
  },
  {
    id: "negotiation",
    title: "Em Negociação",
    color: "bg-chart-2",
    leads: [
      { id: "4", name: "Ana Costa", phone: "(41) 96666-3456", value: "R$ 5.000", lastContact: "Há 3h", tag: "VIP" },
      { id: "5", name: "Pedro Rocha", phone: "(51) 95555-7890", value: "R$ 3.200", lastContact: "Há 1d" },
    ],
  },
  {
    id: "closed",
    title: "Fechado",
    color: "bg-chart-4",
    leads: [
      { id: "6", name: "Lucia Santos", phone: "(61) 94444-1234", value: "R$ 8.500", lastContact: "Há 2d", tag: "Recorrente" },
    ],
  },
  {
    id: "lost",
    title: "Perdido",
    color: "bg-destructive",
    leads: [
      { id: "7", name: "Roberto Dias", phone: "(71) 93333-5678", value: "R$ 1.200", lastContact: "Há 5d" },
    ],
  },
];

const tagColors: Record<string, string> = {
  Quente: "bg-destructive/15 text-destructive",
  Indicação: "bg-primary/15 text-primary",
  VIP: "bg-chart-4/15 text-chart-4",
  Recorrente: "bg-chart-2/15 text-chart-2",
};

const CRM = () => {
  const [columns] = useState<Column[]>(initialColumns);

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">CRM</h1>
            <p className="text-muted-foreground mt-1">Gerencie seus leads no Kanban</p>
          </div>
          <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors">
            <Plus className="w-4 h-4" />
            Novo Lead
          </button>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4">
          {columns.map((column) => (
            <div key={column.id} className="flex-shrink-0 w-[300px]">
              <div className="flex items-center gap-2 mb-3">
                <div className={cn("w-2.5 h-2.5 rounded-full", column.color)} />
                <h3 className="text-sm font-semibold text-foreground">{column.title}</h3>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  {column.leads.length}
                </span>
              </div>
              <div className="space-y-2">
                {column.leads.map((lead) => (
                  <div
                    key={lead.id}
                    className="glass-card rounded-lg p-4 cursor-grab hover:shadow-md transition-shadow group"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <GripVertical className="w-4 h-4 text-muted-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span className="font-medium text-sm text-foreground">{lead.name}</span>
                      </div>
                      <MoreHorizontal className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" />
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{lead.phone}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-primary">{lead.value}</span>
                      <span className="text-xs text-muted-foreground">{lead.lastContact}</span>
                    </div>
                    {lead.tag && (
                      <span className={cn(
                        "inline-block mt-2 text-xs px-2 py-0.5 rounded-full font-medium",
                        tagColors[lead.tag] || "bg-muted text-muted-foreground"
                      )}>
                        {lead.tag}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default CRM;
