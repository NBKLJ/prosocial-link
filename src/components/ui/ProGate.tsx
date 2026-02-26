import { isPro } from "@/lib/planAccess";
import { Lock, Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ProGateProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export function ProGate({ children, title = "Funcionalidade do Plano Pro", description = "Faça upgrade para acessar recursos avançados de IA, CRM e automações." }: ProGateProps) {
  const navigate = useNavigate();

  if (isPro()) {
    return <>{children}</>;
  }

  return (
    <div className="relative rounded-xl border border-border/50 bg-muted/30 p-8 flex flex-col items-center justify-center text-center space-y-4">
      <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center">
        <Lock className="w-7 h-7 text-amber-500" />
      </div>
      <div>
        <div className="flex items-center justify-center gap-2 mb-1">
          <h3 className="text-base font-bold text-foreground">{title}</h3>
          <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-gradient-to-r from-amber-500/15 to-orange-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <Crown className="w-2.5 h-2.5" />PRO
          </span>
        </div>
        <p className="text-sm text-muted-foreground max-w-sm">{description}</p>
      </div>
      <button
        onClick={() => navigate("/configuracoes")}
        className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-semibold hover:from-amber-600 hover:to-orange-600 transition-all shadow-md"
      >
        Fazer Upgrade
      </button>
    </div>
  );
}
