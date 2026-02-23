import { AppLayout } from "@/components/AppLayout";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Search, Phone, Check, CheckCheck, Mic, X, Send as SendIcon } from "lucide-react";
import { getAudioStore, type AudioItem } from "@/pages/DisparoAudio";

interface Conversation {
  id: string;
  name: string;
  phone: string;
  lastMessage: string;
  time: string;
  unread: number;
  avatar: string;
  status: "online" | "offline";
}

const conversations: Conversation[] = [
  { id: "1", name: "João Silva", phone: "(11) 99999-1234", lastMessage: "Olá, gostaria de saber mais sobre o produto...", time: "10:32", unread: 3, avatar: "JS", status: "online" },
  { id: "2", name: "Maria Souza", phone: "(21) 98888-5678", lastMessage: "Ok, pode enviar o orçamento", time: "09:15", unread: 0, avatar: "MS", status: "online" },
  { id: "3", name: "Carlos Lima", phone: "(31) 97777-9012", lastMessage: "Perfeito, vamos fechar então!", time: "Ontem", unread: 0, avatar: "CL", status: "offline" },
  { id: "4", name: "Ana Costa", phone: "(41) 96666-3456", lastMessage: "Preciso de mais informações", time: "Ontem", unread: 1, avatar: "AC", status: "offline" },
  { id: "5", name: "Pedro Rocha", phone: "(51) 95555-7890", lastMessage: "Obrigado pelo atendimento!", time: "23/02", unread: 0, avatar: "PR", status: "offline" },
];

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
  const [showAudioList, setShowAudioList] = useState(false);

  const filtered = conversations.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout fullHeight>
      <div className="animate-fade-in h-full flex overflow-hidden border-l border-border">
        {/* Contacts List */}
        <div className="w-[340px] border-r border-border flex flex-col">
          <div className="p-4 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground mb-3">Conversas</h2>
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
          <div className="flex items-center justify-between px-5 py-3 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full gradient-green flex items-center justify-center text-xs font-bold text-primary-foreground">
                JS
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">João Silva</p>
                <p className="text-xs text-primary">Online</p>
              </div>
            </div>
            <Phone className="w-5 h-5 text-muted-foreground cursor-pointer hover:text-foreground transition-colors" />
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
                  <span className="text-sm font-semibold text-foreground">Áudios Salvos</span>
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

            <div className="flex gap-3 items-center">
              <button
                onClick={() => setShowAudioList(!showAudioList)}
                className={cn(
                  "p-2.5 rounded-lg transition-colors flex-shrink-0",
                  showAudioList ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
                )}
                title="Áudios salvos"
              >
                <Mic className="w-5 h-5" />
              </button>
              <input
                type="text"
                placeholder="Digite uma mensagem..."
                className="flex-1 bg-muted rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
              />
              <button className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                Enviar
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Conversas;
