import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { ProGate } from "@/components/ui/ProGate";
import {
  FileText, Plus, Search, Eye, Send, Download, PenTool, Sparkles,
  Clock, CheckCircle2, XCircle, AlertCircle, Filter, MoreVertical,
  FileSignature, Scale, Bot, Briefcase, ChevronRight, Copy,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";

// ── TYPES ─────────────────────────────────────────────────
type ContractStatus = "draft" | "sent" | "viewed" | "signed" | "declined" | "expired" | "cancelled";

interface Contract {
  id: string;
  title: string;
  client: string;
  type: "contrato" | "procuracao" | "distrato" | "aditivo";
  status: ContractStatus;
  value?: string;
  createdAt: string;
  expiresAt?: string;
  signedAt?: string;
  viewedAt?: string;
  zapsignId?: string;
  sentBy?: string;
}

// ── MOCK DATA ─────────────────────────────────────────────
const MOCK_CONTRACTS: Contract[] = [
  { id: "CTR-001", title: "Contrato de Prestação de Serviços", client: "TechCorp Ltda", type: "contrato", status: "signed", value: "R$ 15.000,00", createdAt: "2026-02-20", signedAt: "2026-02-22", zapsignId: "zs-a1b2c3", sentBy: "Ana Paula" },
  { id: "CTR-002", title: "Contrato de Consultoria", client: "AutoFlow S.A.", type: "contrato", status: "viewed", value: "R$ 8.500,00", createdAt: "2026-02-25", expiresAt: "2026-03-10", viewedAt: "2026-02-26", zapsignId: "zs-d4e5f6", sentBy: "Carlos Silva" },
  { id: "CTR-003", title: "Procuração Administrativa", client: "Maria Silva", type: "procuracao", status: "draft", createdAt: "2026-02-27" },
  { id: "CTR-004", title: "Aditivo Contratual #1", client: "DataSync Ltda", type: "aditivo", status: "signed", value: "R$ 3.200,00", createdAt: "2026-02-15", signedAt: "2026-02-18", zapsignId: "zs-g7h8i9", sentBy: "Ana Paula" },
  { id: "CTR-005", title: "Distrato de Serviço", client: "CloudNex Ltda", type: "distrato", status: "declined", createdAt: "2026-01-10", expiresAt: "2026-02-10", zapsignId: "zs-j0k1l2", sentBy: "Carlos Silva" },
  { id: "CTR-006", title: "Contrato de Licenciamento", client: "SmartOps Inc", type: "contrato", status: "sent", value: "R$ 22.000,00", createdAt: "2026-02-28", zapsignId: "zs-m3n4o5", sentBy: "Ana Paula" },
  { id: "CTR-007", title: "Contrato de Suporte Mensal", client: "Nova Digital", type: "contrato", status: "expired", value: "R$ 4.800,00", createdAt: "2026-01-05", expiresAt: "2026-02-05", sentBy: "Carlos Silva" },
  { id: "CTR-008", title: "NDA Confidencialidade", client: "StartUp XYZ", type: "contrato", status: "cancelled", createdAt: "2026-02-01", sentBy: "Ana Paula" },
];

const TEMPLATES = [
  { id: "tpl-1", name: "Contrato de Prestação de Serviços", icon: Briefcase, desc: "Modelo padrão para serviços recorrentes ou pontuais" },
  { id: "tpl-2", name: "Procuração Ad Judicia", icon: Scale, desc: "Procuração para representação judicial" },
  { id: "tpl-3", name: "Procuração Administrativa", icon: FileSignature, desc: "Procuração para atos administrativos" },
  { id: "tpl-4", name: "Distrato Contratual", icon: XCircle, desc: "Encerramento formal de contrato vigente" },
  { id: "tpl-5", name: "Aditivo Contratual", icon: Plus, desc: "Alteração de cláusulas em contrato vigente" },
  { id: "tpl-6", name: "Contrato de Confidencialidade (NDA)", icon: FileText, desc: "Acordo de não divulgação entre partes" },
];

// ── HELPERS ───────────────────────────────────────────────
const statusConfig: Record<ContractStatus, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  draft: { label: "Rascunho", color: "bg-slate-500/15 text-slate-400 border-slate-500/20", icon: Clock },
  sent: { label: "Enviado", color: "bg-blue-500/15 text-blue-400 border-blue-500/20", icon: Send },
  viewed: { label: "Visualizado", color: "bg-purple-500/15 text-purple-400 border-purple-500/20", icon: Eye },
  signed: { label: "Assinado", color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20", icon: CheckCircle2 },
  declined: { label: "Recusado", color: "bg-red-500/15 text-red-400 border-red-500/20", icon: XCircle },
  expired: { label: "Expirado", color: "bg-amber-500/15 text-amber-400 border-amber-500/20", icon: AlertCircle },
  cancelled: { label: "Cancelado", color: "bg-red-500/15 text-red-300 border-red-500/20", icon: XCircle },
};

const typeLabels: Record<string, string> = {
  contrato: "Contrato", procuracao: "Procuração", distrato: "Distrato", aditivo: "Aditivo",
};

// ── METRICS CARDS ─────────────────────────────────────────
function MetricCards({ contracts }: { contracts: Contract[] }) {
  const total = contracts.length;
  const signed = contracts.filter(c => c.status === "signed").length;
  const pending = contracts.filter(c => c.status === "sent" || c.status === "viewed").length;
  const declined = contracts.filter(c => c.status === "declined").length;
  const viewed = contracts.filter(c => c.status === "viewed").length;

  const signRate = total > 0 ? Math.round((signed / total) * 100) : 0;

  const metrics = [
    { label: "Total de Documentos", value: total, icon: FileText, accent: "text-[hsl(var(--primary))]" },
    { label: "Assinados", value: signed, icon: CheckCircle2, accent: "text-emerald-400", sub: `${signRate}% taxa` },
    { label: "Aguardando", value: pending, icon: Send, accent: "text-blue-400", sub: `${viewed} visualizados` },
    { label: "Recusados", value: declined, icon: XCircle, accent: "text-red-400" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((m, i) => (
        <motion.div
          key={m.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="bg-card border border-border/50 rounded-xl p-5 flex items-center gap-4"
        >
          <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center bg-muted/50", m.accent)}>
            <m.icon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{m.value}</p>
            <p className="text-xs text-muted-foreground">{m.label}</p>
            {(m as any).sub && <p className="text-[10px] text-muted-foreground/70">{(m as any).sub}</p>}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ── CONTRACT TABLE ────────────────────────────────────────
function ContractTable({ contracts, onView }: { contracts: Contract[]; onView: (c: Contract) => void }) {
  return (
    <div className="bg-card border border-border/50 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/50">
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Documento</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Cliente</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tipo</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Valor</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Data</th>
              <th className="text-right px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody>
            {contracts.map((c, i) => {
              const st = statusConfig[c.status];
              const StIcon = st.icon;
              return (
                <motion.tr
                  key={c.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-border/30 hover:bg-muted/20 transition-colors cursor-pointer"
                  onClick={() => onView(c)}
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <div>
                        <p className="font-medium text-foreground">{c.title}</p>
                        <p className="text-xs text-muted-foreground">{c.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-foreground">{c.client}</td>
                  <td className="px-5 py-4">
                    <Badge variant="outline" className="text-xs">{typeLabels[c.type]}</Badge>
                  </td>
                  <td className="px-5 py-4">
                    <span className={cn("inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg border", st.color)}>
                      <StIcon className="w-3 h-3" />{st.label}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-foreground font-medium">{c.value || "—"}</td>
                  <td className="px-5 py-4 text-muted-foreground">{c.createdAt}</td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-2 rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── AI GENERATOR PANEL ────────────────────────────────────
function AIGeneratorPanel() {
  const [generating, setGenerating] = useState(false);
  const [formData, setFormData] = useState({
    clientName: "", docType: "contrato", description: "",
  });

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => setGenerating(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border/50 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
            <Bot className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Geração por IA</h3>
            <p className="text-xs text-muted-foreground">Descreva o que precisa e a IA cria o documento</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Nome do Cliente</label>
            <input
              type="text"
              value={formData.clientName}
              onChange={e => setFormData(p => ({ ...p, clientName: e.target.value }))}
              placeholder="Ex: João da Silva Ltda"
              className="w-full bg-muted/50 border border-border/50 rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Tipo de Documento</label>
            <select
              value={formData.docType}
              onChange={e => setFormData(p => ({ ...p, docType: e.target.value }))}
              className="w-full bg-muted/50 border border-border/50 rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30"
            >
              <option value="contrato">Contrato de Prestação de Serviços</option>
              <option value="procuracao">Procuração</option>
              <option value="distrato">Distrato</option>
              <option value="aditivo">Aditivo Contratual</option>
              <option value="nda">NDA / Confidencialidade</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Descrição / Instruções para IA</label>
            <textarea
              value={formData.description}
              onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
              placeholder="Ex: Contrato de consultoria em TI por 12 meses, com valor de R$ 5.000/mês, incluindo cláusula de confidencialidade e multa por rescisão antecipada de 20%."
              rows={4}
              className="w-full bg-muted/50 border border-border/50 rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 resize-none"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={generating}
            className={cn(
              "w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all",
              "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 shadow-lg shadow-amber-500/20",
              generating && "opacity-70 cursor-wait"
            )}
          >
            {generating ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Gerando documento...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Gerar com IA
              </>
            )}
          </button>
        </div>
      </div>

      {/* Generated preview (mock) */}
      <AnimatePresence>
        {generating && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-card border border-amber-500/20 rounded-xl p-6 space-y-4"
          >
            <div className="flex items-center gap-2 text-amber-400">
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span className="text-sm font-medium">IA processando documento...</span>
            </div>
            <div className="space-y-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-3 bg-muted/50 rounded animate-pulse" style={{ width: `${85 - i * 8}%`, animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── TEMPLATES PANEL ───────────────────────────────────────
function TemplatesPanel() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {TEMPLATES.map((tpl, i) => (
        <motion.div
          key={tpl.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="bg-card border border-border/50 rounded-xl p-5 hover:border-primary/30 transition-all cursor-pointer group"
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
              <tpl.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-foreground text-sm">{tpl.name}</h4>
              <p className="text-xs text-muted-foreground mt-1">{tpl.desc}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
          </div>
          <div className="flex items-center gap-2 mt-4">
            <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-2.5 py-1.5 rounded-lg hover:bg-muted/50">
              <Copy className="w-3 h-3" /> Usar template
            </button>
            <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-2.5 py-1.5 rounded-lg hover:bg-muted/50">
              <Sparkles className="w-3 h-3" /> Gerar com IA
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ── SIGNATURE PANEL ───────────────────────────────────────
function SignaturePanel() {
  const pendingSignatures = MOCK_CONTRACTS.filter(c => c.status === "sent");

  return (
    <div className="space-y-4">
      <div className="bg-card border border-border/50 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-blue-500/15 flex items-center justify-center">
            <PenTool className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Assinatura Digital</h3>
            <p className="text-xs text-muted-foreground">Envie documentos e acompanhe assinaturas em tempo real</p>
          </div>
        </div>

        {pendingSignatures.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">Nenhum documento aguardando assinatura</p>
        ) : (
          <div className="space-y-3">
            {pendingSignatures.map(c => (
              <div key={c.id} className="flex items-center justify-between border border-border/30 rounded-lg p-4 hover:bg-muted/20 transition-colors">
                <div className="flex items-center gap-3">
                  <FileSignature className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{c.title}</p>
                    <p className="text-xs text-muted-foreground">{c.client} • Expira em {c.expiresAt}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-500/15 text-blue-400 hover:bg-blue-500/25 transition-colors">
                    Reenviar
                  </button>
                  <button className="px-3 py-1.5 text-xs font-medium rounded-lg bg-muted/50 text-foreground hover:bg-muted transition-colors">
                    Detalhes
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-card border border-border/50 rounded-xl p-6">
        <h3 className="font-semibold text-foreground text-sm mb-4">Enviar para Assinatura</h3>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="E-mail do signatário"
            className="w-full bg-muted/50 border border-border/50 rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <input
            type="text"
            placeholder="Nome completo do signatário"
            className="w-full bg-muted/50 border border-border/50 rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <button className="w-full py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20">
            <Send className="w-4 h-4" /> Enviar Documento
          </button>
        </div>
      </div>
    </div>
  );
}

// ── DETAIL MODAL ──────────────────────────────────────────
function ContractDetail({ contract, onClose }: { contract: Contract; onClose: () => void }) {
  const st = statusConfig[contract.status];
  const StIcon = st.icon;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-card border border-border/50 rounded-2xl max-w-lg w-full p-6 space-y-5"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold text-foreground">{contract.title}</h2>
            <p className="text-sm text-muted-foreground mt-1">{contract.id}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors">
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div><p className="text-xs text-muted-foreground mb-1">Cliente</p><p className="text-sm font-medium text-foreground">{contract.client}</p></div>
          <div><p className="text-xs text-muted-foreground mb-1">Tipo</p><Badge variant="outline">{typeLabels[contract.type]}</Badge></div>
          <div><p className="text-xs text-muted-foreground mb-1">Status</p><span className={cn("inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg border", st.color)}><StIcon className="w-3 h-3" />{st.label}</span></div>
          <div><p className="text-xs text-muted-foreground mb-1">Valor</p><p className="text-sm font-bold text-foreground">{contract.value || "—"}</p></div>
          <div><p className="text-xs text-muted-foreground mb-1">Criado em</p><p className="text-sm text-foreground">{contract.createdAt}</p></div>
          {contract.signedAt && <div><p className="text-xs text-muted-foreground mb-1">Assinado em</p><p className="text-sm text-emerald-400">{contract.signedAt}</p></div>}
          {contract.expiresAt && <div><p className="text-xs text-muted-foreground mb-1">Expira em</p><p className="text-sm text-amber-400">{contract.expiresAt}</p></div>}
        </div>

        <div className="flex items-center gap-2 pt-2">
          <button className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-primary/15 text-primary hover:bg-primary/25 transition-all flex items-center justify-center gap-2">
            <Download className="w-4 h-4" /> Baixar PDF
          </button>
          {contract.status === "draft" && (
            <button className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 transition-all flex items-center justify-center gap-2">
              <Send className="w-4 h-4" /> Enviar para Assinatura
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── MAIN PAGE ─────────────────────────────────────────────
export default function Contratos() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ContractStatus | "all">("all");
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);

  const filtered = MOCK_CONTRACTS
    .filter(c => statusFilter === "all" || c.status === statusFilter)
    .filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.client.toLowerCase().includes(searchQuery.toLowerCase()));

  const content = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Contratos & Documentos</h1>
          <p className="text-sm text-muted-foreground mt-1">Geração automática, assinatura digital e gestão completa</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg shadow-amber-500/20">
          <Plus className="w-4 h-4" /> Novo Documento
        </button>
      </div>

      <MetricCards contracts={MOCK_CONTRACTS} />

      <Tabs defaultValue="todos" className="space-y-4">
        <TabsList className="bg-muted/30 border border-border/50 p-1 rounded-xl">
          <TabsTrigger value="todos" className="rounded-lg text-xs data-[state=active]:bg-card data-[state=active]:shadow-sm">Todos</TabsTrigger>
          <TabsTrigger value="gerar" className="rounded-lg text-xs data-[state=active]:bg-card data-[state=active]:shadow-sm">
            <Sparkles className="w-3 h-3 mr-1" /> Gerar com IA
          </TabsTrigger>
          <TabsTrigger value="templates" className="rounded-lg text-xs data-[state=active]:bg-card data-[state=active]:shadow-sm">
            <FileText className="w-3 h-3 mr-1" /> Templates
          </TabsTrigger>
          <TabsTrigger value="assinatura" className="rounded-lg text-xs data-[state=active]:bg-card data-[state=active]:shadow-sm">
            <PenTool className="w-3 h-3 mr-1" /> Assinatura Digital
          </TabsTrigger>
        </TabsList>

        <TabsContent value="todos" className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Buscar por título ou cliente..."
                className="w-full bg-card border border-border/50 rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              {(["all", "draft", "sent", "viewed", "signed", "declined", "expired", "cancelled"] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium rounded-lg transition-colors",
                    statusFilter === s ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  {s === "all" ? "Todos" : statusConfig[s].label}
                </button>
              ))}
            </div>
          </div>

          <ContractTable contracts={filtered} onView={setSelectedContract} />
        </TabsContent>

        <TabsContent value="gerar">
          <AIGeneratorPanel />
        </TabsContent>

        <TabsContent value="templates">
          <TemplatesPanel />
        </TabsContent>

        <TabsContent value="assinatura">
          <SignaturePanel />
        </TabsContent>
      </Tabs>

      <AnimatePresence>
        {selectedContract && <ContractDetail contract={selectedContract} onClose={() => setSelectedContract(null)} />}
      </AnimatePresence>
    </div>
  );

  return (
    <AppLayout>
      <ProGate title="Contratos & Documentos" description="Disponível no plano Premium. Gere contratos por IA, procurações e documentos jurídicos com assinatura digital.">
        {content}
      </ProGate>
    </AppLayout>
  );
}
