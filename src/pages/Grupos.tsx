import { AppLayout } from "@/components/AppLayout";
import {
  Users, Search, Plus, MessageCircle, UserPlus, Settings2, MoreVertical,
  Mic, X, Send as SendIcon, Smile, Image, FileText, Sticker,
  Trash2, Pause, Play, CircleStop, LogOut, Bell, BellOff, Archive,
} from "lucide-react";
import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { getAudioStore } from "@/pages/DisparoAudio";
import { getMensagemStore } from "@/pages/DisparoMensagem";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Group {
  id: string;
  name: string;
  avatar: string;
  members: number;
  lastMessage: string;
  lastMessageTime: string;
  unread: number;
  description: string;
  connection: string;
}

const mockGroups: Group[] = [
  { id: "1", name: "Equipe Comercial", avatar: "EC", members: 12, lastMessage: "Fechamos o contrato do cliente X!", lastMessageTime: "10:32", unread: 3, description: "Grupo da equipe de vendas", connection: "Comercial 1" },
  { id: "2", name: "Suporte Técnico", avatar: "ST", members: 8, lastMessage: "Ticket #432 resolvido", lastMessageTime: "09:45", unread: 0, description: "Atendimento e suporte ao cliente", connection: "Suporte" },
  { id: "3", name: "Marketing Digital", avatar: "MD", members: 6, lastMessage: "Campanha aprovada pelo cliente", lastMessageTime: "Ontem", unread: 5, description: "Estratégias de marketing", connection: "Comercial 1" },
  { id: "4", name: "Financeiro", avatar: "FN", members: 4, lastMessage: "NF enviada para o cliente Y", lastMessageTime: "Ontem", unread: 0, description: "Controle financeiro e cobranças", connection: "Comercial 2" },
  { id: "5", name: "Leads Quentes 🔥", avatar: "LQ", members: 15, lastMessage: "Novo lead qualificado via site", lastMessageTime: "08:12", unread: 12, description: "Leads com alta chance de conversão", connection: "Comercial 1" },
  { id: "6", name: "Pós-Venda", avatar: "PV", members: 5, lastMessage: "Cliente satisfeito com onboarding", lastMessageTime: "Seg", unread: 0, description: "Acompanhamento pós-venda", connection: "Suporte" },
];

interface Message {
  id: string;
  text: string;
  time: string;
  sent: boolean;
  sender?: string;
  senderAvatar?: string;
}

const initialMessages: Message[] = [
  { id: "1", text: "Bom dia pessoal! Temos novidades sobre o cliente X.", time: "10:30", sent: false, sender: "João Carlos", senderAvatar: "JC" },
  { id: "2", text: "Ótimo! Fechamos o contrato do cliente X! 🎉", time: "10:32", sent: false, sender: "Maria Lima", senderAvatar: "ML" },
  { id: "3", text: "Parabéns equipe! Vamos agendar onboarding para amanhã.", time: "10:35", sent: true },
];

export default function Grupos() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(mockGroups[0]);
  const [chatMessages, setChatMessages] = useState<Message[]>(initialMessages);
  const [messageText, setMessageText] = useState("");

  // Input bar state
  const [showAudioList, setShowAudioList] = useState(false);
  const [showMensagemList, setShowMensagemList] = useState(false);
  const [showAttach, setShowAttach] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordTime, setRecordTime] = useState(0);
  const recordInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  // Dialog states
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  // Create group form
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDesc, setNewGroupDesc] = useState("");

  // Add member form
  const [memberPhone, setMemberPhone] = useState("");

  // Settings form
  const [editGroupName, setEditGroupName] = useState("");
  const [editGroupDesc, setEditGroupDesc] = useState("");
  const [muteNotifications, setMuteNotifications] = useState(false);

  const filtered = mockGroups.filter(g =>
    g.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const startRecording = () => {
    setIsRecording(true);
    setIsPaused(false);
    setRecordTime(0);
    recordInterval.current = setInterval(() => {
      setRecordTime((t) => t + 1);
    }, 1000);
  };

  const pauseRecording = () => {
    setIsPaused(true);
    if (recordInterval.current) clearInterval(recordInterval.current);
  };

  const resumeRecording = () => {
    setIsPaused(false);
    recordInterval.current = setInterval(() => {
      setRecordTime((t) => t + 1);
    }, 1000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    setIsPaused(false);
    setRecordTime(0);
    if (recordInterval.current) clearInterval(recordInterval.current);
  };

  const formatRecordTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const sendMessage = () => {
    if (!messageText.trim()) return;
    const now = new Date();
    const time = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
    setChatMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), text: messageText, time, sent: true },
    ]);
    setMessageText("");
  };

  const insertEmoji = (emoji: string) => {
    setMessageText((prev) => prev + emoji);
    setShowEmoji(false);
  };

  return (
    <AppLayout fullHeight>
      <div className="flex h-screen gap-0 overflow-hidden bg-card">
        {/* Lista de grupos */}
        <div className="w-[340px] flex flex-col border-r border-border">
          <div className="p-4 space-y-3 border-b border-border">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Grupos</h2>
              <button onClick={() => { setNewGroupName(""); setNewGroupDesc(""); setShowCreateGroup(true); }} className="p-2 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar grupo..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-muted rounded-lg pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filtered.map(group => {
              const isSelected = selectedGroup?.id === group.id;
              return (
                <button
                  key={group.id}
                  onClick={() => setSelectedGroup(group)}
                  className={cn(
                    "w-full flex items-start gap-3 px-4 py-3 hover:bg-muted/50 transition-colors text-left border-b border-border/40",
                    isSelected && "bg-muted"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5",
                    isSelected ? "gradient-green text-primary-foreground" : "bg-muted text-muted-foreground"
                  )}>
                    {group.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-foreground truncate">{group.name}</span>
                      <span className="text-[11px] text-muted-foreground flex-shrink-0">{group.lastMessageTime}</span>
                    </div>
                    <div className="flex items-center justify-between mt-0.5">
                      <span className="text-xs text-muted-foreground truncate">{group.lastMessage}</span>
                      {group.unread > 0 && (
                        <span className="min-w-[20px] h-5 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold px-1.5 flex-shrink-0 ml-2">
                          {group.unread}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-0.5">
                      <span className="text-[11px] text-muted-foreground">{group.members} membros</span>
                      <div className="flex items-center gap-1 text-[11px] text-primary flex-shrink-0">
                        <MessageCircle className="w-3 h-3" />
                        <span>{group.connection}</span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Detalhes do grupo */}
        {selectedGroup ? (
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full gradient-green flex items-center justify-center text-xs font-bold text-primary-foreground">
                  {selectedGroup.avatar}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">{selectedGroup.name}</h3>
                  <span className="text-xs text-muted-foreground">{selectedGroup.members} membros</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => { setMemberPhone(""); setShowAddMember(true); }} className="p-2 rounded-lg hover:bg-muted/50 transition-colors text-muted-foreground" title="Adicionar membro">
                  <UserPlus className="w-4 h-4" />
                </button>
                <button onClick={() => { setEditGroupName(selectedGroup.name); setEditGroupDesc(selectedGroup.description); setShowSettings(true); }} className="p-2 rounded-lg hover:bg-muted/50 transition-colors text-muted-foreground" title="Configurações">
                  <Settings2 className="w-4 h-4" />
                </button>
                <div className="relative">
                  <button onClick={() => setShowMoreMenu(!showMoreMenu)} className="p-2 rounded-lg hover:bg-muted/50 transition-colors text-muted-foreground" title="Mais opções">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                  {showMoreMenu && (
                    <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-xl shadow-lg z-20 w-52 py-1">
                      <button onClick={() => { setMuteNotifications(!muteNotifications); setShowMoreMenu(false); toast.success(muteNotifications ? "Notificações ativadas" : "Notificações silenciadas"); }} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-muted/50 transition-colors text-left">
                        {muteNotifications ? <Bell className="w-4 h-4 text-muted-foreground" /> : <BellOff className="w-4 h-4 text-muted-foreground" />}
                        <span className="text-sm text-foreground">{muteNotifications ? "Ativar notificações" : "Silenciar grupo"}</span>
                      </button>
                      <button onClick={() => { setShowMoreMenu(false); toast.info("Grupo arquivado"); }} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-muted/50 transition-colors text-left">
                        <Archive className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-foreground">Arquivar grupo</span>
                      </button>
                      <button onClick={() => { setShowMoreMenu(false); toast.info("Você saiu do grupo"); }} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-muted/50 transition-colors text-left">
                        <LogOut className="w-4 h-4 text-destructive" />
                        <span className="text-sm text-destructive">Sair do grupo</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Área de mensagens */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <div className="flex justify-center">
                <span className="text-xs text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">Hoje</span>
              </div>

              {chatMessages.map((msg) => (
                <div key={msg.id} className={cn("flex gap-3", msg.sent && "justify-end")}>
                  {!msg.sent && (
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground flex-shrink-0">
                      {msg.senderAvatar || "?"}
                    </div>
                  )}
                  <div className={cn(
                    "rounded-2xl px-4 py-2.5 max-w-[60%]",
                    msg.sent
                      ? "bg-primary/10 border border-primary/20 rounded-tr-md"
                      : "bg-muted/50 border border-border rounded-tl-md"
                  )}>
                    {!msg.sent && msg.sender && (
                      <span className="text-xs font-semibold text-primary block mb-1">{msg.sender}</span>
                    )}
                    <p className="text-sm text-foreground">{msg.text}</p>
                    <span className="text-[10px] text-muted-foreground mt-1 block text-right">{msg.time}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Input bar - idêntica à de Conversas */}
            <div className="px-5 py-3 border-t border-border relative">
              {/* Audio list popup */}
              {showAudioList && (
                <div className="absolute bottom-full left-5 right-5 mb-2 bg-card border border-border rounded-xl shadow-lg max-h-60 overflow-y-auto z-10">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                    <span className="text-sm font-semibold text-foreground">Áudios Programados</span>
                    <button onClick={() => setShowAudioList(false)} className="p-1 rounded hover:bg-muted">
                      <X className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                  {getAudioStore().length === 0 ? (
                    <p className="px-4 py-6 text-sm text-muted-foreground text-center">Nenhum áudio salvo</p>
                  ) : (
                    getAudioStore().map((audio) => (
                      <button
                        key={audio.id}
                        onClick={() => setShowAudioList(false)}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors text-left"
                      >
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Mic className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{audio.title}</p>
                          <p className="text-xs text-muted-foreground">{audio.duration}</p>
                        </div>
                        <SendIcon className="w-4 h-4 text-primary flex-shrink-0" />
                      </button>
                    ))
                  )}
                </div>
              )}

              {/* Mensagens programadas list popup */}
              {showMensagemList && (
                <div className="absolute bottom-full left-5 right-5 mb-2 bg-card border border-border rounded-xl shadow-lg max-h-60 overflow-y-auto z-10">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                    <span className="text-sm font-semibold text-foreground">Mensagens Programadas</span>
                    <button onClick={() => setShowMensagemList(false)} className="p-1 rounded hover:bg-muted">
                      <X className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                  {getMensagemStore().length === 0 ? (
                    <p className="px-4 py-6 text-sm text-muted-foreground text-center">Nenhuma mensagem salva</p>
                  ) : (
                    getMensagemStore().map((msg) => (
                      <button
                        key={msg.id}
                        onClick={() => {
                          setMessageText(msg.message);
                          setShowMensagemList(false);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors text-left"
                      >
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <MessageCircle className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{msg.title}</p>
                          <p className="text-xs text-muted-foreground truncate">{msg.message}</p>
                        </div>
                        <SendIcon className="w-4 h-4 text-primary flex-shrink-0" />
                      </button>
                    ))
                  )}
                </div>
              )}

              {/* Attach popup */}
              {showAttach && (
                <div className="absolute bottom-full left-5 mb-2 bg-card border border-border rounded-xl shadow-lg z-10 w-56">
                  <div className="py-2">
                    {[
                      { icon: Image, label: "Imagem", color: "text-blue-500" },
                      { icon: FileText, label: "Documento", color: "text-orange-500" },
                      { icon: Mic, label: "Áudios Programados", color: "text-primary", action: () => { setShowAttach(false); setShowAudioList(true); setShowMensagemList(false); } },
                      { icon: MessageCircle, label: "Mensagens Programadas", color: "text-emerald-500", action: () => { setShowAttach(false); setShowMensagemList(true); setShowAudioList(false); } },
                      { icon: Sticker, label: "Figurinha", color: "text-pink-500" },
                    ].map((item) => (
                      <button
                        key={item.label}
                        onClick={() => { if (item.action) { item.action(); } else { setShowAttach(false); toast.info("Funcionalidade em breve"); } }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-muted/50 transition-colors text-left"
                      >
                        <item.icon className={cn("w-5 h-5", item.color)} />
                        <span className="text-sm font-medium text-foreground">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Emoji picker popup */}
              {showEmoji && (
                <div className="absolute bottom-full right-5 mb-2 bg-card border border-border rounded-xl shadow-lg z-10 p-4 w-72">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-foreground">Emojis</span>
                    <button onClick={() => setShowEmoji(false)} className="p-1 rounded hover:bg-muted">
                      <X className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                  <div className="grid grid-cols-8 gap-1">
                    {["😀","😂","😍","🥰","😎","🤩","😢","😡","👍","👎","❤️","🔥","🎉","✅","⭐","💬","📞","📸","🎁","💰","🙏","👋","🤝","💪","🏆","🎯","📌","⏰","📅","💡","🚀","✨"].map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => insertEmoji(emoji)}
                        className="w-8 h-8 flex items-center justify-center text-lg hover:bg-muted rounded transition-colors"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {isRecording ? (
                <div className="flex gap-2 items-center">
                  <span className="text-xs text-muted-foreground mr-1 cursor-pointer hover:text-foreground transition-colors" onClick={stopRecording}>Cancelar</span>
                  <button onClick={stopRecording} className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-destructive hover:border-destructive transition-colors flex-shrink-0" title="Descartar">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="flex items-center gap-2 px-3">
                    <div className={cn("w-2.5 h-2.5 rounded-full bg-destructive", !isPaused && "animate-pulse")} />
                    <span className="text-sm font-mono font-semibold text-foreground min-w-[36px]">{formatRecordTime(recordTime)}</span>
                  </div>
                  <div className="flex-1 flex items-center justify-center gap-[3px] h-8 overflow-hidden">
                    {Array.from({ length: 30 }).map((_, i) => (
                      <div key={i} className={cn("w-[3px] rounded-full bg-muted-foreground/40 transition-all", !isPaused && "animate-pulse")} style={{ height: `${Math.max(4, Math.random() * 24 + 4)}px`, animationDelay: `${i * 50}ms` }} />
                    ))}
                  </div>
                  <button onClick={isPaused ? resumeRecording : pauseRecording} className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground transition-colors flex-shrink-0" title={isPaused ? "Continuar" : "Pausar"}>
                    {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                  </button>
                  <button onClick={stopRecording} className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground transition-colors flex-shrink-0" title="Parar">
                    <CircleStop className="w-4 h-4" />
                  </button>
                  <button onClick={stopRecording} className="w-10 h-10 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center justify-center flex-shrink-0" title="Enviar áudio">
                    <SendIcon className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2 items-center">
                  <button
                    onClick={() => { setShowAttach(!showAttach); setShowEmoji(false); setShowAudioList(false); setShowMensagemList(false); }}
                    className={cn("p-2.5 rounded-lg transition-colors flex-shrink-0", showAttach ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted")}
                    title="Anexar"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => { setShowEmoji(!showEmoji); setShowAttach(false); setShowAudioList(false); }}
                    className={cn("p-2.5 rounded-lg transition-colors flex-shrink-0", showEmoji ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted")}
                    title="Emoji"
                  >
                    <Smile className="w-5 h-5" />
                  </button>
                  <input
                    type="text"
                    placeholder="Digite uma mensagem..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                    className="flex-1 bg-muted rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                  />
                  <button onClick={startRecording} className="p-2.5 rounded-lg transition-colors flex-shrink-0 text-muted-foreground hover:text-foreground hover:bg-muted" title="Gravar áudio">
                    <Mic className="w-5 h-5" />
                  </button>
                  <button onClick={sendMessage} className="p-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex-shrink-0">
                    <SendIcon className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center space-y-2">
              <Users className="w-12 h-12 mx-auto opacity-40" />
              <p className="text-sm">Selecione um grupo para visualizar</p>
            </div>
          </div>
        )}
      </div>

      {/* Dialog: Criar Grupo */}
      <Dialog open={showCreateGroup} onOpenChange={setShowCreateGroup}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar Novo Grupo</DialogTitle>
            <DialogDescription>Preencha as informações do novo grupo.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Nome do grupo</label>
              <input value={newGroupName} onChange={e => setNewGroupName(e.target.value)} placeholder="Ex: Equipe de Vendas" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Descrição</label>
              <input value={newGroupDesc} onChange={e => setNewGroupDesc(e.target.value)} placeholder="Descreva o propósito do grupo" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateGroup(false)}>Cancelar</Button>
            <Button onClick={() => { if (!newGroupName.trim()) { toast.error("Informe o nome do grupo"); return; } toast.success(`Grupo "${newGroupName}" criado com sucesso!`); setShowCreateGroup(false); }}>Criar Grupo</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog: Adicionar Membro */}
      <Dialog open={showAddMember} onOpenChange={setShowAddMember}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Membro</DialogTitle>
            <DialogDescription>Adicione um novo membro ao grupo {selectedGroup?.name}.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Número do WhatsApp</label>
              <input value={memberPhone} onChange={e => setMemberPhone(e.target.value)} placeholder="(11) 99999-9999" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddMember(false)}>Cancelar</Button>
            <Button onClick={() => { if (!memberPhone.trim()) { toast.error("Informe o número"); return; } toast.success(`Membro adicionado ao grupo!`); setShowAddMember(false); }}>Adicionar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog: Configurações do Grupo */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configurações do Grupo</DialogTitle>
            <DialogDescription>Edite as informações do grupo.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Nome do grupo</label>
              <input value={editGroupName} onChange={e => setEditGroupName(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Descrição</label>
              <input value={editGroupDesc} onChange={e => setEditGroupDesc(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSettings(false)}>Cancelar</Button>
            <Button onClick={() => { toast.success("Configurações salvas!"); setShowSettings(false); }}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
