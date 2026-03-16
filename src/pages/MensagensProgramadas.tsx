import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { MessageSquare, Mic, Plus, Play, Pause, Trash2, Upload, X, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

// === AUDIO STORE (shared) ===
export interface AudioItem {
  id: string;
  title: string;
  fileName: string;
  duration: string;
  createdAt: string;
}

let audioStore: AudioItem[] = [
  { id: "1", title: "Boas-vindas", fileName: "boas-vindas.mp3", duration: "0:15", createdAt: "22/02/2026" },
  { id: "2", title: "Promoção do mês", fileName: "promo-mes.mp3", duration: "0:32", createdAt: "21/02/2026" },
  { id: "3", title: "Confirmação de pedido", fileName: "confirmacao.mp3", duration: "0:20", createdAt: "20/02/2026" },
];
export const getAudioStore = () => audioStore;

// === MENSAGEM STORE (shared) ===
export interface MensagemItem {
  id: string;
  title: string;
  message: string;
  createdAt: string;
}

let mensagemStore: MensagemItem[] = [
  { id: "1", title: "Boas-vindas", message: "Olá! Seja bem-vindo(a)! Estamos à disposição para ajudá-lo(a). 😊", createdAt: "22/02/2026" },
  { id: "2", title: "Promoção do mês", message: "Aproveite nossa promoção especial deste mês! Condições imperdíveis até sexta-feira.", createdAt: "21/02/2026" },
  { id: "3", title: "Confirmação de pedido", message: "Seu pedido foi confirmado com sucesso! Em breve você receberá as informações de envio.", createdAt: "20/02/2026" },
];
export const getMensagemStore = () => mensagemStore;

type TabType = "mensagens" | "audios";

const MensagensProgramadas = () => {
  const [tab, setTab] = useState<TabType>("mensagens");

  // Audio state
  const [audios, setAudios] = useState<AudioItem[]>(audioStore);
  const [showAudioModal, setShowAudioModal] = useState(false);
  const [newAudioTitle, setNewAudioTitle] = useState("");
  const [playingId, setPlayingId] = useState<string | null>(null);

  // Mensagem state
  const [mensagens, setMensagens] = useState<MensagemItem[]>(mensagemStore);
  const [showMsgModal, setShowMsgModal] = useState(false);
  const [newMsgTitle, setNewMsgTitle] = useState("");
  const [newMsgBody, setNewMsgBody] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Audio handlers
  const addAudio = () => {
    if (!newAudioTitle.trim()) return;
    const newItem: AudioItem = { id: Date.now().toString(), title: newAudioTitle.trim(), fileName: `${newAudioTitle.trim().toLowerCase().replace(/\s+/g, "-")}.mp3`, duration: "0:00", createdAt: new Date().toLocaleDateString("pt-BR") };
    const updated = [newItem, ...audios];
    setAudios(updated); audioStore = updated;
    setNewAudioTitle(""); setShowAudioModal(false);
  };
  const removeAudio = (id: string) => { const updated = audios.filter(a => a.id !== id); setAudios(updated); audioStore = updated; };

  // Mensagem handlers
  const addMensagem = () => {
    if (!newMsgTitle.trim() || !newMsgBody.trim()) return;
    const newItem: MensagemItem = { id: Date.now().toString(), title: newMsgTitle.trim(), message: newMsgBody.trim(), createdAt: new Date().toLocaleDateString("pt-BR") };
    const updated = [newItem, ...mensagens];
    setMensagens(updated); mensagemStore = updated;
    setNewMsgTitle(""); setNewMsgBody(""); setShowMsgModal(false);
  };
  const removeMensagem = (id: string) => { const updated = mensagens.filter(m => m.id !== id); setMensagens(updated); mensagemStore = updated; };

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Mensagens Programadas</h1>
            <p className="text-muted-foreground mt-1">Templates de texto e áudio para envio rápido</p>
          </div>
          <button
            onClick={() => tab === "mensagens" ? setShowMsgModal(true) : setShowAudioModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            {tab === "mensagens" ? "Nova Mensagem" : "Novo Áudio"}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-xl w-fit">
          {([
            { key: "mensagens" as TabType, label: "Mensagens", icon: MessageSquare },
            { key: "audios" as TabType, label: "Áudios", icon: Mic },
          ]).map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} className={cn("flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all", tab === t.key ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}>
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          ))}
        </div>

        {/* === TAB: MENSAGENS === */}
        {tab === "mensagens" && (
          mensagens.length === 0 ? (
            <div className="glass-card rounded-xl p-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4"><MessageSquare className="w-8 h-8 text-primary" /></div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Nenhuma mensagem salva</h3>
              <p className="text-sm text-muted-foreground max-w-md">Adicione mensagens com títulos para enviar rapidamente durante as conversas.</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {mensagens.map(msg => (
                <div key={msg.id} className="glass-card rounded-xl p-5 flex items-start gap-4 hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-primary/10 flex-shrink-0 mt-0.5"><MessageSquare className="w-5 h-5 text-primary" /></div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-foreground">{msg.title}</h3>
                    <p className={cn("text-xs text-muted-foreground mt-1", expandedId !== msg.id && "line-clamp-1")}>{msg.message}</p>
                  </div>
                  <span className="text-xs text-muted-foreground flex-shrink-0">{msg.createdAt}</span>
                  <button onClick={() => setExpandedId(expandedId === msg.id ? null : msg.id)} className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors flex-shrink-0">
                    {expandedId === msg.id ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button onClick={() => removeMensagem(msg.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          )
        )}

        {/* === TAB: ÁUDIOS === */}
        {tab === "audios" && (
          audios.length === 0 ? (
            <div className="glass-card rounded-xl p-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4"><Mic className="w-8 h-8 text-primary" /></div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Nenhum áudio salvo</h3>
              <p className="text-sm text-muted-foreground max-w-md">Adicione áudios com títulos para enviar rapidamente durante as conversas.</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {audios.map(audio => (
                <div key={audio.id} className="glass-card rounded-xl p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
                  <button onClick={() => setPlayingId(playingId === audio.id ? null : audio.id)} className={cn("w-10 h-10 rounded-lg flex items-center justify-center transition-colors", playingId === audio.id ? "bg-primary text-primary-foreground" : "bg-primary/10")}>
                    {playingId === audio.id ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 text-primary" />}
                  </button>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-foreground">{audio.title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{audio.fileName} • {audio.duration}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{audio.createdAt}</span>
                  <button onClick={() => removeAudio(audio.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          )
        )}
      </div>

      {/* === MODAL: NOVA MENSAGEM === */}
      {showMsgModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-card rounded-2xl p-6 w-full max-w-md mx-4 shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Nova Mensagem</h2>
              <button onClick={() => { setNewMsgTitle(""); setNewMsgBody(""); setShowMsgModal(false); }} className="p-1 rounded-lg hover:bg-muted transition-colors"><X className="w-5 h-5 text-muted-foreground" /></button>
            </div>
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">Título</label>
              <input type="text" value={newMsgTitle} onChange={e => setNewMsgTitle(e.target.value)} placeholder="Ex: Boas-vindas, Promoção..." className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all" />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">Corpo da mensagem</label>
              <textarea value={newMsgBody} onChange={e => setNewMsgBody(e.target.value)} placeholder="Digite a mensagem..." rows={5} className="w-full bg-muted/50 border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all resize-none" />
            </div>
            <div className="flex gap-3 justify-end">
              <button onClick={() => { setNewMsgTitle(""); setNewMsgBody(""); setShowMsgModal(false); }} className="px-4 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted transition-colors">Cancelar</button>
              <button onClick={addMensagem} className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">Salvar Mensagem</button>
            </div>
          </div>
        </div>
      )}

      {/* === MODAL: NOVO ÁUDIO === */}
      {showAudioModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-card rounded-2xl p-6 w-full max-w-md mx-4 shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Novo Áudio</h2>
              <button onClick={() => { setNewAudioTitle(""); setShowAudioModal(false); }} className="p-1 rounded-lg hover:bg-muted transition-colors"><X className="w-5 h-5 text-muted-foreground" /></button>
            </div>
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">Título do áudio</label>
              <input type="text" value={newAudioTitle} onChange={e => setNewAudioTitle(e.target.value)} placeholder="Ex: Boas-vindas, Promoção..." className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all" />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">Arquivo de áudio</label>
              <button className="w-full flex flex-col items-center gap-3 py-8 border-2 border-dashed border-border rounded-lg hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer">
                <Upload className="w-8 h-8 text-muted-foreground" />
                <div className="text-center">
                  <p className="text-sm font-medium text-foreground">Clique para enviar um áudio</p>
                  <p className="text-xs text-muted-foreground mt-1">MP3, OGG ou WAV • Máx. 5MB</p>
                </div>
              </button>
            </div>
            <div className="flex gap-3 justify-end">
              <button onClick={() => { setNewAudioTitle(""); setShowAudioModal(false); }} className="px-4 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted transition-colors">Cancelar</button>
              <button onClick={addAudio} className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">Salvar Áudio</button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
};

export default MensagensProgramadas;
