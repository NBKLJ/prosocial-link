import { AppLayout } from "@/components/AppLayout";
import { Link2, Smartphone, QrCode, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const conexoes = [
  { id: "1", number: "(11) 99999-1234", name: "Comercial 1", status: "connected" as const },
  { id: "2", number: "(21) 98888-5678", name: "Suporte", status: "disconnected" as const },
];

const Conexoes = () => (
  <AppLayout>
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Conexões</h1>
        <p className="text-muted-foreground mt-1">Gerencie seus números WhatsApp (Limite: 2 no plano BASIC)</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {conexoes.map((c) => (
          <div key={c.id} className="glass-card rounded-xl p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center",
                  c.status === "connected" ? "bg-primary/10" : "bg-muted"
                )}>
                  <Smartphone className={cn("w-5 h-5", c.status === "connected" ? "text-primary" : "text-muted-foreground")} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{c.name}</h3>
                  <p className="text-xs text-muted-foreground">{c.number}</p>
                </div>
              </div>
              <span className={cn(
                "inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full",
                c.status === "connected" ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"
              )}>
                {c.status === "connected" ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
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
  </AppLayout>
);

export default Conexoes;
