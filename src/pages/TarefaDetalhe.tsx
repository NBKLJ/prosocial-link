import { AppLayout } from "@/components/AppLayout";
import { ProGate } from "@/components/ui/ProGate";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { getTaskStore, saveTaskStore, availableAssignees, type Task, type TaskComment } from "@/lib/taskStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  ArrowLeft, CheckSquare, Square, X, User, Clock, RefreshCw,
  Paperclip, Send as SendIcon, Calendar, MessageSquare,
  Bold, Italic, Underline, Link, Image, FileText,
} from "lucide-react";
import { toast } from "sonner";

const priorityColors: Record<string, string> = {
  high: "bg-destructive",
  medium: "bg-yellow-500",
  low: "bg-emerald-500",
};

const priorityLabels: Record<string, string> = {
  high: "Alta",
  medium: "Média",
  low: "Baixa",
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / 1048576).toFixed(1) + " MB";
}

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
  const [descAttachments, setDescAttachments] = useState<{ name: string; size: string }[]>([]);
  const [commentAttachments, setCommentAttachments] = useState<{ name: string; size: string }[]>([]);

  const commentRef = useRef<HTMLTextAreaElement>(null);
  const descFileRef = useRef<HTMLInputElement>(null);
  const commentFileRef = useRef<HTMLInputElement>(null);

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
    saveTask({ status: task?.status === "done" ? "in_progress" : "done" });
    toast.success(task?.status === "done" ? "Tarefa reaberta" : "Tarefa finalizada!");
  };

  const handleDeleteTask = () => {
    if (!task) return;
    const tasks = getTaskStore().filter((t) => t.id !== task.id);
    saveTaskStore(tasks);
    toast.success("Tarefa deletada");
    navigate("/gestao/tarefas");
  };

  // Formatting helpers
  const applyFormat = (prefix: string, suffix: string) => {
    const ta = commentRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = commentText.substring(start, end);
    const before = commentText.substring(0, start);
    const after = commentText.substring(end);
    if (selected) {
      setCommentText(before + prefix + selected + suffix + after);
    } else {
      setCommentText(before + prefix + "texto" + suffix + after);
    }
    ta.focus();
  };

  const handleBold = () => applyFormat("**", "**");
  const handleItalic = () => applyFormat("*", "*");
  const handleUnderline = () => applyFormat("__", "__");
  const handleH1 = () => {
    const ta = commentRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const lineStart = commentText.lastIndexOf("\n", start - 1) + 1;
    const before = commentText.substring(0, lineStart);
    const rest = commentText.substring(lineStart);
    setCommentText(before + "# " + rest);
    ta.focus();
  };
  const handleH2 = () => {
    const ta = commentRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const lineStart = commentText.lastIndexOf("\n", start - 1) + 1;
    const before = commentText.substring(0, lineStart);
    const rest = commentText.substring(lineStart);
    setCommentText(before + "## " + rest);
    ta.focus();
  };
  const handleLink = () => applyFormat("[", "](url)");
  const handleImage = () => {
    setCommentText(commentText + "\n![descrição](url-da-imagem)");
    commentRef.current?.focus();
  };

  const handleDescFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newFiles = Array.from(files).map((f) => ({ name: f.name, size: formatFileSize(f.size) }));
    setDescAttachments((prev) => [...prev, ...newFiles]);
    toast.success(`${newFiles.length} arquivo(s) anexado(s)`);
    e.target.value = "";
  };

  const handleCommentFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newFiles = Array.from(files).map((f) => ({ name: f.name, size: formatFileSize(f.size) }));
    setCommentAttachments((prev) => [...prev, ...newFiles]);
    toast.success(`${newFiles.length} arquivo(s) anexado(s)`);
    e.target.value = "";
  };

  const handleAddComment = () => {
    if (!commentText.trim() || !task) return;
    const newComment: TaskComment = {
      id: Date.now().toString(),
      text: commentText,
      by: "Você",
      createdAt: new Date().toISOString(),
      attachments: commentAttachments.length > 0 ? [...commentAttachments] : undefined,
    };
    saveTask({ comments: [...(task.comments || []), newComment] });
    setCommentText("");
    setCommentAttachments([]);
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
    ? `#${task.conversationId.padStart(5, "0")}`
    : null;

  const daysSinceCreation = Math.floor((Date.now() - new Date(task.createdAt).getTime()) / 86400000);
  const timeAgoLabel = daysSinceCreation === 0 ? "hoje" : daysSinceCreation === 1 ? "há 1 dia" : `há ${daysSinceCreation} dias`;

  return (
    <AppLayout>
      <ProGate>
        <div className="h-full overflow-y-auto bg-muted/30">
          <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">

            {/* Single card container */}
            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">

              {/* ─── Top bar ─── */}
              <div className="px-6 pt-5 pb-4 flex items-center justify-between">
                <button
                  onClick={() => navigate("/gestao/tarefas")}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-destructive border border-destructive/40 rounded-md hover:bg-destructive/5 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Voltar
                </button>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Criada {timeAgoLabel}</span>
                </div>
              </div>

              {/* ─── Title + actions ─── */}
              <div className="px-6 pb-4 flex items-start justify-between gap-4">
                <h1 className="text-xl sm:text-2xl font-bold text-foreground leading-tight">
                  {task.title}
                </h1>
                <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                  <button
                    onClick={handleFinishTask}
                    className={cn(
                      "flex items-center gap-2 text-sm font-medium transition-colors whitespace-nowrap",
                      task.status === "done"
                        ? "text-emerald-600"
                        : "text-foreground hover:text-emerald-600"
                    )}
                  >
                    {task.status === "done" ? (
                      <CheckSquare className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Square className="w-4 h-4 text-muted-foreground" />
                    )}
                    Finalizar Tarefa
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="flex items-center gap-1 text-xs text-destructive/70 hover:text-destructive hover:underline transition-colors"
                  >
                    <X className="w-3 h-3" />
                    deletar tarefa
                  </button>
                </div>
              </div>

              {/* ─── Meta grid: 3 columns ─── */}
              <div className="mx-6 mb-5 border border-border rounded-lg grid grid-cols-3 divide-x divide-border">
                {/* Col 1: Responsável */}
                <div className="p-4 relative">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">Responsável</p>
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center">
                      <User className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <span className="text-sm font-medium text-foreground">{task.assignee || "—"}</span>
                  </div>
                  <button
                    onClick={() => { setShowAssigneeSelect(!showAssigneeSelect); setShowPrioritySelect(false); setShowDateEdit(false); }}
                    className="flex items-center gap-1 text-[11px] text-primary hover:underline mt-2.5"
                  >
                    <RefreshCw className="w-3 h-3" />
                    modificar responsável
                  </button>
                  {showAssigneeSelect && (
                    <div className="absolute left-4 top-full mt-1 bg-card border border-border rounded-lg shadow-lg p-1 z-20 min-w-[140px]">
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

                {/* Col 2: Prazo */}
                <div className="p-4 relative">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">Prazo</p>
                  <span className="text-sm font-medium text-foreground">
                    {task.dueDate
                      ? new Date(task.dueDate + "T12:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })
                      : "Sem prazo"}
                  </span>
                  <div className="flex flex-col gap-1 mt-2.5">
                    <button className="flex items-center gap-1 text-[11px] text-primary hover:underline">
                      <Calendar className="w-3 h-3" />
                      marcar na agenda
                    </button>
                    <button
                      onClick={() => { setShowDateEdit(!showDateEdit); setShowAssigneeSelect(false); setShowPrioritySelect(false); }}
                      className="flex items-center gap-1 text-[11px] text-primary hover:underline"
                    >
                      <RefreshCw className="w-3 h-3" />
                      modificar prazo
                    </button>
                  </div>
                  {showDateEdit && (
                    <div className="absolute left-4 top-full mt-1 flex items-center gap-2 bg-card border border-border rounded-lg shadow-lg p-2.5 z-20">
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

                {/* Col 3: Prioridade */}
                <div className="p-4 relative">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">Prioridade</p>
                  <div className="flex items-center gap-2">
                    <div className={cn("w-4 h-4 rounded-full", priorityColors[task.priority] || "bg-muted")} />
                    <span className="text-sm font-medium text-foreground">{priorityLabels[task.priority] || task.priority}</span>
                  </div>
                  <button
                    onClick={() => { setShowPrioritySelect(!showPrioritySelect); setShowAssigneeSelect(false); setShowDateEdit(false); }}
                    className="flex items-center gap-1 text-[11px] text-primary hover:underline mt-2.5"
                  >
                    <RefreshCw className="w-3 h-3" />
                    modificar prioridade
                  </button>
                  {showPrioritySelect && (
                    <div className="absolute right-4 top-full mt-1 bg-card border border-border rounded-lg shadow-lg p-1 z-20 min-w-[120px]">
                      {(["high", "medium", "low"] as Task["priority"][]).map((p) => (
                        <button
                          key={p}
                          onClick={() => handleChangePriority(p)}
                          className="w-full flex items-center gap-2 text-left px-3 py-1.5 text-xs rounded hover:bg-muted transition-colors"
                        >
                          <div className={cn("w-3 h-3 rounded-full", priorityColors[p])} />
                          {priorityLabels[p]}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* ─── Descrição ─── */}
              <div className="px-6 py-5 border-t border-border">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-foreground">Descrição</h3>
                  {!isEditingDesc && (
                    <button onClick={() => setIsEditingDesc(true)} className="text-[11px] text-primary hover:underline">
                      editar
                    </button>
                  )}
                </div>
                {isEditingDesc ? (
                  <div className="space-y-2">
                    <textarea
                      value={editDesc}
                      onChange={(e) => setEditDesc(e.target.value)}
                      rows={3}
                      className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none"
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleSaveDescription}>Salvar</Button>
                      <Button size="sm" variant="outline" onClick={() => { setIsEditingDesc(false); setEditDesc(task.description); }}>Cancelar</Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {task.description || "Sem descrição"}
                  </p>
                )}

                {/* Attach file to description */}
                <input type="file" ref={descFileRef} className="hidden" multiple onChange={handleDescFileSelect} />
                <button
                  onClick={() => descFileRef.current?.click()}
                  className="flex items-center gap-1.5 text-[11px] text-primary hover:underline mt-3"
                >
                  <Paperclip className="w-3 h-3" />
                  anexar arquivo
                </button>
                {descAttachments.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {descAttachments.map((att, i) => (
                      <span key={i} className="inline-flex items-center gap-1.5 bg-muted text-foreground text-xs px-2.5 py-1 rounded-full border border-border">
                        <FileText className="w-3 h-3 text-muted-foreground" />
                        {att.name} ({att.size})
                        <button onClick={() => setDescAttachments((prev) => prev.filter((_, idx) => idx !== i))} className="text-muted-foreground hover:text-destructive">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* ─── Sobre (atendimento vinculado) ─── */}
              <div className="px-6 py-5 border-t border-border">
                <h3 className="text-sm font-bold text-foreground mb-3">Sobre</h3>
                <div className="border border-border rounded-lg p-4 bg-muted/20">
                  {task.conversationId ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <MessageSquare className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <button
                            onClick={handleGoToConversation}
                            className="text-sm font-semibold text-primary hover:underline transition-colors"
                          >
                            Atendimento {atendimentoNumber}
                          </button>
                          {task.fromContact && (
                            <div className="flex items-center gap-2 mt-1">
                              <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center">
                                <User className="w-3 h-3 text-muted-foreground" />
                              </div>
                              <span className="text-xs text-muted-foreground">{task.fromContact}</span>
                              <Badge className="text-[9px] h-4 bg-emerald-500/15 text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/15">
                                Resolvido
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <span className="text-[11px]">{timeAgoLabel}</span>
                        <svg viewBox="0 0 24 24" className="w-4 h-4 text-emerald-500" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                        </svg>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                        <FileText className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Tarefa criada manualmente</p>
                        <p className="text-xs text-muted-foreground/70 mt-0.5">Nenhum atendimento vinculado</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* ─── Comentários ─── */}
              <div className="px-6 py-5 border-t border-border">
                <h3 className="text-sm font-bold text-foreground mb-4">Comentários</h3>

                {/* Existing comments */}
                {(task.comments || []).length > 0 && (
                  <div className="space-y-4 mb-5">
                    {(task.comments || []).map((comment) => (
                      <div key={comment.id} className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                          <User className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-foreground">{comment.by}</span>
                            <span className="text-[10px] text-muted-foreground">
                              {new Date(comment.createdAt).toLocaleDateString("pt-BR")} às{" "}
                              {new Date(comment.createdAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                            </span>
                          </div>
                          <p className="text-sm text-foreground mt-1 whitespace-pre-wrap break-words">{comment.text}</p>
                          {comment.attachments && comment.attachments.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-1.5">
                              {comment.attachments.map((att, i) => (
                                <span key={i} className="inline-flex items-center gap-1 bg-muted text-xs px-2 py-0.5 rounded-full border border-border text-muted-foreground">
                                  <FileText className="w-3 h-3" />
                                  {att.name}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* New comment editor */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-1">
                    <User className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    {/* Toolbar */}
                    <div className="flex items-center gap-0.5 bg-muted/50 border border-border border-b-0 rounded-t-lg px-2 py-1.5 flex-wrap">
                      <button onClick={handleH1} className="px-1.5 py-0.5 text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors" title="Título H1">H₁</button>
                      <button onClick={handleH2} className="px-1.5 py-0.5 text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors" title="Título H2">H₂</button>
                      <span className="text-muted-foreground/30 px-1 select-none">|</span>
                      <button onClick={handleBold} className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors" title="Negrito"><Bold className="w-3.5 h-3.5" /></button>
                      <button onClick={handleItalic} className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors" title="Itálico"><Italic className="w-3.5 h-3.5" /></button>
                      <button onClick={handleUnderline} className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors" title="Sublinhado"><Underline className="w-3.5 h-3.5" /></button>
                      <span className="text-muted-foreground/30 px-1 select-none">|</span>
                      <button onClick={handleLink} className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors" title="Inserir link"><Link className="w-3.5 h-3.5" /></button>
                      <button onClick={handleImage} className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors" title="Inserir imagem"><Image className="w-3.5 h-3.5" /></button>
                      <button onClick={() => commentFileRef.current?.click()} className="p-1 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors" title="Anexar arquivo"><Paperclip className="w-3.5 h-3.5" /></button>
                    </div>
                    {/* Textarea */}
                    <div className="relative">
                      <textarea
                        ref={commentRef}
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Escreva um comentário..."
                        rows={3}
                        className="w-full bg-card border border-border border-t-0 rounded-b-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none pr-14"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleAddComment();
                          }
                        }}
                      />
                      <Button
                        size="icon"
                        className="absolute right-2 bottom-2.5 h-8 w-8 bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-lg"
                        onClick={handleAddComment}
                        disabled={!commentText.trim()}
                      >
                        <SendIcon className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Comment attachments */}
                    <input type="file" ref={commentFileRef} className="hidden" multiple onChange={handleCommentFileSelect} />
                    {commentAttachments.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {commentAttachments.map((att, i) => (
                          <span key={i} className="inline-flex items-center gap-1.5 bg-muted text-foreground text-xs px-2.5 py-1 rounded-full border border-border">
                            <FileText className="w-3 h-3 text-muted-foreground" />
                            {att.name} ({att.size})
                            <button onClick={() => setCommentAttachments((prev) => prev.filter((_, idx) => idx !== i))} className="text-muted-foreground hover:text-destructive">
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
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
