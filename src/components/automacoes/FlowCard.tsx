import { AutomationFlow } from "./types";
import { FlowStepVisual } from "./FlowStepVisual";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Pencil, Trash2, ChevronDown, ChevronUp, Send, MessageSquare, UserCheck, Clock } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const categoryLabels: Record<string, { label: string; className: string }> = {
  "follow-up": { label: "Follow-up", className: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
  "pos-venda": { label: "Pós-venda", className: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
  "reengajamento": { label: "Reengajamento", className: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
  "custom": { label: "Personalizado", className: "bg-purple-500/10 text-purple-500 border-purple-500/20" },
};

interface FlowCardProps {
  flow: AutomationFlow;
  onToggle: (id: string) => void;
  onEdit: (flow: AutomationFlow) => void;
  onDelete: (id: string) => void;
}

export function FlowCard({ flow, onToggle, onEdit, onDelete }: FlowCardProps) {
  const [expanded, setExpanded] = useState(false);
  const cat = categoryLabels[flow.category] || categoryLabels.custom;
  const recoveryRate = flow.stats.sent > 0 ? Math.round((flow.stats.recovered / flow.stats.sent) * 100) : 0;

  return (
    <div className="glass-card rounded-xl overflow-hidden transition-all hover:shadow-md">
      {/* Header */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h3 className="font-semibold text-foreground text-sm">{flow.name}</h3>
              <Badge variant="outline" className={`text-[10px] ${cat.className}`}>{cat.label}</Badge>
              {!flow.active && <Badge variant="secondary" className="text-[10px]">Pausado</Badge>}
            </div>
            <p className="text-xs text-muted-foreground">{flow.description}</p>
          </div>
          <Switch checked={flow.active} onCheckedChange={() => onToggle(flow.id)} />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-muted/50">
            <Send className="w-3.5 h-3.5 text-blue-400" />
            <div>
              <p className="text-xs font-bold text-foreground">{flow.stats.sent}</p>
              <p className="text-[10px] text-muted-foreground">Enviadas</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-muted/50">
            <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
            <div>
              <p className="text-xs font-bold text-foreground">{flow.stats.replied}</p>
              <p className="text-[10px] text-muted-foreground">Responderam</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-muted/50">
            <UserCheck className="w-3.5 h-3.5 text-amber-400" />
            <div>
              <p className="text-xs font-bold text-foreground">{recoveryRate}%</p>
              <p className="text-[10px] text-muted-foreground">Recuperados</p>
            </div>
          </div>
        </div>

        {flow.lastTriggered && (
          <div className="flex items-center gap-1.5 mt-3 text-[10px] text-muted-foreground">
            <Clock className="w-3 h-3" />
            Último disparo: {flow.lastTriggered}
          </div>
        )}
      </div>

      {/* Expand/Collapse */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-center gap-1.5 py-2.5 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors border-t border-border/50"
      >
        {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        {expanded ? "Ocultar fluxo" : `Ver fluxo (${flow.steps.length} etapas)`}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-4 pt-2 border-t border-border/50 bg-muted/20">
              {flow.steps.map((step, i) => (
                <FlowStepVisual key={step.id} step={step} index={i} isLast={i === flow.steps.length - 1} />
              ))}
            </div>
            <div className="flex items-center justify-end gap-1 px-4 pb-3">
              <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={() => onEdit(flow)}>
                <Pencil className="w-3 h-3" /> Editar
              </Button>
              <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 text-destructive hover:text-destructive" onClick={() => onDelete(flow.id)}>
                <Trash2 className="w-3 h-3" /> Excluir
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
