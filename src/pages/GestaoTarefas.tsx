import { AppLayout } from "@/components/AppLayout";
import { ProGate } from "@/components/ui/ProGate";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, CheckCircle2, Clock, AlertCircle, Calendar, User, Filter, MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { getTaskStore, saveTaskStore, addTask, availableAssignees, type Task } from "@/lib/taskStore";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { TaskDetailPanel } from "@/components/gestao/TaskDetailPanel";

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
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filterUser, setFilterUser] = useState<string>("todos");
  const [showNewTask, setShowNewTask] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newAssignee, setNewAssignee] = useState(availableAssignees[0]);
  const [newPriority, setNewPriority] = useState<Task["priority"]>("medium");
  const [newDueDate, setNewDueDate] = useState("");

  useEffect(() => {
    setTasks(getTaskStore());
    const handler = () => setTasks(getTaskStore());
    window.addEventListener("tasks-updated", handler);
    return () => window.removeEventListener("tasks-updated", handler);
  }, []);

  const filteredTasks = filterUser === "todos" ? tasks : tasks.filter((t) => t.assignee === filterUser);

  const handleStatusChange = (id: string, newStatus: Task["status"]) => {
    const updated = tasks.map((t) => (t.id === id ? { ...t, status: newStatus } : t));
    setTasks(updated);
    saveTaskStore(updated);
  };

  const handleUpdateTask = (updated: Task) => {
    const newTasks = tasks.map((t) => (t.id === updated.id ? updated : t));
    setTasks(newTasks);
    saveTaskStore(newTasks);
    setSelectedTask(updated);
  };

  const handleDeleteTask = (id: string) => {
    const newTasks = tasks.filter((t) => t.id !== id);
    setTasks(newTasks);
    saveTaskStore(newTasks);
    setSelectedTask(null);
  };

  const handleCreateTask = () => {
    if (!newTitle.trim()) { toast.error("Título obrigatório"); return; }
    addTask({
      title: newTitle,
      description: newDesc,
      status: "todo",
      priority: newPriority,
      assignee: newAssignee,
      dueDate: newDueDate || new Date().toISOString().split("T")[0],
      tags: [],
    });
    setTasks(getTaskStore());
    setShowNewTask(false);
    setNewTitle(""); setNewDesc("");
    toast.success("Tarefa criada com sucesso!");
  };

  return (
    <AppLayout>
      <ProGate>
        <div className="p-6 space-y-6 overflow-y-auto h-full">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Tarefas</h1>
              <p className="text-sm text-muted-foreground">Gerencie as tarefas da sua equipe em formato Kanban</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <select
                  value={filterUser}
                  onChange={(e) => setFilterUser(e.target.value)}
                  className="bg-muted border border-border rounded-lg px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                >
                  <option value="todos">Todos os Usuários</option>
                  {availableAssignees.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>
              <Button className="gap-2" onClick={() => setShowNewTask(true)}>
                <Plus className="w-4 h-4" />
                Nova Tarefa
              </Button>
            </div>
          </div>

          {/* Kanban columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {columns.map((col) => {
              const colTasks = filteredTasks.filter((t) => t.status === col.key);
              const StatusIcon = statusConfig[col.key].icon;
              return (
                <div key={col.key} className="space-y-3">
                  <div className="flex items-center gap-2 px-1">
                    <StatusIcon className={cn("w-4 h-4", statusConfig[col.key].color)} />
                    <span className="text-sm font-semibold text-foreground">{col.label}</span>
                    <Badge variant="secondary" className="text-xs">{colTasks.length}</Badge>
                  </div>
                  <div className="space-y-2 min-h-[100px]">
                    {colTasks.map((task) => (
                      <Card
                        key={task.id}
                        className="hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => setSelectedTask(task)}
                      >
                        <CardContent className="p-4 space-y-3">
                          <div className="flex items-start justify-between">
                            <h3 className="text-sm font-semibold text-foreground leading-tight">{task.title}</h3>
                            <div className="relative group" onClick={(e) => e.stopPropagation()}>
                              <div className="flex gap-1">
                                {columns.filter((c) => c.key !== task.status).map((c) => {
                                  const Icon = statusConfig[c.key].icon;
                                  return (
                                    <button
                                      key={c.key}
                                      onClick={() => handleStatusChange(task.id, c.key)}
                                      className="p-1 rounded hover:bg-muted transition-colors opacity-0 group-hover:opacity-100"
                                      title={`Mover para ${c.label}`}
                                    >
                                      <Icon className={cn("w-3.5 h-3.5", statusConfig[c.key].color)} />
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2">{task.description}</p>
                          {task.fromContact && (
                            <div className="flex items-center gap-1 text-xs text-primary">
                              <MessageCircle className="w-3 h-3" />
                              <span>De: {task.fromContact}</span>
                            </div>
                          )}
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
                    {colTasks.length === 0 && (
                      <div className="border-2 border-dashed border-border rounded-xl p-6 text-center text-xs text-muted-foreground">
                        Nenhuma tarefa
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Task Detail Panel */}
        {selectedTask && (
          <TaskDetailPanel
            task={selectedTask}
            onClose={() => setSelectedTask(null)}
            onUpdate={handleUpdateTask}
            onDelete={handleDeleteTask}
          />
        )}

        {/* New Task Dialog */}
        <Dialog open={showNewTask} onOpenChange={setShowNewTask}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Nova Tarefa</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Título</label>
                <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                  placeholder="Título da tarefa" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Descrição</label>
                <textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)} rows={3}
                  className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none"
                  placeholder="Descreva a tarefa..." />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Responsável</label>
                  <select value={newAssignee} onChange={(e) => setNewAssignee(e.target.value)}
                    className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50">
                    {availableAssignees.map((a) => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Prioridade</label>
                  <select value={newPriority} onChange={(e) => setNewPriority(e.target.value as Task["priority"])}
                    className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50">
                    <option value="low">Baixa</option>
                    <option value="medium">Média</option>
                    <option value="high">Alta</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Data de Entrega</label>
                <input type="date" value={newDueDate} onChange={(e) => setNewDueDate(e.target.value)}
                  className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowNewTask(false)}>Cancelar</Button>
              <Button onClick={handleCreateTask}>Criar Tarefa</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </ProGate>
    </AppLayout>
  );
}
