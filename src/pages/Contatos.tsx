import { AppLayout } from "@/components/AppLayout";
import { Users, Search, Plus, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

const contatos = [
  { id: "1", name: "João Silva", phone: "(11) 99999-1234", email: "joao@email.com", tags: ["Quente", "VIP"] },
  { id: "2", name: "Maria Souza", phone: "(21) 98888-5678", email: "maria@email.com", tags: ["Novo"] },
  { id: "3", name: "Carlos Lima", phone: "(31) 97777-9012", email: "carlos@email.com", tags: ["Indicação"] },
  { id: "4", name: "Ana Costa", phone: "(41) 96666-3456", email: "ana@email.com", tags: ["VIP", "Recorrente"] },
  { id: "5", name: "Pedro Rocha", phone: "(51) 95555-7890", email: "pedro@email.com", tags: ["Quente"] },
];

const tagColors: Record<string, string> = {
  Quente: "bg-destructive/15 text-destructive",
  VIP: "bg-chart-4/15 text-chart-4",
  Novo: "bg-primary/15 text-primary",
  Indicação: "bg-chart-2/15 text-chart-2",
  Recorrente: "bg-chart-3/15 text-chart-3",
};

const Contatos = () => (
  <AppLayout>
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Contatos</h1>
          <p className="text-muted-foreground mt-1">{contatos.length} contatos cadastrados</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" />
          Novo Contato
        </button>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Nome</th>
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Telefone</th>
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Email</th>
              <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Tags</th>
            </tr>
          </thead>
          <tbody>
            {contatos.map((c) => (
              <tr key={c.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors cursor-pointer">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full gradient-green flex items-center justify-center text-[10px] font-bold text-primary-foreground">
                      {c.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <span className="text-sm font-medium text-foreground">{c.name}</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-sm text-muted-foreground">{c.phone}</td>
                <td className="px-5 py-4 text-sm text-muted-foreground">{c.email}</td>
                <td className="px-5 py-4">
                  <div className="flex gap-1.5 flex-wrap">
                    {c.tags.map((tag) => (
                      <span key={tag} className={cn("text-xs px-2 py-0.5 rounded-full font-medium", tagColors[tag] || "bg-muted text-muted-foreground")}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </AppLayout>
);

export default Contatos;
