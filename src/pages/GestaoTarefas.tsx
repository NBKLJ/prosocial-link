import { AppLayout } from "@/components/AppLayout";
import { ProGate } from "@/components/ui/ProGate";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, CheckCircle2, Clock, AlertCircle, MoreHorizontal, Calendar, User } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface Task {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in_progress" | "done";
  priority: "low" | "medium" | "high";
  assignee: string;
  dueDate: string;
  tags: string[];
}

const mockTasks: Task[] = [
  { id: "1", title: "Follow-up com cliente MegaCorp", description: "Enviar proposta revisada", status: "todo", priority: "high", assignee: "Carlos", dueDate: "2026-03-05", tags: ["vendas", "urgente"] },
  { id: "2", title: "Preparar apresentação Q1", description: "Relatório trimestral de vendas", status: "in_progress", priority: "medium", assignee: "Ana", dueDate: "2026-03-10", tags: ["relatório"] },
  { id: "3", title: "Atualizar base de contatos", description: "Limpar leads inativos há 90 dias", status: "todo", priority: "low", assignee: "João", dueDate: "2026-03-15", tags: ["operacional"] },
  { id: "4", title: "Configurar automação de boas-vindas", description: "Novo fluxo para leads do site", status: "done", priority: "medium", assignee: "Carlos", dueDate: "2026-03-01", tags: ["automação"] },
  { id: "5", title: "Reunião com equipe comercial", description: "Alinhamento de metas mensais", status: "in_progress", priority: "high", assignee: "Ana", dueDate: "2026-03-03", tags: ["reunião"] },
  { id: "6", title: "Revisar contratos pendentes", description: "3 contratos aguardando assinatura", status: "todo", priority: "high", assignee: "João", dueDate: "2026-03-04", tags: ["contratos", "urgente"] },
];

const priorityConfig = {
  high: { label: "Alta", color: "bg-red-500/15 text-red-600 border-red-500/20" },
  medium: { label: "Média", color: "bg-amber-500/15 text-amber-600 border-amber-500/20" },
  low: { label: "Baixa", color: "bg-emerald-500/15 text-emerald-600 border-emerald-500/20" },
};

const statusConfig = {
  todo: { label: "A Fazer", icon: AlertCircle, color: "text-muted-foreground" },
  in_progress: { label: "Em Andamento", icon: Clock, color: "text-amber-500" },
  done: { label: "Concluído", icon: CheckCircle2, color: "text-emerald-500" },
};

const columns: { key: Task["status"]; label: string }[] = [
  { key: "todo", label: "A Fazer" },
  { key: "in_progress", label: "Em Andamento" },
  { key: "done", label: "Concluído" },
];

export default function GestaoTarefas() {
  const [tasks] = useState<Task[]>(mockTasks);

  return (
    <AppLayout>
      <ProGate>
        <div className="p-6 space-y-6 overflow-y-auto h-full">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Tarefas</h1>
              <p className="text-sm text-muted-foreground">Gerencie as tarefas da sua equipe em formato Kanban</p>
            </div>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Nova Tarefa
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {columns.map((col) => {
              const colTasks = tasks.filter((t) => t.status === col.key);
              const StatusIcon = statusConfig[col.key].icon;
              return (
                <div key={col.key} className="space-y-3">
                  <div className="flex items-center gap-2 px-1">
                    <StatusIcon className={cn("w-4 h-4", statusConfig[col.key].color)} />
                    <span className="text-sm font-semibold text-foreground">{col.label}</span>
                    <Badge variant="secondary" className="text-xs">{colTasks.length}</Badge>
                  </div>
                  <div className="space-y-2">
                    {colTasks.map((task) => (
                      <Card key={task.id} className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardContent className="p-4 space-y-3">
                          <div className="flex items-start justify-between">
                            <h3 className="text-sm font-semibold text-foreground leading-tight">{task.title}</h3>
                            <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0">
                              <MoreHorizontal className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground">{task.description}</p>
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="outline" className={cn("text-[10px]", priorityConfig[task.priority].color)}>
                              {priorityConfig[task.priority].label}
                            </Badge>
                            {task.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-[10px]">{tag}</Badge>
                            ))}
                          </div>
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span className="flex items-center gap-1"><User className="w-3 h-3" />{task.assignee}</span>
                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(task.dueDate).toLocaleDateString("pt-BR")}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </ProGate>
    </AppLayout>
  );
}
