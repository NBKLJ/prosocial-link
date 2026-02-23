import { AppLayout } from "@/components/AppLayout";
import { Megaphone, Plus, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const disparos = [
  { id: "1", title: "Promoção Black Friday", type: "Texto + Imagem", contacts: 450, status: "enviado", date: "22/02/2026" },
  { id: "2", title: "Boas-vindas novos leads", type: "Texto", contacts: 120, status: "agendado", date: "24/02/2026" },
  { id: "3", title: "Reativação de clientes", type: "Áudio", contacts: 85, status: "rascunho", date: "-" },
];

const statusConfig: Record<string, { icon: typeof CheckCircle2; label: string; class: string }> = {
  enviado: { icon: CheckCircle2, label: "Enviado", class: "text-primary bg-primary/10" },
  agendado: { icon: Clock, label: "Agendado", class: "text-chart-4 bg-chart-4/10" },
  rascunho: { icon: AlertCircle, label: "Rascunho", class: "text-muted-foreground bg-muted" },
};

const Disparos = () => {
  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Disparos</h1>
            <p className="text-muted-foreground mt-1">Gerencie suas campanhas de disparo</p>
          </div>
          <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors">
            <Plus className="w-4 h-4" />
            Novo Disparo
          </button>
        </div>

        <div className="glass-card rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Campanha</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Tipo</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Contatos</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Status</th>
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Data</th>
              </tr>
            </thead>
            <tbody>
              {disparos.map((d) => {
                const st = statusConfig[d.status];
                const StIcon = st.icon;
                return (
                  <tr key={d.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors cursor-pointer">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Megaphone className="w-4 h-4 text-primary" />
                        </div>
                        <span className="text-sm font-medium text-foreground">{d.title}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-muted-foreground">{d.type}</td>
                    <td className="px-5 py-4 text-sm text-foreground font-medium">{d.contacts}</td>
                    <td className="px-5 py-4">
                      <span className={cn("inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full", st.class)}>
                        <StIcon className="w-3.5 h-3.5" />
                        {st.label}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-muted-foreground">{d.date}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
};

export default Disparos;
