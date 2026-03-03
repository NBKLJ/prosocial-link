import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { ProGate } from "@/components/ui/ProGate";
import {
  DollarSign, TrendingUp, TrendingDown, Clock, AlertTriangle,
  CheckCircle2, XCircle, ArrowUpRight, ArrowDownRight, Filter,
  Search, Eye, Download, MoreVertical, CreditCard, Banknote,
  CalendarDays, BarChart3, PieChart, RefreshCw, Building2,
  ChevronRight, Receipt, Wallet, CircleDollarSign,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

// ── TYPES ─────────────────────────────────────────────────
type PaymentStatus = "received" | "pending" | "overdue" | "refunded" | "cancelled";
type BoletoStatus = "paid" | "pending" | "overdue" | "cancelled";

interface Transaction {
  id: string;
  description: string;
  client: string;
  value: number;
  dueDate: string;
  paymentDate?: string;
  status: PaymentStatus;
  type: "boleto" | "pix" | "credit_card" | "transfer";
  installment?: string;
}

interface Boleto {
  id: string;
  description: string;
  client: string;
  value: number;
  dueDate: string;
  status: BoletoStatus;
  barcode?: string;
  installment?: string;
}

// ── MOCK DATA ─────────────────────────────────────────────
const MOCK_TRANSACTIONS: Transaction[] = [
  { id: "TXN-001", description: "Honorários - Caso Trabalhista", client: "Maria Silva", value: 5000, dueDate: "2026-03-05", paymentDate: "2026-03-03", status: "received", type: "pix" },
  { id: "TXN-002", description: "Contrato de Consultoria", client: "TechCorp Ltda", value: 8500, dueDate: "2026-03-10", status: "pending", type: "boleto" },
  { id: "TXN-003", description: "Honorários - Processo Civil", client: "João Santos", value: 3200, dueDate: "2026-02-25", status: "overdue", type: "boleto" },
  { id: "TXN-004", description: "Parcela 2/6 - Acordo Judicial", client: "AutoFlow S.A.", value: 2500, dueDate: "2026-03-15", status: "pending", type: "boleto", installment: "2/6" },
  { id: "TXN-005", description: "Consultoria Jurídica Mensal", client: "DataSync Ltda", value: 4800, dueDate: "2026-03-01", paymentDate: "2026-03-01", status: "received", type: "credit_card" },
  { id: "TXN-006", description: "Honorários Iniciais", client: "CloudNex Ltda", value: 15000, dueDate: "2026-02-20", paymentDate: "2026-02-20", status: "received", type: "transfer" },
  { id: "TXN-007", description: "Parecer Jurídico", client: "SmartOps Inc", value: 6000, dueDate: "2026-03-20", status: "pending", type: "pix" },
  { id: "TXN-008", description: "Parcela 1/3 - Causa Previdenciária", client: "Ana Oliveira", value: 1800, dueDate: "2026-02-15", status: "overdue", type: "boleto", installment: "1/3" },
  { id: "TXN-009", description: "Contrato de Prestação de Serviços", client: "Nova Digital", value: 12000, dueDate: "2026-04-01", status: "pending", type: "boleto" },
  { id: "TXN-010", description: "Devolução - Causa Cancelada", client: "StartUp XYZ", value: 3500, dueDate: "2026-02-28", paymentDate: "2026-02-28", status: "refunded", type: "pix" },
  { id: "TXN-011", description: "Parcela 3/6 - Acordo Judicial", client: "AutoFlow S.A.", value: 2500, dueDate: "2026-04-15", status: "pending", type: "boleto", installment: "3/6" },
  { id: "TXN-012", description: "Honorários - Caso Família", client: "Carlos Mendes", value: 7500, dueDate: "2026-03-08", paymentDate: "2026-03-03", status: "received", type: "pix" },
];

const MOCK_BOLETOS: Boleto[] = [
  { id: "BOL-001", description: "Honorários - Caso Trabalhista", client: "Maria Silva", value: 5000, dueDate: "2026-03-05", status: "paid" },
  { id: "BOL-002", description: "Contrato de Consultoria", client: "TechCorp Ltda", value: 8500, dueDate: "2026-03-10", status: "pending" },
  { id: "BOL-003", description: "Honorários - Processo Civil", client: "João Santos", value: 3200, dueDate: "2026-02-25", status: "overdue" },
  { id: "BOL-004", description: "Parcela 2/6 - Acordo Judicial", client: "AutoFlow S.A.", value: 2500, dueDate: "2026-03-15", status: "pending", installment: "2/6" },
  { id: "BOL-005", description: "Parcela 1/3 - Causa Previdenciária", client: "Ana Oliveira", value: 1800, dueDate: "2026-02-15", status: "overdue", installment: "1/3" },
  { id: "BOL-006", description: "Contrato de Prestação de Serviços", client: "Nova Digital", value: 12000, dueDate: "2026-04-01", status: "pending" },
  { id: "BOL-007", description: "Parcela 3/6 - Acordo Judicial", client: "AutoFlow S.A.", value: 2500, dueDate: "2026-04-15", status: "pending", installment: "3/6" },
];

// ── HELPERS ───────────────────────────────────────────────
const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

const statusConfig: Record<PaymentStatus, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  received: { label: "Recebido", color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20", icon: CheckCircle2 },
  pending: { label: "Pendente", color: "bg-amber-500/15 text-amber-400 border-amber-500/20", icon: Clock },
  overdue: { label: "Atrasado", color: "bg-red-500/15 text-red-400 border-red-500/20", icon: AlertTriangle },
  refunded: { label: "Devolvido", color: "bg-blue-500/15 text-blue-400 border-blue-500/20", icon: RefreshCw },
  cancelled: { label: "Cancelado", color: "bg-slate-500/15 text-slate-400 border-slate-500/20", icon: XCircle },
};

const boletoStatusConfig: Record<BoletoStatus, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  paid: { label: "Pago", color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20", icon: CheckCircle2 },
  pending: { label: "Pendente", color: "bg-amber-500/15 text-amber-400 border-amber-500/20", icon: Clock },
  overdue: { label: "Vencido", color: "bg-red-500/15 text-red-400 border-red-500/20", icon: AlertTriangle },
  cancelled: { label: "Cancelado", color: "bg-slate-500/15 text-slate-400 border-slate-500/20", icon: XCircle },
};

const typeIcons: Record<string, typeof CreditCard> = {
  boleto: Receipt, pix: Banknote, credit_card: CreditCard, transfer: ArrowUpRight,
};
const typeLabels: Record<string, string> = {
  boleto: "Boleto", pix: "PIX", credit_card: "Cartão", transfer: "Transferência",
};

// ── METRIC CARDS ──────────────────────────────────────────
function FinanceMetrics({ transactions }: { transactions: Transaction[] }) {
  const totalReceived = transactions.filter(t => t.status === "received").reduce((s, t) => s + t.value, 0);
  const totalPending = transactions.filter(t => t.status === "pending").reduce((s, t) => s + t.value, 0);
  const totalOverdue = transactions.filter(t => t.status === "overdue").reduce((s, t) => s + t.value, 0);
  const futureReceivables = transactions.filter(t => t.status === "pending" && new Date(t.dueDate) > new Date()).reduce((s, t) => s + t.value, 0);

  const balance = totalReceived;
  const overdueCount = transactions.filter(t => t.status === "overdue").length;
  const pendingCount = transactions.filter(t => t.status === "pending").length;

  const metrics = [
    { label: "Saldo em Conta", value: formatCurrency(balance), icon: Wallet, accent: "text-emerald-400", bg: "from-emerald-500/10 to-emerald-500/5", sub: "Atualizado agora" },
    { label: "A Receber", value: formatCurrency(totalPending), icon: TrendingUp, accent: "text-blue-400", bg: "from-blue-500/10 to-blue-500/5", sub: `${pendingCount} cobranças pendentes` },
    { label: "Pagamentos em Atraso", value: formatCurrency(totalOverdue), icon: AlertTriangle, accent: "text-red-400", bg: "from-red-500/10 to-red-500/5", sub: `${overdueCount} boletos vencidos` },
    { label: "Recebimentos Futuros", value: formatCurrency(futureReceivables), icon: CalendarDays, accent: "text-purple-400", bg: "from-purple-500/10 to-purple-500/5", sub: "Próximos 30 dias" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((m, i) => (
        <motion.div
          key={m.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className={cn("bg-card border border-border/50 rounded-xl p-5 relative overflow-hidden")}
        >
          <div className={cn("absolute inset-0 bg-gradient-to-br opacity-50", m.bg)} />
          <div className="relative flex items-start gap-4">
            <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center bg-muted/50", m.accent)}>
              <m.icon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground mb-1">{m.label}</p>
              <p className="text-xl font-bold text-foreground">{m.value}</p>
              <p className="text-[10px] text-muted-foreground/70 mt-1">{m.sub}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ── RECENT ACTIVITY ───────────────────────────────────────
function RecentActivity({ transactions }: { transactions: Transaction[] }) {
  const recent = [...transactions]
    .filter(t => t.paymentDate)
    .sort((a, b) => new Date(b.paymentDate!).getTime() - new Date(a.paymentDate!).getTime())
    .slice(0, 5);

  return (
    <div className="bg-card border border-border/50 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">Últimas Movimentações</h3>
        <span className="text-[10px] text-muted-foreground">Tempo real via Asaas</span>
      </div>
      <div className="space-y-3">
        {recent.map((t, i) => {
          const isIncome = t.status === "received";
          const TIcon = typeIcons[t.type];
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3 py-2"
            >
              <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center", isIncome ? "bg-emerald-500/10" : "bg-red-500/10")}>
                {isIncome ? <ArrowDownRight className="w-4 h-4 text-emerald-400" /> : <ArrowUpRight className="w-4 h-4 text-red-400" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{t.description}</p>
                <p className="text-[10px] text-muted-foreground">{t.client} • {t.paymentDate}</p>
              </div>
              <div className="text-right">
                <p className={cn("text-sm font-bold", isIncome ? "text-emerald-400" : "text-red-400")}>
                  {isIncome ? "+" : "-"}{formatCurrency(t.value)}
                </p>
                <div className="flex items-center gap-1 justify-end">
                  <TIcon className="w-3 h-3 text-muted-foreground" />
                  <span className="text-[10px] text-muted-foreground">{typeLabels[t.type]}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ── UPCOMING PAYMENTS ─────────────────────────────────────
function UpcomingPayments({ transactions }: { transactions: Transaction[] }) {
  const upcoming = transactions
    .filter(t => t.status === "pending")
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);

  const getDaysUntil = (date: string) => {
    const diff = Math.ceil((new Date(date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  return (
    <div className="bg-card border border-border/50 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">Próximos Vencimentos</h3>
        <CalendarDays className="w-4 h-4 text-muted-foreground" />
      </div>
      <div className="space-y-3">
        {upcoming.map((t, i) => {
          const days = getDaysUntil(t.dueDate);
          const isUrgent = days <= 3;
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3 py-2"
            >
              <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center", isUrgent ? "bg-red-500/10" : "bg-amber-500/10")}>
                <Clock className={cn("w-4 h-4", isUrgent ? "text-red-400" : "text-amber-400")} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{t.client}</p>
                <p className="text-[10px] text-muted-foreground">{t.description}{t.installment ? ` (${t.installment})` : ""}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-foreground">{formatCurrency(t.value)}</p>
                <p className={cn("text-[10px] font-medium", isUrgent ? "text-red-400" : "text-muted-foreground")}>
                  {days === 0 ? "Hoje" : days === 1 ? "Amanhã" : `em ${days} dias`}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ── OVERDUE PANEL ─────────────────────────────────────────
function OverduePanel({ transactions }: { transactions: Transaction[] }) {
  const overdue = transactions.filter(t => t.status === "overdue");

  if (overdue.length === 0) {
    return (
      <div className="bg-card border border-border/50 rounded-xl p-8 text-center">
        <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
        <p className="text-sm font-medium text-foreground">Nenhum pagamento em atraso!</p>
        <p className="text-xs text-muted-foreground mt-1">Todos os pagamentos estão em dia.</p>
      </div>
    );
  }

  const totalOverdue = overdue.reduce((s, t) => s + t.value, 0);

  return (
    <div className="space-y-4">
      <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-red-500/15 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Pagamentos em Atraso</h3>
            <p className="text-xs text-muted-foreground">{overdue.length} cobranças • Total: <span className="text-red-400 font-bold">{formatCurrency(totalOverdue)}</span></p>
          </div>
        </div>
        <div className="space-y-2">
          {overdue.map((t) => {
            const daysPast = Math.ceil((new Date().getTime() - new Date(t.dueDate).getTime()) / (1000 * 60 * 60 * 24));
            return (
              <div key={t.id} className="flex items-center gap-3 bg-card/50 rounded-lg p-3 border border-border/30">
                <Receipt className="w-4 h-4 text-red-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{t.client}</p>
                  <p className="text-[10px] text-muted-foreground">{t.description} • Venceu em {t.dueDate}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-red-400">{formatCurrency(t.value)}</p>
                  <p className="text-[10px] text-red-400/70">{daysPast} dias atrás</p>
                </div>
                <button className="px-3 py-1.5 text-xs font-medium rounded-lg bg-red-500/15 text-red-400 hover:bg-red-500/25 transition-colors flex-shrink-0">
                  Reenviar
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── BOLETOS TABLE ─────────────────────────────────────────
function BoletosTable({ boletos }: { boletos: Boleto[] }) {
  const [filter, setFilter] = useState<BoletoStatus | "all">("all");
  const [search, setSearch] = useState("");

  const filtered = boletos
    .filter(b => filter === "all" || b.status === filter)
    .filter(b => b.description.toLowerCase().includes(search.toLowerCase()) || b.client.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Buscar boleto por descrição ou cliente..."
            className="w-full bg-card border border-border/50 rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          {(["all", "pending", "overdue", "paid", "cancelled"] as const).map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={cn("px-3 py-1.5 text-xs font-medium rounded-lg transition-colors", filter === s ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/50")}>
              {s === "all" ? "Todos" : boletoStatusConfig[s].label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border/50 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/50">
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Boleto</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Cliente</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Valor</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Vencimento</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
              <th className="text-right px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((b, i) => {
              const st = boletoStatusConfig[b.status];
              const StIcon = st.icon;
              return (
                <motion.tr key={b.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                  className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <Receipt className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <div>
                        <p className="font-medium text-foreground">{b.description}</p>
                        <p className="text-xs text-muted-foreground">{b.id}{b.installment ? ` • Parcela ${b.installment}` : ""}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-foreground">{b.client}</td>
                  <td className="px-5 py-4 text-foreground font-medium">{formatCurrency(b.value)}</td>
                  <td className="px-5 py-4 text-muted-foreground">{b.dueDate}</td>
                  <td className="px-5 py-4">
                    <span className={cn("inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg border", st.color)}>
                      <StIcon className="w-3 h-3" />{st.label}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-2 rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"><Eye className="w-4 h-4" /></button>
                      <button className="p-2 rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"><Download className="w-4 h-4" /></button>
                      <button className="p-2 rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"><MoreVertical className="w-4 h-4" /></button>
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

// ── TRANSACTIONS TABLE ────────────────────────────────────
function TransactionsTable({ transactions }: { transactions: Transaction[] }) {
  const [filter, setFilter] = useState<PaymentStatus | "all">("all");
  const [search, setSearch] = useState("");

  const filtered = transactions
    .filter(t => filter === "all" || t.status === filter)
    .filter(t => t.description.toLowerCase().includes(search.toLowerCase()) || t.client.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Buscar transação..."
            className="w-full bg-card border border-border/50 rounded-xl pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20" />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-muted-foreground" />
          {(["all", "received", "pending", "overdue", "refunded"] as const).map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={cn("px-3 py-1.5 text-xs font-medium rounded-lg transition-colors", filter === s ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/50")}>
              {s === "all" ? "Todas" : statusConfig[s].label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border/50 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/50">
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Descrição</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Cliente</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tipo</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Valor</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Vencimento</th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t, i) => {
              const st = statusConfig[t.status];
              const StIcon = st.icon;
              const TIcon = typeIcons[t.type];
              return (
                <motion.tr key={t.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                  className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-medium text-foreground">{t.description}</p>
                    <p className="text-xs text-muted-foreground">{t.id}{t.installment ? ` • Parcela ${t.installment}` : ""}</p>
                  </td>
                  <td className="px-5 py-4 text-foreground">{t.client}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5">
                      <TIcon className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-xs text-foreground">{typeLabels[t.type]}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-foreground font-medium">{formatCurrency(t.value)}</td>
                  <td className="px-5 py-4 text-muted-foreground">{t.dueDate}</td>
                  <td className="px-5 py-4">
                    <span className={cn("inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-lg border", st.color)}>
                      <StIcon className="w-3 h-3" />{st.label}
                    </span>
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

// ── ASAAS CONNECTION STATUS ───────────────────────────────
function AsaasStatus() {
  return (
    <div className="bg-card border border-border/50 rounded-xl p-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center">
          <Building2 className="w-5 h-5 text-emerald-400" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-foreground text-sm">Banco Asaas</h3>
            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Conectado
            </span>
          </div>
          <p className="text-xs text-muted-foreground">Sincronizando automaticamente • Última atualização: agora</p>
        </div>
        <button className="px-3 py-1.5 text-xs font-medium rounded-lg bg-muted/50 text-foreground hover:bg-muted transition-colors flex items-center gap-1.5">
          <RefreshCw className="w-3 h-3" /> Sincronizar
        </button>
      </div>
    </div>
  );
}

// ── MAIN PAGE ─────────────────────────────────────────────
export default function Financeiro() {
  const [activeTab, setActiveTab] = useState("visao-geral");

  const content = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Financeiro</h1>
          <p className="text-sm text-muted-foreground mt-1">Controle completo da sua movimentação financeira via Asaas</p>
        </div>
      </div>

      <AsaasStatus />
      <FinanceMetrics transactions={MOCK_TRANSACTIONS} />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-muted/30 border border-border/50 p-1 rounded-xl">
          <TabsTrigger value="visao-geral" className="rounded-lg text-xs data-[state=active]:bg-card data-[state=active]:shadow-sm">
            <BarChart3 className="w-3 h-3 mr-1" /> Visão Geral
          </TabsTrigger>
          <TabsTrigger value="boletos" className="rounded-lg text-xs data-[state=active]:bg-card data-[state=active]:shadow-sm">
            <Receipt className="w-3 h-3 mr-1" /> Boletos
          </TabsTrigger>
          <TabsTrigger value="transacoes" className="rounded-lg text-xs data-[state=active]:bg-card data-[state=active]:shadow-sm">
            <CircleDollarSign className="w-3 h-3 mr-1" /> Transações
          </TabsTrigger>
          <TabsTrigger value="atrasos" className="rounded-lg text-xs data-[state=active]:bg-card data-[state=active]:shadow-sm">
            <AlertTriangle className="w-3 h-3 mr-1" /> Atrasos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="visao-geral" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <RecentActivity transactions={MOCK_TRANSACTIONS} />
            <UpcomingPayments transactions={MOCK_TRANSACTIONS} />
          </div>
        </TabsContent>

        <TabsContent value="boletos">
          <BoletosTable boletos={MOCK_BOLETOS} />
        </TabsContent>

        <TabsContent value="transacoes">
          <TransactionsTable transactions={MOCK_TRANSACTIONS} />
        </TabsContent>

        <TabsContent value="atrasos">
          <OverduePanel transactions={MOCK_TRANSACTIONS} />
        </TabsContent>
      </Tabs>
    </div>
  );

  return (
    <AppLayout>
      <ProGate title="Financeiro" description="Disponível no plano Premium. Controle financeiro completo integrado ao Asaas.">
        {content}
      </ProGate>
    </AppLayout>
  );
}
