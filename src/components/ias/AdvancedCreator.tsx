import { useState } from "react";
import {
  ArrowLeft, Sparkles, Wand2, Mic, MicOff
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface AdvancedCreatorProps {
  onClose: () => void;
  onFinish: (prompt: string) => void;
}

const AdvancedCreator = ({ onClose, onFinish }: AdvancedCreatorProps) => {
  const [prompt, setPrompt] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isImproving, setIsImproving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const mediaRecorderRef = useState<MediaRecorder | null>(null);

  const handleMic = async () => {
    if (isRecording) {
      setIsRecording(false);
      toast.info("Gravação finalizada");
      // In a real implementation, stop recording and transcribe
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsRecording(true);
      toast.info("Gravando... clique novamente para parar");

      // Auto-stop after 60s
      setTimeout(() => {
        setIsRecording(false);
        stream.getTracks().forEach(t => t.stop());
      }, 60000);
    } catch {
      toast.error("Não foi possível acessar o microfone");
    }
  };

  const handleImprove = async () => {
    if (!prompt.trim()) {
      toast.error("Escreva um prompt primeiro para melhorar com IA");
      return;
    }
    setIsImproving(true);
    // Simulate AI improvement
    await new Promise(r => setTimeout(r, 1500));
    const improved = `${prompt}\n\n---\n✨ Melhorias aplicadas pela IA:\n• Tom de voz ajustado para ser mais profissional e empático\n• Adicionadas instruções de qualificação de leads\n• Incluído fluxo de encerramento de conversa\n• Regras de compliance e LGPD adicionadas`;
    setPrompt(improved);
    setIsImproving(false);
    toast.success("Prompt melhorado com IA!");
  };

  const handleGenerate = () => {
    if (!prompt.trim()) {
      toast.error("Escreva um prompt para gerar o agente");
      return;
    }
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      onFinish(prompt);
      toast.success("Agente gerado com sucesso!");
    }, 1000);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-base font-bold text-foreground">Criador de Agentes</h2>
          <p className="text-xs text-muted-foreground">Crie seu agente de IA personalizado</p>
        </div>
      </div>

      {/* Back + Badge */}
      <div className="flex items-center justify-between">
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar
        </button>
        <Badge variant="outline" className="text-xs border-primary/30 text-primary cursor-pointer hover:bg-primary/5">
          Outras Áreas
        </Badge>
      </div>

      {/* Prompt area */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <Textarea
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder="Crie um agente de recepção..."
          className="border-0 shadow-none focus-visible:ring-0 min-h-[160px] text-sm resize-none px-5 pt-5 pb-2 bg-transparent"
        />
        <div className="flex items-center justify-between px-4 pb-4 pt-1">
          <div className="flex items-center gap-2">
            <button
              onClick={handleMic}
              className={cn(
                "w-9 h-9 rounded-full flex items-center justify-center border transition-all",
                isRecording
                  ? "border-destructive bg-destructive/10 text-destructive animate-pulse"
                  : "border-border bg-muted/30 text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
              title={isRecording ? "Parar gravação" : "Gravar áudio"}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <button
              onClick={handleImprove}
              disabled={isImproving || !prompt.trim()}
              className={cn(
                "flex items-center gap-1.5 px-3 h-9 rounded-full border text-xs font-semibold transition-all",
                isImproving
                  ? "border-primary/30 bg-primary/5 text-primary animate-pulse"
                  : "border-border text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-primary/5 disabled:opacity-40 disabled:cursor-not-allowed"
              )}
              title="Melhorar prompt com IA"
            >
              <Wand2 className="w-3.5 h-3.5" />
              {isImproving ? "Melhorando..." : "Melhorar com IA"}
            </button>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            className="gap-1.5 text-xs rounded-full px-5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {isGenerating ? "Gerando..." : "Gerar Agente"}
          </Button>
        </div>
      </div>

      {/* Tips */}
      <div className="rounded-xl border border-border bg-muted/20 p-4">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Dicas para um bom prompt</p>
        <ul className="space-y-1.5 text-xs text-muted-foreground">
          <li>• Descreva o objetivo principal do agente (vendas, suporte, agendamento)</li>
          <li>• Mencione o tom de voz desejado (formal, amigável, técnico)</li>
          <li>• Inclua regras específicas do seu negócio</li>
          <li>• Cite produtos ou serviços que o agente deve conhecer</li>
          <li>• Use o botão <span className="font-semibold text-primary">"Melhorar com IA"</span> para otimizar seu prompt automaticamente</li>
        </ul>
      </div>
    </div>
  );
};

export default AdvancedCreator;
