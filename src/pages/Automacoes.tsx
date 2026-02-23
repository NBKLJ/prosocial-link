import { AppLayout } from "@/components/AppLayout";
import { Bot, Plus, ToggleRight, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const automacoes = [
  { id: "1", name: "Boas-vindas automática", trigger: "Nova mensagem recebida", action: "Enviar mensagem de texto", active: true },
  { id: "2", name: "Follow-up 24h", trigger: "Sem resposta em 24h", action: "Enviar lembrete", active: true },
  { id: "3", name: "Classificar lead", trigger: "Palavra-chave detectada", action: "Adicionar tag + mover CRM", active: false },
];

const Automacoes = () => (
  <AppLayout>
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Automações</h1>
          <p className="text-muted-foreground mt-1">Configure fluxos automáticos</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" />
          Nova Automação
        </button>
      </div>

      <div className="grid gap-4">
        {automacoes.map((a) => (
          <div key={a.id} className="glass-card rounded-xl p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", a.active ? "bg-primary/10" : "bg-muted")}>
              <Bot className={cn("w-5 h-5", a.active ? "text-primary" : "text-muted-foreground")} />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-foreground">{a.name}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                <Zap className="w-3 h-3 inline mr-1" />
                {a.trigger} → {a.action}
              </p>
            </div>
            <div className={cn(
              "flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full",
              a.active ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
            )}>
              <ToggleRight className="w-4 h-4" />
              {a.active ? "Ativo" : "Inativo"}
            </div>
          </div>
        ))}
      </div>
    </div>
  </AppLayout>
);

export default Automacoes;
