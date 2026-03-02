import {
  Clock, AlertTriangle, ArrowRightLeft, EyeOff, Star,
  Users, Shield, TrendingUp, SmilePlus, Frown, Meh,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const initialSlaRules = [
  { id: "1", name: "Primeira Resposta", target: "3", unit: "min", current: "2m 15s", status: "ok" as const },
  { id: "2", name: "Resposta Média", target: "5", unit: "min", current: "4m 32s", status: "ok" as const },
  { id: "3", name: "Máx. Sem Resposta", target: "15", unit: "min", current: "12m", status: "warning" as const },
  { id: "4", name: "Resolução", target: "24", unit: "h", current: "18h", status: "ok" as const },
];

const initialEscalationRules = [
  { id: "1", trigger: "Sem resposta em 5 min", action: "Alerta interno ao atendente", active: true },
  { id: "2", trigger: "Sem resposta em 10 min", action: "Alerta ao supervisor", active: true },
  { id: "3", trigger: "Sem resposta em 15 min", action: "Redistribuir conversa", active: true },
  { id: "4", trigger: "Cliente insatisfeito detectado", action: "Escalar para gerente", active: false },
];

const distributionMethods = [
  { id: "roundrobin", name: "Round-Robin", desc: "Distribui igualmente entre atendentes" },
  { id: "workload", name: "Por Carga", desc: "Prioriza quem tem menos conversas ativas" },
  { id: "performance", name: "Por Performance", desc: "Prioriza atendentes com melhor taxa de conversão" },
  { id: "specialty", name: "Por Especialidade", desc: "Direciona por tipo de produto/serviço" },
];

const attendantQueue = [
  { name: "Ana Silva", active: 5, waiting: 2, avgTime: "2m", sla: 98, status: "online" as const, resolved: 42, conversations: 58, nps: 92 },
  { name: "Carlos Mendes", active: 8, waiting: 4, avgTime: "5m", sla: 85, status: "online" as const, resolved: 35, conversations: 48, nps: 74 },
  { name: "Julia Costa", active: 3, waiting: 0, avgTime: "1m", sla: 100, status: "online" as const, resolved: 38, conversations: 40, nps: 96 },
  { name: "Pedro Rocha", active: 6, waiting: 3, avgTime: "7m", sla: 72, status: "away" as const, resolved: 28, conversations: 44, nps: 68 },
];

const npsData = [
  { score: "0-6", count: 4, color: "hsl(0, 72%, 51%)" },
  { score: "7-8", count: 12, color: "hsl(38, 92%, 50%)" },
  { score: "9-10", count: 34, color: "hsl(152, 69%, 40%)" },
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
  const [slaRules, setSlaRules] = useState(initialSlaRules);
  const [escalationRules, setEscalationRules] = useState(initialEscalationRules);
  const [ratingModal, setRatingModal] = useState<string | null>(null);
  const [ratingValue, setRatingValue] = useState(5);

  const toggleEscalation = (id: string) => {
    setEscalationRules(prev => prev.map(r => r.id === id ? { ...r, active: !r.active } : r));
    toast.success("Regra atualizada");
  };

  const updateSlaTarget = (id: string, value: string) => {
    setSlaRules(prev => prev.map(r => r.id === id ? { ...r, target: value } : r));
  };

  const totalResolved = attendantQueue.reduce((s, a) => s + a.resolved, 0);
  const totalConversations = attendantQueue.reduce((s, a) => s + a.conversations, 0);
  const resolutionRate = totalConversations > 0 ? ((totalResolved / totalConversations) * 100).toFixed(1) : "0";
  const avgNps = Math.round(attendantQueue.reduce((s, a) => s + a.nps, 0) / attendantQueue.length);

  return (
    <div className="space-y-6 overflow-y-auto pb-6">
      {/* Top Metrics */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Taxa de Resolução", value: `${resolutionRate}%`, icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "NPS Médio", value: avgNps.toString(), icon: SmilePlus, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Conversas Ativas", value: attendantQueue.reduce((s, a) => s + a.active, 0).toString(), icon: Users, color: "text-purple-500", bg: "bg-purple-500/10" },
          { label: "Aguardando", value: attendantQueue.reduce((s, a) => s + a.waiting, 0).toString(), icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
        ].map(m => (
          <div key={m.label} className="bg-card border border-border/50 rounded-xl p-4 flex items-center gap-3">
            <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", m.bg)}>
              <m.icon className={cn("w-5 h-5", m.color)} />
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">{m.value}</p>
              <p className="text-[11px] text-muted-foreground">{m.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* SLA - Editable */}
        <div className="bg-card border border-border/50 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground">Regras de SLA</h3>
            <Clock className="w-4 h-4 text-primary" />
          </div>
          <div className="space-y-3">
            {slaRules.map((rule) => (
              <div key={rule.id} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                <div className="flex-1">
                  <span className="text-sm font-medium text-foreground">{rule.name}</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] text-muted-foreground">Meta:</span>
                    <Input
                      value={rule.target}
                      onChange={(e) => updateSlaTarget(rule.id, e.target.value)}
                      className="w-16 h-7 text-xs px-2"
                    />
                    <span className="text-[11px] text-muted-foreground">{rule.unit}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-foreground">{rule.current}</span>
                  <div className={cn("w-2.5 h-2.5 rounded-full", rule.status === "ok" ? "bg-emerald-500" : "bg-amber-500")} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Escalation - Toggles */}
        <div className="bg-card border border-border/50 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground">Regras de Escalação</h3>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="space-y-3">
            {escalationRules.map((rule) => (
              <div key={rule.id} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                <div className="flex-1">
                  <span className="text-sm font-medium text-foreground">{rule.trigger}</span>
                  <p className="text-[11px] text-muted-foreground">{rule.action}</p>
                </div>
                <button
                  onClick={() => toggleEscalation(rule.id)}
                  className={cn(
                    "relative w-10 h-5 rounded-full transition-colors",
                    rule.active ? "bg-emerald-500" : "bg-muted"
                  )}
                >
                  <div className={cn(
                    "absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform",
                    rule.active ? "translate-x-5" : "translate-x-0.5"
                  )} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* NPS Distribution */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card border border-border/50 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground">Distribuição NPS</h3>
            <SmilePlus className="w-4 h-4 text-primary" />
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={npsData}>
              <XAxis dataKey="score" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip />
              <Bar dataKey="count" name="Respostas" radius={[4, 4, 0, 0]}>
                {npsData.map((entry, i) => (
                  <Bar key={i} dataKey="count" fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 text-[10px]">
            <span className="flex items-center gap-1"><Frown className="w-3 h-3 text-red-500" /> Detratores: 4</span>
            <span className="flex items-center gap-1"><Meh className="w-3 h-3 text-amber-500" /> Neutros: 12</span>
            <span className="flex items-center gap-1"><SmilePlus className="w-3 h-3 text-emerald-500" /> Promotores: 34</span>
          </div>
        </div>

        {/* Distribution Methods */}
        <div className="col-span-2 bg-card border border-border/50 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground">Distribuição Inteligente</h3>
            <ArrowRightLeft className="w-4 h-4 text-primary" />
          </div>
          <div className="grid grid-cols-4 gap-3">
            {distributionMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => { setActiveDistribution(method.id); toast.success(`Distribuição: ${method.name}`); }}
                className={cn(
                  "border rounded-xl p-3 text-left transition-all",
                  activeDistribution === method.id
                    ? "border-primary/30 bg-primary/5"
                    : "border-border/50 hover:border-primary/20 hover:bg-muted/30"
                )}
              >
                <span className="text-xs font-bold text-foreground">{method.name}</span>
                <p className="text-[10px] text-muted-foreground mt-1">{method.desc}</p>
                {activeDistribution === method.id && (
                  <span className="text-[10px] font-semibold text-primary mt-2 block">✓ Ativo</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Attendant Queue */}
      <div className="bg-card border border-border/50 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-foreground">Supervisão de Atendimento</h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-semibold animate-pulse">● Tempo real</span>
          </div>
          <Users className="w-4 h-4 text-primary" />
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left text-[11px] font-semibold text-muted-foreground py-2">Atendente</th>
              <th className="text-center text-[11px] font-semibold text-muted-foreground py-2">Status</th>
              <th className="text-center text-[11px] font-semibold text-muted-foreground py-2">Ativas</th>
              <th className="text-center text-[11px] font-semibold text-muted-foreground py-2">Aguardando</th>
              <th className="text-center text-[11px] font-semibold text-muted-foreground py-2">Resolvidas</th>
              <th className="text-center text-[11px] font-semibold text-muted-foreground py-2">Tempo</th>
              <th className="text-center text-[11px] font-semibold text-muted-foreground py-2">SLA</th>
              <th className="text-center text-[11px] font-semibold text-muted-foreground py-2">NPS</th>
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
                <td className="text-center text-sm text-foreground py-3">{att.resolved}</td>
                <td className="text-center text-sm text-foreground py-3">{att.avgTime}</td>
                <td className="text-center py-3">
                  <span className={cn("text-sm font-bold", att.sla >= 90 ? "text-emerald-500" : att.sla >= 75 ? "text-amber-500" : "text-destructive")}>{att.sla}%</span>
                </td>
                <td className="text-center py-3">
                  <span className={cn("text-sm font-bold", att.nps >= 80 ? "text-emerald-500" : att.nps >= 60 ? "text-amber-500" : "text-destructive")}>{att.nps}</span>
                </td>
                <td className="text-center py-3">
                  <div className="flex items-center justify-center gap-1">
                    <button onClick={() => toast.info(`Monitorando ${att.name}`)} className="p-1.5 rounded-lg hover:bg-muted transition-colors" title="Monitorar">
                      <EyeOff className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                    <button onClick={() => toast.info(`Assumindo conversa de ${att.name}`)} className="p-1.5 rounded-lg hover:bg-muted transition-colors" title="Assumir">
                      <Shield className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                    <button onClick={() => { setRatingModal(att.name); setRatingValue(5); }} className="p-1.5 rounded-lg hover:bg-muted transition-colors" title="Avaliar">
                      <Star className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Quality Log */}
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

      {/* Rating Modal */}
      {ratingModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={() => setRatingModal(null)}>
          <div className="bg-card border border-border rounded-xl p-6 w-80 space-y-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-sm font-bold text-foreground">Avaliar {ratingModal}</h3>
            <div className="flex items-center justify-center gap-1">
              {[1, 2, 3, 4, 5].map(v => (
                <button key={v} onClick={() => setRatingValue(v)} className="p-1">
                  <Star className={cn("w-8 h-8 transition-colors", v <= ratingValue ? "text-amber-500 fill-amber-500" : "text-muted-foreground/30")} />
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={() => setRatingModal(null)} className="flex-1 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:bg-muted transition-colors">Cancelar</button>
              <button onClick={() => { toast.success(`Avaliação ${ratingValue}⭐ aplicada a ${ratingModal}`); setRatingModal(null); }} className="flex-1 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">Aplicar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
