import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import {
  Search, Filter, ArrowUpDown, Plus, RefreshCcw, ChevronLeft, ChevronRight,
  ChevronsLeft, ChevronsRight, Copy, Tag, Users, Hash, Clock, UserCheck, CircleDot,
  FileText, MoreHorizontal, Eye, Pencil, Trash2, AlertTriangle
} from "lucide-react";
import { ProGate } from "@/components/ui/ProGate";

interface Processo {
  id: string;
  numero: string;
  etiquetas: string[];
  partes: string[];
  ultimaMovimentacao: string;
  responsaveis: string[];
  status: "em_andamento" | "arquivado" | "urgente" | "concluido" | "aguardando";
  descricao?: string;
  tipo?: string;
  createdAt: string;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  em_andamento: { label: "Em andamento", className: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
  arquivado: { label: "Arquivado", className: "bg-muted text-muted-foreground border-border" },
  urgente: { label: "Urgente", className: "bg-destructive/10 text-destructive border-destructive/20" },
  concluido: { label: "Concluído", className: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
  aguardando: { label: "Aguardando", className: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
};

const mockProcessos: Processo[] = [
  {
    id: "p1", numero: "0001234-56.2025.8.26.0100", etiquetas: ["Cível", "Prioritário"],
    partes: ["João Silva", "Empresa ABC Ltda"], ultimaMovimentacao: "03/03/2026",
    responsaveis: ["Dr. Carlos", "Ana Paula"], status: "em_andamento",
    descricao: "Ação de cobrança referente ao contrato nº 4521", tipo: "Cível", createdAt: "15/01/2026"
  },
  {
    id: "p2", numero: "0005678-90.2025.5.02.0001", etiquetas: ["Trabalhista"],
    partes: ["Maria Souza", "Tech Solutions S.A."], ultimaMovimentacao: "01/03/2026",
    responsaveis: ["Dr. Carlos"], status: "urgente",
    descricao: "Reclamação trabalhista - horas extras", tipo: "Trabalhista", createdAt: "20/02/2026"
  },
  {
    id: "p3", numero: "0009012-34.2024.8.13.0200", etiquetas: ["Família"],
    partes: ["Pedro Oliveira", "Clara Oliveira"], ultimaMovimentacao: "28/02/2026",
    responsaveis: ["Ana Paula"], status: "aguardando",
    descricao: "Divórcio consensual", tipo: "Família", createdAt: "10/12/2025"
  },
  {
    id: "p4", numero: "0003456-78.2024.8.26.0500", etiquetas: ["Cível", "Contrato"],
    partes: ["Empresa XYZ", "Fornecedora Beta"], ultimaMovimentacao: "25/02/2026",
    responsaveis: ["Dr. Carlos", "Marcos"], status: "concluido",
    descricao: "Rescisão contratual com indenização", tipo: "Cível", createdAt: "05/08/2025"
  },
  {
    id: "p5", numero: "0007890-12.2023.8.26.0100", etiquetas: ["Tributário"],
    partes: ["Indústria Alfa S.A."], ultimaMovimentacao: "20/02/2026",
    responsaveis: ["Ana Paula", "Marcos"], status: "em_andamento",
    descricao: "Mandado de segurança tributário", tipo: "Tributário", createdAt: "15/03/2025"
  },
];

const mockModelos = [
  { id: "m1", nome: "Petição Inicial - Cível", tipo: "Cível", atualizacao: "01/03/2026" },
  { id: "m2", nome: "Contestação Trabalhista", tipo: "Trabalhista", atualizacao: "28/02/2026" },
  { id: "m3", nome: "Recurso de Apelação", tipo: "Cível", atualizacao: "15/02/2026" },
];

export default function ProcessosAcompanhamento() {
  const [processos, setProcessos] = useState<Processo[]>(mockProcessos);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [tab, setTab] = useState("normal");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProcesso, setEditingProcesso] = useState<Processo | null>(null);
  const [detailProcesso, setDetailProcesso] = useState<Processo | null>(null);
  const [perPage, setPerPage] = useState("30");

  const [form, setForm] = useState({ numero: "", partes: "", etiquetas: "", responsaveis: "", status: "em_andamento", descricao: "", tipo: "" });

  const filtered = processos.filter((p) => {
    const matchSearch = p.numero.includes(search) || p.partes.some(pt => pt.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleAll = () => {
    setSelectedIds(prev => prev.length === filtered.length ? [] : filtered.map(p => p.id));
  };

  const openCreate = () => {
    setEditingProcesso(null);
    setForm({ numero: "", partes: "", etiquetas: "", responsaveis: "", status: "em_andamento", descricao: "", tipo: "" });
    setDialogOpen(true);
  };

  const openEdit = (p: Processo) => {
    setEditingProcesso(p);
    setForm({
      numero: p.numero, partes: p.partes.join(", "), etiquetas: p.etiquetas.join(", "),
      responsaveis: p.responsaveis.join(", "), status: p.status, descricao: p.descricao || "", tipo: p.tipo || ""
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.numero.trim()) return;
    const data: Processo = {
      id: editingProcesso?.id || `p-${Date.now()}`,
      numero: form.numero,
      partes: form.partes.split(",").map(s => s.trim()).filter(Boolean),
      etiquetas: form.etiquetas.split(",").map(s => s.trim()).filter(Boolean),
      responsaveis: form.responsaveis.split(",").map(s => s.trim()).filter(Boolean),
      status: form.status as Processo["status"],
      descricao: form.descricao,
      tipo: form.tipo,
      ultimaMovimentacao: new Date().toLocaleDateString("pt-BR"),
      createdAt: editingProcesso?.createdAt || new Date().toLocaleDateString("pt-BR"),
    };
    if (editingProcesso) {
      setProcessos(prev => prev.map(p => p.id === editingProcesso.id ? data : p));
    } else {
      setProcessos(prev => [...prev, data]);
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setProcessos(prev => prev.filter(p => p.id !== id));
  };

  return (
    <AppLayout>
      <ProGate title="Acompanhamento de Processos" description="Gerencie e acompanhe todos os seus processos em um só lugar.">
        <div className="space-y-6 max-w-7xl mx-auto animate-fade-in">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Processos</span>
            <span className="text-muted-foreground">›</span>
            <span className="font-medium text-foreground">Acompanhamento</span>
          </div>

          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Número do processo" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 w-[220px]" />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px]">
                  <Filter className="w-3.5 h-3.5 mr-1.5" />
                  <SelectValue placeholder="Filtrar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="em_andamento">Em andamento</SelectItem>
                  <SelectItem value="urgente">Urgente</SelectItem>
                  <SelectItem value="aguardando">Aguardando</SelectItem>
                  <SelectItem value="concluido">Concluído</SelectItem>
                  <SelectItem value="arquivado">Arquivado</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                <ArrowUpDown className="w-3.5 h-3.5" /> Última movimentação
              </Button>
            </div>
            <Button onClick={openCreate} className="gap-2">
              <Plus className="w-4 h-4" /> Adicionar processo
            </Button>
          </div>

          {/* Count */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{filtered.length} processos encontrados</span>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <RefreshCcw className="w-3.5 h-3.5" />
            </Button>
          </div>

          {/* Tabs */}
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList>
              <TabsTrigger value="normal" className="gap-1.5 text-xs">
                <CircleDot className="w-3.5 h-3.5" /> Normal
              </TabsTrigger>
              <TabsTrigger value="modelos" className="gap-1.5 text-xs">
                <FileText className="w-3.5 h-3.5" /> Modelos
              </TabsTrigger>
            </TabsList>

            <TabsContent value="normal">
              <div className="glass-card rounded-xl overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-10">
                        <Checkbox checked={selectedIds.length === filtered.length && filtered.length > 0} onCheckedChange={toggleAll} />
                      </TableHead>
                      <TableHead>Etiquetas</TableHead>
                      <TableHead>Partes</TableHead>
                      <TableHead>Número do Processo</TableHead>
                      <TableHead>Última Movimentação</TableHead>
                      <TableHead>Responsáveis</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((p) => (
                      <TableRow key={p.id} className="cursor-pointer hover:bg-muted/50" onClick={() => setDetailProcesso(p)}>
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <Checkbox checked={selectedIds.includes(p.id)} onCheckedChange={() => toggleSelect(p.id)} />
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {p.etiquetas.map((e, i) => (
                              <Badge key={i} variant="outline" className="text-[10px]">
                                <Tag className="w-2.5 h-2.5 mr-1" />{e}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                            <span className="text-xs">{p.partes.join(" vs ")}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-xs">{p.numero}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Clock className="w-3.5 h-3.5" /> {p.ultimaMovimentacao}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <UserCheck className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                            <span className="text-xs">{p.responsaveis.join(", ")}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`text-[10px] ${statusConfig[p.status]?.className}`}>
                            {statusConfig[p.status]?.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setDetailProcesso(p)}>
                              <Eye className="w-3.5 h-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(p)}>
                              <Pencil className="w-3.5 h-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => handleDelete(p.id)}>
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filtered.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center text-muted-foreground py-12">
                          Sem resultados.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="modelos">
              <div className="glass-card rounded-xl overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome do Modelo</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Última Atualização</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockModelos.map((m) => (
                      <TableRow key={m.id}>
                        <TableCell className="font-medium text-sm">{m.nome}</TableCell>
                        <TableCell><Badge variant="outline" className="text-[10px]">{m.tipo}</Badge></TableCell>
                        <TableCell className="text-xs text-muted-foreground">{m.atualizacao}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" className="h-7 w-7"><Copy className="w-3.5 h-3.5" /></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <Select value={perPage} onValueChange={setPerPage}>
              <SelectTrigger className="w-[160px] text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">Exibir 10 itens</SelectItem>
                <SelectItem value="30">Exibir 30 itens</SelectItem>
                <SelectItem value="50">Exibir 50 itens</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8"><ChevronsLeft className="w-4 h-4" /></Button>
              <Button variant="ghost" size="icon" className="h-8 w-8"><ChevronLeft className="w-4 h-4" /></Button>
              <Button variant="ghost" size="icon" className="h-8 w-8"><ChevronRight className="w-4 h-4" /></Button>
              <Button variant="ghost" size="icon" className="h-8 w-8"><ChevronsRight className="w-4 h-4" /></Button>
            </div>
          </div>
        </div>
      </ProGate>

      {/* Detail side panel */}
      {detailProcesso && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDetailProcesso(null)} />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative w-full max-w-lg bg-card border-l border-border shadow-2xl overflow-y-auto"
          >
            <div className="p-6 space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-bold text-foreground">Detalhes do Processo</h2>
                  <p className="text-xs font-mono text-muted-foreground mt-1">{detailProcesso.numero}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setDetailProcesso(null)}>✕</Button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-muted/50 space-y-1">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Status</span>
                    <Badge variant="outline" className={`text-[10px] ${statusConfig[detailProcesso.status]?.className}`}>
                      {statusConfig[detailProcesso.status]?.label}
                    </Badge>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50 space-y-1">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Tipo</span>
                    <p className="text-sm font-medium text-foreground">{detailProcesso.tipo || "—"}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50 space-y-1">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Criado em</span>
                    <p className="text-sm font-medium text-foreground">{detailProcesso.createdAt}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50 space-y-1">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Última Mov.</span>
                    <p className="text-sm font-medium text-foreground">{detailProcesso.ultimaMovimentacao}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">Partes</h3>
                  {detailProcesso.partes.map((p, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
                      <Users className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-sm">{p}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">Responsáveis</h3>
                  <div className="flex flex-wrap gap-2">
                    {detailProcesso.responsaveis.map((r, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">{r}</Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">Etiquetas</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {detailProcesso.etiquetas.map((e, i) => (
                      <Badge key={i} variant="outline" className="text-[10px]"><Tag className="w-2.5 h-2.5 mr-1" />{e}</Badge>
                    ))}
                  </div>
                </div>

                {detailProcesso.descricao && (
                  <div className="space-y-2">
                    <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">Descrição</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{detailProcesso.descricao}</p>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button size="sm" className="flex-1 gap-1.5" onClick={() => { openEdit(detailProcesso); setDetailProcesso(null); }}>
                  <Pencil className="w-3.5 h-3.5" /> Editar
                </Button>
                <Button size="sm" variant="destructive" className="gap-1.5" onClick={() => { handleDelete(detailProcesso.id); setDetailProcesso(null); }}>
                  <Trash2 className="w-3.5 h-3.5" /> Excluir
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingProcesso ? "Editar Processo" : "Adicionar Processo"}</DialogTitle>
            <DialogDescription>Preencha os dados do processo.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs">Número do Processo</Label>
              <Input value={form.numero} onChange={e => setForm(f => ({ ...f, numero: e.target.value }))} placeholder="0000000-00.0000.0.00.0000" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Tipo</Label>
                <Select value={form.tipo} onValueChange={v => setForm(f => ({ ...f, tipo: v }))}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cível">Cível</SelectItem>
                    <SelectItem value="Trabalhista">Trabalhista</SelectItem>
                    <SelectItem value="Família">Família</SelectItem>
                    <SelectItem value="Tributário">Tributário</SelectItem>
                    <SelectItem value="Criminal">Criminal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Status</Label>
                <Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="em_andamento">Em andamento</SelectItem>
                    <SelectItem value="urgente">Urgente</SelectItem>
                    <SelectItem value="aguardando">Aguardando</SelectItem>
                    <SelectItem value="concluido">Concluído</SelectItem>
                    <SelectItem value="arquivado">Arquivado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Partes (separadas por vírgula)</Label>
              <Input value={form.partes} onChange={e => setForm(f => ({ ...f, partes: e.target.value }))} placeholder="João Silva, Empresa ABC" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Etiquetas (separadas por vírgula)</Label>
              <Input value={form.etiquetas} onChange={e => setForm(f => ({ ...f, etiquetas: e.target.value }))} placeholder="Cível, Prioritário" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Responsáveis (separados por vírgula)</Label>
              <Input value={form.responsaveis} onChange={e => setForm(f => ({ ...f, responsaveis: e.target.value }))} placeholder="Dr. Carlos, Ana Paula" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Descrição</Label>
              <Textarea value={form.descricao} onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))} placeholder="Detalhes do processo..." className="resize-none min-h-[60px]" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} disabled={!form.numero.trim()}>{editingProcesso ? "Salvar" : "Adicionar"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
