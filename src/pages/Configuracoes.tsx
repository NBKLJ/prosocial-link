import { AppLayout } from "@/components/AppLayout";
import { useState } from "react";
import { toast } from "sonner";
import {
  Smartphone, QrCode, CheckCircle2, XCircle, Tag, Plus, X, Crown, Users, Pencil, Trash2,
  CreditCard, Wifi, Check, Plug, Key, ShieldCheck, Loader2, ExternalLink,
  FileSignature, Building2, Upload, Info, ChevronRight, Shield, Zap, Globe,
  BarChart3, UserPlus, Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getTagStore, setTagStore, tagColors, type TagItem } from "@/lib/tagStore";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

type TabKey = "assinatura" | "conexoes" | "etiquetas" | "usuarios" | "integracoes" | "departamentos";

const tabs: { key: TabKey; label: string; icon: typeof CreditCard; desc: string }[] = [
  { key: "assinatura", label: "Assinatura", icon: CreditCard, desc: "Plano e faturamento" },
  { key: "conexoes", label: "Conexões", icon: Wifi, desc: "WhatsApp e canais" },
  { key: "integracoes", label: "Integrações", icon: Plug, desc: "APIs e serviços externos" },
  { key: "etiquetas", label: "Etiquetas", icon: Tag, desc: "Categorias e tags" },
  { key: "departamentos", label: "Departamentos", icon: Building2, desc: "Setores da equipe" },
  { key: "usuarios", label: "Usuários", icon: Users, desc: "Membros e permissões" },
];

const conexoes = [
  { id: "1", number: "BR 6699665813", name: "Comercial", description: "Serviços Comerciais...", status: "connected" as const, lastSync: "19/02/26 11:44" },
  { id: "2", number: "BR 2188885678", name: "Suporte", description: "Atendimento ao cliente...", status: "disconnected" as const, lastSync: "18/02/26 09:30" },
];

interface Department {
  id: string;
  name: string;
  color: string;
  membersCount: number;
}

const defaultDepartments: Department[] = [
  { id: "1", name: "Gestão", color: "#6366f1", membersCount: 1 },
  { id: "2", name: "Suporte", color: "#f59e0b", membersCount: 1 },
  { id: "3", name: "Vendas", color: "#10b981", membersCount: 1 },
  { id: "4", name: "Financeiro", color: "#ef4444", membersCount: 0 },
  { id: "5", name: "Jurídico", color: "#8b5cf6", membersCount: 0 },
];

const avatarColors = [
  "#ef4444", "#f87171", "#a855f7", "#7c3aed", "#6366f1",
  "#3b82f6", "#06b6d4", "#22d3ee", "#14b8a6", "#10b981",
  "#22c55e", "#84cc16", "#eab308", "#f59e0b",
  "#f97316", "#fb923c", "#78716c", "#6b7280",
];

interface UserItem {
  id: string;
  name: string;
  email: string;
  setor: string;
  role: string;
  avatar: string;
  avatarColor?: string;
  phone?: string;
  conexao?: string;
  restricaoHorario?: boolean;
}

const initialUsers: UserItem[] = [
  { id: "1", name: "Admin Principal", email: "admin@empresa.com", setor: "Gestão", role: "Administrador", avatar: "AP", avatarColor: "#6366f1" },
  { id: "2", name: "Ana Paula", email: "ana@empresa.com", setor: "Suporte", role: "Atendente", avatar: "AP", avatarColor: "#f59e0b" },
  { id: "3", name: "Carlos Silva", email: "carlos@empresa.com", setor: "Vendas", role: "Atendente", avatar: "CS", avatarColor: "#10b981" },
];

const plans = [
  {
    name: "Basic",
    price: "R$ 97",
    period: "/mês",
    features: ["2 conexões WhatsApp", "Disparos ilimitados", "CRM básico", "3 usuários", "Suporte por email"],
    current: true,
  },
  {
    name: "Pro",
    price: "R$ 197",
    period: "/mês",
    features: [
      "5 conexões WhatsApp", "IA de recepção inteligente", "IAs personalizadas por setor",
      "Agendamento automático (Google Meet)", "CRM avançado com origem de leads",
      "Distribuição automática de leads", "Automações por gatilho",
      "Painel analítico avançado", "10 usuários", "Suporte prioritário",
    ],
    popular: true,
  },
  {
    name: "Premium",
    price: "R$ 397",
    period: "/mês",
    features: ["Conexões ilimitadas", "Disparos ilimitados", "CRM completo", "Usuários ilimitados", "Automações completas", "API integrada", "Suporte 24/7"],
  },
];

/* ─── Shared input classes ─── */
const inputCls = "w-full bg-muted/40 border border-border/60 rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all";
const selectCls = inputCls;

const Configuracoes = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("assinatura");
  const [tags, setTagsState] = useState<TagItem[]>(getTagStore());
  const [newTag, setNewTag] = useState("");
  const [newColor, setNewColor] = useState(tagColors[0].value);
  const [users, setUsers] = useState<UserItem[]>(initialUsers);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [userForm, setUserForm] = useState({
    name: "", email: "", password: "", setor: "", role: "Usuário comum",
    phone: "", avatarColor: avatarColors[0], conexao: "", restricaoHorario: false,
  });
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [editingTag, setEditingTag] = useState<string | null>(null);
  const [_editTagColor, setEditTagColor] = useState("");
  const [departments, setDepartments] = useState<Department[]>(defaultDepartments);
  const [newDeptName, setNewDeptName] = useState("");
  const [newDeptColor, setNewDeptColor] = useState(avatarColors[0]);
  const [editingDept, setEditingDept] = useState<string | null>(null);
  const [editDeptName, setEditDeptName] = useState("");
  const [userSearch, setUserSearch] = useState("");

  const userDataStr = localStorage.getItem("zapprobr_user");
  const currentPlan = userDataStr ? JSON.parse(userDataStr).plan || "basic" : "basic";

  const setTags = (updated: TagItem[]) => { setTagsState(updated); setTagStore(updated); };
  const addTag = () => {
    if (newTag.trim() && !tags.some((t) => t.name === newTag.trim())) {
      setTags([...tags, { name: newTag.trim(), color: newColor }]);
      setNewTag(""); setNewColor(tagColors[0].value);
    }
  };
  const removeTag = (name: string) => setTags(tags.filter((t) => t.name !== name));
  const updateTagColor = (name: string, color: string) => {
    setTags(tags.map(t => t.name === name ? { ...t, color } : t));
    setEditingTag(null);
  };

  const addDepartment = () => {
    if (newDeptName.trim() && !departments.some(d => d.name === newDeptName.trim())) {
      setDepartments([...departments, { id: Date.now().toString(), name: newDeptName.trim(), color: newDeptColor, membersCount: 0 }]);
      setNewDeptName(""); setNewDeptColor(avatarColors[0]);
      toast.success("Departamento criado");
    }
  };
  const removeDepartment = (id: string) => { setDepartments(departments.filter(d => d.id !== id)); toast.success("Departamento removido"); };
  const saveDeptEdit = (id: string) => {
    if (editDeptName.trim()) {
      setDepartments(departments.map(d => d.id === id ? { ...d, name: editDeptName.trim() } : d));
      setEditingDept(null); toast.success("Departamento atualizado");
    }
  };

  const openNewUser = () => {
    setEditingUser(null);
    setUserForm({ name: "", email: "", password: "", setor: "", role: "Usuário comum", phone: "", avatarColor: avatarColors[0], conexao: "", restricaoHorario: false });
    setShowUserModal(true);
  };
  const openEditUser = (user: UserItem) => {
    setEditingUser(user);
    setUserForm({ name: user.name, email: user.email, password: "", setor: user.setor, role: user.role, phone: user.phone || "", avatarColor: user.avatarColor || avatarColors[0], conexao: user.conexao || "", restricaoHorario: user.restricaoHorario || false });
    setShowUserModal(true);
  };
  const saveUser = () => {
    if (!userForm.name.trim() || !userForm.email.trim()) return;
    if (editingUser) {
      setUsers(users.map((u) => u.id === editingUser.id ? { ...u, name: userForm.name, email: userForm.email, setor: userForm.setor, role: userForm.role, avatarColor: userForm.avatarColor, phone: userForm.phone, conexao: userForm.conexao, restricaoHorario: userForm.restricaoHorario } : u));
      toast.success("Usuário atualizado");
    } else {
      const newUser: UserItem = {
        id: Date.now().toString(), name: userForm.name, email: userForm.email, setor: userForm.setor,
        role: userForm.role, avatar: userForm.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase(),
        avatarColor: userForm.avatarColor, phone: userForm.phone, conexao: userForm.conexao, restricaoHorario: userForm.restricaoHorario,
      };
      setUsers([...users, newUser]);
      const existingDynamic = JSON.parse(localStorage.getItem("zapprobr_dynamic_users") || "[]");
      existingDynamic.push({ email: userForm.email, password: userForm.password || "123456", plan: currentPlan });
      localStorage.setItem("zapprobr_dynamic_users", JSON.stringify(existingDynamic));
      toast.success("Usuário criado — já pode fazer login");
    }
    setShowUserModal(false);
  };
  const removeUser = (id: string) => setUsers(users.filter((u) => u.id !== id));

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.setor.toLowerCase().includes(userSearch.toLowerCase())
  );

  const activeTabData = tabs.find(t => t.key === activeTab)!;

  return (
    <AppLayout>
      <div className="animate-fade-in">
        {/* Upgrade banner */}
        <div className="mb-6 rounded-2xl bg-gradient-to-r from-primary via-primary/90 to-primary/70 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-foreground/15 flex items-center justify-center backdrop-blur-sm">
              <Crown className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <p className="text-sm font-semibold text-primary-foreground">Desbloqueie todo o potencial do Birdly</p>
              <p className="text-xs text-primary-foreground/70">Faça upgrade e acesse recursos exclusivos</p>
            </div>
          </div>
          <button onClick={() => setShowPlanModal(true)} className="px-5 py-2 rounded-xl bg-primary-foreground text-primary text-sm font-bold hover:bg-primary-foreground/90 transition-colors shadow-lg">
            Fazer Upgrade
          </button>
        </div>

        {/* Layout: Sidebar + Content */}
        <div className="flex gap-6 min-h-[calc(100vh-200px)]">
          {/* Sidebar navigation */}
          <div className="w-64 flex-shrink-0">
            <div className="glass-card rounded-2xl p-3 sticky top-6">
              <div className="px-3 py-2 mb-1">
                <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">Configurações</h2>
              </div>
              <nav className="space-y-0.5">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all group",
                      activeTab === tab.key
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                      activeTab === tab.key ? "bg-primary/15" : "bg-muted/50 group-hover:bg-muted"
                    )}>
                      <tab.icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{tab.label}</p>
                      <p className={cn("text-[10px] truncate", activeTab === tab.key ? "text-primary/60" : "text-muted-foreground/50")}>{tab.desc}</p>
                    </div>
                    {activeTab === tab.key && <ChevronRight className="w-4 h-4 text-primary/50" />}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                {/* Section header */}
                <div className="mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <activeTabData.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h1 className="text-xl font-bold text-foreground">{activeTabData.label}</h1>
                      <p className="text-sm text-muted-foreground">{activeTabData.desc}</p>
                    </div>
                  </div>
                </div>

                {/* ===== ASSINATURA ===== */}
                {activeTab === "assinatura" && (
                  <div className="space-y-5">
                    {/* Current plan card */}
                    <div className="glass-card rounded-2xl p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                            <Crown className="w-8 h-8 text-primary" />
                          </div>
                          <div>
                            <div className="flex items-center gap-3">
                              <h3 className="text-xl font-bold text-foreground">Plano {currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)}</h3>
                              <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                                Ativo
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {currentPlan === "basic" && "Até 2 conexões • Disparos ilimitados • CRM básico"}
                              {currentPlan === "pro" && "Até 5 conexões • CRM avançado • Automações"}
                              {currentPlan === "premium" && "Conexões ilimitadas • CRM completo • API"}
                            </p>
                          </div>
                        </div>
                        <Button onClick={() => setShowPlanModal(true)} size="sm" className="rounded-xl">
                          Alterar Plano
                        </Button>
                      </div>
                    </div>

                    {/* Stats grid */}
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { label: "Conexões WhatsApp", value: currentPlan === "premium" ? "∞" : currentPlan === "pro" ? "5" : "2", icon: Wifi, color: "text-blue-500", bg: "bg-blue-500/10" },
                        { label: "Usuários Ativos", value: `${users.length}`, icon: Users, color: "text-violet-500", bg: "bg-violet-500/10" },
                        { label: "Disparos/mês", value: "∞", icon: Zap, color: "text-amber-500", bg: "bg-amber-500/10" },
                      ].map((item) => (
                        <div key={item.label} className="glass-card rounded-2xl p-5">
                          <div className="flex items-center gap-3 mb-3">
                            <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center", item.bg)}>
                              <item.icon className={cn("w-4.5 h-4.5", item.color)} />
                            </div>
                            <span className="text-xs font-medium text-muted-foreground">{item.label}</span>
                          </div>
                          <p className="text-3xl font-bold text-foreground">{item.value}</p>
                        </div>
                      ))}
                    </div>

                    {/* Billing info */}
                    <div className="glass-card rounded-2xl p-6">
                      <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-muted-foreground" />
                        Informações de Faturamento
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { label: "Próxima cobrança", value: "08/04/2026" },
                          { label: "Método de pagamento", value: "•••• 4242" },
                          { label: "Valor mensal", value: currentPlan === "basic" ? "R$ 97,00" : currentPlan === "pro" ? "R$ 197,00" : "R$ 397,00" },
                          { label: "Desconto ativo", value: "Nenhum" },
                        ].map(item => (
                          <div key={item.label} className="flex items-center justify-between py-3 px-4 rounded-xl bg-muted/30">
                            <span className="text-xs text-muted-foreground">{item.label}</span>
                            <span className="text-sm font-semibold text-foreground">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ===== CONEXÕES ===== */}
                {activeTab === "conexoes" && (
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-muted-foreground bg-muted/60 px-4 py-1.5 rounded-xl border border-border/40">
                        {conexoes.filter(c => c.status === "connected").length}/{conexoes.length} conectados
                      </span>
                      <Button size="sm" className="rounded-xl gap-2">
                        <Plus className="w-4 h-4" /> Nova Conexão
                      </Button>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      {conexoes.map((c) => (
                        <div key={c.id} className="glass-card rounded-2xl overflow-hidden group hover:shadow-md transition-shadow">
                          {/* Status indicator bar */}
                          <div className={cn("h-1", c.status === "connected" ? "bg-emerald-500" : "bg-destructive/60")} />

                          <div className="p-5 space-y-4">
                            {/* Header */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className={cn(
                                  "w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold text-primary-foreground",
                                  c.status === "connected" ? "bg-emerald-500" : "bg-muted"
                                )}>
                                  {c.status === "connected"
                                    ? <CheckCircle2 className="w-5 h-5 text-white" />
                                    : <XCircle className="w-5 h-5 text-muted-foreground" />
                                  }
                                </div>
                                <div>
                                  <h4 className="text-sm font-bold text-foreground">{c.name}</h4>
                                  <p className="text-[11px] text-muted-foreground">{c.description}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-1.5 rounded-lg hover:bg-muted transition-colors"><Pencil className="w-3.5 h-3.5 text-muted-foreground" /></button>
                                <button className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors"><Trash2 className="w-3.5 h-3.5 text-destructive/70" /></button>
                              </div>
                            </div>

                            {/* Number */}
                            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-muted/40 border border-border/30">
                              <Smartphone className="w-4 h-4 text-primary flex-shrink-0" />
                              <span className="text-sm font-mono font-medium text-foreground tracking-wider">{c.number}</span>
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-between">
                              <p className="text-[10px] text-muted-foreground">Atualizado: {c.lastSync}</p>
                              {c.status === "connected" ? (
                                <button onClick={() => toast.success(`Conexão "${c.name}" desconectada`)} className="px-4 py-2 rounded-xl border border-border text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                                  Desconectar
                                </button>
                              ) : (
                                <button onClick={() => toast.success(`Conexão "${c.name}" conectada`)} className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors flex items-center gap-1.5">
                                  <QrCode className="w-3.5 h-3.5" /> Conectar
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ===== INTEGRAÇÕES ===== */}
                {activeTab === "integracoes" && <IntegracaoZapSign />}

                {/* ===== ETIQUETAS ===== */}
                {activeTab === "etiquetas" && (
                  <div className="space-y-5">
                    {/* Create tag */}
                    <div className="glass-card rounded-2xl p-5 space-y-4">
                      <h3 className="text-sm font-semibold text-foreground">Nova Etiqueta</h3>
                      <div className="flex gap-3">
                        <input type="text" placeholder="Nome da etiqueta..." value={newTag} onChange={(e) => setNewTag(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addTag()} className={cn(inputCls, "flex-1")} />
                        <Button onClick={addTag} className="rounded-xl gap-2 px-5">
                          <Plus className="w-4 h-4" /> Criar
                        </Button>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground font-medium">Cor:</span>
                        <div className="flex gap-1.5 flex-wrap">
                          {tagColors.map((c) => (
                            <button key={c.value} onClick={() => setNewColor(c.value)} className={cn("w-7 h-7 rounded-full transition-all flex items-center justify-center", newColor === c.value ? "ring-2 ring-offset-2 ring-offset-card scale-110" : "hover:scale-110")} style={{ backgroundColor: c.value }} title={c.name}>
                              {newColor === c.value && <Check className="w-3 h-3 text-white" />}
                            </button>
                          ))}
                        </div>
                        {newTag.trim() && (
                          <span className="inline-flex items-center text-xs font-medium px-3 py-1 rounded-full text-white ml-1" style={{ backgroundColor: newColor }}>{newTag.trim()}</span>
                        )}
                      </div>
                    </div>

                    {/* Tag list */}
                    <div className="glass-card rounded-2xl divide-y divide-border/40">
                      <div className="px-5 py-3">
                        <p className="text-xs font-semibold text-muted-foreground">{tags.length} etiqueta{tags.length !== 1 ? "s" : ""}</p>
                      </div>
                      {tags.map((tag) => (
                        <div key={tag.name} className="flex items-center gap-3 px-5 py-3 hover:bg-muted/30 transition-colors group">
                          <div className="w-3.5 h-3.5 rounded-full flex-shrink-0" style={{ backgroundColor: tag.color }} />
                          <span className="text-sm font-medium text-foreground flex-1">{tag.name}</span>
                          {editingTag === tag.name ? (
                            <div className="flex gap-1">
                              {tagColors.map(c => (
                                <button key={c.value} onClick={() => updateTagColor(tag.name, c.value)} className="w-5 h-5 rounded-full hover:scale-110 transition-all" style={{ backgroundColor: c.value }}>
                                  {tag.color === c.value && <Check className="w-3 h-3 text-white mx-auto" />}
                                </button>
                              ))}
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => { setEditingTag(tag.name); setEditTagColor(tag.color); }} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                              <button onClick={() => removeTag(tag.name)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                            </div>
                          )}
                        </div>
                      ))}
                      {tags.length === 0 && <p className="text-sm text-muted-foreground text-center py-10">Nenhuma etiqueta criada</p>}
                    </div>
                  </div>
                )}

                {/* ===== DEPARTAMENTOS ===== */}
                {activeTab === "departamentos" && (
                  <div className="space-y-5">
                    {/* Create department */}
                    <div className="glass-card rounded-2xl p-5 space-y-4">
                      <div>
                        <h3 className="text-sm font-semibold text-foreground">Novo Departamento</h3>
                        <p className="text-xs text-muted-foreground mt-1">Crie departamentos para organizar sua equipe por setor</p>
                      </div>
                      <div className="flex gap-3">
                        <input type="text" placeholder="Nome do departamento..." value={newDeptName} onChange={(e) => setNewDeptName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addDepartment()} className={cn(inputCls, "flex-1")} />
                        <Button onClick={addDepartment} className="rounded-xl gap-2 px-5">
                          <Plus className="w-4 h-4" /> Criar
                        </Button>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground font-medium">Cor:</span>
                        <div className="flex gap-1.5 flex-wrap">
                          {avatarColors.slice(0, 14).map((c) => (
                            <button key={c} onClick={() => setNewDeptColor(c)} className={cn("w-7 h-7 rounded-full transition-all flex items-center justify-center", newDeptColor === c ? "ring-2 ring-offset-2 ring-offset-card scale-110" : "hover:scale-110")} style={{ backgroundColor: c }}>
                              {newDeptColor === c && <Check className="w-3 h-3 text-white" />}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Department list */}
                    <div className="glass-card rounded-2xl divide-y divide-border/40">
                      <div className="px-5 py-3">
                        <p className="text-xs font-semibold text-muted-foreground">{departments.length} departamento{departments.length !== 1 ? "s" : ""}</p>
                      </div>
                      {departments.map((dept) => (
                        <div key={dept.id} className="flex items-center gap-4 px-5 py-4 hover:bg-muted/30 transition-colors group">
                          <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: dept.color + "18" }}>
                            <Building2 className="w-5 h-5" style={{ color: dept.color }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            {editingDept === dept.id ? (
                              <div className="flex gap-2">
                                <input type="text" value={editDeptName} onChange={(e) => setEditDeptName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && saveDeptEdit(dept.id)} className={cn(inputCls, "flex-1 !py-1.5")} autoFocus />
                                <Button onClick={() => saveDeptEdit(dept.id)} size="sm" className="rounded-xl">Salvar</Button>
                                <Button variant="ghost" size="sm" onClick={() => setEditingDept(null)} className="rounded-xl">Cancelar</Button>
                              </div>
                            ) : (
                              <>
                                <p className="text-sm font-semibold text-foreground">{dept.name}</p>
                                <p className="text-xs text-muted-foreground">{dept.membersCount} {dept.membersCount === 1 ? "membro" : "membros"}</p>
                              </>
                            )}
                          </div>
                          {editingDept !== dept.id && (
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => { setEditingDept(dept.id); setEditDeptName(dept.name); }} className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                              <button onClick={() => removeDepartment(dept.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                            </div>
                          )}
                        </div>
                      ))}
                      {departments.length === 0 && <p className="text-sm text-muted-foreground text-center py-10">Nenhum departamento criado</p>}
                    </div>
                  </div>
                )}

                {/* ===== USUÁRIOS ===== */}
                {activeTab === "usuarios" && (
                  <div className="space-y-5">
                    {/* Toolbar */}
                    <div className="flex items-center justify-between gap-4">
                      <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                        <input type="text" placeholder="Buscar usuário..." value={userSearch} onChange={(e) => setUserSearch(e.target.value)} className={cn(inputCls, "pl-10")} />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-muted-foreground bg-muted/60 px-3 py-1.5 rounded-xl border border-border/40">
                          {users.length} usuário{users.length !== 1 ? "s" : ""}
                        </span>
                        <Button onClick={openNewUser} className="rounded-xl gap-2">
                          <UserPlus className="w-4 h-4" /> Novo Usuário
                        </Button>
                      </div>
                    </div>

                    {/* User cards grid */}
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {filteredUsers.map((user) => (
                        <div key={user.id} className="glass-card rounded-2xl p-5 hover:shadow-md transition-all group">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold text-white shadow-lg" style={{ backgroundColor: user.avatarColor || "#6366f1" }}>
                                {user.avatar}
                              </div>
                              <div>
                                <p className="text-sm font-bold text-foreground">{user.name}</p>
                                <p className="text-xs text-muted-foreground">{user.email}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => openEditUser(user)} className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"><Pencil className="w-3.5 h-3.5" /></button>
                              <button onClick={() => removeUser(user.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {user.setor && (
                              <span className="text-[10px] font-semibold px-2.5 py-1 rounded-lg bg-muted/60 text-muted-foreground border border-border/30">{user.setor}</span>
                            )}
                            <span className={cn(
                              "text-[10px] font-semibold px-2.5 py-1 rounded-lg",
                              user.role === "Administrador" ? "bg-primary/10 text-primary border border-primary/20" : "bg-muted/60 text-muted-foreground border border-border/30"
                            )}>
                              {user.role}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    {filteredUsers.length === 0 && (
                      <div className="glass-card rounded-2xl p-10 text-center">
                        <Users className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                        <p className="text-sm text-muted-foreground">Nenhum usuário encontrado</p>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ===== MODAL ADICIONAR/EDITAR USUÁRIO ===== */}
      <AnimatePresence>
        {showUserModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card rounded-2xl p-6 w-full max-w-2xl mx-4 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto border border-border/40"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                    <UserPlus className="w-4.5 h-4.5 text-primary" />
                  </div>
                  <h2 className="text-lg font-bold text-foreground">{editingUser ? "Editar Usuário" : "Novo Usuário"}</h2>
                </div>
                <button onClick={() => setShowUserModal(false)} className="p-2 rounded-xl hover:bg-muted transition-colors"><X className="w-5 h-5 text-muted-foreground" /></button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6">
                {/* Left: Avatar + Color Picker */}
                <div className="flex flex-col items-center gap-4 p-4 rounded-2xl bg-muted/20 border border-border/30">
                  <div className="w-24 h-24 rounded-2xl flex items-center justify-center border-2 border-border/40 shadow-inner" style={{ backgroundColor: userForm.avatarColor + "20" }}>
                    {userForm.name ? (
                      <span className="text-2xl font-bold" style={{ color: userForm.avatarColor }}>
                        {userForm.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
                      </span>
                    ) : (
                      <Users className="w-10 h-10 text-muted-foreground/30" />
                    )}
                  </div>
                  <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-muted/60 border border-border/40 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                    <Upload className="w-3.5 h-3.5" /> Upload
                  </button>
                  <div>
                    <p className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider mb-2 text-center">Cor do Avatar</p>
                    <div className="grid grid-cols-6 gap-1.5">
                      {avatarColors.map((color) => (
                        <button key={color} onClick={() => setUserForm({ ...userForm, avatarColor: color })} className={cn("w-6 h-6 rounded-full transition-all", userForm.avatarColor === color ? "ring-2 ring-offset-2 ring-offset-card scale-110" : "hover:scale-110")} style={{ backgroundColor: color }} />
                      ))}
                    </div>
                  </div>
                  <label className="flex items-start gap-2 cursor-pointer mt-1">
                    <input type="checkbox" checked={userForm.restricaoHorario} onChange={(e) => setUserForm({ ...userForm, restricaoHorario: e.target.checked })} className="mt-0.5 rounded border-border accent-primary" />
                    <span className="text-[11px] text-muted-foreground leading-tight">Restrição de horários de login</span>
                  </label>
                </div>

                {/* Right: Form */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-foreground">Nome</label>
                      <input type="text" value={userForm.name} onChange={(e) => setUserForm({ ...userForm, name: e.target.value })} placeholder="Nome completo" className={inputCls} />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Senha</label>
                      <input type="password" value={userForm.password} onChange={(e) => setUserForm({ ...userForm, password: e.target.value })} placeholder="••••••••" className={inputCls} />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Email</label>
                    <input type="email" value={userForm.email} onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} placeholder="email@empresa.com" className={inputCls} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Celular</label>
                    <input type="tel" value={userForm.phone} onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })} placeholder="(00) 00000-0000" className={inputCls} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Setor / Departamento</label>
                    <select value={userForm.setor} onChange={(e) => setUserForm({ ...userForm, setor: e.target.value })} className={selectCls}>
                      <option value="">Selecione um setor...</option>
                      {departments.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Grupo de Permissões</label>
                      <select value={userForm.role} onChange={(e) => setUserForm({ ...userForm, role: e.target.value })} className={selectCls}>
                        <option value="Usuário comum">Usuário comum</option>
                        <option value="Administrador">Administrador</option>
                        <option value="Supervisor">Supervisor</option>
                        <option value="Atendente">Atendente</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                        Conexão padrão
                        <Info className="w-3 h-3 text-muted-foreground/40" />
                      </label>
                      <select value={userForm.conexao} onChange={(e) => setUserForm({ ...userForm, conexao: e.target.value })} className={selectCls}>
                        <option value="">Selecione...</option>
                        {conexoes.map(c => <option key={c.id} value={c.name}>{c.name} - {c.number}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-3 border-t border-border/40">
                <Button variant="outline" onClick={() => setShowUserModal(false)} className="rounded-xl">Cancelar</Button>
                <Button onClick={saveUser} className="rounded-xl px-6">{editingUser ? "Salvar" : "Adicionar"}</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Plan Upgrade Modal */}
      <Dialog open={showPlanModal} onOpenChange={setShowPlanModal}>
        <DialogContent className="max-w-3xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl">Escolha seu plano</DialogTitle>
            <DialogDescription>Selecione o plano ideal para o seu negócio</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-4 mt-2">
            {plans.map((plan) => {
              const isCurrent = plan.name.toLowerCase() === currentPlan;
              return (
                <div key={plan.name} className={cn("rounded-2xl border p-5 space-y-4 relative transition-all", plan.popular ? "border-primary ring-2 ring-primary/20 shadow-lg" : "border-border", isCurrent && "bg-primary/5")}>
                  {plan.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest shadow-md">Popular</span>
                  )}
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
                    <div className="flex items-baseline gap-0.5 mt-1">
                      <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                      <span className="text-sm text-muted-foreground">{plan.period}</span>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                        <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => {
                      if (isCurrent) return;
                      const userData = JSON.parse(localStorage.getItem("zapprobr_user") || "{}");
                      userData.plan = plan.name.toLowerCase();
                      localStorage.setItem("zapprobr_user", JSON.stringify(userData));
                      toast.success(`Plano alterado para ${plan.name}`);
                      setShowPlanModal(false);
                      window.location.reload();
                    }}
                    className={cn(
                      "w-full py-2.5 rounded-xl text-sm font-semibold transition-colors",
                      isCurrent ? "bg-muted text-muted-foreground cursor-default" : plan.popular ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md" : "border border-border text-foreground hover:bg-muted"
                    )}
                  >
                    {isCurrent ? "Plano atual" : "Selecionar"}
                  </button>
                </div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

/* ═══════ INTEGRAÇÃO ZAPSIGN ═══════ */
function IntegracaoZapSign() {
  const [apiKey, setApiKey] = useState("");
  const [clientId, setClientId] = useState("");
  const [status, setStatus] = useState<"disconnected" | "connected" | "testing">("disconnected");
  const [saved, setSaved] = useState(false);

  const testConnection = () => {
    if (!apiKey.trim()) { toast.error("Insira a API Key"); return; }
    setStatus("testing");
    setTimeout(() => { setStatus("connected"); toast.success("Conexão com ZapSign estabelecida!"); }, 2000);
  };

  const saveConfig = () => {
    if (status !== "connected") { toast.error("Teste a conexão antes de salvar"); return; }
    setSaved(true); toast.success("Configurações salvas com sucesso!");
  };

  return (
    <div className="space-y-5">
      {/* ZapSign card */}
      <div className="glass-card rounded-2xl p-6 space-y-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/15 to-cyan-500/15 flex items-center justify-center border border-blue-500/10">
              <FileSignature className="w-7 h-7 text-blue-400" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="text-lg font-bold text-foreground">ZapSign</h3>
                {status === "connected" ? (
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Conectado
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-lg bg-destructive/10 text-destructive border border-destructive/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-destructive" /> Desconectado
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">Assinatura digital de contratos e documentos</p>
            </div>
          </div>
          <a href="https://app.zapsign.com.br" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-primary hover:underline font-medium">
            Painel ZapSign <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Key className="w-4 h-4 text-muted-foreground" /> API Key
            </label>
            <input type="password" value={apiKey} onChange={(e) => { setApiKey(e.target.value); setStatus("disconnected"); setSaved(false); }} placeholder="Cole sua API Key da ZapSign aqui..."
              className={cn(inputCls, "font-mono")} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-muted-foreground" /> Client ID <span className="text-xs text-muted-foreground font-normal">(opcional)</span>
            </label>
            <input type="text" value={clientId} onChange={(e) => setClientId(e.target.value)} placeholder="Client ID (se necessário)"
              className={cn(inputCls, "font-mono")} />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={testConnection} disabled={status === "testing" || !apiKey.trim()} className="rounded-xl gap-2">
            {status === "testing" ? (<><Loader2 className="w-4 h-4 animate-spin" /> Testando...</>) : status === "connected" ? (<><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Conexão OK</>) : (<>Testar Conexão</>)}
          </Button>
          <Button onClick={saveConfig} disabled={status !== "connected"} className="rounded-xl gap-2">
            {saved ? <><CheckCircle2 className="w-4 h-4" /> Salvo</> : <>Salvar Configurações</>}
          </Button>
        </div>

        <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/20 border border-border/30">
          <Shield className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-semibold text-foreground">Armazenamento Seguro</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Credenciais criptografadas e armazenadas com segurança no servidor.</p>
          </div>
        </div>
      </div>

      {/* Webhook card */}
      <div className="glass-card rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
          <Globe className="w-4 h-4 text-muted-foreground" /> Webhook de Atualização
        </h3>
        <p className="text-xs text-muted-foreground">Configure este URL como webhook na ZapSign para receber atualizações de status em tempo real:</p>
        <div className="flex items-center gap-2">
          <code className="flex-1 bg-muted/30 border border-border/40 rounded-xl px-4 py-3 text-xs text-foreground font-mono truncate">
            https://api.birdly.com.br/webhooks/zapsign
          </code>
          <Button variant="outline" size="sm" onClick={() => { navigator.clipboard.writeText("https://api.birdly.com.br/webhooks/zapsign"); toast.success("URL copiado!"); }} className="rounded-xl">
            Copiar
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Configuracoes;
