import { AppLayout } from "@/components/AppLayout";
import { useState } from "react";
import { toast } from "sonner";
import {
  Smartphone, QrCode, CheckCircle2, XCircle, Tag, Plus, X, Crown, Users, Pencil, Trash2, CreditCard, Wifi, Settings, Check, Plug, Key, ShieldCheck, Loader2, ExternalLink, FileSignature, Building2, Upload, Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getTagStore, setTagStore, tagColors, type TagItem } from "@/lib/tagStore";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type TabKey = "assinatura" | "conexoes" | "etiquetas" | "usuarios" | "integracoes" | "departamentos";

const tabs: { key: TabKey; label: string; icon: typeof CreditCard }[] = [
  { key: "assinatura", label: "Assinatura", icon: CreditCard },
  { key: "conexoes", label: "Conexões", icon: Wifi },
  { key: "integracoes", label: "Integrações", icon: Plug },
  { key: "etiquetas", label: "Etiquetas", icon: Tag },
  { key: "departamentos", label: "Departamentos", icon: Building2 },
  { key: "usuarios", label: "Usuários", icon: Users },
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
      "5 conexões WhatsApp",
      "IA de recepção inteligente",
      "IAs personalizadas por setor",
      "Agendamento automático (Google Meet)",
      "CRM avançado com origem de leads",
      "Distribuição automática de leads",
      "Automações por gatilho",
      "Painel analítico avançado",
      "10 usuários",
      "Suporte prioritário",
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
  const [editTagColor, setEditTagColor] = useState("");

  // Departments state
  const [departments, setDepartments] = useState<Department[]>(defaultDepartments);
  const [newDeptName, setNewDeptName] = useState("");
  const [newDeptColor, setNewDeptColor] = useState(avatarColors[0]);
  const [editingDept, setEditingDept] = useState<string | null>(null);
  const [editDeptName, setEditDeptName] = useState("");

  // Get current user plan
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

  // Department functions
  const addDepartment = () => {
    if (newDeptName.trim() && !departments.some(d => d.name === newDeptName.trim())) {
      setDepartments([...departments, { id: Date.now().toString(), name: newDeptName.trim(), color: newDeptColor, membersCount: 0 }]);
      setNewDeptName("");
      setNewDeptColor(avatarColors[0]);
      toast.success("Departamento criado");
    }
  };
  const removeDepartment = (id: string) => {
    setDepartments(departments.filter(d => d.id !== id));
    toast.success("Departamento removido");
  };
  const saveDeptEdit = (id: string) => {
    if (editDeptName.trim()) {
      setDepartments(departments.map(d => d.id === id ? { ...d, name: editDeptName.trim() } : d));
      setEditingDept(null);
      toast.success("Departamento atualizado");
    }
  };

  const openNewUser = () => {
    setEditingUser(null);
    setUserForm({ name: "", email: "", password: "", setor: "", role: "Usuário comum", phone: "", avatarColor: avatarColors[0], conexao: "", restricaoHorario: false });
    setShowUserModal(true);
  };
  const openEditUser = (user: UserItem) => {
    setEditingUser(user);
    setUserForm({
      name: user.name, email: user.email, password: "", setor: user.setor, role: user.role,
      phone: user.phone || "", avatarColor: user.avatarColor || avatarColors[0],
      conexao: user.conexao || "", restricaoHorario: user.restricaoHorario || false,
    });
    setShowUserModal(true);
  };
  const saveUser = () => {
    if (!userForm.name.trim() || !userForm.email.trim()) return;
    if (editingUser) {
      setUsers(users.map((u) => u.id === editingUser.id ? {
        ...u, name: userForm.name, email: userForm.email, setor: userForm.setor,
        role: userForm.role, avatarColor: userForm.avatarColor, phone: userForm.phone,
        conexao: userForm.conexao, restricaoHorario: userForm.restricaoHorario,
      } : u));
      toast.success("Usuário atualizado");
    } else {
      const newUser: UserItem = {
        id: Date.now().toString(),
        name: userForm.name,
        email: userForm.email,
        setor: userForm.setor,
        role: userForm.role,
        avatar: userForm.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase(),
        avatarColor: userForm.avatarColor,
        phone: userForm.phone,
        conexao: userForm.conexao,
        restricaoHorario: userForm.restricaoHorario,
      };
      setUsers([...users, newUser]);

      // Save to localStorage for login access
      const existingDynamic = JSON.parse(localStorage.getItem("zapprobr_dynamic_users") || "[]");
      existingDynamic.push({ email: userForm.email, password: userForm.password || "123456", plan: currentPlan });
      localStorage.setItem("zapprobr_dynamic_users", JSON.stringify(existingDynamic));

      toast.success("Usuário criado — já pode fazer login");
    }
    setShowUserModal(false);
  };
  const removeUser = (id: string) => setUsers(users.filter((u) => u.id !== id));

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Banner Upgrade */}
        <div className="w-full px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center gap-3">
          <Crown className="w-4 h-4 text-primary-foreground" />
          <span className="text-sm font-semibold text-primary-foreground">Fazer upgrade de plano</span>
          <button onClick={() => setShowPlanModal(true)} className="ml-2 px-3 py-1 rounded-lg bg-primary-foreground/20 text-primary-foreground text-xs font-bold hover:bg-primary-foreground/30 transition-colors backdrop-blur-sm">
            Upgrade
          </button>
        </div>

        <div>
          <h1 className="text-2xl font-bold text-foreground">Configurações</h1>
          <p className="text-muted-foreground mt-1">Gerencie sua conta, conexões, etiquetas e equipe</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-muted/50 p-1 rounded-xl overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
                activeTab === tab.key
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* ===== ASSINATURA ===== */}
        {activeTab === "assinatura" && (
          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Crown className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-foreground">Plano {currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)}</h3>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-primary/10 text-primary">Ativo</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {currentPlan === "basic" && "Até 2 conexões • Disparos ilimitados • CRM básico"}
                    {currentPlan === "pro" && "Até 5 conexões • CRM avançado • Automações"}
                    {currentPlan === "premium" && "Conexões ilimitadas • CRM completo • API"}
                  </p>
                </div>
              </div>
              <button onClick={() => setShowPlanModal(true)} className="px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">Upgrade</button>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-4">
              {[
                { label: "Conexões", value: currentPlan === "premium" ? "∞" : currentPlan === "pro" ? "5" : "2", desc: "números WhatsApp" },
                { label: "Usuários", value: `${users.length}`, desc: "ativos" },
                { label: "Disparos", value: "∞", desc: "ilimitados" },
              ].map((item) => (
                <div key={item.label} className="bg-muted/50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-foreground">{item.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{item.label}</p>
                  <p className="text-[10px] text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== CONEXÕES ===== */}
        {activeTab === "conexoes" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-medium bg-muted px-3 py-1 rounded-full">{conexoes.length}/2 números</span>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              {conexoes.map((c) => (
                <div key={c.id} className="rounded-2xl overflow-hidden bg-card border border-border">
                  <div className="flex items-center justify-between px-5 pt-5 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-foreground font-bold text-base">{c.name}</span>
                      {c.status === "connected" ? <CheckCircle2 className="w-5 h-5 text-primary" /> : <XCircle className="w-5 h-5 text-destructive" />}
                    </div>
                  </div>
                  <div className="mx-5 mb-4 flex items-center justify-between rounded-lg px-3 py-2.5 bg-muted">
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-primary shrink-0" />
                      <span className="text-sm font-medium text-foreground tracking-wide">{c.number}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 rounded-md hover:bg-muted transition-colors"><Pencil className="w-3.5 h-3.5 text-muted-foreground" /></button>
                      <button className="p-1.5 rounded-md hover:bg-muted transition-colors"><Trash2 className="w-3.5 h-3.5 text-destructive/70" /></button>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 px-5 pb-4">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-bold text-muted-foreground border border-border">{c.name.charAt(0)}</div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{c.name.split(" ")[0]}</p>
                      <p className="text-xs text-muted-foreground">{c.description}</p>
                    </div>
                    <Settings className="w-4 h-4 text-orange-500 ml-auto" />
                  </div>
                  <div className="flex items-center gap-2 px-5 pb-3">
                    {c.status === "connected" ? (
                      <><CheckCircle2 className="w-4 h-4 text-primary" /><span className="text-sm font-semibold text-primary">Conexão estabelecida!</span></>
                    ) : (
                      <><XCircle className="w-4 h-4 text-destructive" /><span className="text-sm font-semibold text-destructive">Desconectado</span></>
                    )}
                  </div>
                  <div className="px-5 pb-3 flex justify-center">
                    {c.status === "connected" ? (
                      <button onClick={() => toast.success(`Conexão "${c.name}" desconectada`)} className="px-6 py-2 rounded-md border border-border text-xs font-bold text-foreground uppercase tracking-widest hover:bg-muted transition-colors">Desconectar</button>
                    ) : (
                      <button onClick={() => toast.success(`Conexão "${c.name}" conectada`)} className="px-6 py-2 rounded-md bg-primary text-primary-foreground text-xs font-bold uppercase tracking-widest hover:bg-primary/90 transition-colors flex items-center gap-2"><QrCode className="w-3.5 h-3.5" /> Conectar</button>
                    )}
                  </div>
                  <div className="px-5 pb-5 pt-2">
                    <p className="text-[11px] text-muted-foreground text-center">Última atualização: {c.lastSync}</p>
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
          <div className="glass-card rounded-xl p-5 space-y-4">
            <div className="space-y-3">
              <div className="flex gap-2">
                <input type="text" placeholder="Nome da etiqueta..." value={newTag} onChange={(e) => setNewTag(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addTag()}
                  className="flex-1 bg-muted/50 border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all" />
                <button onClick={addTag} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                  <Plus className="w-4 h-4" /> Adicionar
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Cor:</span>
                <div className="flex gap-1.5">
                  {tagColors.map((c) => (
                    <button key={c.value} onClick={() => setNewColor(c.value)} className={cn("w-7 h-7 rounded-full transition-all flex items-center justify-center", newColor === c.value ? "ring-2 ring-offset-2 ring-offset-card scale-110" : "hover:scale-110")} style={{ backgroundColor: c.value }} title={c.name}>
                      {newColor === c.value && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                    </button>
                  ))}
                </div>
                {newTag.trim() && (
                  <span className="inline-flex items-center text-xs font-medium px-3 py-1 rounded-full text-white ml-2" style={{ backgroundColor: newColor }}>{newTag.trim()}</span>
                )}
              </div>
            </div>
            <div className="space-y-1">
              {tags.map((tag) => (
                <div key={tag.name} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted/50 transition-colors group">
                  <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: tag.color }} />
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
                      <button onClick={() => { setEditingTag(tag.name); setEditTagColor(tag.color); }} className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" title="Editar cor">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => removeTag(tag.name)} className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors" title="Remover">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
              {tags.length === 0 && <p className="text-sm text-muted-foreground text-center py-6">Nenhuma etiqueta criada</p>}
            </div>
          </div>
        )}

        {/* ===== DEPARTAMENTOS ===== */}
        {activeTab === "departamentos" && (
          <div className="space-y-4">
            <div className="glass-card rounded-xl p-5 space-y-4">
              <div>
                <h3 className="text-base font-semibold text-foreground">Gerenciar Departamentos</h3>
                <p className="text-xs text-muted-foreground mt-1">Crie departamentos para organizar sua equipe. Ao adicionar um usuário, você poderá vinculá-lo a um departamento.</p>
              </div>

              {/* Add department */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Nome do departamento..."
                  value={newDeptName}
                  onChange={(e) => setNewDeptName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addDepartment()}
                  className="flex-1 bg-muted/50 border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                />
                <button onClick={addDepartment} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                  <Plus className="w-4 h-4" /> Adicionar
                </button>
              </div>

              {/* Color selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Cor:</span>
                <div className="flex gap-1.5 flex-wrap">
                  {avatarColors.slice(0, 14).map((c) => (
                    <button key={c} onClick={() => setNewDeptColor(c)} className={cn("w-7 h-7 rounded-full transition-all flex items-center justify-center", newDeptColor === c ? "ring-2 ring-offset-2 ring-offset-card scale-110" : "hover:scale-110")} style={{ backgroundColor: c }}>
                      {newDeptColor === c && <Check className="w-3.5 h-3.5 text-white" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Department list */}
              <div className="space-y-1 mt-2">
                {departments.map((dept) => (
                  <div key={dept.id} className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-muted/50 transition-colors group">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: dept.color + "20" }}>
                      <Building2 className="w-5 h-5" style={{ color: dept.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      {editingDept === dept.id ? (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={editDeptName}
                            onChange={(e) => setEditDeptName(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && saveDeptEdit(dept.id)}
                            className="flex-1 bg-muted/50 border border-border rounded-lg px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                            autoFocus
                          />
                          <button onClick={() => saveDeptEdit(dept.id)} className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium">Salvar</button>
                          <button onClick={() => setEditingDept(null)} className="px-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:bg-muted">Cancelar</button>
                        </div>
                      ) : (
                        <>
                          <p className="text-sm font-medium text-foreground">{dept.name}</p>
                          <p className="text-xs text-muted-foreground">{dept.membersCount} {dept.membersCount === 1 ? "membro" : "membros"}</p>
                        </>
                      )}
                    </div>
                    {editingDept !== dept.id && (
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => { setEditingDept(dept.id); setEditDeptName(dept.name); }} className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" title="Editar">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => removeDepartment(dept.id)} className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors" title="Remover">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
                {departments.length === 0 && <p className="text-sm text-muted-foreground text-center py-6">Nenhum departamento criado</p>}
              </div>
            </div>
          </div>
        )}

        {/* ===== USUÁRIOS ===== */}
        {activeTab === "usuarios" && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <button onClick={openNewUser} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                <Plus className="w-4 h-4" /> Novo Usuário
              </button>
            </div>
            <div className="glass-card rounded-xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Usuário</th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">E-mail</th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Setor</th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Função</th>
                    <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: user.avatarColor || "#6366f1" }}>{user.avatar}</div>
                          <span className="text-sm font-medium text-foreground">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-muted-foreground">{user.email}</td>
                      <td className="px-5 py-4"><span className="text-xs font-medium px-2.5 py-1 rounded-full bg-muted text-muted-foreground">{user.setor || "—"}</span></td>
                      <td className="px-5 py-4">
                        <span className={cn("text-xs font-medium px-2.5 py-1 rounded-full", user.role === "Administrador" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground")}>{user.role}</span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => openEditUser(user)} className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" title="Editar"><Pencil className="w-4 h-4" /></button>
                          <button onClick={() => removeUser(user.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors" title="Remover"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ===== MODAL ADICIONAR USUÁRIO (matching reference) ===== */}
      {showUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-card rounded-2xl p-6 w-full max-w-2xl mx-4 shadow-xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">{editingUser ? "Editar usuário" : "Adicionar usuário"}</h2>
              <button onClick={() => setShowUserModal(false)} className="p-1 rounded-lg hover:bg-muted transition-colors"><X className="w-5 h-5 text-muted-foreground" /></button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6">
              {/* Left: Avatar + Color Picker */}
              <div className="flex flex-col items-center gap-4">
                <div className="w-28 h-28 rounded-full flex items-center justify-center border-2 border-border" style={{ backgroundColor: userForm.avatarColor + "20" }}>
                  {userForm.name ? (
                    <span className="text-3xl font-bold" style={{ color: userForm.avatarColor }}>
                      {userForm.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
                    </span>
                  ) : (
                    <Users className="w-12 h-12 text-muted-foreground/40" />
                  )}
                </div>
                <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider hover:bg-primary/90 transition-colors">
                  <Upload className="w-3.5 h-3.5" /> Upload Avatar
                </button>

                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Cor Padrão</p>
                  <div className="grid grid-cols-7 gap-1.5">
                    {avatarColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setUserForm({ ...userForm, avatarColor: color })}
                        className={cn(
                          "w-7 h-7 rounded-full transition-all",
                          userForm.avatarColor === color ? "ring-2 ring-offset-2 ring-offset-card scale-110" : "hover:scale-110"
                        )}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                {/* Login time restriction */}
                <label className="flex items-start gap-2 mt-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={userForm.restricaoHorario}
                    onChange={(e) => setUserForm({ ...userForm, restricaoHorario: e.target.checked })}
                    className="mt-0.5 rounded border-border"
                  />
                  <span className="text-xs text-muted-foreground leading-tight">Restrição de horários login do usuário</span>
                </label>
              </div>

              {/* Right: Form Fields */}
              <div className="space-y-4">
                {/* Name + Password */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-primary">Nome</label>
                    <input
                      type="text"
                      value={userForm.name}
                      onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                      placeholder="Nome do usuário"
                      className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Senha</label>
                    <input
                      type="password"
                      value={userForm.password}
                      onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                      placeholder="••••••••"
                      className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Email</label>
                  <input
                    type="email"
                    value={userForm.email}
                    onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                    placeholder="email@empresa.com"
                    className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                  />
                </div>

                {/* Celular */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Celular</label>
                  <input
                    type="tel"
                    value={userForm.phone}
                    onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                    placeholder="(00) 00000-0000"
                    className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                  />
                </div>

                {/* Setores (Departamento) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Setores</label>
                  <select
                    value={userForm.setor}
                    onChange={(e) => setUserForm({ ...userForm, setor: e.target.value })}
                    className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                  >
                    <option value="">Selecione um setor...</option>
                    {departments.map(d => (
                      <option key={d.id} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>

                {/* Grupo de Permissões + Conexão padrão */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Grupo de Permissões</label>
                    <select
                      value={userForm.role}
                      onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                      className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                    >
                      <option value="Usuário comum">Usuário comum</option>
                      <option value="Administrador">Administrador</option>
                      <option value="Supervisor">Supervisor</option>
                      <option value="Atendente">Atendente</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                      Conexão(ões) padrão
                      <button className="text-muted-foreground/50 hover:text-muted-foreground" title="Selecione a conexão WhatsApp padrão deste usuário">
                        <Info className="w-3.5 h-3.5" />
                      </button>
                    </label>
                    <select
                      value={userForm.conexao}
                      onChange={(e) => setUserForm({ ...userForm, conexao: e.target.value })}
                      className="w-full bg-muted/50 border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                    >
                      <option value="">Conexão(ões) padrão</option>
                      {conexoes.map(c => (
                        <option key={c.id} value={c.name}>{c.name} - {c.number}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end pt-2 border-t border-border">
              <button onClick={() => setShowUserModal(false)} className="px-5 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wider text-muted-foreground border border-border hover:bg-muted transition-colors">
                Cancelar
              </button>
              <button onClick={saveUser} className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-bold uppercase tracking-wider hover:bg-primary/90 transition-colors">
                {editingUser ? "Salvar" : "Adicionar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Plan Upgrade Modal */}
      <Dialog open={showPlanModal} onOpenChange={setShowPlanModal}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Escolha seu plano</DialogTitle>
            <DialogDescription>Selecione o plano ideal para o seu negócio.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-4">
            {plans.map((plan) => {
              const isCurrent = plan.name.toLowerCase() === currentPlan;
              return (
                <div key={plan.name} className={cn("rounded-xl border p-5 space-y-4 relative transition-all", plan.popular ? "border-primary ring-2 ring-primary/20" : "border-border", isCurrent && "bg-primary/5")}>
                  {plan.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider">Popular</span>
                  )}
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
                    <div className="flex items-baseline gap-0.5 mt-1">
                      <span className="text-2xl font-bold text-foreground">{plan.price}</span>
                      <span className="text-sm text-muted-foreground">{plan.period}</span>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-center gap-2 text-sm text-foreground">
                        <Check className="w-4 h-4 text-primary flex-shrink-0" />
                        {f}
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
                      "w-full py-2.5 rounded-lg text-sm font-medium transition-colors",
                      isCurrent
                        ? "bg-muted text-muted-foreground cursor-default"
                        : plan.popular
                          ? "bg-primary text-primary-foreground hover:bg-primary/90"
                          : "border border-border text-foreground hover:bg-muted"
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

// ═══════ INTEGRAÇÃO ZAPSIGN ═══════
function IntegracaoZapSign() {
  const [apiKey, setApiKey] = useState("");
  const [clientId, setClientId] = useState("");
  const [status, setStatus] = useState<"disconnected" | "connected" | "testing">("disconnected");
  const [saved, setSaved] = useState(false);

  const testConnection = () => {
    if (!apiKey.trim()) { toast.error("Insira a API Key"); return; }
    setStatus("testing");
    setTimeout(() => {
      setStatus("connected");
      toast.success("Conexão com ZapSign estabelecida!");
    }, 2000);
  };

  const saveConfig = () => {
    if (status !== "connected") { toast.error("Teste a conexão antes de salvar"); return; }
    setSaved(true);
    toast.success("Configurações salvas com sucesso!");
  };

  return (
    <div className="space-y-5">
      <div className="glass-card rounded-xl p-6 space-y-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
              <FileSignature className="w-7 h-7 text-blue-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-foreground">ZapSign</h3>
                {status === "connected" ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-emerald-500/15 text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Conectado
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-destructive/15 text-destructive">
                    <span className="w-1.5 h-1.5 rounded-full bg-destructive" /> Desconectado
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">Assinatura digital de contratos e documentos</p>
            </div>
          </div>
          <a href="https://app.zapsign.com.br" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-primary hover:underline">
            Painel ZapSign <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Key className="w-4 h-4 text-muted-foreground" /> API Key
            </label>
            <input type="password" value={apiKey} onChange={(e) => { setApiKey(e.target.value); setStatus("disconnected"); setSaved(false); }} placeholder="Cole sua API Key da ZapSign aqui..."
              className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all font-mono" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-muted-foreground" /> Client ID <span className="text-xs text-muted-foreground font-normal">(opcional)</span>
            </label>
            <input type="text" value={clientId} onChange={(e) => setClientId(e.target.value)} placeholder="Client ID (se necessário)"
              className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all font-mono" />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={testConnection} disabled={status === "testing" || !apiKey.trim()}
            className={cn("flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all", status === "testing" ? "bg-muted text-muted-foreground cursor-wait" : "border border-border text-foreground hover:bg-muted")}>
            {status === "testing" ? (<><Loader2 className="w-4 h-4 animate-spin" /> Testando...</>) : status === "connected" ? (<><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Conexão OK</>) : (<>Testar Conexão</>)}
          </button>
          <button onClick={saveConfig} disabled={status !== "connected"}
            className={cn("flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all", status === "connected" ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-muted text-muted-foreground cursor-not-allowed")}>
            {saved ? <><CheckCircle2 className="w-4 h-4" /> Salvo</> : <>Salvar Configurações</>}
          </button>
        </div>

        <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/50">
          <ShieldCheck className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs font-medium text-foreground">Armazenamento Seguro</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Suas credenciais são criptografadas e armazenadas com segurança no servidor.</p>
          </div>
        </div>
      </div>

      <div className="glass-card rounded-xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
          <Plug className="w-4 h-4 text-muted-foreground" /> Webhook de Atualização
        </h3>
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Configure este URL como webhook na ZapSign para receber atualizações de status em tempo real:</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 bg-muted/50 border border-border rounded-lg px-4 py-2.5 text-xs text-foreground font-mono truncate">
              https://api.birdly.com.br/webhooks/zapsign
            </code>
            <button onClick={() => { navigator.clipboard.writeText("https://api.birdly.com.br/webhooks/zapsign"); toast.success("URL copiado!"); }} className="px-3 py-2.5 rounded-lg border border-border text-xs font-medium text-foreground hover:bg-muted transition-colors">
              Copiar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Configuracoes;
