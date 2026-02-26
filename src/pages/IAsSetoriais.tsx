import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Brain, Save, Sparkles, MessageSquare, Headphones, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ProGate } from "@/components/ui/ProGate";
import { ProBadge } from "@/components/ui/ProBadge";

interface SectorIA {
  id: string;
  name: string;
  icon: typeof DollarSign;
  description: string;
  prompt: string;
  tone: "formal" | "amigavel" | "tecnico";
  active: boolean;
}

const toneLabels = { formal: "Formal", amigavel: "Amigável", tecnico: "Técnico" };

const IAsSetoriais = () => {
  const [sectors, setSectors] = useState<SectorIA[]>([
    {
      id: "comercial", name: "Comercial", icon: DollarSign,
      description: "IA focada em vendas, qualificação de leads e apresentação de produtos/serviços.",
      prompt: "Você é um assistente comercial. Qualifique o interesse do cliente, entenda a necessidade e apresente as soluções mais adequadas. Seja proativo em agendar reuniões.",
      tone: "amigavel", active: true,
    },
    {
      id: "financeiro", name: "Financeiro", icon: DollarSign,
      description: "IA para questões financeiras, cobranças e negociações de pagamento.",
      prompt: "Você é um assistente financeiro. Ajude com informações sobre faturas, prazos de pagamento, segunda via de boletos e negociação de débitos. Seja claro e objetivo.",
      tone: "formal", active: false,
    },
    {
      id: "suporte", name: "Suporte", icon: Headphones,
      description: "IA para atendimento ao cliente, resolução de problemas e dúvidas técnicas.",
      prompt: "Você é um assistente de suporte técnico. Ajude a resolver problemas, responda dúvidas sobre o produto e encaminhe para atendimento humano quando necessário.",
      tone: "tecnico", active: true,
    },
  ]);

  const updateSector = (id: string, updates: Partial<SectorIA>) => {
    setSectors(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  return (
    <AppLayout>
      <ProGate title="IAs Setoriais" description="Configure IAs personalizadas por setor com o Plano Pro.">
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-foreground">IAs Setoriais</h1>
                <ProBadge size="md" />
              </div>
              <p className="text-muted-foreground mt-1">Configure IAs personalizadas por setor</p>
            </div>
          </div>

          <div className="grid gap-5">
            {sectors.map((sector) => (
              <div key={sector.id} className="glass-card rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", sector.active ? "bg-primary/10" : "bg-muted")}>
                      <Brain className={cn("w-5 h-5", sector.active ? "text-primary" : "text-muted-foreground")} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-foreground">{sector.name}</h3>
                      <p className="text-xs text-muted-foreground">{sector.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => updateSector(sector.id, { active: !sector.active })}
                    className={cn(
                      "px-4 py-2 rounded-full text-xs font-medium transition-colors",
                      sector.active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                    )}
                  >
                    {sector.active ? "Ativo" : "Inativo"}
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-foreground">Prompt da IA</label>
                  <textarea
                    value={sector.prompt}
                    onChange={(e) => updateSector(sector.id, { prompt: e.target.value })}
                    rows={3}
                    className="w-full bg-muted/50 border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-foreground">Tom de voz</label>
                  <div className="flex gap-2">
                    {(Object.keys(toneLabels) as Array<keyof typeof toneLabels>).map((tone) => (
                      <button
                        key={tone}
                        onClick={() => updateSector(sector.id, { tone })}
                        className={cn(
                          "px-3 py-1.5 rounded-lg border text-xs font-medium transition-all",
                          sector.tone === tone
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border text-muted-foreground hover:bg-muted"
                        )}
                      >
                        {toneLabels[tone]}
                      </button>
                    ))}
                  </div>
                </div>

                {sector.active && (
                  <div className="bg-muted/30 rounded-lg p-4 border border-border/50">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-3.5 h-3.5 text-primary" />
                      <span className="text-xs font-medium text-foreground">Preview da resposta</span>
                    </div>
                    <div className="bg-card rounded-lg p-3 border border-border/40">
                      <div className="flex items-start gap-2">
                        <MessageSquare className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {sector.id === "comercial" && "Olá! 👋 Vi que você demonstrou interesse em nossos serviços. Posso te ajudar a encontrar a solução ideal? Me conta um pouco sobre sua necessidade."}
                          {sector.id === "financeiro" && "Boa tarde. Identificamos uma pendência em sua conta. Posso enviar a segunda via do boleto ou negociar condições de pagamento. Como prefere prosseguir?"}
                          {sector.id === "suporte" && "Olá! Sou o assistente técnico. Para ajudá-lo da melhor forma, por favor descreva o problema que está enfrentando. Vou analisar e buscar a solução mais rápida."}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => toast.success("Configurações das IAs salvas")}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors"
            >
              <Save className="w-4 h-4" />
              Salvar Configurações
            </button>
          </div>
        </div>
      </ProGate>
    </AppLayout>
  );
};

export default IAsSetoriais;
