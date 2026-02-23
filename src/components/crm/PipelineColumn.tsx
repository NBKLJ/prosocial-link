import { DragEvent } from "react";
import { cn } from "@/lib/utils";
import { Plus, MoreHorizontal, Users } from "lucide-react";
import { Pipeline, Lead } from "./types";
import { stageColors } from "./data";
import { LeadCard } from "./LeadCard";

interface PipelineColumnProps {
  pipeline: Pipeline;
  dragOverColumn: string | null;
  draggedFromColumn: string | null;
  onDragStart: (e: DragEvent, lead: Lead, columnId: string) => void;
  onDragEnd: (e: DragEvent) => void;
  onDragEnter: (e: DragEvent, columnId: string) => void;
  onDragLeave: (e: DragEvent, columnId: string) => void;
  onDragOver: (e: DragEvent) => void;
  onDrop: (e: DragEvent, columnId: string) => void;
  isDraggingColumn?: boolean;
  isColumnDropTarget?: boolean;
  onColumnDragStart?: (e: DragEvent, columnId: string) => void;
  onColumnDragOver?: (e: DragEvent, columnId: string) => void;
  onColumnDrop?: (e: DragEvent, columnId: string) => void;
  onColumnDragEnd?: () => void;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(value);

export function PipelineColumn({
  pipeline,
  dragOverColumn,
  draggedFromColumn,
  onDragStart,
  onDragEnd,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  isDraggingColumn,
  isColumnDropTarget,
  onColumnDragStart,
  onColumnDragOver,
  onColumnDrop,
  onColumnDragEnd,
}: PipelineColumnProps) {
  const colors = stageColors[pipeline.id] || stageColors.qualified;
  const totalValue = pipeline.leads.reduce((sum, l) => sum + l.value, 0);
  const isDropTarget = dragOverColumn === pipeline.id && draggedFromColumn !== pipeline.id;

  return (
    <div
      className={cn(
        "flex-shrink-0 w-[310px] flex flex-col rounded-xl h-full",
        "bg-muted/30 dark:bg-muted/10",
        "transition-[transform,opacity,box-shadow,background-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
        isDropTarget && "ring-2 ring-primary/40 bg-primary/5 scale-[1.01]",
        isDraggingColumn && "opacity-40 scale-[0.96] rotate-[0.5deg]",
        isColumnDropTarget && "ring-2 ring-accent-violet/40 scale-[1.02] shadow-lg shadow-accent-violet/10"
      )}
      onDragEnter={(e) => onDragEnter(e, pipeline.id)}
      onDragLeave={(e) => onDragLeave(e, pipeline.id)}
      onDragOver={(e) => {
        onDragOver(e);
        onColumnDragOver?.(e, pipeline.id);
      }}
      onDrop={(e) => {
        onDrop(e, pipeline.id);
        onColumnDrop?.(e, pipeline.id);
      }}
    >
      {/* Column top bar */}
      <div className={cn("h-1 rounded-t-xl", colors.bar)} />

      {/* Header - draggable for column reorder */}
      <div
        className="px-3 py-3 cursor-grab active:cursor-grabbing"
        draggable
        onDragStart={(e) => {
          e.stopPropagation();
          onColumnDragStart?.(e, pipeline.id);
        }}
        onDragEnd={() => onColumnDragEnd?.()}
      >
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <h3 className="text-[13px] font-semibold text-foreground">{pipeline.title}</h3>
            <span className={cn("text-[11px] font-semibold px-2 py-0.5 rounded-full", colors.bg, colors.text)}>
              {pipeline.leads.length}
            </span>
          </div>
          <div className="flex items-center gap-0.5">
            <button className="p-1.5 rounded-md hover:bg-muted transition-colors">
              <Plus className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
            <button className="p-1.5 rounded-md hover:bg-muted transition-colors">
              <MoreHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          </div>
        </div>
        <p className="text-[11px] text-muted-foreground font-medium">{formatCurrency(totalValue)}</p>
      </div>

      {/* Cards */}
      <div className="flex-1 overflow-y-auto space-y-2 px-2 pb-3 min-h-[80px] transition-all duration-300">
        {pipeline.leads.map((lead) => (
          <LeadCard
            key={lead.id}
            lead={lead}
            columnId={pipeline.id}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
          />
        ))}

        {pipeline.leads.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 text-muted-foreground/40">
            <Users className="w-6 h-6 mb-1.5" />
            <p className="text-[11px]">Sem leads neste estágio</p>
          </div>
        )}
      </div>
    </div>
  );
}
