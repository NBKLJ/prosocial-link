import { AppLayout } from "@/components/AppLayout";
import { ProGate } from "@/components/ui/ProGate";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getTaskStore, saveTaskStore, availableAssignees, type Task, type TaskComment } from "@/lib/taskStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  ArrowLeft, Square, X, User, Clock, RefreshCw,
  Paperclip, Send as SendIcon, Calendar,
  Bold, Italic, Underline, Link, Image, Save, Type,
} from "lucide-react";
import { toast } from "sonner";

const priorityColors: Record<string, string> = {
  high: "bg-red-500",
  medium: "bg-amber-400",
  low: "bg-emerald-500",
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

  const daysSinceCreation = Math.floor((Date.now() - new Date(task.createdAt).getTime()) / 86400000);
  const timeAgoLabel = daysSinceCreation === 0 ? "hoje" : `há ${daysSinceCreation} dias`;

  return (
    <AppLayout>
      <ProGate>
        <div className="h-full overflow-y-auto bg-[hsl(var(--muted)/0.3)]">
          <div className="max-w-5xl mx-auto p-6">
            {/* Main card container */}
            <div className="bg-card border border-border rounded-lg shadow-sm">

              {/* Top bar - VOLTAR */}
              <div className="px-6 pt-5 pb-0">
                <button
                  onClick={() => navigate("/gestao/tarefas")}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-destructive border border-destructive/30 rounded hover:bg-destructive/5 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  VOLTAR
                </button>
              </div>

              {/* Title + actions row */}
              <div className="px-6 pt-4 pb-2">
                <div className="flex items-start justify-between">
                  <h1 className="text-2xl font-bold text-foreground lowercase">{task.title}</h1>
                  <div className="flex flex-col items-end gap-1">
                    <button
                      onClick={handleFinishTask}
                      className={cn(
                        "flex items-center gap-2 text-sm font-medium transition-colors",
                        task.status === "done" ? "text-emerald-600" : "text-foreground hover:text-emerald-600"
                      )}
                    >
                      <Square className={cn("w-4 h-4", task.status === "done" ? "fill-emerald-500 text-emerald-500" : "text-muted-foreground")} />
                      Finalizar Tarefa
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="flex items-center gap-1 text-xs text-primary hover:underline"
                    >
                      <X className="w-3 h-3" />
                      deletar tarefa
                    </button>
                  </div>
                </div>
              </div>

              {/* Meta row - 3 columns */}
              <div className="px-6 py-4">
                <div className="border border-border rounded-lg grid grid-cols-3 divide-x divide-border">
                  {/* Assignee */}
                  <div className="p-4 relative">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                        <User className="w-5 h-5 text-muted-foreground" />
                      </div>
                      {task.assignee && (
                        <span className="text-sm text-foreground">{task.assignee}</span>
                      )}
                    </div>
                    <button
                      onClick={() => setShowAssigneeSelect(!showAssigneeSelect)}
                      className="flex items-center gap-1 text-xs text-primary hover:underline mt-2"
                    >
                      <User className="w-3 h-3" />
                      modificar responsável
                    </button>
                    {showAssigneeSelect && (
                      <div className="absolute left-4 top-full mt-1 bg-card border border-border rounded-lg shadow-lg p-1 z-10">
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

                  {/* Date / prazo */}
                  <div className="p-4 relative">
                    {task.dueDate ? (
                      <span className="text-sm text-foreground">
                        {new Date(task.dueDate).toLocaleDateString("pt-BR")}
                      </span>
                    ) : null}
                    <div className="flex flex-col gap-1 mt-2">
                      <button className="flex items-center gap-1 text-xs text-primary hover:underline">
                        <Calendar className="w-3 h-3" />
                        {task.dueDate ? "marcar na agenda" : "adicionar prazo"}
                      </button>
                      <button
                        onClick={() => setShowDateEdit(!showDateEdit)}
                        className="flex items-center gap-1 text-xs text-primary hover:underline"
                      >
                        <RefreshCw className="w-3 h-3" />
                        modificar prazo
                      </button>
                    </div>
                    {showDateEdit && (
                      <div className="absolute left-4 top-full mt-1 flex items-center gap-2 bg-card border border-border rounded-lg shadow-lg p-2 z-10">
                        <input
                          type="date"
                          value={editDate}
                          onChange={(e) => setEditDate(e.target.value)}
                          className="bg-muted border border-border rounded px-2 py-1 text-xs text-foreground"
                        />
                        <Button size="sm" variant="outline" className="text-xs h-7" onClick={handleChangeDate}>
                          OK
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Priority */}
                  <div className="p-4 relative">
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-sm text-foreground">Prioridade</span>
                      <div className={cn("w-5 h-5 rounded-full", priorityColors[task.priority] || "bg-muted")} />
                    </div>
                    <div className="flex justify-end mt-2">
                      <button
                        onClick={() => setShowPrioritySelect(!showPrioritySelect)}
                        className="flex items-center gap-1 text-xs text-primary hover:underline"
                      >
                        <RefreshCw className="w-3 h-3" />
                        modificar prioridade
                      </button>
                    </div>
                    {showPrioritySelect && (
                      <div className="absolute right-4 top-full mt-1 bg-card border border-border rounded-lg shadow-lg p-1 z-10">
                        {(["low", "medium", "high"] as Task["priority"][]).map((p) => (
                          <button
                            key={p}
                            onClick={() => handleChangePriority(p)}
                            className="w-full flex items-center gap-2 text-left px-3 py-1.5 text-xs rounded hover:bg-muted transition-colors"
                          >
                            <div className={cn("w-3 h-3 rounded-full", priorityColors[p])} />
                            {p === "high" ? "Alta" : p === "medium" ? "Média" : "Baixa"}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="px-6 py-4 border-t border-border">
                <h3 className="text-sm font-bold text-foreground mb-1">Descrição</h3>
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
                    <p className="text-sm text-muted-foreground">{task.description || ""}</p>
                    <button onClick={() => setIsEditingDesc(true)} className="text-xs text-primary hover:underline mt-1 block">
                      editar
                    </button>
                  </>
                )}

                <button className="flex items-center gap-1.5 text-xs text-primary hover:underline mt-4">
                  <Paperclip className="w-3 h-3" />
                  anexar arquivo
                </button>
              </div>

              {/* Sobre (linked conversation) */}
              <div className="px-6 py-4 border-t border-border">
                <h3 className="text-sm text-muted-foreground mb-2">Sobre</h3>
                <div className="border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      {task.conversationId ? (
                        <button
                          onClick={handleGoToConversation}
                          className="text-sm font-semibold text-foreground hover:text-primary transition-colors"
                        >
                          Atendimento {atendimentoNumber}
                        </button>
                      ) : (
                        <span className="text-sm text-muted-foreground">Sem atendimento vinculado</span>
                      )}
                      {task.fromContact && (
                        <div className="flex items-center gap-2 mt-2">
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                            <User className="w-4 h-4 text-muted-foreground" />
                          </div>
                          <span className="text-sm text-foreground">{task.fromContact}</span>
                          <Badge className="text-[10px] bg-red-500 text-white border-none hover:bg-red-500">
                            Resolvido
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Time ago + WhatsApp icon */}
              <div className="px-6 pb-2 flex justify-end items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>{timeAgoLabel}</span>
              </div>

              {/* Comment editor */}
              <div className="px-6 py-4 border-t border-border">
                {/* Existing comments */}
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

                {/* Rich text toolbar + textarea */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-1">
                    <User className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    {/* Toolbar */}
                    <div className="flex items-center gap-1 bg-muted/50 border border-border border-b-0 rounded-t-lg px-2 py-1.5">
                      <span className="text-xs font-bold text-muted-foreground px-1">H₁</span>
                      <span className="text-xs font-bold text-muted-foreground px-1">H₂</span>
                      <span className="text-xs text-muted-foreground px-1">Sans Serif</span>
                      <span className="text-muted-foreground/30 px-1">|</span>
                      <button className="p-0.5 text-muted-foreground hover:text-foreground"><Bold className="w-3.5 h-3.5" /></button>
                      <button className="p-0.5 text-muted-foreground hover:text-foreground"><Italic className="w-3.5 h-3.5" /></button>
                      <button className="p-0.5 text-muted-foreground hover:text-foreground"><Underline className="w-3.5 h-3.5" /></button>
                      <span className="text-xs text-muted-foreground px-1">❝</span>
                      <span className="text-muted-foreground/30 px-1">|</span>
                      <button className="p-0.5 text-muted-foreground hover:text-foreground"><Link className="w-3.5 h-3.5" /></button>
                      <button className="p-0.5 text-muted-foreground hover:text-foreground"><Image className="w-3.5 h-3.5" /></button>
                      <button className="p-0.5 text-muted-foreground hover:text-foreground"><Save className="w-3.5 h-3.5" /></button>
                      <button className="p-0.5 text-muted-foreground hover:text-foreground"><Type className="w-3.5 h-3.5" /></button>
                    </div>
                    <div className="relative">
                      <textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Adicionar comentário"
                        rows={2}
                        className="w-full bg-muted/30 border border-border rounded-b-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none pr-14"
                        onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleAddComment(); } }}
                      />
                      <Button
                        size="icon"
                        variant="outline"
                        className="absolute right-2 top-2 h-7 w-7 border-destructive/30 text-destructive hover:bg-destructive/10"
                        onClick={handleAddComment}
                        disabled={!commentText.trim()}
                      >
                        <SendIcon className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                    <button className="flex items-center gap-1.5 text-xs text-primary hover:underline mt-2">
                      <Paperclip className="w-3 h-3" />
                      anexar arquivo
                    </button>
                  </div>
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
