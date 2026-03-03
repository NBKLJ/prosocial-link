import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FlowCard } from "@/components/automacoes/FlowCard";
import { FlowBuilderDialog } from "@/components/automacoes/FlowBuilderDialog";
import { AutomationFlow } from "@/components/automacoes/types";
import { initialFlows } from "@/components/automacoes/data";
import {
  Zap, Send, MessageSquare, UserCheck, Plus, Search, RotateCcw
} from "lucide-react";
import { motion } from "framer-motion";

export default function Automacoes() {
  const [flows, setFlows] = useState<AutomationFlow[]>(initialFlows);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingFlow, setEditingFlow] = useState<AutomationFlow | null>(null);

  const filtered = flows.filter((f) => {
    const matchSearch = f.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = categoryFilter === "all" || f.category === categoryFilter;
    const matchStatus = statusFilter === "all" || (statusFilter === "active" ? f.active : !f.active);
    return matchSearch && matchCategory && matchStatus;
  });

  const totalSent = flows.reduce((s, f) => s + f.stats.sent, 0);
  const totalReplied = flows.reduce((s, f) => s + f.stats.replied, 0);
  const totalRecovered = flows.reduce((s, f) => s + f.stats.recovered, 0);
  const activeCount = flows.filter((f) => f.active).length;

  const handleToggle = (id: string) => {
    setFlows((prev) => prev.map((f) => (f.id === id ? { ...f, active: !f.active } : f)));
  };

  const handleDelete = (id: string) => {
    setFlows((prev) => prev.filter((f) => f.id !== id));
  };

  const handleEdit = (flow: AutomationFlow) => {
    setEditingFlow(flow);
    setDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingFlow(null);
    setDialogOpen(true);
  };

  const handleSave = (flow: AutomationFlow) => {
    setFlows((prev) => {
      const exists = prev.find((f) => f.id === flow.id);
      if (exists) return prev.map((f) => (f.id === flow.id ? flow : f));
      return [...prev, flow];
    });
  };

  return (
    <AppLayout>
      <div className="space-y-8 max-w-7xl mx-auto animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-foreground">Automações de Follow-up</h1>
              <Badge variant="outline" className="text-[10px] bg-primary/10 text-primary border-primary/20">
                <RotateCcw className="w-3 h-3 mr-1" /> Recontato Automático
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Crie fluxos inteligentes para recontatar clientes que pararam de responder. Nunca mais perca uma tratativa.
            </p>
          </div>
          <Button onClick={handleCreate} className="gap-2">
            <Plus className="w-4 h-4" /> Novo Fluxo
          </Button>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard title="Fluxos Ativos" value={String(activeCount)} change={`${flows.length} criados`} positive icon={Zap} color="blue" />
          <MetricCard title="Mensagens Enviadas" value={totalSent.toLocaleString("pt-BR")} change="Total acumulado" positive icon={Send} color="teal" />
          <MetricCard title="Respostas Obtidas" value={totalReplied.toLocaleString("pt-BR")} change={`${totalSent > 0 ? Math.round((totalReplied / totalSent) * 100) : 0}% taxa de resposta`} positive icon={MessageSquare} color="violet" />
          <MetricCard title="Clientes Recuperados" value={totalRecovered.toLocaleString("pt-BR")} change={`${totalSent > 0 ? Math.round((totalRecovered / totalSent) * 100) : 0}% taxa de recuperação`} positive icon={UserCheck} color="emerald" />
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Buscar fluxo..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas categorias</SelectItem>
              <SelectItem value="follow-up">Follow-up</SelectItem>
              <SelectItem value="pos-venda">Pós-venda</SelectItem>
              <SelectItem value="reengajamento">Reengajamento</SelectItem>
              <SelectItem value="custom">Personalizado</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="active">Ativos</SelectItem>
              <SelectItem value="paused">Pausados</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Flow Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map((flow, i) => (
            <motion.div
              key={flow.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <FlowCard flow={flow} onToggle={handleToggle} onEdit={handleEdit} onDelete={handleDelete} />
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <RotateCcw className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">Nenhum fluxo encontrado.</p>
            <Button variant="outline" size="sm" className="mt-3" onClick={handleCreate}>
              Criar primeiro fluxo
            </Button>
          </div>
        )}
      </div>

      <FlowBuilderDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        flow={editingFlow}
        onSave={handleSave}
      />
    </AppLayout>
  );
}
