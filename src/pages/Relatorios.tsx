import { AppLayout } from "@/components/AppLayout";
import { TrendingUp, Download } from "lucide-react";

const Relatorios = () => (
  <AppLayout>
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Relatórios</h1>
          <p className="text-muted-foreground mt-1">Análise detalhada de desempenho</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-secondary text-secondary-foreground font-medium text-sm hover:bg-secondary/80 transition-colors">
          <Download className="w-4 h-4" />
          Exportar
        </button>
      </div>

      <div className="glass-card rounded-xl p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
          <TrendingUp className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Relatórios detalhados</h3>
        <p className="text-sm text-muted-foreground max-w-md">
          Acompanhe métricas de mensagens, leads, conversões e desempenho da equipe com relatórios visuais completos.
        </p>
      </div>
    </div>
  </AppLayout>
);

export default Relatorios;
