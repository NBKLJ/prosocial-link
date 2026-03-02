import { AppLayout } from "@/components/AppLayout";
import { ProGate } from "@/components/ui/ProGate";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { getTaskStore, saveTaskStore, availableAssignees, type Task, type TaskComment } from "@/lib/taskStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  ArrowLeft, User, Clock, Paperclip, Send as SendIcon, Calendar,
  MessageSquare, Bold, Italic, Underline, Link, Image, FileText,
  MoreHorizontal, ArrowRightLeft, Copy, XCircle, Trash2, ChevronDown,
  CheckCircle2, Circle, Timer, Tag, Building2, Shield, Hash,
  MessageCircle, ExternalLink, ChevronRight, Plus, X,
} from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// ── Helpers ──────────────────────────────────────────────
const priorityConfig: Record<string, { label: string; color: string; bg: string }> = {
  high: { label: "Alta", color: "text-red-600 dark:text-red-400", bg: "bg-red-500/10 border-red-500/20" },
  medium: { label: "Média", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
  low: { label: "Baixa", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
};

const statusConfig: Record<string, { label: string; icon: React.ReactNode; color: string; bg: string }> = {
  todo: { label: "Pendente", icon: <Circle className="w-3.5 h-3.5" />, color: "text-muted-foreground", bg: "bg-muted border-border" },
  in_progress: { label: "Em andamento", icon: <Timer className="w-3.5 h-3.5" />, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
  done: { label: "Concluída", icon: <CheckCircle2 className="w-3.5 h-3.5" />, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
};

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / 1048576).toFixed(1) + " MB";
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "agora";
  if (mins < 60) return `há ${mins}min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `há ${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "há 1 dia";
  return `há ${days} dias`;
}

// ── Component ────────────────────────────────────────────
export default function TarefaDetalhe() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);

  // Edit states
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [editDesc, setEditDesc] = useState("");
  const [commentText, setCommentText] = useState("");
  const [updateText, setUpdateText] = useState("");
  const [descAttachments, setDescAttachments] = useState<{ name: string; size: string }[]>([]);
  const [commentAttachments, setCommentAttachments] = useState<{ name: string; size: string }[]>([]);

  // Modals
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const [transferTo, setTransferTo] = useState("");
  const [transferReason, setTransferReason] = useState("");
  const [showFinalize, setShowFinalize] = useState(false);
  const [finalizeComment, setFinalizeComment] = useState("");
  const [showStatusMenu, setShowStatusMenu] = useState(false);

  const commentRef = useRef<HTMLTextAreaElement>(null);
  const descFileRef = useRef<HTMLInputElement>(null);
  const commentFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const tasks = getTaskStore();
    const found = tasks.find((t) => t.id === id);
    if (found) {
      setTask(found);
      setEditTitle(found.title);
      setEditDesc(found.description);
    }
  }, [id]);

  const saveTask = (changes: Partial<Task>) => {
    if (!task) return;
    const updated = { ...task, ...changes };
    setTask(updated);
    const tasks = getTaskStore().map((t) => (t.id === updated.id ? updated : t));
    saveTaskStore(tasks);
  };

  const addTimelineEntry = (text: string) => {
    const entry: TaskComment = {
      id: Date.now().toString(),
      text,
      by: "Sistema",
      createdAt: new Date().toISOString(),
    };
    saveTask({ comments: [...(task?.comments || []), entry] });
  };

  // ── Handlers ──
  const handleSaveTitle = () => {
    if (editTitle.trim()) saveTask({ title: editTitle.trim() });
    setIsEditingTitle(false);
    toast.success("Título atualizado");
  };

  const handleSaveDescription = () => {
    saveTask({ description: editDesc });
    setIsEditingDesc(false);
    toast.success("Descrição atualizada");
  };

  const handleChangeStatus = (status: Task["status"]) => {
    saveTask({ status });
    setShowStatusMenu(false);
    toast.success(`Status: ${statusConfig[status].label}`);
  };

  const handleChangePriority = (priority: Task["priority"]) => {
    saveTask({ priority });
    toast.success("Prioridade atualizada");
  };

  const handleChangeAssignee = (assignee: string) => {
    saveTask({ assignee });
    toast.success(`Responsável: ${assignee}`);
  };

  const handleDeleteTask = () => {
    if (!task) return;
    const tasks = getTaskStore().filter((t) => t.id !== task.id);
    saveTaskStore(tasks);
    toast.success("Tarefa excluída");
    navigate("/gestao/tarefas");
  };

  const handleDuplicate = () => {
    if (!task) return;
    const tasks = getTaskStore();
    const dup: Task = { ...task, id: Date.now().toString(), title: task.title + " (cópia)", status: "todo", createdAt: new Date().toISOString(), comments: [] };
    tasks.push(dup);
    saveTaskStore(tasks);
    toast.success("Tarefa duplicada");
    navigate(`/gestao/tarefas/${dup.id}`);
  };

  const handleTransfer = () => {
    if (!transferTo) return;
    const prev = task?.assignee || "—";
    saveTask({ assignee: transferTo });
    addTimelineEntry(`📋 Tarefa transferida de ${prev} para ${transferTo}${transferReason ? `. Motivo: ${transferReason}` : ""}`);
    setShowTransfer(false);
    setTransferTo("");
    setTransferReason("");
    toast.success(`Transferida para ${transferTo}`);
  };

  const handleFinalize = () => {
    saveTask({ status: "done" });
    if (finalizeComment.trim()) {
      addTimelineEntry(`✅ Tarefa finalizada. ${finalizeComment}`);
    } else {
      addTimelineEntry("✅ Tarefa finalizada.");
    }
    setShowFinalize(false);
    setFinalizeComment("");
    toast.success("Tarefa finalizada!");
  };

  const handleAddUpdate = () => {
    if (!updateText.trim()) return;
    addTimelineEntry(updateText.trim());
    setUpdateText("");
    toast.success("Registro adicionado");
  };

  // Comment formatting
  const applyFormat = (prefix: string, suffix: string) => {
    const ta = commentRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = commentText.substring(start, end);
    const before = commentText.substring(0, start);
    const after = commentText.substring(end);
    setCommentText(before + prefix + (selected || "texto") + suffix + after);
    ta.focus();
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

  const handleGoToConversation = () => {
    if (task?.conversationId) navigate(`/conversas?atendimento=${task.conversationId}`);
  };

  // ── Not found ──
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

  const sc = statusConfig[task.status] || statusConfig.todo;
  const pc = priorityConfig[task.priority] || priorityConfig.medium;
  const atendimentoNumber = task.conversationId ? `#${task.conversationId.padStart(5, "0")}` : null;

  return (
    <AppLayout>
      <ProGate>
        <div className="h-full overflow-y-auto bg-background">
          <div className="max-w-[1360px] mx-auto py-6 px-4 sm:px-6 lg:px-8">

            {/* ━━━ BREADCRUMB ━━━ */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
              <button onClick={() => navigate("/gestao/tarefas")} className="hover:text-foreground transition-colors flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" />
                Tarefas
              </button>
              <ChevronRight className="w-3 h-3" />
              <span className="text-foreground font-medium truncate max-w-[300px]">{task.title}</span>
            </div>

            {/* ━━━ STRATEGIC HEADER ━━━ */}
            <div className="glass-card rounded-2xl p-6 mb-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {/* Title — inline edit */}
                  {isEditingTitle ? (
                    <div className="flex items-center gap-3">
                      <input
                        autoFocus
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onBlur={handleSaveTitle}
                        onKeyDown={(e) => e.key === "Enter" && handleSaveTitle()}
                        className="text-xl sm:text-2xl font-bold bg-transparent border-b-2 border-primary/50 text-foreground focus:outline-none w-full"
                      />
                    </div>
                  ) : (
                    <h1
                      onClick={() => setIsEditingTitle(true)}
                      className="text-xl sm:text-2xl font-bold text-foreground leading-tight cursor-text hover:bg-muted/50 rounded-lg px-1 -mx-1 py-0.5 transition-colors"
                      title="Clique para editar"
                    >
                      {task.title}
                    </h1>
                  )}
                  {/* Meta info under title */}
                  <div className="flex items-center gap-3 mt-3 flex-wrap">
                    {/* Status badge */}
                    <div className="relative">
                      <button
                        onClick={() => setShowStatusMenu(!showStatusMenu)}
                        className={cn("inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full border transition-all", sc.bg, sc.color)}
                      >
                        {sc.icon}
                        {sc.label}
                        <ChevronDown className="w-3 h-3 opacity-60" />
                      </button>
                      {showStatusMenu && (
                        <div className="absolute top-full left-0 mt-1.5 bg-popover border border-border rounded-xl shadow-xl p-1.5 z-30 min-w-[170px] animate-in fade-in-0 zoom-in-95">
                          {(["todo", "in_progress", "done"] as Task["status"][]).map((s) => {
                            const cfg = statusConfig[s];
                            return (
                              <button
                                key={s}
                                onClick={() => handleChangeStatus(s)}
                                className={cn(
                                  "w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg transition-colors",
                                  s === task.status ? "bg-muted font-semibold" : "hover:bg-muted/60"
                                )}
                              >
                                <span className={cfg.color}>{cfg.icon}</span>
                                {cfg.label}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Priority badge */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className={cn("inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full border transition-all", pc.bg, pc.color)}>
                          <div className="w-2 h-2 rounded-full bg-current" />
                          {pc.label}
                          <ChevronDown className="w-3 h-3 opacity-60" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="min-w-[140px]">
                        {(["high", "medium", "low"] as Task["priority"][]).map((p) => {
                          const c = priorityConfig[p];
                          return (
                            <DropdownMenuItem key={p} onClick={() => handleChangePriority(p)} className="gap-2">
                              <div className={cn("w-2.5 h-2.5 rounded-full", p === "high" ? "bg-red-500" : p === "medium" ? "bg-amber-500" : "bg-emerald-500")} />
                              {c.label}
                            </DropdownMenuItem>
                          );
                        })}
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Criada {timeAgo(task.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Actions menu */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon" className="h-9 w-9 rounded-xl">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="min-w-[200px]">
                      <DropdownMenuItem onClick={() => setShowTransfer(true)} className="gap-2.5">
                        <ArrowRightLeft className="w-4 h-4" /> Transferir tarefa
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleDuplicate} className="gap-2.5">
                        <Copy className="w-4 h-4" /> Duplicar
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleChangeStatus("todo")} className="gap-2.5">
                        <XCircle className="w-4 h-4" /> Cancelar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setShowDeleteConfirm(true)} className="gap-2.5 text-destructive focus:text-destructive">
                        <Trash2 className="w-4 h-4" /> Excluir
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>

            {/* ━━━ BODY: 2 COLUMNS ━━━ */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">

              {/* ── LEFT COLUMN (execution) ── */}
              <div className="space-y-6">

                {/* ▸ ATENDIMENTO QUE GEROU A TAREFA */}
                <div className="glass-card rounded-2xl overflow-hidden">
                  <div className="px-5 py-3.5 border-b border-border flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-primary" />
                    <h2 className="text-xs font-bold uppercase tracking-wider text-foreground">
                      Atendimento que gerou a tarefa
                    </h2>
                  </div>
                  <div className="p-5">
                    {task.conversationId ? (
                      <div className="space-y-4">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <MessageCircle className="w-6 h-6 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-base font-bold text-foreground">
                                Atendimento {atendimentoNumber}
                              </span>
                              <Badge className="text-[10px] h-5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/10">
                                Finalizado
                              </Badge>
                            </div>
                            {task.fromContact && (
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <User className="w-3.5 h-3.5" />
                                <span>{task.fromContact}</span>
                                <span className="text-muted-foreground/40">•</span>
                                <span className="flex items-center gap-1">
                                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-emerald-500" fill="currentColor">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                                  </svg>
                                  WhatsApp
                                </span>
                              </div>
                            )}
                            {task.fromMessage && (
                              <p className="text-sm text-muted-foreground mt-2 italic border-l-2 border-primary/30 pl-3">
                                "{task.fromMessage}"
                              </p>
                            )}
                            <p className="text-xs text-muted-foreground mt-2">
                              {new Date(task.createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })} às{" "}
                              {new Date(task.createdAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Button variant="outline" size="sm" className="rounded-xl gap-2 text-xs" onClick={handleGoToConversation}>
                            <ExternalLink className="w-3.5 h-3.5" />
                            Abrir conversa completa
                          </Button>
                          <Button variant="ghost" size="sm" className="rounded-xl gap-2 text-xs text-primary" onClick={handleGoToConversation}>
                            <Hash className="w-3.5 h-3.5" />
                            Ir para mensagem de gatilho
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-4 py-2">
                        <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center">
                          <FileText className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Tarefa criada manualmente</p>
                          <p className="text-xs text-muted-foreground/60 mt-0.5">Nenhum atendimento vinculado a esta tarefa</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* ▸ DESCRIÇÃO */}
                <div className="glass-card rounded-2xl overflow-hidden">
                  <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-primary" />
                      <h2 className="text-xs font-bold uppercase tracking-wider text-foreground">Descrição</h2>
                    </div>
                    {!isEditingDesc && (
                      <button onClick={() => setIsEditingDesc(true)} className="text-xs text-primary hover:underline font-medium">
                        Editar
                      </button>
                    )}
                  </div>
                  <div className="p-5">
                    {isEditingDesc ? (
                      <div className="space-y-3">
                        <textarea
                          autoFocus
                          value={editDesc}
                          onChange={(e) => setEditDesc(e.target.value)}
                          rows={5}
                          className="w-full bg-muted/30 border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none leading-relaxed"
                          placeholder="Descreva os detalhes da tarefa..."
                        />
                        <div className="flex items-center gap-2">
                          <Button size="sm" className="rounded-xl" onClick={handleSaveDescription}>Salvar</Button>
                          <Button size="sm" variant="ghost" className="rounded-xl" onClick={() => { setIsEditingDesc(false); setEditDesc(task.description); }}>Cancelar</Button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap min-h-[60px]">
                        {task.description || "Clique em editar para adicionar uma descrição..."}
                      </p>
                    )}

                    {/* Attachments */}
                    <input type="file" ref={descFileRef} className="hidden" multiple onChange={handleDescFileSelect} />
                    <button
                      onClick={() => descFileRef.current?.click()}
                      className="flex items-center gap-1.5 text-xs text-primary hover:underline mt-4 font-medium"
                    >
                      <Paperclip className="w-3.5 h-3.5" />
                      Anexar arquivo
                    </button>
                    {descAttachments.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {descAttachments.map((att, i) => (
                          <span key={i} className="inline-flex items-center gap-1.5 bg-muted text-foreground text-xs px-3 py-1.5 rounded-xl border border-border">
                            <FileText className="w-3 h-3 text-muted-foreground" />
                            {att.name} <span className="text-muted-foreground">({att.size})</span>
                            <button onClick={() => setDescAttachments((prev) => prev.filter((_, idx) => idx !== i))} className="text-muted-foreground hover:text-destructive ml-1">
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* ▸ ATUALIZAÇÕES INTERNAS (Timeline) */}
                <div className="glass-card rounded-2xl overflow-hidden">
                  <div className="px-5 py-3.5 border-b border-border flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary" />
                    <h2 className="text-xs font-bold uppercase tracking-wider text-foreground">Atualizações Internas</h2>
                  </div>
                  <div className="p-5">
                    {/* Add update */}
                    <div className="flex items-start gap-3 mb-6">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <User className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <textarea
                          value={updateText}
                          onChange={(e) => setUpdateText(e.target.value)}
                          placeholder="Registrar uma atualização..."
                          rows={2}
                          className="w-full bg-muted/30 border border-border rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleAddUpdate(); }
                          }}
                        />
                        <Button
                          size="sm"
                          className="mt-2 rounded-xl gap-1.5 text-xs"
                          onClick={handleAddUpdate}
                          disabled={!updateText.trim()}
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Adicionar registro
                        </Button>
                      </div>
                    </div>

                    {/* Timeline entries */}
                    {(task.comments || []).length > 0 ? (
                      <div className="relative">
                        <div className="absolute left-[15px] top-0 bottom-0 w-px bg-border" />
                        <div className="space-y-0">
                          {[...(task.comments || [])].reverse().map((entry) => (
                            <div key={entry.id} className="relative flex items-start gap-3 pb-5">
                              <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10",
                                entry.by === "Sistema" ? "bg-muted" : "bg-primary/10"
                              )}>
                                {entry.by === "Sistema" ? (
                                  <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                                ) : (
                                  <User className="w-3.5 h-3.5 text-primary" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0 pt-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-xs font-semibold text-foreground">{entry.by}</span>
                                  <span className="text-[10px] text-muted-foreground">
                                    {new Date(entry.createdAt).toLocaleDateString("pt-BR")} às{" "}
                                    {new Date(entry.createdAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                                  </span>
                                </div>
                                <p className="text-sm text-foreground/80 mt-1 whitespace-pre-wrap break-words leading-relaxed">
                                  {entry.text}
                                </p>
                                {entry.attachments && entry.attachments.length > 0 && (
                                  <div className="flex flex-wrap gap-1.5 mt-2">
                                    {entry.attachments.map((att, i) => (
                                      <span key={i} className="inline-flex items-center gap-1 bg-muted text-xs px-2 py-0.5 rounded-lg border border-border text-muted-foreground">
                                        <FileText className="w-3 h-3" /> {att.name}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-6">Nenhuma atualização registrada</p>
                    )}
                  </div>
                </div>

                {/* ▸ COMENTÁRIOS */}
                <div className="glass-card rounded-2xl overflow-hidden">
                  <div className="px-5 py-3.5 border-b border-border flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-primary" />
                    <h2 className="text-xs font-bold uppercase tracking-wider text-foreground">Comentários</h2>
                  </div>
                  <div className="p-5">
                    {/* Editor */}
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                        <User className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        {/* Toolbar */}
                        <div className="flex items-center gap-0.5 bg-muted/40 border border-border border-b-0 rounded-t-xl px-2.5 py-2 flex-wrap">
                          <button onClick={() => applyFormat("**", "**")} className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors" title="Negrito"><Bold className="w-3.5 h-3.5" /></button>
                          <button onClick={() => applyFormat("*", "*")} className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors" title="Itálico"><Italic className="w-3.5 h-3.5" /></button>
                          <button onClick={() => applyFormat("__", "__")} className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors" title="Sublinhado"><Underline className="w-3.5 h-3.5" /></button>
                          <span className="w-px h-4 bg-border mx-1" />
                          <button onClick={() => applyFormat("[", "](url)")} className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors" title="Link"><Link className="w-3.5 h-3.5" /></button>
                          <button onClick={() => setCommentText((t) => t + "\n![imagem](url)")} className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors" title="Imagem"><Image className="w-3.5 h-3.5" /></button>
                          <button onClick={() => commentFileRef.current?.click()} className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors" title="Anexar"><Paperclip className="w-3.5 h-3.5" /></button>
                        </div>
                        <div className="relative">
                          <textarea
                            ref={commentRef}
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Escreva um comentário..."
                            rows={3}
                            className="w-full bg-card border border-border border-t-0 rounded-b-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none pr-14 leading-relaxed"
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleAddComment(); }
                            }}
                          />
                          <Button
                            size="icon"
                            className="absolute right-3 bottom-3 h-8 w-8 rounded-xl"
                            onClick={handleAddComment}
                            disabled={!commentText.trim()}
                          >
                            <SendIcon className="w-4 h-4" />
                          </Button>
                        </div>
                        <input type="file" ref={commentFileRef} className="hidden" multiple onChange={handleCommentFileSelect} />
                        {commentAttachments.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {commentAttachments.map((att, i) => (
                              <span key={i} className="inline-flex items-center gap-1.5 bg-muted text-foreground text-xs px-3 py-1.5 rounded-xl border border-border">
                                <FileText className="w-3 h-3 text-muted-foreground" />
                                {att.name} <span className="text-muted-foreground">({att.size})</span>
                                <button onClick={() => setCommentAttachments((prev) => prev.filter((_, idx) => idx !== i))} className="text-muted-foreground hover:text-destructive ml-1">
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

              {/* ── RIGHT COLUMN (control panel) ── */}
              <div className="space-y-6">
                {/* Control panel card */}
                <div className="glass-card rounded-2xl overflow-hidden lg:sticky lg:top-6">
                  <div className="px-5 py-3.5 border-b border-border">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-foreground">Painel de Controle</h2>
                  </div>
                  <div className="p-5 space-y-5">
                    {/* Responsável */}
                    <div>
                      <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2 block">Responsável</label>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-muted/40 hover:bg-muted/60 transition-colors text-left">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <User className="w-4 h-4 text-primary" />
                            </div>
                            <span className="text-sm font-medium text-foreground">{task.assignee || "Ninguém"}</span>
                            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground ml-auto" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="min-w-[200px]">
                          {availableAssignees.map((a) => (
                            <DropdownMenuItem key={a} onClick={() => handleChangeAssignee(a)} className={cn("gap-2.5", a === task.assignee && "font-semibold")}>
                              <User className="w-3.5 h-3.5" /> {a}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Prazo */}
                    <div>
                      <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2 block">Prazo</label>
                      <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-muted/40">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <input
                          type="date"
                          value={task.dueDate}
                          onChange={(e) => {
                            saveTask({ dueDate: e.target.value });
                            toast.success("Prazo atualizado");
                          }}
                          className="bg-transparent text-sm text-foreground focus:outline-none flex-1 cursor-pointer"
                        />
                      </div>
                    </div>

                    {/* Tags */}
                    <div>
                      <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2 block">Tags</label>
                      <div className="flex flex-wrap gap-1.5">
                        {task.tags.length > 0 ? task.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-[10px] px-2 py-0.5 rounded-lg font-medium">
                            <Tag className="w-2.5 h-2.5 mr-1" />
                            {tag}
                          </Badge>
                        )) : (
                          <span className="text-xs text-muted-foreground">Sem tags</span>
                        )}
                      </div>
                    </div>

                    {/* Departamento */}
                    <div>
                      <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2 block">Departamento</label>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Building2 className="w-4 h-4" />
                        <span>Operações</span>
                      </div>
                    </div>

                    {/* SLA */}
                    <div>
                      <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2 block">SLA</label>
                      <div className="flex items-center gap-2 text-sm">
                        <Shield className="w-4 h-4 text-muted-foreground" />
                        <span className={cn(
                          task.dueDate && new Date(task.dueDate) < new Date() ? "text-destructive font-medium" : "text-muted-foreground"
                        )}>
                          {task.dueDate && new Date(task.dueDate) < new Date()
                            ? "⚠ Prazo expirado"
                            : task.dueDate
                              ? `${Math.ceil((new Date(task.dueDate).getTime() - Date.now()) / 86400000)} dias restantes`
                              : "Sem SLA definido"
                          }
                        </span>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-border" />

                    {/* Finalizar button */}
                    <Button
                      className="w-full rounded-xl h-11 text-sm font-semibold gap-2"
                      onClick={() => task.status === "done" ? handleChangeStatus("in_progress") : setShowFinalize(true)}
                      variant={task.status === "done" ? "outline" : "default"}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      {task.status === "done" ? "Reabrir Tarefa" : "Finalizar Tarefa"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ━━━ MODALS ━━━ */}

        {/* Delete */}
        <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
          <DialogContent className="sm:max-w-sm rounded-2xl">
            <DialogHeader>
              <DialogTitle>Excluir tarefa</DialogTitle>
              <DialogDescription>Essa ação não pode ser desfeita. A tarefa será removida permanentemente.</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" className="rounded-xl" onClick={() => setShowDeleteConfirm(false)}>Cancelar</Button>
              <Button variant="destructive" className="rounded-xl" onClick={handleDeleteTask}>Excluir</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Transfer */}
        <Dialog open={showTransfer} onOpenChange={setShowTransfer}>
          <DialogContent className="sm:max-w-md rounded-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2"><ArrowRightLeft className="w-5 h-5 text-primary" /> Transferir tarefa</DialogTitle>
              <DialogDescription>Selecione o colaborador e informe o motivo da transferência.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div>
                <label className="text-xs font-semibold text-foreground mb-1.5 block">Transferir para</label>
                <div className="grid grid-cols-2 gap-2">
                  {availableAssignees.filter((a) => a !== task.assignee).map((a) => (
                    <button
                      key={a}
                      onClick={() => setTransferTo(a)}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm transition-all",
                        transferTo === a
                          ? "border-primary bg-primary/5 text-foreground font-medium"
                          : "border-border bg-muted/30 text-muted-foreground hover:bg-muted/50"
                      )}
                    >
                      <User className="w-4 h-4" />
                      {a}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground mb-1.5 block">Motivo (opcional)</label>
                <textarea
                  value={transferReason}
                  onChange={(e) => setTransferReason(e.target.value)}
                  placeholder="Ex: Colaborador com mais experiência no assunto"
                  rows={2}
                  className="w-full bg-muted/30 border border-border rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" className="rounded-xl" onClick={() => setShowTransfer(false)}>Cancelar</Button>
              <Button className="rounded-xl gap-2" onClick={handleTransfer} disabled={!transferTo}>
                <ArrowRightLeft className="w-4 h-4" />
                Transferir
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Finalize */}
        <Dialog open={showFinalize} onOpenChange={setShowFinalize}>
          <DialogContent className="sm:max-w-md rounded-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> Finalizar tarefa</DialogTitle>
              <DialogDescription>Confirme a finalização da tarefa. Você pode adicionar um comentário de encerramento.</DialogDescription>
            </DialogHeader>
            <div className="py-2">
              <label className="text-xs font-semibold text-foreground mb-1.5 block">Comentário de encerramento (opcional)</label>
              <textarea
                value={finalizeComment}
                onChange={(e) => setFinalizeComment(e.target.value)}
                placeholder="Ex: Cliente atendido com sucesso, caso resolvido."
                rows={3}
                className="w-full bg-muted/30 border border-border rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" className="rounded-xl" onClick={() => setShowFinalize(false)}>Cancelar</Button>
              <Button className="rounded-xl gap-2 bg-emerald-600 hover:bg-emerald-700 text-white" onClick={handleFinalize}>
                <CheckCircle2 className="w-4 h-4" />
                Confirmar Finalização
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </ProGate>
    </AppLayout>
  );
}
