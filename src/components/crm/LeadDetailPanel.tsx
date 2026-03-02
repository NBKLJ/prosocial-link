import { useState } from "react";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import { Lead, Pipeline } from "./types";
import { cn } from "@/lib/utils";
import {
  Phone, Mail, Building2, Clock, User, MessageSquare,
  FileText, Calendar, ArrowRight, Plus, Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";

import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface LeadDetailPanelProps {
  lead: Lead | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pipelines: Pipeline[];
  currentStageId: string | null;
  onMoveStage: (leadId: string, toStageId: string) => void;
  onAddNote: (leadId: string, note: string) => void;
  onUpdateLead: (lead: Lead) => void;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

function getTemperature(score?: number) {
  if (!score || score < 40) return { label: "Frio", color: "text-blue-500", bg: "bg-blue-500/10", emoji: "❄️" };
  if (score < 70) return { label: "Morno", color: "text-amber-500", bg: "bg-amber-500/10", emoji: "🌤" };
  return { label: "Quente", color: "text-red-500", bg: "bg-red-500/10", emoji: "🔥" };
}

const eventIcons: Record<string, typeof MessageSquare> = {
  message: MessageSquare, call: Phone, email: Mail, note: FileText,
  stage_change: ArrowRight, proposal: Send, meeting: Calendar,
};

export function LeadDetailPanel({
  lead, open, onOpenChange, pipelines, currentStageId,
  onMoveStage, onAddNote, onUpdateLead,
}: LeadDetailPanelProps) {
  const [newNote, setNewNote] = useState("");
  const [activeSection, setActiveSection] = useState<"timeline" | "notes" | "actions">("timeline");

  if (!lead) return null;

  const temp = getTemperature(lead.score);
  const stage = pipelines.find(p => p.id === currentStageId);

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    onAddNote(lead.id, newNote.trim());
    setNewNote("");
    toast.success("Nota adicionada");
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[480px] sm:max-w-[480px] overflow-y-auto p-0">
        {/* Header */}
        <div className="p-6 border-b border-border/50 bg-gradient-to-b from-primary/5 to-transparent">
          <SheetHeader className="mb-4">
            <SheetTitle className="text-lg">{lead.name}</SheetTitle>
          </SheetHeader>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center ring-2 ring-primary/10">
              <span className="text-lg font-bold text-primary">
                {lead.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
              </span>
            </div>
            <div className="flex-1">
              {lead.company && (
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Building2 className="w-3.5 h-3.5" />
                  <span className="text-sm">{lead.company}</span>
                </div>
              )}
              <div className="flex items-center gap-2 mt-1">
                <span className={cn("text-xs px-2 py-0.5 rounded-full font-semibold", temp.bg, temp.color)}>
                  {temp.emoji} Score: {lead.score ?? "—"}
                </span>
                {stage && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
                    {stage.title}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick info */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Phone className="w-3.5 h-3.5" />{lead.phone}
            </div>
            {lead.email && (
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Mail className="w-3.5 h-3.5" /><span className="truncate">{lead.email}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />{lead.lastContact}
            </div>
            {lead.assignee && (
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <User className="w-3.5 h-3.5" />Resp: {lead.assignee}
              </div>
            )}
          </div>

          {/* Value + Probability */}
          <div className="mt-4 p-3 rounded-lg bg-card border border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Valor</p>
                <p className="text-lg font-bold text-foreground">{formatCurrency(lead.value)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Probabilidade</p>
                <p className="text-lg font-bold text-foreground">{lead.probability ?? 0}%</p>
              </div>
            </div>
            {lead.probability !== undefined && (
              <div className="w-full h-2 rounded-full bg-muted mt-2 overflow-hidden">
                <div
                  className={cn("h-full rounded-full transition-all", lead.probability >= 75 ? "bg-emerald-500" : lead.probability >= 50 ? "bg-amber-500" : "bg-blue-500")}
                  style={{ width: `${lead.probability}%` }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border/50">
          {(["timeline", "notes", "actions"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveSection(tab)}
              className={cn(
                "flex-1 py-3 text-xs font-semibold transition-colors",
                activeSection === tab ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab === "timeline" ? "Timeline" : tab === "notes" ? "Notas" : "Ações"}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-5">
          {activeSection === "timeline" && (
            <div className="space-y-3">
              {(lead.interactionHistory || []).slice().reverse().map((event) => {
                const Icon = eventIcons[event.type] || MessageSquare;
                return (
                  <div key={event.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-3.5 h-3.5 text-primary" />
                      </div>
                      <div className="w-px flex-1 bg-border/50 mt-1" />
                    </div>
                    <div className="pb-4">
                      <p className="text-sm text-foreground">{event.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-muted-foreground">
                          {new Date(event.timestamp).toLocaleDateString("pt-BR")} às{" "}
                          {new Date(event.timestamp).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                        {event.by && <span className="text-[10px] text-primary font-medium">por {event.by}</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
              {(!lead.interactionHistory || lead.interactionHistory.length === 0) && (
                <p className="text-sm text-muted-foreground text-center py-8">Nenhuma interação registrada</p>
              )}
            </div>
          )}

          {activeSection === "notes" && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <Textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Adicionar nota interna..."
                  className="min-h-[60px] text-sm"
                />
                <Button size="sm" onClick={handleAddNote} disabled={!newNote.trim()} className="self-end">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-2">
                {(lead.notes || []).slice().reverse().map((note, i) => (
                  <div key={i} className="p-3 rounded-lg bg-muted/50 border border-border/30">
                    <p className="text-sm text-foreground">{note}</p>
                  </div>
                ))}
                {(!lead.notes || lead.notes.length === 0) && (
                  <p className="text-sm text-muted-foreground text-center py-4">Nenhuma nota ainda</p>
                )}
              </div>
            </div>
          )}

          {activeSection === "actions" && (
            <div className="space-y-4">
              {/* Move stage */}
              <div>
                <p className="text-xs font-semibold text-foreground mb-2">Mover para estágio</p>
                <div className="grid grid-cols-2 gap-2">
                  {pipelines.map(p => (
                    <button
                      key={p.id}
                      onClick={() => { onMoveStage(lead.id, p.id); toast.success(`Lead movido para ${p.title}`); }}
                      disabled={p.id === currentStageId}
                      className={cn(
                        "px-3 py-2 rounded-lg text-xs font-medium border transition-colors text-left",
                        p.id === currentStageId
                          ? "bg-primary/10 border-primary/30 text-primary"
                          : "border-border/50 hover:border-primary/30 hover:bg-muted/50 text-foreground"
                      )}
                    >
                      {p.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Assignee */}
              <div>
                <p className="text-xs font-semibold text-foreground mb-2">Atribuir responsável</p>
                <div className="flex gap-2">
                  {["VS", "AL", "MR", "JP"].map(a => (
                    <button
                      key={a}
                      onClick={() => {
                        onUpdateLead({ ...lead, assignee: a });
                        toast.success(`Lead atribuído a ${a}`);
                      }}
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                        lead.assignee === a
                          ? "bg-primary text-primary-foreground ring-2 ring-primary/30"
                          : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
                      )}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>

              {/* Add tag */}
              <div>
                <p className="text-xs font-semibold text-foreground mb-2">Etiqueta</p>
                <div className="flex gap-2 flex-wrap">
                  {["Quente", "VIP", "Indicação", "Enterprise", "Recorrente"].map(t => (
                    <button
                      key={t}
                      onClick={() => {
                        onUpdateLead({ ...lead, tag: lead.tag === t ? undefined : t });
                        toast.success(lead.tag === t ? "Etiqueta removida" : `Etiqueta "${t}" adicionada`);
                      }}
                      className={cn(
                        "text-[11px] px-3 py-1.5 rounded-full font-medium border transition-colors",
                        lead.tag === t
                          ? "bg-primary/10 border-primary/30 text-primary"
                          : "border-border/50 text-muted-foreground hover:border-primary/20"
                      )}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
