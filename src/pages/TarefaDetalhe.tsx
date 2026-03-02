import { AppLayout } from "@/components/AppLayout";
import { ProGate } from "@/components/ui/ProGate";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getTaskStore, saveTaskStore, availableAssignees, type Task, type TaskComment } from "@/lib/taskStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  ArrowLeft, CheckCircle2, Trash2, User, Calendar, Clock,
  Paperclip, Send as SendIcon, Flag,
} from "lucide-react";
import { toast } from "sonner";

const priorityConfig = {
  high: { label: "Alta", color: "bg-red-500/15 text-red-600 border-red-500/20" },
  medium: { label: "Média", color: "bg-amber-500/15 text-amber-600 border-amber-500/20" },
  low: { label: "Baixa", color: "bg-emerald-500/15 text-emerald-600 border-emerald-500/20" },
};

export default function TarefaDetalhe() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);

  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [editDesc, setEditDesc] = useState("");
  const [showAssigneeSelect, setShowAssigneeSelect] = useState(false);
  const [showPrioritySelect, setShowPrioritySelect] = useState(false);
  const [showDateEdit, setShowDateEdit] = useState(false);
  const [editDate, setEditDate] = useState("");
  const [commentText, setCommentText] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const tasks = getTaskStore();
    const found = tasks.find((t) => t.id === id);
    if (found) {
      setTask(found);
      setEditDesc(found.description);
      setEditDate(found.dueDate);
    }
  }, [id]);

  const saveTask = (changes: Partial<Task>) => {
    if (!task) return;
    const updated = { ...task, ...changes };
    setTask(updated);
    const tasks = getTaskStore().map((t) => (t.id === updated.id ? updated : t));
    saveTaskStore(tasks);
  };

  const handleSaveDescription = () => {
    saveTask({ description: editDesc });
    setIsEditingDesc(false);
    toast.success("Descrição atualizada");
  };

  const handleChangeAssignee = (assignee: string) => {
    saveTask({ assignee });
    setShowAssigneeSelect(false);
    toast.success(`Responsável alterado para ${assignee}`);
  };

  const handleChangePriority = (priority: Task["priority"]) => {
    saveTask({ priority });
    setShowPrioritySelect(false);
    toast.success("Prioridade atualizada");
  };

  const handleChangeDate = () => {
    saveTask({ dueDate: editDate });
    setShowDateEdit(false);
    toast.success("Prazo atualizado");
  };

  const handleFinishTask = () => {
    saveTask({ status: "done" });
    toast.success("Tarefa finalizada!");
  };

  const handleDeleteTask = () => {
    if (!task) return;
    const tasks = getTaskStore().filter((t) => t.id !== task.id);
    saveTaskStore(tasks);
    toast.success("Tarefa deletada");
    navigate("/gestao/tarefas");
  };

  const handleAddComment = () => {
    if (!commentText.trim() || !task) return;
    const newComment: TaskComment = {
      id: Date.now().toString(),
      text: commentText,
      by: "Você",
      createdAt: new Date().toISOString(),
    };
    saveTask({ comments: [...(task.comments || []), newComment] });
    setCommentText("");
    toast.success("Comentário adicionado");
  };

  const handleGoToConversation = () => {
    if (task?.conversationId) {
      navigate(`/conversas?atendimento=${task.conversationId}`);
    }
  };

  if (!task) {
    return (
      <AppLayout>
        <ProGate>
          <div className="p-6 flex items-center justify-center h-full">
            <p className="text-muted-foreground">Tarefa não encontrada</p>
          </div>
        </ProGate>
      </AppLayout>
    );
  }

  const atendimentoNumber = task.conversationId
    ? `#${task.conversationId.padStart(5, "0")}${task.id.slice(-2)}`
    : null;

  return (
    <AppLayout>
      <ProGate>
        <div className="h-full overflow-y-auto">
          <div className="max-w-4xl mx-auto p-6 space-y-0">
            {/* Header */}
            <div className="pb-5 border-b border-border">
              <div className="flex items-center justify-between mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/gestao/tarefas")}
                  className="gap-2 text-destructive border-destructive/30 hover:bg-destructive/10"
                >
                  <ArrowLeft className="w-4 h-4" />
                  VOLTAR
                </Button>
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleFinishTask}
                    className={cn(
                      "flex items-center gap-2 text-sm font-medium transition-colors",
                      task.status === "done" ? "text-emerald-600" : "text-foreground hover:text-emerald-600"
                    )}
                  >
                    <CheckCircle2 className={cn("w-5 h-5", task.status === "done" && "fill-emerald-500 text-white")} />
                    Finalizar Tarefa
                  </button>
                </div>
              </div>

              <div className="flex items-start justify-between">
                <h1 className="text-2xl font-bold text-foreground">{task.title}</h1>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  deletar tarefa
                </button>
              </div>
            </div>

            {/* Meta row */}
            <div className="py-5 border-b border-border">
              <div className="grid grid-cols-3 gap-4 bg-muted/50 rounded-xl p-4">
                {/* Assignee */}
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    <User className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <span className="text-sm font-medium text-foreground">{task.assignee}</span>
                  <button
                    onClick={() => setShowAssigneeSelect(!showAssigneeSelect)}
                    className="text-xs text-primary hover:underline flex items-center gap-1"
                  >
                    <User className="w-3 h-3" />
                    modificar responsável
                  </button>
                  {showAssigneeSelect && (
                    <div className="bg-card border border-border rounded-lg shadow-lg p-1 mt-1">
                      {availableAssignees.map((a) => (
                        <button
                          key={a}
                          onClick={() => handleChangeAssignee(a)}
                          className={cn(
                            "w-full text-left px-3 py-1.5 text-xs rounded hover:bg-muted transition-colors",
                            a === task.assignee && "font-bold text-primary"
                          )}
                        >
                          {a}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Date */}
                <div className="flex flex-col items-center gap-2">
                  <span className="text-sm font-medium text-foreground">
                    {new Date(task.dueDate).toLocaleDateString("pt-BR")} {new Date(task.createdAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                  <button className="text-xs text-primary hover:underline flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    marcar na agenda
                  </button>
                  <button
                    onClick={() => setShowDateEdit(!showDateEdit)}
                    className="text-xs text-primary hover:underline flex items-center gap-1"
                  >
                    <Clock className="w-3 h-3" />
                    modificar prazo
                  </button>
                  {showDateEdit && (
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="date"
                        value={editDate}
                        onChange={(e) => setEditDate(e.target.value)}
                        className="bg-muted border border-border rounded px-2 py-1 text-xs text-foreground"
                      />
                      <Button size="sm" variant="outline" className="text-xs h-7" onClick={handleChangeDate}>
                        Salvar
                      </Button>
                    </div>
                  )}
                </div>

                {/* Priority */}
                <div className="flex flex-col items-center gap-2">
                  {task.priority && (
                    <Badge variant="outline" className={cn("text-xs", priorityConfig[task.priority].color)}>
                      {priorityConfig[task.priority].label}
                    </Badge>
                  )}
                  <button
                    onClick={() => setShowPrioritySelect(!showPrioritySelect)}
                    className="text-xs text-primary hover:underline flex items-center gap-1"
                  >
                    <Flag className="w-3 h-3" />
                    {task.priority ? "alterar prioridade" : "adicionar prioridade"}
                  </button>
                  {showPrioritySelect && (
                    <div className="bg-card border border-border rounded-lg shadow-lg p-1 mt-1">
                      {(["low", "medium", "high"] as Task["priority"][]).map((p) => (
                        <button
                          key={p}
                          onClick={() => handleChangePriority(p)}
                          className="w-full text-left px-3 py-1.5 text-xs rounded hover:bg-muted transition-colors"
                        >
                          <Badge variant="outline" className={cn("text-[10px]", priorityConfig[p].color)}>
                            {priorityConfig[p].label}
                          </Badge>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="py-5 border-b border-border">
              <h3 className="text-sm font-bold text-foreground mb-2">Descrição</h3>
              {isEditingDesc ? (
                <div className="space-y-2">
                  <textarea
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    rows={3}
                    className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none"
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleSaveDescription}>Salvar</Button>
                    <Button size="sm" variant="outline" onClick={() => { setIsEditingDesc(false); setEditDesc(task.description); }}>Cancelar</Button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground">{task.description || "Sem descrição"}</p>
                  <button onClick={() => setIsEditingDesc(true)} className="text-xs text-primary hover:underline mt-1">
                    editar
                  </button>
                </>
              )}
              <button className="flex items-center gap-1.5 text-xs text-primary hover:underline mt-3">
                <Paperclip className="w-3 h-3" />
                anexar arquivo
              </button>
            </div>

            {/* Linked conversation */}
            {task.conversationId && (
              <div className="py-5 border-b border-border">
                <h3 className="text-sm font-bold text-foreground mb-2">Sobre</h3>
                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <button
                        onClick={handleGoToConversation}
                        className="text-sm font-semibold text-foreground hover:text-primary transition-colors"
                      >
                        Atendimento {atendimentoNumber}
                      </button>
                      {task.fromContact && (
                        <div className="flex items-center gap-2 mt-1">
                          <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                            <User className="w-3 h-3 text-muted-foreground" />
                          </div>
                          <Badge variant="secondary" className="text-[10px] bg-emerald-500/15 text-emerald-600 border-emerald-500/20">
                            {task.fromContact}
                          </Badge>
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(task.createdAt).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                </Card>
              </div>
            )}

            {/* Tags */}
            {task.tags.length > 0 && (
              <div className="py-3 border-b border-border">
                <div className="flex items-center gap-2 flex-wrap">
                  {task.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Comments */}
            <div className="py-5">
              {(task.comments || []).length > 0 && (
                <div className="space-y-3 mb-4">
                  {(task.comments || []).map((comment) => (
                    <div key={comment.id} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-foreground">{comment.by}</span>
                          <span className="text-[10px] text-muted-foreground">
                            {new Date(comment.createdAt).toLocaleDateString("pt-BR")} {new Date(comment.createdAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                        <p className="text-sm text-foreground mt-0.5">{comment.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add comment */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-1">
                  <User className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex-1 relative">
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Adicionar comentário"
                    rows={2}
                    className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none pr-12"
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleAddComment(); } }}
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute right-2 top-2 h-7 w-7 text-primary hover:bg-primary/10"
                    onClick={handleAddComment}
                    disabled={!commentText.trim()}
                  >
                    <SendIcon className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Delete confirmation */}
        <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>Deletar tarefa?</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-muted-foreground">Essa ação não pode ser desfeita.</p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>Cancelar</Button>
              <Button variant="destructive" onClick={handleDeleteTask}>Deletar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </ProGate>
    </AppLayout>
  );
}
