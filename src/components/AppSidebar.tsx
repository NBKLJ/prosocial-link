import { useState } from "react";
import {
  MessageCircle, BarChart3, Megaphone, Users, Settings, Search, ChevronDown,
  Send, MessageSquarePlus, Mic, Clock, Bot, Brain, CalendarDays, MessageSquare,
  FileText, Briefcase, ListTodo, CalendarRange, UsersRound, Activity, DollarSign, PieChart,
  Scale, Layers, ClipboardList, FolderOpen, Receipt,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import logo from "@/assets/birdly-logo.png";
import { toast } from "sonner";

import { ProBadge } from "@/components/ui/ProBadge";

interface SubItem { title: string; url: string; icon: typeof Send; }
interface MenuItem { title: string; url: string; icon: typeof MessageCircle; count?: number; expandable?: boolean; subItems?: SubItem[]; proBadge?: boolean; }

const menuItems: MenuItem[] = [
  { title: "Relatórios", url: "/relatorios", icon: PieChart },
  { title: "Conversas", url: "/conversas", icon: MessageCircle, count: 6 },
  { title: "Grupos", url: "/grupos", icon: Users },
  { title: "CRM", url: "/crm", icon: BarChart3 },
  {
    title: "Disparos", url: "/disparos", icon: Megaphone, expandable: true,
    subItems: [
      { title: "Disparos", url: "/disparos", icon: Send },
      { title: "Recepção Automática", url: "/disparos/recepcao", icon: MessageSquarePlus },
      { title: "Mensagens Programadas", url: "/disparos/mensagens-programadas", icon: MessageSquare },
    ],
  },
  { title: "Contatos", url: "/contatos", icon: Users },
  { title: "Automações", url: "/automacoes", icon: Bot },
  {
    title: "Agenda", url: "/agenda", icon: CalendarDays, expandable: true,
    subItems: [
      { title: "Agenda", url: "/agenda", icon: CalendarRange },
      { title: "Agendamentos", url: "/agendamentos", icon: Clock },
      { title: "Configurações", url: "/agenda/configuracoes", icon: Settings },
    ],
  },
  { title: "IAs Setoriais", url: "/ias-setoriais", icon: Brain },
  {
    title: "Processos", url: "/processos/painel", icon: Scale, expandable: true,
    subItems: [
      { title: "Painel de Gestão", url: "/processos/painel", icon: Layers },
      { title: "Acompanhamento", url: "/processos/acompanhamento", icon: ClipboardList },
    ],
  },
  { title: "Contratos", url: "/contratos", icon: FileText },
  { title: "Financeiro", url: "/financeiro", icon: DollarSign },
  {
    title: "Gestão", url: "/gestao/tarefas", icon: Briefcase, expandable: true,
    subItems: [
      { title: "Tarefas", url: "/gestao/tarefas", icon: ListTodo },
      { title: "Calendários", url: "/gestao/calendarios", icon: CalendarRange },
      { title: "Usuários", url: "/gestao/usuarios", icon: UsersRound },
      { title: "Produtividade", url: "/gestao/produtividade", icon: Activity },
    ],
  },
];

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    menuItems.forEach((item) => {
      if (item.expandable && item.subItems) {
        const isOnSubRoute = item.subItems.some((sub) => location.pathname.startsWith(item.url));
        if (isOnSubRoute) initial[item.title] = true;
      }
    });
    return initial;
  });

  const filteredItems = menuItems.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleExpand = (title: string) => {
    setExpandedMenus((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const handleLogout = () => {
    localStorage.removeItem("zapprobr_auth");
    localStorage.removeItem("zapprobr_user");
    toast.success("Logout realizado");
    navigate("/login", { replace: true });
  };

  const userDataStr = localStorage.getItem("zapprobr_user");
  const userData = userDataStr ? JSON.parse(userDataStr) : { email: "usuario@email.com", plan: "basic" };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-[260px] flex flex-col bg-[hsl(var(--sidebar-background))] border-r border-[hsl(var(--sidebar-border))]">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 pt-6 pb-4">
        <img src={logo} alt="birdly" className="w-10 h-10 rounded-xl object-contain flex-shrink-0" />
        <div>
          <span className="text-base font-bold text-[hsl(var(--sidebar-accent-foreground))] tracking-tight block leading-tight">birdly</span>
          <span className="text-xs text-[hsl(var(--sidebar-foreground))]">WhatsApp Manager</span>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 pb-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--sidebar-foreground))]/60" />
          <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[hsl(var(--sidebar-accent))] border border-[hsl(var(--sidebar-border))] rounded-xl pl-9 pr-3 py-2.5 text-sm text-[hsl(var(--sidebar-accent-foreground))] placeholder:text-[hsl(var(--sidebar-foreground))]/50 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--sidebar-ring))]/20 focus:border-[hsl(var(--sidebar-ring))]/30 transition-all" />
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
        {filteredItems.map((item) => {
          const isActive = item.url === "/" ? location.pathname === "/" : location.pathname.startsWith(item.url);
          const isExpanded = expandedMenus[item.title];
          const hasSubItems = item.subItems && item.subItems.length > 0;

          return (
            <div key={item.title}>
              <div className="flex items-center">
                <NavLink to={item.url} end={item.url === "/"}
                  className={cn("flex-1 flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200", "text-[hsl(var(--sidebar-foreground))] hover:text-[hsl(var(--sidebar-accent-foreground))] hover:bg-[hsl(var(--sidebar-accent))]")}
                  activeClassName="bg-[hsl(var(--sidebar-primary))]/15 text-[hsl(var(--sidebar-primary))] !font-semibold"
                >
                  <item.icon className={cn("w-[22px] h-[22px] flex-shrink-0 stroke-[1.8]", isActive && "text-[hsl(var(--sidebar-primary))]")} />
                  <span className="flex-1">{item.title}</span>
                  {item.proBadge && <ProBadge />}
                  {item.count && (
                    <span className={cn("text-xs min-w-[22px] h-[22px] flex items-center justify-center rounded-md font-semibold", isActive ? "bg-[hsl(var(--sidebar-primary))]/20 text-[hsl(var(--sidebar-primary))]" : "bg-[hsl(var(--sidebar-muted))] text-[hsl(var(--sidebar-foreground))]")}>
                      {item.count}
                    </span>
                  )}
                </NavLink>
                {hasSubItems && (
                  <button onClick={(e) => { e.preventDefault(); toggleExpand(item.title); }} className="p-2 rounded-lg hover:bg-[hsl(var(--sidebar-accent))] transition-colors">
                    <ChevronDown className={cn("w-4 h-4 text-[hsl(var(--sidebar-foreground))]/50 transition-transform duration-200", isExpanded && "rotate-180")} />
                  </button>
                )}
              </div>

              {hasSubItems && isExpanded && (
                <div className="ml-8 mt-1 space-y-0.5 border-l-2 border-[hsl(var(--sidebar-border))] pl-3">
                  {item.subItems!.map((sub) => {
                    const isSubActive = location.pathname === sub.url;
                    return (
                      <NavLink key={sub.title} to={sub.url} end
                        className={cn("flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200", "text-[hsl(var(--sidebar-foreground))] hover:text-[hsl(var(--sidebar-accent-foreground))] hover:bg-[hsl(var(--sidebar-accent))]")}
                        activeClassName="text-[hsl(var(--sidebar-primary))] !font-semibold"
                      >
                        <sub.icon className={cn("w-4 h-4 flex-shrink-0 stroke-[1.8]", isSubActive && "text-[hsl(var(--sidebar-primary))]")} />
                        <span>{sub.title}</span>
                      </NavLink>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-[hsl(var(--sidebar-border))] px-4 py-4 space-y-3">
        <NavLink to="/configuracoes"
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-[hsl(var(--sidebar-foreground))] hover:text-[hsl(var(--sidebar-accent-foreground))] hover:bg-[hsl(var(--sidebar-accent))] transition-all"
          activeClassName="bg-[hsl(var(--sidebar-primary))]/15 text-[hsl(var(--sidebar-primary))] !font-semibold"
        >
          <Settings className="w-[22px] h-[22px] stroke-[1.8]" /><span>Configurações</span>
        </NavLink>

        <div className="flex items-center gap-3 px-3.5">
          <div className="w-8 h-8 rounded-full bg-[hsl(var(--sidebar-muted))] flex items-center justify-center text-xs font-semibold text-[hsl(var(--sidebar-foreground))]">U</div>
          <span className="text-sm font-medium text-[hsl(var(--sidebar-accent-foreground))] flex-1 truncate">{userData.email?.split("@")[0] || "Usuário"}</span>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md bg-[hsl(var(--sidebar-primary))]/15 text-[hsl(var(--sidebar-primary))]">{userData.plan || "Basic"}</span>
        </div>

        <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-all">Sair</button>
      </div>
    </aside>
  );
}
