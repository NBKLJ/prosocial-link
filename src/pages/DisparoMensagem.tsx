import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { MessageSquare, Plus, Trash2, X, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

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

const DisparoMensagem = () => {
  const [mensagens, setMensagens] = useState<MensagemItem[]>(mensagemStore);
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const addMensagem = () => {
    if (!newTitle.trim() || !newMessage.trim()) return;
    const newItem: MensagemItem = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      message: newMessage.trim(),
      createdAt: new Date().toLocaleDateString("pt-BR"),
    };
    const updated = [newItem, ...mensagens];
    setMensagens(updated);
    mensagemStore = updated;
    setNewTitle("");
    setNewMessage("");
    setShowModal(false);
  };

  const removeMensagem = (id: string) => {
    const updated = mensagens.filter((m) => m.id !== id);
    setMensagens(updated);
    mensagemStore = updated;
  };

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Mensagem Programada</h1>
            <p className="text-muted-foreground mt-1">
              Cadastre e armazene mensagens para envio rápido nas conversas
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nova Mensagem
          </button>
        </div>

        {mensagens.length === 0 ? (
          <div className="glass-card rounded-xl p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <MessageSquare className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Nenhuma mensagem salva</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Adicione mensagens com títulos para enviar rapidamente durante as conversas.
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            {mensagens.map((msg) => (
              <div
                key={msg.id}
                className="glass-card rounded-xl p-5 flex items-start gap-4 hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-primary/10 flex-shrink-0 mt-0.5">
                  <MessageSquare className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-foreground">{msg.title}</h3>
                  <p className={cn("text-xs text-muted-foreground mt-1", expandedId !== msg.id && "line-clamp-1")}>
                    {msg.message}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground flex-shrink-0">{msg.createdAt}</span>
                <button
                  onClick={() => setExpandedId(expandedId === msg.id ? null : msg.id)}
                  className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
                  title={expandedId === msg.id ? "Recolher" : "Expandir"}
                >
                  {expandedId === msg.id ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => removeMensagem(msg.id)}
                  className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Modal Nova Mensagem */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-card rounded-2xl p-6 w-full max-w-md mx-4 shadow-xl space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">Nova Mensagem</h2>
                <button
                  onClick={() => { setNewTitle(""); setNewMessage(""); setShowModal(false); }}
                  className="p-1 rounded-lg hover:bg-muted transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">Título da mensagem</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ex: Boas-vindas, Promoção..."
                  className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">Corpo da mensagem</label>
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Digite a mensagem que será salva para envio rápido..."
                  rows={5}
                  className="w-full bg-muted/50 border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all resize-none"
                />
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => { setNewTitle(""); setNewMessage(""); setShowModal(false); }}
                  className="px-4 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={addMensagem}
                  className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  Salvar Mensagem
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default DisparoMensagem;
