import { AppLayout } from "@/components/AppLayout";
import { useState } from "react";
import {
  Settings,
  User,
  Bell,
  Shield,
  Palette,
  Smartphone,
  QrCode,
  CheckCircle2,
  XCircle,
  StickyNote,
  Tag,
  Plus,
  X,
  Crown,
} from "lucide-react";
import { cn } from "@/lib/utils";

const conexoes = [
  { id: "1", number: "(11) 99999-1234", name: "Comercial 1", status: "connected" as const },
  { id: "2", number: "(21) 98888-5678", name: "Suporte", status: "disconnected" as const },
];

const defaultTags = ["Lead Quente", "Cliente VIP", "Suporte", "Parceiro", "Inativo"];

const Configuracoes = () => {
  const [tags, setTags] = useState(defaultTags);
  const [newTag, setNewTag] = useState("");
  const [notes, setNotes] = useState("Exemplo: informações importantes sobre configurações do sistema.");

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  return (
    <AppLayout>
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Configurações</h1>
          <p className="text-muted-foreground mt-1">Gerencie sua conta e preferências</p>
        </div>

        {/* Plano atual */}
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center gap-3 mb-1">
            <Crown className="w-5 h-5 text-primary" />
            <h2 className="text-base font-semibold text-foreground">Plano Atual</h2>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-primary/10 text-primary">
              Basic
            </span>
          </div>
          <p className="text-xs text-muted-foreground ml-8">Até 2 conexões de WhatsApp incluídas</p>
        </div>

        {/* Conexões */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-primary" />
              <h2 className="text-base font-semibold text-foreground">Conexões WhatsApp</h2>
            </div>
            <span className="text-xs text-muted-foreground">{conexoes.length}/2 números</span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {conexoes.map((c) => (
              <div key={c.id} className="glass-card rounded-xl p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center",
                        c.status === "connected" ? "bg-primary/10" : "bg-muted"
                      )}
                    >
                      <Smartphone
                        className={cn(
                          "w-5 h-5",
                          c.status === "connected" ? "text-primary" : "text-muted-foreground"
                        )}
                      />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">{c.name}</h3>
                      <p className="text-xs text-muted-foreground">{c.number}</p>
                    </div>
                  </div>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full",
                      c.status === "connected"
                        ? "bg-primary/10 text-primary"
                        : "bg-destructive/10 text-destructive"
                    )}
                  >
                    {c.status === "connected" ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5" />
                    )}
                    {c.status === "connected" ? "Conectado" : "Desconectado"}
                  </span>
                </div>
                {c.status === "disconnected" && (
                  <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                    <QrCode className="w-4 h-4" />
                    Reconectar via QR Code
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Etiquetas (Tags) */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-primary" />
            <h2 className="text-base font-semibold text-foreground">Etiquetas (Tags)</h2>
          </div>

          <div className="glass-card rounded-xl p-5 space-y-4">
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-primary/10 text-primary"
                >
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Nova etiqueta..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTag()}
                className="flex-1 bg-muted/50 border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
              />
              <button
                onClick={addTag}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Adicionar
              </button>
            </div>
          </div>
        </div>

        {/* Anotações Internas */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <StickyNote className="w-5 h-5 text-primary" />
            <h2 className="text-base font-semibold text-foreground">Anotações Internas</h2>
          </div>

          <div className="glass-card rounded-xl p-5">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Escreva suas anotações aqui..."
              rows={5}
              className="w-full bg-muted/50 border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all resize-none"
            />
            <div className="flex justify-end mt-3">
              <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                Salvar Anotações
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Configuracoes;
