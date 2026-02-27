import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProBadge } from "@/components/ui/ProBadge";
import {
  Zap, Mail, MessageSquare, TrendingUp, Plus, Search, Pencil, Trash2,
  RefreshCcw, Crosshair, Layers, Megaphone
} from "lucide-react";

interface Automation {
  id: string;
  name: string;
  trigger: string;
  actions: string[];
  active: boolean;
}

const initialAutomations: Automation[] = [
  { id: "1", name: "Follow-up Proposta", trigger: "Lead sem resposta há 2 dias", actions: ["Enviar mensagem", "Notificar atendente"], active: true },
  { id: "2", name: "Boas-vindas Novo Lead", trigger: "Novo lead criado", actions: ["Enviar mensagem de boas-vindas"], active: true },
  { id: "3", name: "Reengajamento", trigger: "Lead inativo há 7 dias", actions: ["Enviar sequência", "Mover no funil"], active: false },
  { id: "4", name: "Gatilho Orçamento", trigger: "Palavra-chave detectada", actions: ["Responder automaticamente", "Criar tarefa"], active: true },
];

const modules = [
  { id: "followup", name: "Follow-ups Inteligentes", desc: "Automatize contatos estratégicos com base no comportamento do lead.", status: "Ativo", detail: "4 fluxos rodando", icon: RefreshCcw, color: "text-primary" },
  { id: "triggers", name: "Gatilhos por Palavra", desc: "Dispare mensagens automaticamente quando palavras específicas forem detectadas.", status: "Ativo", detail: "6 regras configuradas", icon: Crosshair, color: "text-accent-teal" },
  { id: "sequences", name: "Sequências Automatizadas", desc: "Crie jornadas completas com múltiplas etapas e intervalos estratégicos.", status: "Pausado", detail: "", icon: Layers, color: "text-accent-violet", pro: true },
  { id: "mass", name: "Envios em Massa", desc: "Execute campanhas amplas com controle total de performance.", status: "Ativo", detail: "2 campanhas", icon: Megaphone, color: "text-warning" },
];

const recentActivity = [
  { automation: "Follow-up Proposta", action: "Mensagem enviada", status: "Executado", date: "Hoje • 14:32" },
  { automation: "Sequência Reengajamento", action: "Aguardando disparo", status: "Pendente", date: "Hoje • 16:00" },
  { automation: 'Gatilho Palavra "Orçamento"', action: "Detectado e acionado", status: "Executado", date: "Ontem • 18:12" },
];

export default function Automacoes() {
  const [automations, setAutomations] = useState<Automation[]>(initialAutomations);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Automation | null>(null);
  const [form, setForm] = useState({ name: "", trigger: "", actions: "", active: true });

  const filtered = automations.filter(a => {
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || (statusFilter === "active" ? a.active : !a.active);
    return matchSearch && matchStatus;
  });

  const openCreate = () => {
    setEditing(null);
    setForm({ name: "", trigger: "", actions: "", active: true });
    setModalOpen(true);
  };

  const openEdit = (a: Automation) => {
    setEditing(a);
    setForm({ name: a.name, trigger: a.trigger, actions: a.actions.join(", "), active: a.active });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) return;
    const actions = form.actions.split(",").map(s => s.trim()).filter(Boolean);
    if (editing) {
      setAutomations(prev => prev.map(a => a.id === editing.id ? { ...a, name: form.name, trigger: form.trigger, actions, active: form.active } : a));
    } else {
      setAutomations(prev => [...prev, { id: Date.now().toString(), name: form.name, trigger: form.trigger, actions, active: form.active }]);
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setAutomations(prev => prev.filter(a => a.id !== id));
  };

  const toggleStatus = (id: string) => {
    setAutomations(prev => prev.map(a => a.id === id ? { ...a, active: !a.active } : a));
  };

  return (
    <AppLayout>
      <div className="space-y-8 max-w-7xl mx-auto animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Central de Automações</h1>
            <p className="text-sm text-muted-foreground mt-1">Gerencie, monitore e otimize todos os fluxos automatizados da sua operação.</p>
          </div>
          <Button onClick={openCreate} className="gap-2">
            <Plus className="w-4 h-4" /> Criar Nova Automação
          </Button>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard title="Automações Ativas" value="12" change="+8% este mês" positive icon={Zap} color="blue" />
          <MetricCard title="Mensagens Enviadas" value="4.280" change="+12% esta semana" positive icon={Mail} color="teal" />
          <MetricCard title="Taxa Média de Resposta" value="46%" change="+3.2% crescimento" positive icon={MessageSquare} color="violet" />
          <MetricCard title="Conversões Geradas" value="389" change="+5.4% crescimento" positive icon={TrendingUp} color="emerald" />
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Buscar automação..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="active">Ativas</SelectItem>
              <SelectItem value="paused">Pausadas</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Modules */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Módulos de Automação</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {modules.map(m => (
              <div key={m.id} className="glass-card rounded-xl p-5 hover:shadow-lg transition-shadow space-y-3 cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-muted">
                    <m.icon className={`w-5 h-5 ${m.color}`} />
                  </div>
                  {m.pro && <ProBadge />}
                </div>
                <h3 className="font-semibold text-foreground text-sm">{m.name}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{m.desc}</p>
                <Badge variant={m.status === "Ativo" ? "default" : "secondary"} className="text-[10px]">
                  {m.status}{m.detail ? ` • ${m.detail}` : ""}
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Automations List */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Suas Automações</h2>
          <div className="glass-card rounded-xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Gatilho</TableHead>
                  <TableHead>Ações</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Opções</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(a => (
                  <TableRow key={a.id}>
                    <TableCell className="font-medium">{a.name}</TableCell>
                    <TableCell className="text-muted-foreground text-xs">{a.trigger}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {a.actions.map((act, i) => (
                          <Badge key={i} variant="outline" className="text-[10px]">{act}</Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Switch checked={a.active} onCheckedChange={() => toggleStatus(a.id)} />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(a)}>
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(a.id)}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">Nenhuma automação encontrada.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Atividade Recente</h2>
          <div className="glass-card rounded-xl overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Automação</TableHead>
                  <TableHead>Ação</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentActivity.map((r, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{r.automation}</TableCell>
                    <TableCell className="text-muted-foreground text-xs">{r.action}</TableCell>
                    <TableCell>
                      <Badge className={r.status === "Executado" ? "bg-success/15 text-success border-success/20" : "bg-warning/15 text-warning border-warning/20"} variant="outline">
                        {r.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs">{r.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Editar Automação" : "Criar Nova Automação"}</DialogTitle>
            <DialogDescription>Preencha os campos abaixo para configurar a automação.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Nome da Automação</Label>
              <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Ex: Follow-up Proposta" />
            </div>
            <div className="space-y-2">
              <Label>Gatilho (Trigger)</Label>
              <Select value={form.trigger} onValueChange={v => setForm(f => ({ ...f, trigger: v }))}>
                <SelectTrigger><SelectValue placeholder="Selecione o gatilho" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Lead sem resposta há 2 dias">Lead sem resposta há 2 dias</SelectItem>
                  <SelectItem value="Novo lead criado">Novo lead criado</SelectItem>
                  <SelectItem value="Lead inativo há 7 dias">Lead inativo há 7 dias</SelectItem>
                  <SelectItem value="Palavra-chave detectada">Palavra-chave detectada</SelectItem>
                  <SelectItem value="Mudança de etapa no funil">Mudança de etapa no funil</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Ações (separadas por vírgula)</Label>
              <Input value={form.actions} onChange={e => setForm(f => ({ ...f, actions: e.target.value }))} placeholder="Enviar mensagem, Notificar atendente" />
            </div>
            <div className="flex items-center justify-between">
              <Label>Status</Label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{form.active ? "Ativa" : "Pausada"}</span>
                <Switch checked={form.active} onCheckedChange={v => setForm(f => ({ ...f, active: v }))} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave}>{editing ? "Salvar" : "Criar"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
