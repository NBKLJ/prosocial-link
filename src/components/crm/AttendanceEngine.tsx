import {
  Clock, AlertTriangle, ArrowRightLeft, Eye, EyeOff, Star,
  Users, Shield, Bell, TrendingUp, Zap, BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useState } from "react";

// Mock SLA data
const slaRules = [
  { id: "1", name: "Primeira Resposta", target: "3 min", current: "2m 15s", status: "ok" as const },
  { id: "2", name: "Resposta Média", target: "5 min", current: "4m 32s", status: "ok" as const },
  { id: "3", name: "Tempo Máximo Sem Resposta", target: "15 min", current: "12m", status: "warning" as const },
  { id: "4", name: "Resolução do Atendimento", target: "24h", current: "18h", status: "ok" as const },
];

const escalationRules = [
  { trigger: "Sem resposta em 5 min", action: "Alerta interno ao atendente", active: true },
  { trigger: "Sem resposta em 10 min", action: "Alerta ao supervisor", active: true },
  { trigger: "Sem resposta em 15 min", action: "Redistribuir conversa", active: true },
  { trigger: "Cliente insatisfeito detectado", action: "Escalar para gerente", active: false },
];

const distributionMethods = [
  { id: "roundrobin", name: "Round-Robin", desc: "Distribui igualmente entre atendentes", active: true },
  { id: "workload", name: "Por Carga", desc: "Prioriza quem tem menos conversas ativas", active: false },
  { id: "performance", name: "Por Performance", desc: "Prioriza atendentes com melhor taxa de conversão", active: false },
  { id: "specialty", name: "Por Especialidade", desc: "Direciona por tipo de produto/serviço", active: false },
];

const attendantQueue = [
  { name: "Ana Silva", active: 5, waiting: 2, avgTime: "2m", sla: 98, status: "online" as const },
  { name: "Carlos Mendes", active: 8, waiting: 4, avgTime: "5m", sla: 85, status: "online" as const },
  { name: "Julia Costa", active: 3, waiting: 0, avgTime: "1m", sla: 100, status: "online" as const },
  { name: "Pedro Rocha", active: 6, waiting: 3, avgTime: "7m", sla: 72, status: "away" as const },
];

const qualityLog = [
  { id: "1", attendant: "Carlos Mendes", action: "Supervisor entrou invisível", time: "10:32", type: "monitor" as const },
  { id: "2", attendant: "Pedro Rocha", action: "Conversa assumida pelo supervisor", time: "09:45", type: "takeover" as const },
  { id: "3", attendant: "Ana Silva", action: "Avaliação 5⭐ recebida", time: "09:12", type: "rating" as const },
  { id: "4", attendant: "Julia Costa", action: "SLA cumprido - 100%", time: "08:55", type: "sla" as const },
  { id: "5", attendant: "Carlos Mendes", action: "Alerta: tempo de resposta alto", time: "08:30", type: "alert" as const },
];

export function AttendanceEngine() {
  const [activeDistribution, setActiveDistribution] = useState("roundrobin");

  return (
    <div className="space-y-6 overflow-y-auto pb-6">
      {/* SLA Configuration */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card border border-border/50 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground">Regras de SLA</h3>
            <Clock className="w-4 h-4 text-primary" />
          </div>
          <div className="space-y-3">
            {slaRules.map((rule) => (
              <div key={rule.id} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                <div>
                  <span className="text-sm font-medium text-foreground">{rule.name}</span>
                  <p className="text-[11px] text-muted-foreground">Meta: {rule.target}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-foreground">{rule.current}</span>
                  <div className={cn("w-2.5 h-2.5 rounded-full", rule.status === "ok" ? "bg-emerald-500" : rule.status === "warning" ? "bg-amber-500" : "bg-destructive")} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Escalation Rules */}
        <div className="bg-card border border-border/50 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground">Regras de Escalação</h3>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="space-y-3">
            {escalationRules.map((rule, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                <div className="flex-1">
                  <span className="text-sm font-medium text-foreground">{rule.trigger}</span>
                  <p className="text-[11px] text-muted-foreground">{rule.action}</p>
                </div>
                <button
                  onClick={() => toast.info(`Regra ${rule.active ? "desativada" : "ativada"}`)}
                  className={cn("px-3 py-1 rounded-full text-[11px] font-semibold transition-colors", rule.active ? "bg-emerald-500/10 text-emerald-500" : "bg-muted text-muted-foreground")}
                >
                  {rule.active ? "Ativa" : "Inativa"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Distribution Methods */}
      <div className="bg-card border border-border/50 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-foreground">Distribuição Inteligente</h3>
          <ArrowRightLeft className="w-4 h-4 text-primary" />
        </div>
        <div className="grid grid-cols-4 gap-3">
          {distributionMethods.map((method) => (
            <button
              key={method.id}
              onClick={() => { setActiveDistribution(method.id); toast.success(`Distribuição alterada para: ${method.name}`); }}
              className={cn(
                "border rounded-xl p-4 text-left transition-all",
                activeDistribution === method.id
                  ? "border-primary/30 bg-primary/5"
                  : "border-border/50 hover:border-primary/20 hover:bg-muted/30"
              )}
            >
              <span className="text-sm font-bold text-foreground">{method.name}</span>
              <p className="text-[11px] text-muted-foreground mt-1">{method.desc}</p>
              {activeDistribution === method.id && (
                <span className="text-[10px] font-semibold text-primary mt-2 block">✓ Ativo</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Attendant Queue - Real-time */}
      <div className="bg-card border border-border/50 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-foreground">Fila de Atendimento</h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-semibold animate-pulse">● Tempo real</span>
          </div>
          <Users className="w-4 h-4 text-primary" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-[11px] font-semibold text-muted-foreground py-2">Atendente</th>
                <th className="text-center text-[11px] font-semibold text-muted-foreground py-2">Status</th>
                <th className="text-center text-[11px] font-semibold text-muted-foreground py-2">Ativas</th>
                <th className="text-center text-[11px] font-semibold text-muted-foreground py-2">Aguardando</th>
                <th className="text-center text-[11px] font-semibold text-muted-foreground py-2">Tempo Resp.</th>
                <th className="text-center text-[11px] font-semibold text-muted-foreground py-2">SLA</th>
                <th className="text-center text-[11px] font-semibold text-muted-foreground py-2">Ações</th>
              </tr>
            </thead>
            <tbody>
              {attendantQueue.map((att) => (
                <tr key={att.name} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-[10px] font-bold text-primary">{att.name.split(" ").map(n => n[0]).join("")}</span>
                        </div>
                        <div className={cn("absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-card", att.status === "online" ? "bg-emerald-500" : "bg-amber-500")} />
                      </div>
                      <span className="text-sm font-medium text-foreground">{att.name}</span>
                    </div>
                  </td>
                  <td className="text-center py-3">
                    <span className={cn("text-[11px] px-2 py-0.5 rounded-full font-medium", att.status === "online" ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500")}>
                      {att.status === "online" ? "Online" : "Ausente"}
                    </span>
                  </td>
                  <td className="text-center text-sm font-semibold text-foreground py-3">{att.active}</td>
                  <td className="text-center py-3">
                    <span className={cn("text-sm font-semibold", att.waiting > 2 ? "text-destructive" : "text-foreground")}>{att.waiting}</span>
                  </td>
                  <td className="text-center text-sm text-foreground py-3">{att.avgTime}</td>
                  <td className="text-center py-3">
                    <span className={cn("text-sm font-bold", att.sla >= 90 ? "text-emerald-500" : att.sla >= 75 ? "text-amber-500" : "text-destructive")}>{att.sla}%</span>
                  </td>
                  <td className="text-center py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => toast.info(`Monitorando ${att.name}`)} className="p-1.5 rounded-lg hover:bg-muted transition-colors" title="Monitorar invisível">
                        <EyeOff className="w-3.5 h-3.5 text-muted-foreground" />
                      </button>
                      <button onClick={() => toast.info(`Assumindo conversa de ${att.name}`)} className="p-1.5 rounded-lg hover:bg-muted transition-colors" title="Assumir conversa">
                        <Shield className="w-3.5 h-3.5 text-muted-foreground" />
                      </button>
                      <button onClick={() => toast.info(`Avaliando ${att.name}`)} className="p-1.5 rounded-lg hover:bg-muted transition-colors" title="Avaliar">
                        <Star className="w-3.5 h-3.5 text-muted-foreground" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quality Control Log */}
      <div className="bg-card border border-border/50 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-foreground">Log de Qualidade</h3>
          <Shield className="w-4 h-4 text-primary" />
        </div>
        <div className="space-y-2">
          {qualityLog.map((log) => (
            <div key={log.id} className="flex items-center gap-3 py-2 border-b border-border/20 last:border-0">
              <div className={cn("w-2 h-2 rounded-full flex-shrink-0", {
                "bg-blue-500": log.type === "monitor",
                "bg-amber-500": log.type === "takeover",
                "bg-emerald-500": log.type === "rating",
                "bg-primary": log.type === "sla",
                "bg-destructive": log.type === "alert",
              })} />
              <span className="text-xs font-medium text-foreground">{log.attendant}</span>
              <span className="text-xs text-muted-foreground flex-1">{log.action}</span>
              <span className="text-[11px] text-muted-foreground">{log.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
