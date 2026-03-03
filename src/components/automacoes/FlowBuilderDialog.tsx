import { useState } from "react";
import { AutomationFlow, FlowStep, VARIABLES } from "./types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Trash2, Zap, Timer, MessageSquare, GitBranch, GripVertical } from "lucide-react";

interface FlowBuilderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  flow: AutomationFlow | null;
  onSave: (flow: AutomationFlow) => void;
}

const stepIcons = {
  trigger: Zap,
  wait: Timer,
  message: MessageSquare,
  condition: GitBranch,
  action: Zap,
};

const defaultStep = (type: FlowStep["type"]): FlowStep => {
  const id = `step-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  switch (type) {
    case "trigger": return { id, type, config: { type: "sem_resposta", days: 2 } };
    case "wait": return { id, type, config: { hours: 24, minutes: 0 } };
    case "message": return { id, type, config: { text: "" } };
    case "condition": return { id, type, config: { check: "respondeu", yesAction: "parar", noAction: "continuar" } };
    default: return { id, type, config: {} };
  }
};

export function FlowBuilderDialog({ open, onOpenChange, flow, onSave }: FlowBuilderDialogProps) {
  const [name, setName] = useState(flow?.name || "");
  const [description, setDescription] = useState(flow?.description || "");
  const [category, setCategory] = useState<AutomationFlow["category"]>(flow?.category || "follow-up");
  const [active, setActive] = useState(flow?.active ?? true);
  const [steps, setSteps] = useState<FlowStep[]>(
    flow?.steps || [defaultStep("trigger"), defaultStep("message")]
  );

  const handleReset = () => {
    setName(flow?.name || "");
    setDescription(flow?.description || "");
    setCategory(flow?.category || "follow-up");
    setActive(flow?.active ?? true);
    setSteps(flow?.steps || [defaultStep("trigger"), defaultStep("message")]);
  };

  const updateStep = (index: number, config: Record<string, any>) => {
    setSteps((prev) => prev.map((s, i) => (i === index ? { ...s, config: { ...s.config, ...config } } : s)));
  };

  const addStep = (type: FlowStep["type"]) => {
    setSteps((prev) => [...prev, defaultStep(type)]);
  };

  const removeStep = (index: number) => {
    if (steps.length <= 2) return;
    setSteps((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({
      id: flow?.id || `flow-${Date.now()}`,
      name,
      description,
      category,
      active,
      steps,
      stats: flow?.stats || { sent: 0, replied: 0, recovered: 0 },
      createdAt: flow?.createdAt || new Date().toISOString().split("T")[0],
      lastTriggered: flow?.lastTriggered,
    });
    onOpenChange(false);
  };

  // Reset when dialog opens with new flow
  const handleOpenChange = (val: boolean) => {
    if (val) handleReset();
    onOpenChange(val);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{flow ? "Editar Fluxo" : "Criar Novo Fluxo"}</DialogTitle>
          <DialogDescription>Configure o gatilho, mensagens e etapas do fluxo de follow-up.</DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Basic info */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5 col-span-2">
              <Label className="text-xs">Nome do Fluxo</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Follow-up Comercial" />
            </div>
            <div className="space-y-1.5 col-span-2">
              <Label className="text-xs">Descrição</Label>
              <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descreva o objetivo deste fluxo" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Categoria</Label>
              <Select value={category} onValueChange={(v) => setCategory(v as AutomationFlow["category"])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="follow-up">Follow-up</SelectItem>
                  <SelectItem value="pos-venda">Pós-venda</SelectItem>
                  <SelectItem value="reengajamento">Reengajamento</SelectItem>
                  <SelectItem value="custom">Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Status</Label>
              <div className="flex items-center gap-2 h-10">
                <Switch checked={active} onCheckedChange={setActive} />
                <span className="text-xs text-muted-foreground">{active ? "Ativo" : "Pausado"}</span>
              </div>
            </div>
          </div>

          {/* Steps */}
          <div>
            <Label className="text-xs mb-3 block">Etapas do Fluxo</Label>
            <div className="space-y-2">
              {steps.map((step, i) => {
                const Icon = stepIcons[step.type] || Zap;
                return (
                  <div key={step.id} className="flex items-start gap-2 p-3 rounded-lg border border-border/50 bg-muted/30">
                    <GripVertical className="w-4 h-4 text-muted-foreground mt-1 shrink-0 opacity-30" />
                    <Icon className="w-4 h-4 mt-1 shrink-0 text-primary" />
                    <div className="flex-1 space-y-2">
                      {step.type === "trigger" && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">Cliente sem resposta há</span>
                          <Input
                            type="number"
                            className="w-16 h-7 text-xs"
                            value={step.config.days || 2}
                            onChange={(e) => updateStep(i, { days: parseInt(e.target.value) || 1 })}
                          />
                          <span className="text-xs text-muted-foreground">dia(s)</span>
                        </div>
                      )}
                      {step.type === "wait" && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">Aguardar</span>
                          <Input
                            type="number"
                            className="w-16 h-7 text-xs"
                            value={step.config.hours || 0}
                            onChange={(e) => updateStep(i, { hours: parseInt(e.target.value) || 0 })}
                          />
                          <span className="text-xs text-muted-foreground">hora(s)</span>
                        </div>
                      )}
                      {step.type === "message" && (
                        <div className="space-y-1.5">
                          <Textarea
                            className="text-xs min-h-[60px] resize-none"
                            value={step.config.text || ""}
                            onChange={(e) => updateStep(i, { text: e.target.value })}
                            placeholder="Digite a mensagem... Use variáveis como {nome}, {dias_sem_resposta}"
                          />
                          <div className="flex flex-wrap gap-1">
                            {VARIABLES.map((v) => (
                              <button
                                key={v.key}
                                type="button"
                                className="text-[9px] px-1.5 py-0.5 rounded bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                                onClick={() => updateStep(i, { text: (step.config.text || "") + v.key })}
                                title={v.label}
                              >
                                {v.key}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      {step.type === "condition" && (
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs text-muted-foreground">Se cliente</span>
                          <Badge variant="outline" className="text-[10px]">respondeu → parar</Badge>
                          <Badge variant="outline" className="text-[10px]">não respondeu → continuar</Badge>
                        </div>
                      )}
                    </div>
                    {steps.length > 2 && (
                      <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0 text-destructive/60 hover:text-destructive" onClick={() => removeStep(i)}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Add step buttons */}
            <div className="flex flex-wrap gap-2 mt-3">
              <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={() => addStep("message")}>
                <MessageSquare className="w-3 h-3" /> Mensagem
              </Button>
              <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={() => addStep("wait")}>
                <Timer className="w-3 h-3" /> Espera
              </Button>
              <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={() => addStep("condition")}>
                <GitBranch className="w-3 h-3" /> Condição
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSave} disabled={!name.trim()}>{flow ? "Salvar" : "Criar Fluxo"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
