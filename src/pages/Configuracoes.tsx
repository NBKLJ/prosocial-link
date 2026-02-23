import { AppLayout } from "@/components/AppLayout";
import { useState } from "react";
import {
  Smartphone,
  QrCode,
  CheckCircle2,
  XCircle,
  Tag,
  Plus,
  X,
  Crown,
  Users,
  Mail,
  Lock,
  Pencil,
  Trash2,
  CreditCard,
  Wifi,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getTagStore, setTagStore, tagColors, type TagItem } from "@/lib/tagStore";

type TabKey = "assinatura" | "conexoes" | "etiquetas" | "usuarios";

const tabs: { key: TabKey; label: string; icon: typeof CreditCard }[] = [
  { key: "assinatura", label: "Assinatura", icon: CreditCard },
  { key: "conexoes", label: "Conexões", icon: Wifi },
  { key: "etiquetas", label: "Etiquetas", icon: Tag },
  { key: "usuarios", label: "Usuários", icon: Users },
];

const conexoes = [
  { id: "1", number: "(11) 99999-1234", name: "Comercial 1", status: "connected" as const, lastSync: "Agora" },
  { id: "2", number: "(21) 98888-5678", name: "Suporte", status: "disconnected" as const, lastSync: "2h atrás" },
];

interface UserItem {
  id: string;
  name: string;
  email: string;
  setor: string;
  role: string;
  avatar: string;
}

const initialUsers: UserItem[] = [
  { id: "1", name: "Admin Principal", email: "admin@empresa.com", setor: "Gestão", role: "Administrador", avatar: "AP" },
  { id: "2", name: "Ana Paula", email: "ana@empresa.com", setor: "Suporte", role: "Atendente", avatar: "AP" },
  { id: "3", name: "Carlos Silva", email: "carlos@empresa.com", setor: "Vendas", role: "Atendente", avatar: "CS" },
];

const Configuracoes = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("assinatura");
  const [tags, setTagsState] = useState<TagItem[]>(getTagStore());
  const [newTag, setNewTag] = useState("");
  const [newColor, setNewColor] = useState(tagColors[0].value);
  const [users, setUsers] = useState<UserItem[]>(initialUsers);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [userForm, setUserForm] = useState({ name: "", email: "", password: "", setor: "", role: "Atendente" });

  const setTags = (updated: TagItem[]) => { setTagsState(updated); setTagStore(updated); };
  const addTag = () => {
    if (newTag.trim() && !tags.some((t) => t.name === newTag.trim())) {
      setTags([...tags, { name: newTag.trim(), color: newColor }]);
      setNewTag(""); setNewColor(tagColors[0].value);
    }
  };
  const removeTag = (name: string) => setTags(tags.filter((t) => t.name !== name));

  const openNewUser = () => { setEditingUser(null); setUserForm({ name: "", email: "", password: "", setor: "", role: "Atendente" }); setShowUserModal(true); };
  const openEditUser = (user: UserItem) => { setEditingUser(user); setUserForm({ name: user.name, email: user.email, password: "", setor: user.setor, role: user.role }); setShowUserModal(true); };
  const saveUser = () => {
    if (!userForm.name.trim() || !userForm.email.trim()) return;
    if (editingUser) {
      setUsers(users.map((u) => u.id === editingUser.id ? { ...u, name: userForm.name, email: userForm.email, setor: userForm.setor, role: userForm.role } : u));
    } else {
      setUsers([...users, { id: Date.now().toString(), name: userForm.name, email: userForm.email, setor: userForm.setor, role: userForm.role, avatar: userForm.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() }]);
    }
    setShowUserModal(false);
  };
  const removeUser = (id: string) => setUsers(users.filter((u) => u.id !== id));

  return (
    <AppLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Configurações</h1>
          <p className="text-muted-foreground mt-1">Gerencie sua conta, conexões, etiquetas e equipe</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-muted/50 p-1 rounded-xl">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all",
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
                    <h3 className="text-lg font-bold text-foreground">Plano Basic</h3>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-primary/10 text-primary">Ativo</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">Até 2 conexões • Disparos ilimitados • CRM básico</p>
                </div>
              </div>
              <button className="px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">Upgrade</button>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-4">
              {[
                { label: "Conexões", value: "2", desc: "números WhatsApp" },
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
                <div key={c.id} className="glass-card rounded-2xl p-0 overflow-hidden">
                  {/* Header com nome e status */}
                  <div className="flex items-center justify-between px-5 pt-5 pb-3">
                    <div className="flex items-center gap-2.5">
                      <h3 className="text-base font-bold text-foreground">{c.name}</h3>
                      {c.status === "connected" ? (
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                      ) : (
                        <XCircle className="w-5 h-5 text-destructive" />
                      )}
                    </div>
                  </div>

                  {/* Número com ícone WhatsApp */}
                  <div className="px-5 pb-3">
                    <div className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2.5">
                      <Smartphone className="w-4 h-4 text-primary shrink-0" />
                      <span className="text-sm font-medium text-foreground tracking-wide overflow-hidden whitespace-nowrap">
                        <span className="inline-block animate-[marquee_8s_linear_infinite]">{c.number}</span>
                      </span>
                    </div>
                  </div>

                  {/* Status da conexão */}
                  <div className="px-5 pb-3">
                    <div className="flex items-center gap-2">
                      {c.status === "connected" ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-primary" />
                          <span className="text-sm font-medium text-primary">Conexão estabelecida!</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 text-destructive" />
                          <span className="text-sm font-medium text-destructive">Desconectado</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Botão conectar/desconectar */}
                  <div className="px-5 pb-3">
                    {c.status === "connected" ? (
                      <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-border text-sm font-semibold text-foreground hover:bg-muted transition-colors uppercase tracking-wider">
                        Desconectar
                      </button>
                    ) : (
                      <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">
                        <QrCode className="w-4 h-4" /> Conectar via QR Code
                      </button>
                    )}
                  </div>

                  {/* Última atualização */}
                  <div className="px-5 pb-5 pt-1">
                    <p className="text-xs text-muted-foreground text-center">Última atualização: {c.lastSync}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== ETIQUETAS ===== */}
        {activeTab === "etiquetas" && (
          <div className="glass-card rounded-xl p-5 space-y-4">
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span key={tag.name} className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full text-white" style={{ backgroundColor: tag.color }}>
                  {tag.name}
                  <button onClick={() => removeTag(tag.name)} className="hover:opacity-70 rounded-full p-0.5 transition-opacity"><X className="w-3 h-3" /></button>
                </span>
              ))}
            </div>
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
                    <button key={c.value} onClick={() => setNewColor(c.value)}
                      className={cn("w-7 h-7 rounded-full transition-all flex items-center justify-center", newColor === c.value ? "ring-2 ring-offset-2 ring-offset-card scale-110" : "hover:scale-110")}
                      style={{ backgroundColor: c.value }} title={c.name}>
                      {newColor === c.value && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                    </button>
                  ))}
                </div>
                {newTag.trim() && (
                  <span className="inline-flex items-center text-xs font-medium px-3 py-1 rounded-full text-white ml-2" style={{ backgroundColor: newColor }}>{newTag.trim()}</span>
                )}
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
                  <tr className="border-b border-border">
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
                          <div className="w-9 h-9 rounded-full gradient-green flex items-center justify-center text-xs font-bold text-primary-foreground">{user.avatar}</div>
                          <span className="text-sm font-medium text-foreground">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-muted-foreground">{user.email}</td>
                      <td className="px-5 py-4"><span className="text-xs font-medium px-2.5 py-1 rounded-full bg-muted text-muted-foreground">{user.setor}</span></td>
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

      {/* Modal Usuário */}
      {showUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-card rounded-2xl p-6 w-full max-w-md mx-4 shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">{editingUser ? "Editar Usuário" : "Novo Usuário"}</h2>
              <button onClick={() => setShowUserModal(false)} className="p-1 rounded-lg hover:bg-muted transition-colors"><X className="w-5 h-5 text-muted-foreground" /></button>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Nome completo</label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input type="text" value={userForm.name} onChange={(e) => setUserForm({ ...userForm, name: e.target.value })} placeholder="Nome do usuário"
                    className="w-full bg-muted/50 border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">E-mail</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input type="email" value={userForm.email} onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} placeholder="email@empresa.com"
                    className="w-full bg-muted/50 border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">{editingUser ? "Nova senha (deixe vazio para manter)" : "Senha"}</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input type="password" value={userForm.password} onChange={(e) => setUserForm({ ...userForm, password: e.target.value })} placeholder="••••••••"
                    className="w-full bg-muted/50 border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Setor</label>
                  <input type="text" value={userForm.setor} onChange={(e) => setUserForm({ ...userForm, setor: e.target.value })} placeholder="Ex: Vendas"
                    className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Função</label>
                  <select value={userForm.role} onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                    className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all">
                    <option value="Atendente">Atendente</option>
                    <option value="Administrador">Administrador</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <button onClick={() => setShowUserModal(false)} className="px-4 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted transition-colors">Cancelar</button>
              <button onClick={saveUser} className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                {editingUser ? "Salvar Alterações" : "Criar Usuário"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
};

export default Configuracoes;
