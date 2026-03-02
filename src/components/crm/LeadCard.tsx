import { DragEvent } from "react";
import { cn } from "@/lib/utils";
import { Phone, Mail, Clock, Building2, GripVertical, MessageSquare, Globe, Megaphone, Users2 } from "lucide-react";
import { Lead } from "./types";
import { tagColors } from "./data";

interface LeadCardProps {
  lead: Lead;
  columnId: string;
  onDragStart: (e: DragEvent, lead: Lead, columnId: string) => void;
  onDragEnd: (e: DragEvent) => void;
  onClick?: (lead: Lead) => void;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

const getInitials = (name: string) =>
  name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

const assigneeColors: Record<string, string> = {
  VS: "bg-blue-500",
  AL: "bg-purple-500",
  MR: "bg-amber-500",
};

const originIcons: Record<string, { icon: typeof MessageSquare; label: string }> = {
  whatsapp: { icon: MessageSquare, label: "WhatsApp" },
  site: { icon: Globe, label: "Site" },
  indicacao: { icon: Users2, label: "Indicação" },
  anuncio: { icon: Megaphone, label: "Anúncio" },
};

function getTemperature(score?: number): { label: string; color: string; emoji: string } {
  if (!score || score < 40) return { label: "Frio", color: "bg-blue-500/10 text-blue-500 ring-1 ring-blue-500/20", emoji: "❄️" };
  if (score < 70) return { label: "Morno", color: "bg-amber-500/10 text-amber-500 ring-1 ring-amber-500/20", emoji: "🌤" };
  return { label: "Quente", color: "bg-red-500/10 text-red-500 ring-1 ring-red-500/20", emoji: "🔥" };
}

export function LeadCard({ lead, columnId, onDragStart, onDragEnd, onClick }: LeadCardProps) {
  const temp = getTemperature(lead.score);
  const originInfo = lead.origin ? originIcons[lead.origin] : null;
  const OriginIcon = originInfo?.icon;

  return (
    <div
      draggable
      onClick={() => onClick?.(lead)}
      onDragStart={(e) => {
        onDragStart(e, lead, columnId);
        requestAnimationFrame(() => {
          if (e.currentTarget instanceof HTMLElement) {
            e.currentTarget.style.transition = "transform 0.3s cubic-bezier(0.22,1,0.36,1), opacity 0.3s ease";
            e.currentTarget.style.opacity = "0.35";
            e.currentTarget.style.transform = "scale(0.97) rotate(1deg)";
          }
        });
      }}
      onDragEnd={(e) => {
        if (e.currentTarget instanceof HTMLElement) {
          e.currentTarget.style.transition = "transform 0.4s cubic-bezier(0.22,1,0.36,1), opacity 0.3s ease";
          e.currentTarget.style.opacity = "1";
          e.currentTarget.style.transform = "scale(1) rotate(0deg)";
        }
        onDragEnd(e);
      }}
      className={cn(
        "bg-card rounded-lg p-3.5 cursor-grab active:cursor-grabbing",
        "border border-border/60 hover:border-primary/30",
        "hover:shadow-lg hover:shadow-primary/5 group select-none relative",
        "transition-[transform,opacity,box-shadow,border-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
        "active:scale-[0.98] active:shadow-xl active:shadow-primary/10"
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-2.5">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0 ring-1 ring-primary/10">
            <span className="text-[11px] font-bold text-primary">{getInitials(lead.name)}</span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">{lead.name}</p>
            {lead.company && (
              <div className="flex items-center gap-1 mt-0.5">
                <Building2 className="w-3 h-3 text-muted-foreground/60" />
                <p className="text-[11px] text-muted-foreground truncate">{lead.company}</p>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          {/* Score badge */}
          {lead.score !== undefined && (
            <span className={cn("text-[9px] px-1.5 py-0.5 rounded-full font-semibold", temp.color)}>
              {temp.emoji} {lead.score}
            </span>
          )}
          <GripVertical className="w-3.5 h-3.5 text-muted-foreground/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

      {/* Contact info */}
      <div className="space-y-1 mb-2.5">
        <div className="flex items-center gap-1.5">
          <Phone className="w-3 h-3 text-muted-foreground/50" />
          <span className="text-[11px] text-muted-foreground">{lead.phone}</span>
        </div>
        {lead.email && (
          <div className="flex items-center gap-1.5">
            <Mail className="w-3 h-3 text-muted-foreground/50" />
            <span className="text-[11px] text-muted-foreground truncate">{lead.email}</span>
          </div>
        )}
      </div>

      {/* Value + probability bar */}
      <div className="mb-2.5">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-sm font-bold text-foreground">{formatCurrency(lead.value)}</span>
          {lead.probability !== undefined && (
            <span className="text-[10px] font-medium text-muted-foreground">{lead.probability}%</span>
          )}
        </div>
        {lead.probability !== undefined && (
          <div className="w-full h-1 rounded-full bg-muted overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                lead.probability >= 75 ? "bg-emerald-500" :
                lead.probability >= 50 ? "bg-amber-500" :
                lead.probability >= 25 ? "bg-blue-500" : "bg-muted-foreground/30"
              )}
              style={{ width: `${lead.probability}%` }}
            />
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {/* Origin icon */}
          {OriginIcon && (
            <span className={cn("text-[9px] px-1.5 py-0.5 rounded font-medium inline-flex items-center gap-1", {
              "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400": lead.origin === "whatsapp",
              "bg-purple-500/10 text-purple-600 dark:text-purple-400": lead.origin === "site",
              "bg-blue-500/10 text-blue-600 dark:text-blue-400": lead.origin === "indicacao",
              "bg-amber-500/10 text-amber-600 dark:text-amber-400": lead.origin === "anuncio",
            })}>
              <OriginIcon className="w-3 h-3" />
              {originInfo.label}
            </span>
          )}
          {lead.tag && (
            <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-medium", tagColors[lead.tag] || "bg-muted text-muted-foreground")}>
              {lead.tag}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-muted-foreground/40" />
            <span className="text-[10px] text-muted-foreground/60">{lead.lastContact}</span>
          </div>
          {lead.assignee && (
            <div className={cn("w-5 h-5 rounded-full flex items-center justify-center", assigneeColors[lead.assignee] || "bg-muted")}>
              <span className="text-[8px] font-bold text-white">{lead.assignee}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
