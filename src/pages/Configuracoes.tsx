import { AppLayout } from "@/components/AppLayout";
import { useState } from "react";
import {
  Smartphone,
  QrCode,
  CheckCircle2,
  XCircle,
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

const tagColors = [
  { name: "Vermelho", value: "#ef4444" },
  { name: "Laranja", value: "#f97316" },
  { name: "Amarelo", value: "#eab308" },
  { name: "Verde", value: "#22c55e" },
  { name: "Azul", value: "#3b82f6" },
  { name: "Roxo", value: "#8b5cf6" },
  { name: "Rosa", value: "#ec4899" },
  { name: "Ciano", value: "#06b6d4" },
];

interface TagItem {
  name: string;
  color: string;
}

const defaultTags: TagItem[] = [
  { name: "Lead Quente", color: "#ef4444" },
  { name: "Cliente VIP", color: "#eab308" },
  { name: "Suporte", color: "#3b82f6" },
  { name: "Parceiro", color: "#22c55e" },
  { name: "Inativo", color: "#8b5cf6" },
];

const Configuracoes = () => {
  const [tags, setTags] = useState<TagItem[]>(defaultTags);
  const [newTag, setNewTag] = useState("");
  const [newColor, setNewColor] = useState(tagColors[0].value);

  const addTag = () => {
    if (newTag.trim() && !tags.some((t) => t.name === newTag.trim())) {
      setTags([...tags, { name: newTag.trim(), color: newColor }]);
      setNewTag("");
      setNewColor(tagColors[0].value);
    }
  };

  const removeTag = (name: string) => {
    setTags(tags.filter((t) => t.name !== name));
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
                  key={tag.name}
                  className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full text-white"
                  style={{ backgroundColor: tag.color }}
                >
                  {tag.name}
                  <button
                    onClick={() => removeTag(tag.name)}
                    className="hover:opacity-70 rounded-full p-0.5 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Nome da etiqueta..."
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

              {/* Color picker */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Cor:</span>
                <div className="flex gap-1.5">
                  {tagColors.map((c) => (
                    <button
                      key={c.value}
                      onClick={() => setNewColor(c.value)}
                      className={cn(
                        "w-7 h-7 rounded-full transition-all flex items-center justify-center",
                        newColor === c.value ? "ring-2 ring-offset-2 ring-offset-card scale-110" : "hover:scale-110"
                      )}
                      style={{ backgroundColor: c.value }}
                      title={c.name}
                    >
                      {newColor === c.value && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                      )}
                    </button>
                  ))}
                </div>
                {/* Preview */}
                {newTag.trim() && (
                  <span
                    className="inline-flex items-center text-xs font-medium px-3 py-1 rounded-full text-white ml-2"
                    style={{ backgroundColor: newColor }}
                  >
                    {newTag.trim()}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </AppLayout>
  );
};

export default Configuracoes;
