import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { MessageSquarePlus, Save, ToggleRight, Mic, Type, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

type ResponseType = "text" | "audio" | "both";

const DisparoRecepcao = () => {
  const [active, setActive] = useState(true);
  const [responseType, setResponseType] = useState<ResponseType>("text");
  const [message, setMessage] = useState(
    "Olá! Obrigado por entrar em contato. Em breve um de nossos atendentes irá te responder. 😊"
  );
  const [audioFile, setAudioFile] = useState<string | null>(null);

  const responseOptions: { value: ResponseType; label: string; icon: typeof Type }[] = [
    { value: "text", label: "Mensagem de Texto", icon: Type },
    { value: "audio", label: "Áudio", icon: Mic },
    { value: "both", label: "Texto + Áudio", icon: MessageSquarePlus },
  ];

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Recepção Automática</h1>
            <p className="text-muted-foreground mt-1">
              Configure a resposta automática para novos atendimentos
            </p>
          </div>
        </div>

        {/* Ativar / Desativar */}
        <div className="glass-card rounded-xl p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", active ? "bg-primary/10" : "bg-muted")}>
              <MessageSquarePlus className={cn("w-5 h-5", active ? "text-primary" : "text-muted-foreground")} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Resposta automática</h3>
              <p className="text-xs text-muted-foreground">
                Enviar automaticamente ao receber um novo contato
              </p>
            </div>
          </div>
          <button
            onClick={() => setActive(!active)}
            className={cn(
              "flex items-center gap-2 text-xs font-medium px-4 py-2 rounded-full transition-colors",
              active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
            )}
          >
            <ToggleRight className="w-4 h-4" />
            {active ? "Ativo" : "Inativo"}
          </button>
        </div>

        {active && (
          <>
            {/* Tipo de resposta */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-foreground">Tipo de resposta</h3>
              <div className="grid grid-cols-3 gap-3">
                {responseOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setResponseType(opt.value)}
                    className={cn(
                      "glass-card rounded-xl p-4 flex flex-col items-center gap-2 transition-all text-center",
                      responseType === opt.value
                        ? "ring-2 ring-primary bg-primary/5"
                        : "hover:bg-muted/60"
                    )}
                  >
                    <opt.icon
                      className={cn(
                        "w-5 h-5",
                        responseType === opt.value ? "text-primary" : "text-muted-foreground"
                      )}
                    />
                    <span
                      className={cn(
                        "text-xs font-medium",
                        responseType === opt.value ? "text-primary" : "text-muted-foreground"
                      )}
                    >
                      {opt.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Mensagem de texto */}
            {(responseType === "text" || responseType === "both") && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground">Mensagem de boas-vindas</h3>
                <div className="glass-card rounded-xl p-5">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Digite a mensagem automática..."
                    rows={4}
                    className="w-full bg-muted/50 border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all resize-none"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Variáveis disponíveis: <code className="bg-muted px-1.5 py-0.5 rounded text-primary text-[11px]">{"{{nome}}"}</code>{" "}
                    <code className="bg-muted px-1.5 py-0.5 rounded text-primary text-[11px]">{"{{numero}}"}</code>
                  </p>
                </div>
              </div>
            )}

            {/* Upload de áudio */}
            {(responseType === "audio" || responseType === "both") && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-foreground">Áudio de boas-vindas</h3>
                <div className="glass-card rounded-xl p-5">
                  {audioFile ? (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Mic className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{audioFile}</p>
                        <p className="text-xs text-muted-foreground">Áudio carregado</p>
                      </div>
                      <button
                        onClick={() => setAudioFile(null)}
                        className="text-xs text-destructive hover:underline"
                      >
                        Remover
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setAudioFile("audio-recepcao.mp3")}
                      className="w-full flex flex-col items-center gap-3 py-8 border-2 border-dashed border-border rounded-lg hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer"
                    >
                      <Upload className="w-8 h-8 text-muted-foreground" />
                      <div className="text-center">
                        <p className="text-sm font-medium text-foreground">
                          Clique para enviar um áudio
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          MP3, OGG ou WAV • Máx. 5MB
                        </p>
                      </div>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Salvar */}
            <div className="flex justify-end">
              <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors">
                <Save className="w-4 h-4" />
                Salvar Configuração
              </button>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
};

export default DisparoRecepcao;
