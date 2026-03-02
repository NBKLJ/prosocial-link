import {
  Shield, FileText, Lock, Eye, Clock, CheckCircle2,
  Users, Key, Database, Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";

const retentionPolicies = [
  { id: "1", name: "Dados de Conversas", period: "12 meses", action: "Anonimizar", status: "active" as const },
  { id: "2", name: "Leads Perdidos", period: "6 meses", action: "Excluir", status: "active" as const },
  { id: "3", name: "Logs de Auditoria", period: "24 meses", action: "Arquivar", status: "active" as const },
  { id: "4", name: "Dados Financeiros", period: "60 meses", action: "Manter (legal)", status: "active" as const },
];

const auditLog = [
  { id: "1", user: "Admin", action: "Exportou lista de contatos", ip: "192.168.1.100", time: "Hoje, 14:32", risk: "medium" as const },
  { id: "2", user: "VS", action: "Alterou estágio do lead Carlos Lima", ip: "192.168.1.45", time: "Hoje, 12:15", risk: "low" as const },
  { id: "3", user: "Admin", action: "Alterou permissões do usuário MR", ip: "192.168.1.100", time: "Hoje, 10:08", risk: "high" as const },
  { id: "4", user: "AL", action: "Acessou dados sensíveis do lead", ip: "192.168.1.67", time: "Ontem, 18:45", risk: "medium" as const },
  { id: "5", user: "MR", action: "Deletou notas internas", ip: "192.168.1.89", time: "Ontem, 16:20", risk: "low" as const },
  { id: "6", user: "Admin", action: "Backup manual executado", ip: "192.168.1.100", time: "Ontem, 09:00", risk: "low" as const },
];

const roles = [
  { role: "Admin", users: 1, permissions: ["Tudo"], color: "text-red-500" },
  { role: "Gerente", users: 2, permissions: ["Leads", "Relatórios", "Atendentes", "Exportar"], color: "text-purple-500" },
  { role: "Vendedor", users: 4, permissions: ["Leads próprios", "Conversas", "Propostas"], color: "text-blue-500" },
  { role: "Atendente", users: 3, permissions: ["Conversas atribuídas", "Notas"], color: "text-emerald-500" },
  { role: "Visualizador", users: 1, permissions: ["Apenas leitura"], color: "text-muted-foreground" },
];

const complianceIndicators = [
  { label: "LGPD Compliance", value: 94, status: "ok" as const, icon: Shield },
  { label: "Consentimento Ativo", value: 88, status: "warning" as const, icon: CheckCircle2 },
  { label: "Dados Anonimizados", value: 100, status: "ok" as const, icon: Lock },
  { label: "Backup Atualizado", value: 100, status: "ok" as const, icon: Database },
];

export function CompliancePanel() {
  const [activeTab, setActiveTab] = useState<"lgpd" | "audit" | "permissions">("lgpd");

  return (
    <div className="space-y-6 overflow-y-auto pb-6">
      {/* Compliance KPIs */}
      <div className="grid grid-cols-4 gap-3">
        {complianceIndicators.map((ind) => (
          <div key={ind.label} className="bg-card border border-border/50 rounded-xl p-4 flex items-center gap-3">
            <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", ind.status === "ok" ? "bg-emerald-500/10" : "bg-amber-500/10")}>
              <ind.icon className={cn("w-5 h-5", ind.status === "ok" ? "text-emerald-500" : "text-amber-500")} />
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">{ind.value}%</p>
              <p className="text-[11px] text-muted-foreground">{ind.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Sub-tabs */}
      <div className="flex items-center gap-1 bg-muted/30 rounded-xl p-1 w-fit">
        {([
          { id: "lgpd" as const, label: "LGPD & Retenção", icon: Shield },
          { id: "audit" as const, label: "Log de Auditoria", icon: Eye },
          { id: "permissions" as const, label: "Permissões", icon: Key },
        ]).map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
              activeTab === tab.id
                ? "bg-card text-foreground shadow-sm border border-border/50"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* LGPD Tab */}
      {activeTab === "lgpd" && (
        <div className="grid grid-cols-2 gap-4">
          {/* Retention policies */}
          <div className="bg-card border border-border/50 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground">Política de Retenção de Dados</h3>
              <Clock className="w-4 h-4 text-primary" />
            </div>
            <div className="space-y-3">
              {retentionPolicies.map(policy => (
                <div key={policy.id} className="flex items-center justify-between py-2.5 border-b border-border/30 last:border-0">
                  <div>
                    <span className="text-sm font-medium text-foreground">{policy.name}</span>
                    <p className="text-[11px] text-muted-foreground">Retenção: {policy.period} → {policy.action}</p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-semibold">Ativa</span>
                </div>
              ))}
            </div>
          </div>

          {/* LGPD Actions */}
          <div className="bg-card border border-border/50 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground">Ações LGPD</h3>
              <FileText className="w-4 h-4 text-primary" />
            </div>
            <div className="space-y-3">
              {[
                { label: "Solicitar Consentimento em Massa", desc: "Enviar solicitação de consentimento para todos os leads ativos", icon: CheckCircle2 },
                { label: "Anonimizar Dados Expirados", desc: "Executar anonimização conforme política de retenção", icon: Lock },
                { label: "Exportar Dados do Titular", desc: "Gerar relatório completo de dados de um lead específico", icon: FileText },
                { label: "Excluir Dados do Titular", desc: "Remover completamente os dados de um lead (direito ao esquecimento)", icon: Trash2 },
              ].map((action, i) => (
                <button
                  key={i}
                  onClick={() => toast.success(`${action.label} - executado com sucesso`)}
                  className="w-full flex items-start gap-3 p-3 rounded-lg border border-border/30 hover:border-primary/30 hover:bg-primary/5 transition-all text-left"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <action.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-foreground">{action.label}</span>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{action.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Audit Log Tab */}
      {activeTab === "audit" && (
        <div className="bg-card border border-border/50 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground">Histórico de Auditoria</h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-semibold animate-pulse">● Tempo real</span>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-[11px] font-semibold text-muted-foreground py-2">Usuário</th>
                <th className="text-left text-[11px] font-semibold text-muted-foreground py-2">Ação</th>
                <th className="text-left text-[11px] font-semibold text-muted-foreground py-2">IP</th>
                <th className="text-left text-[11px] font-semibold text-muted-foreground py-2">Horário</th>
                <th className="text-center text-[11px] font-semibold text-muted-foreground py-2">Risco</th>
              </tr>
            </thead>
            <tbody>
              {auditLog.map(log => (
                <tr key={log.id} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                  <td className="py-3 pr-3"><span className="text-sm font-medium text-foreground">{log.user}</span></td>
                  <td className="py-3 pr-3"><span className="text-sm text-foreground">{log.action}</span></td>
                  <td className="py-3 pr-3"><span className="text-xs text-muted-foreground font-mono">{log.ip}</span></td>
                  <td className="py-3 pr-3"><span className="text-xs text-muted-foreground">{log.time}</span></td>
                  <td className="py-3 text-center">
                    <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-semibold", {
                      "bg-emerald-500/10 text-emerald-500": log.risk === "low",
                      "bg-amber-500/10 text-amber-500": log.risk === "medium",
                      "bg-red-500/10 text-red-500": log.risk === "high",
                    })}>
                      {log.risk === "low" ? "Baixo" : log.risk === "medium" ? "Médio" : "Alto"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Permissions Tab */}
      {activeTab === "permissions" && (
        <div className="bg-card border border-border/50 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground">Controle de Permissões</h3>
            <Users className="w-4 h-4 text-primary" />
          </div>
          <div className="space-y-3">
            {roles.map(role => (
              <div key={role.role} className="flex items-center justify-between p-4 rounded-xl border border-border/30 hover:border-primary/20 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={cn("w-10 h-10 rounded-lg bg-muted flex items-center justify-center")}>
                    <Key className={cn("w-4 h-4", role.color)} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-foreground">{role.role}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">{role.users} usuário{role.users > 1 ? "s" : ""}</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                      {role.permissions.map(perm => (
                        <span key={perm} className="text-[10px] px-2 py-0.5 rounded bg-primary/5 text-primary font-medium">{perm}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => toast.info(`Editando permissões: ${role.role}`)}
                  className="text-xs text-primary hover:text-primary/80 font-medium transition-colors"
                >
                  Editar
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
