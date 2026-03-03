import { FlowStep, VARIABLES } from "./types";
import { Badge } from "@/components/ui/badge";
import { Clock, MessageSquare, GitBranch, Zap, Timer } from "lucide-react";

interface FlowStepVisualProps {
  step: FlowStep;
  index: number;
  isLast: boolean;
}

const stepConfig = {
  trigger: { icon: Zap, label: "Gatilho", color: "text-amber-500", bg: "bg-amber-500/10 border-amber-500/20" },
  wait: { icon: Timer, label: "Aguardar", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
  message: { icon: MessageSquare, label: "Mensagem", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
  condition: { icon: GitBranch, label: "Condição", color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20" },
  action: { icon: Clock, label: "Ação", color: "text-primary", bg: "bg-primary/10 border-primary/20" },
};

function highlightVariables(text: string) {
  const parts = text.split(/(\{[^}]+\})/g);
  return parts.map((part, i) => {
    if (VARIABLES.some((v) => v.key === part)) {
      return (
        <span key={i} className="inline-flex items-center px-1 py-0.5 rounded bg-primary/15 text-primary text-[10px] font-semibold mx-0.5">
          {part}
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

function getStepDescription(step: FlowStep) {
  switch (step.type) {
    case "trigger":
      return `Cliente sem resposta há ${step.config.days} dia(s)`;
    case "wait": {
      const h = step.config.hours || 0;
      if (h >= 24) return `Aguardar ${Math.floor(h / 24)} dia(s)`;
      if (h > 0) return `Aguardar ${h}h`;
      return "Sem espera adicional";
    }
    case "message":
      return step.config.text;
    case "condition":
      return `Se ${step.config.check === "respondeu" ? "cliente respondeu" : step.config.check}: ${step.config.yesAction} / ${step.config.noAction}`;
    case "action":
      return step.config.description || "Ação personalizada";
    default:
      return "";
  }
}

export function FlowStepVisual({ step, index, isLast }: FlowStepVisualProps) {
  const cfg = stepConfig[step.type];
  const Icon = cfg.icon;
  const desc = getStepDescription(step);

  return (
    <div className="flex items-start gap-3">
      {/* Vertical line + dot */}
      <div className="flex flex-col items-center">
        <div className={`w-8 h-8 rounded-lg border ${cfg.bg} flex items-center justify-center shrink-0`}>
          <Icon className={`w-4 h-4 ${cfg.color}`} />
        </div>
        {!isLast && <div className="w-px h-full min-h-[24px] bg-border" />}
      </div>

      {/* Content */}
      <div className="pb-4 flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold text-foreground">{cfg.label}</span>
          <Badge variant="outline" className="text-[9px] px-1.5 py-0">{index + 1}</Badge>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {step.type === "message" ? highlightVariables(desc) : desc}
        </p>
      </div>
    </div>
  );
}
