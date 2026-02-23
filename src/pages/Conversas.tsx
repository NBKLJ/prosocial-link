import { AppLayout } from "@/components/AppLayout";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import {
  Search, Phone, Check, CheckCheck, Mic, X, Send as SendIcon,
  Smile, Image, FileText, Sticker, Plus, Tag, UserRoundPlus,
  Trash2, Pause, Play, CircleStop,
} from "lucide-react";
import { getAudioStore, type AudioItem } from "@/pages/DisparoAudio";
import { getTagStore, getTagColor } from "@/lib/tagStore";

type ConversationStatus = "aguardando" | "atendendo" | "aguardando_doc" | "finalizado";

interface Conversation {
  id: string;
  name: string;
  phone: string;
  lastMessage: string;
  time: string;
  unread: number;
  avatar: string;
  status: "online" | "offline";
  atendimentoStatus: ConversationStatus;
  tags: string[];
}

const conversations: Conversation[] = [
  { id: "1", name: "João Silva", phone: "(11) 99999-1234", lastMessage: "Olá, gostaria de saber mais sobre o produto...", time: "10:32", unread: 3, avatar: "JS", status: "online", atendimentoStatus: "aguardando", tags: ["Lead Quente"] },
  { id: "2", name: "Maria Souza", phone: "(21) 98888-5678", lastMessage: "Ok, pode enviar o orçamento", time: "09:15", unread: 0, avatar: "MS", status: "online", atendimentoStatus: "atendendo", tags: [] },
  { id: "3", name: "Carlos Lima", phone: "(31) 97777-9012", lastMessage: "Perfeito, vamos fechar então!", time: "Ontem", unread: 0, avatar: "CL", status: "offline", atendimentoStatus: "aguardando_doc", tags: ["Cliente VIP"] },
  { id: "4", name: "Ana Costa", phone: "(41) 96666-3456", lastMessage: "Preciso de mais informações", time: "Ontem", unread: 1, avatar: "AC", status: "offline", atendimentoStatus: "aguardando", tags: [] },
  { id: "5", name: "Pedro Rocha", phone: "(51) 95555-7890", lastMessage: "Obrigado pelo atendimento!", time: "23/02", unread: 0, avatar: "PR", status: "offline", atendimentoStatus: "finalizado", tags: ["Parceiro"] },
];

const statusFilters: { value: ConversationStatus | "todos"; label: string }[] = [
  { value: "aguardando", label: "Aguardando" },
  { value: "atendendo", label: "Atendendo" },
  { value: "aguardando_doc", label: "Aguard. Doc." },
];

const availableUsers = ["Ana (Suporte)", "Carlos (Vendas)", "Julia (Financeiro)"];

interface Message {
  id: string;
  text: string;
  time: string;
  sent: boolean;
  read: boolean;
}

const messages: Message[] = [
  { id: "1", text: "Olá, boa tarde!", time: "10:20", sent: false, read: true },
  { id: "2", text: "Boa tarde! Como posso ajudar?", time: "10:22", sent: true, read: true },
  { id: "3", text: "Gostaria de saber mais sobre o produto Premium", time: "10:25", sent: false, read: true },
  { id: "4", text: "Claro! O plano Premium inclui disparos ilimitados, CRM avançado e automações completas.", time: "10:28", sent: true, read: true },
  { id: "5", text: "Olá, gostaria de saber mais sobre o produto...", time: "10:32", sent: false, read: false },
];

const Conversas = () => {
  const [selected, setSelected] = useState<string>("1");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ConversationStatus | "todos">("todos");
  const [showAudioList, setShowAudioList] = useState(false);
  const [showAttach, setShowAttach] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordTime, setRecordTime] = useState(0);
  const recordInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const [showTagMenu, setShowTagMenu] = useState(false);
  const [showTransferMenu, setShowTransferMenu] = useState(false);
  const [convTags, setConvTags] = useState<Record<string, string[]>>({
    "1": ["Lead Quente"],
    "3": ["Cliente VIP"],
    "5": ["Parceiro"],
  });

  const filtered = conversations.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "todos" || c.atendimentoStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    aguardando: conversations.filter((c) => c.atendimentoStatus === "aguardando").length,
    atendendo: conversations.filter((c) => c.atendimentoStatus === "atendendo").length,
    aguardando_doc: conversations.filter((c) => c.atendimentoStatus === "aguardando_doc").length,
    finalizado: conversations.filter((c) => c.atendimentoStatus === "finalizado").length,
  };

  const toggleConvTag = (tag: string) => {
    const current = convTags[selected] || [];
    const updated = current.includes(tag)
      ? current.filter((t) => t !== tag)
      : [...current, tag];
    setConvTags({ ...convTags, [selected]: updated });
  };

  const selectedConv = conversations.find((c) => c.id === selected);

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

  return (
    <AppLayout fullHeight>
      <div className="animate-fade-in h-full flex overflow-hidden border-l border-border">
        {/* Contacts List */}
        <div className="w-[340px] border-r border-border flex flex-col">
          <div className="p-4 border-b border-border space-y-3">
            <h2 className="text-lg font-semibold text-foreground">Conversas</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar conversa..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-muted rounded-lg pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
              />
            </div>

            {/* Status filters */}
            <div className="flex gap-1.5">
              {statusFilters.map((sf) => {
                const count = statusCounts[sf.value as ConversationStatus] ?? 0;
                const isActive = statusFilter === sf.value;
                return (
                  <button
                    key={sf.value}
                    onClick={() => setStatusFilter(isActive ? "todos" : sf.value)}
                    className={cn(
                      "flex-1 flex flex-col items-center py-2 px-1 rounded-lg text-center transition-all",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    )}
                  >
                    <span className="text-[11px] font-medium leading-tight">{sf.label}</span>
                    <span className={cn("text-sm font-bold", isActive ? "text-primary-foreground" : "text-foreground")}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filtered.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelected(conv.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors text-left",
                  selected === conv.id && "bg-muted"
                )}
              >
                <div className="relative flex-shrink-0">
                  <div className="w-10 h-10 rounded-full gradient-green flex items-center justify-center text-xs font-bold text-primary-foreground">
                    {conv.avatar}
                  </div>
                  {conv.status === "online" && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-primary border-2 border-card" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm font-medium text-foreground truncate">{conv.name}</span>
                    <span className="text-xs text-muted-foreground flex-shrink-0">{conv.time}</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">{conv.lastMessage}</p>
                  {/* Tags inline */}
                  {(convTags[conv.id] || []).length > 0 && (
                    <div className="flex gap-1 mt-1 flex-wrap">
                      {(convTags[conv.id] || []).map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-medium px-1.5 py-0.5 rounded text-white"
                          style={{ backgroundColor: getTagColor(tag) }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                {conv.unread > 0 && (
                  <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                    {conv.unread}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Chat header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full gradient-green flex items-center justify-center text-xs font-bold text-primary-foreground">
                {selectedConv?.avatar || "?"}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{selectedConv?.name || "Selecione"}</p>
                <p className="text-xs text-primary">{selectedConv?.status === "online" ? "Online" : "Offline"}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 relative">
              {/* Tag button */}
              <button
                onClick={() => { setShowTagMenu(!showTagMenu); setShowTransferMenu(false); }}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  showTagMenu ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
                title="Classificar tag"
              >
                <Tag className="w-5 h-5" />
              </button>

              {/* Transfer button */}
              <button
                onClick={() => { setShowTransferMenu(!showTransferMenu); setShowTagMenu(false); }}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  showTransferMenu ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
                title="Transferir conversa"
              >
                <UserRoundPlus className="w-5 h-5" />
              </button>

              <Phone className="w-5 h-5 text-muted-foreground cursor-pointer hover:text-foreground transition-colors ml-1" />

              {/* Tag dropdown */}
              {showTagMenu && (
                <div className="absolute top-full right-0 mt-2 bg-card border border-border rounded-xl shadow-lg z-20 w-52">
                  <div className="px-4 py-3 border-b border-border">
                    <span className="text-sm font-semibold text-foreground">Classificar Tag</span>
                  </div>
                  <div className="py-1">
                    {getTagStore().map((tagItem) => {
                      const isSelected = (convTags[selected] || []).includes(tagItem.name);
                      return (
                        <button
                          key={tagItem.name}
                          onClick={() => toggleConvTag(tagItem.name)}
                          className={cn(
                            "w-full flex items-center gap-2 px-4 py-2.5 text-left text-sm transition-colors",
                            isSelected ? "font-medium" : "text-foreground hover:bg-muted/50"
                          )}
                        >
                          <div
                            className="w-4 h-4 rounded border flex items-center justify-center"
                            style={isSelected ? { backgroundColor: tagItem.color, borderColor: tagItem.color } : {}}
                          >
                            {isSelected && <Check className="w-3 h-3 text-white" />}
                          </div>
                          <span
                            className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{ backgroundColor: tagItem.color }}
                          />
                          {tagItem.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Transfer dropdown */}
              {showTransferMenu && (
                <div className="absolute top-full right-0 mt-2 bg-card border border-border rounded-xl shadow-lg z-20 w-56">
                  <div className="px-4 py-3 border-b border-border">
                    <span className="text-sm font-semibold text-foreground">Transferir para</span>
                  </div>
                  <div className="py-1">
                    {availableUsers.map((user) => (
                      <button
                        key={user}
                        onClick={() => setShowTransferMenu(false)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm text-foreground hover:bg-muted/50 transition-colors"
                      >
                        <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground">
                          {user.charAt(0)}
                        </div>
                        {user}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {messages.map((msg) => (
              <div key={msg.id} className={cn("flex", msg.sent ? "justify-end" : "justify-start")}>
                <div className={cn(
                  "max-w-[65%] px-4 py-2.5 rounded-2xl text-sm",
                  msg.sent
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-muted text-foreground rounded-bl-md"
                )}>
                  <p>{msg.text}</p>
                  <div className={cn("flex items-center justify-end gap-1 mt-1", msg.sent ? "text-primary-foreground/70" : "text-muted-foreground")}>
                    <span className="text-[10px]">{msg.time}</span>
                    {msg.sent && (msg.read ? <CheckCheck className="w-3 h-3" /> : <Check className="w-3 h-3" />)}
                  </div>
                </div>
              </div>
            ))}
          </div>

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

            {/* Attach popup */}
            {showAttach && (
              <div className="absolute bottom-full left-5 mb-2 bg-card border border-border rounded-xl shadow-lg z-10 w-56">
                <div className="py-2">
                  {[
                    { icon: Image, label: "Imagem", color: "text-blue-500" },
                    { icon: FileText, label: "Documento", color: "text-orange-500" },
                    { icon: Mic, label: "Áudios Programados", color: "text-primary", action: () => { setShowAttach(false); setShowAudioList(true); } },
                    { icon: Sticker, label: "Figurinha", color: "text-pink-500" },
                  ].map((item) => (
                    <button
                      key={item.label}
                      onClick={() => { item.action?.(); if (!item.action) setShowAttach(false); }}
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
                      onClick={() => setShowEmoji(false)}
                      className="w-8 h-8 flex items-center justify-center text-lg hover:bg-muted rounded transition-colors"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {isRecording ? (
              /* ===== RECORDING BAR ===== */
              <div className="flex gap-2 items-center">
                {/* Cancelar label */}
                <span className="text-xs text-muted-foreground mr-1 cursor-pointer hover:text-foreground transition-colors" onClick={stopRecording}>Cancelar</span>

                {/* Delete */}
                <button
                  onClick={stopRecording}
                  className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-destructive hover:border-destructive transition-colors flex-shrink-0"
                  title="Descartar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                {/* Red dot + timer */}
                <div className="flex items-center gap-2 px-3">
                  <div className={cn("w-2.5 h-2.5 rounded-full bg-destructive", !isPaused && "animate-pulse")} />
                  <span className="text-sm font-mono font-semibold text-foreground min-w-[36px]">{formatRecordTime(recordTime)}</span>
                </div>

                {/* Waveform visualization */}
                <div className="flex-1 flex items-center justify-center gap-[3px] h-8 overflow-hidden">
                  {Array.from({ length: 30 }).map((_, i) => (
                    <div
                      key={i}
                      className={cn("w-[3px] rounded-full bg-muted-foreground/40 transition-all", !isPaused && "animate-pulse")}
                      style={{
                        height: `${Math.max(4, Math.random() * 24 + 4)}px`,
                        animationDelay: `${i * 50}ms`,
                      }}
                    />
                  ))}
                </div>

                {/* Pause / Resume */}
                <button
                  onClick={isPaused ? resumeRecording : pauseRecording}
                  className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground transition-colors flex-shrink-0"
                  title={isPaused ? "Continuar" : "Pausar"}
                >
                  {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                </button>

                {/* Stop */}
                <button
                  onClick={stopRecording}
                  className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground transition-colors flex-shrink-0"
                  title="Parar"
                >
                  <CircleStop className="w-4 h-4" />
                </button>

                {/* Send */}
                <button
                  onClick={stopRecording}
                  className="w-10 h-10 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center justify-center flex-shrink-0"
                  title="Enviar áudio"
                >
                  <SendIcon className="w-5 h-5" />
                </button>
              </div>
            ) : (
              /* ===== NORMAL INPUT BAR ===== */
              <div className="flex gap-2 items-center">
                <button
                  onClick={() => { setShowAttach(!showAttach); setShowEmoji(false); setShowAudioList(false); }}
                  className={cn(
                    "p-2.5 rounded-lg transition-colors flex-shrink-0",
                    showAttach ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                  title="Anexar"
                >
                  <Plus className="w-5 h-5" />
                </button>

                <button
                  onClick={() => { setShowEmoji(!showEmoji); setShowAttach(false); setShowAudioList(false); }}
                  className={cn(
                    "p-2.5 rounded-lg transition-colors flex-shrink-0",
                    showEmoji ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                  title="Emoji"
                >
                  <Smile className="w-5 h-5" />
                </button>

                <input
                  type="text"
                  placeholder="Digite uma mensagem..."
                  className="flex-1 bg-muted rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                />

                <button
                  onClick={startRecording}
                  className="p-2.5 rounded-lg transition-colors flex-shrink-0 text-muted-foreground hover:text-foreground hover:bg-muted"
                  title="Gravar áudio"
                >
                  <Mic className="w-5 h-5" />
                </button>

                <button className="p-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex-shrink-0">
                  <SendIcon className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Conversas;
