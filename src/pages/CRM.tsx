import { AppLayout } from "@/components/AppLayout";
import { useState, useRef, DragEvent } from "react";
import { Plus, Search, SlidersHorizontal, ChevronDown } from "lucide-react";
import { Pipeline, Lead } from "@/components/crm/types";
import { initialPipelines } from "@/components/crm/data";
import { PipelineColumn } from "@/components/crm/PipelineColumn";


const CRM = () => {
  const [pipelines, setPipelines] = useState<Pipeline[]>(initialPipelines);
  const [draggedLead, setDraggedLead] = useState<{ lead: Lead; fromColumnId: string } | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const dragCounter = useRef<Record<string, number>>({});

  // Column reorder state
  const [draggedColumnId, setDraggedColumnId] = useState<string | null>(null);
  const [dragOverColumnId, setDragOverColumnId] = useState<string | null>(null);

  const filteredPipelines = pipelines.map((p) => ({
    ...p,
    leads: p.leads.filter((lead) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        lead.name.toLowerCase().includes(q) ||
        lead.company?.toLowerCase().includes(q) ||
        lead.email?.toLowerCase().includes(q) ||
        lead.tag?.toLowerCase().includes(q)
      );
    }),
  }));

  const handleDragStart = (e: DragEvent, lead: Lead, columnId: string) => {
    setDraggedLead({ lead, fromColumnId: columnId });
    e.dataTransfer.effectAllowed = "move";
    if (e.currentTarget instanceof HTMLElement) e.currentTarget.style.opacity = "0.4";
  };

  const handleDragEnd = (e: DragEvent) => {
    if (e.currentTarget instanceof HTMLElement) e.currentTarget.style.opacity = "1";
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

    setPipelines((prev) =>
      prev.map((p) => {
        if (p.id === draggedLead.fromColumnId) return { ...p, leads: p.leads.filter((l) => l.id !== draggedLead.lead.id) };
        if (p.id === toColumnId) return { ...p, leads: [...p.leads, draggedLead.lead] };
        return p;
      })
    );

    setDraggedLead(null);
    setDragOverColumn(null);
    dragCounter.current = {};
  };

  // Column reorder handlers
  const handleColumnDragStart = (e: DragEvent, columnId: string) => {
    setDraggedColumnId(columnId);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", columnId);
  };

  const handleColumnDragOver = (e: DragEvent, columnId: string) => {
    e.preventDefault();
    if (!draggedColumnId || draggedColumnId === columnId) return;
    setDragOverColumnId(columnId);
  };

  const handleColumnDrop = (e: DragEvent, targetColumnId: string) => {
    e.preventDefault();
    if (!draggedColumnId || draggedColumnId === targetColumnId) return;

    setPipelines((prev) => {
      const fromIndex = prev.findIndex((p) => p.id === draggedColumnId);
      const toIndex = prev.findIndex((p) => p.id === targetColumnId);
      if (fromIndex === -1 || toIndex === -1) return prev;
      const updated = [...prev];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      return updated;
    });

    setDraggedColumnId(null);
    setDragOverColumnId(null);
  };

  const handleColumnDragEnd = () => {
    setDraggedColumnId(null);
    setDragOverColumnId(null);
  };

  return (
    <AppLayout>
      <div className="space-y-5 animate-fade-in h-[calc(100vh-4rem)] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between flex-shrink-0">
          <div>
            <h1 className="text-xl font-bold text-foreground tracking-tight">Pipeline de Vendas</h1>
            <p className="text-[13px] text-muted-foreground mt-0.5">Gerencie e acompanhe suas oportunidades</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
              <input
                type="text"
                placeholder="Buscar leads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-[260px] pl-9 pr-4 py-2 rounded-lg bg-muted/50 border border-border/50 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
              />
            </div>
            <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border/50 bg-card text-sm text-muted-foreground hover:bg-muted transition-colors">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filtros
            </button>
            <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border/50 bg-card text-sm text-muted-foreground hover:bg-muted transition-colors">
              Pipeline
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors shadow-sm">
              <Plus className="w-4 h-4" />
              Novo Lead
            </button>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="flex gap-3 overflow-x-auto flex-1 pb-2 min-h-0">
          {filteredPipelines.map((pipeline) => (
            <PipelineColumn
              key={pipeline.id}
              pipeline={pipeline}
              dragOverColumn={dragOverColumn}
              draggedFromColumn={draggedLead?.fromColumnId || null}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              isDraggingColumn={draggedColumnId === pipeline.id}
              isColumnDropTarget={dragOverColumnId === pipeline.id && draggedColumnId !== pipeline.id}
              onColumnDragStart={handleColumnDragStart}
              onColumnDragOver={handleColumnDragOver}
              onColumnDrop={handleColumnDrop}
              onColumnDragEnd={handleColumnDragEnd}
            />
          ))}

          {/* Add column */}
          <button className="flex-shrink-0 w-[310px] rounded-xl border-2 border-dashed border-border/40 hover:border-primary/30 hover:bg-primary/5 flex items-center justify-center gap-2 text-sm text-muted-foreground/50 hover:text-primary/60 transition-all h-[120px] self-start">
            <Plus className="w-4 h-4" />
            Adicionar Estágio
          </button>
        </div>
      </div>
    </AppLayout>
  );
};

export default CRM;
