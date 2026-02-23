import { useState } from "react";
import {
  LayoutDashboard,
  MessageCircle,
  BarChart3,
  Megaphone,
  Bot,
  CalendarDays,
  TrendingUp,
  Users,
  Link2,
  Settings,
  Search,
  ChevronUp,
  Zap,
  Crown,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const menuItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Conversas", url: "/conversas", icon: MessageCircle, count: 12 },
  { title: "CRM", url: "/crm", icon: BarChart3 },
  { title: "Disparos", url: "/disparos", icon: Megaphone, count: 3 },
  { title: "Automações", url: "/automacoes", icon: Bot },
  { title: "Agendamentos", url: "/agendamentos", icon: CalendarDays, count: 5 },
  { title: "Relatórios", url: "/relatorios", icon: TrendingUp },
  { title: "Contatos", url: "/contatos", icon: Users },
  { title: "Conexões", url: "/conexoes", icon: Link2 },
  { title: "Configurações", url: "/configuracoes", icon: Settings },
];

export function AppSidebar() {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [collapsed, setCollapsed] = useState(false);

  const filteredItems = menuItems.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen flex flex-col transition-all duration-300 ease-in-out",
        "bg-sidebar border-r border-sidebar-border",
        collapsed ? "w-[68px]" : "w-[260px]"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-sidebar-border">
        <div className="w-9 h-9 rounded-lg gradient-green flex items-center justify-center flex-shrink-0">
          <Zap className="w-5 h-5 text-primary-foreground" />
        </div>
        {!collapsed && (
          <span className="text-lg font-bold text-sidebar-accent-foreground tracking-tight">
            Zap-Pro
          </span>
        )}
      </div>

      {/* Search */}
      {!collapsed && (
        <div className="px-4 py-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sidebar-foreground/50" />
            <input
              type="text"
              placeholder="Buscar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-sidebar-accent border-none rounded-lg pl-9 pr-3 py-2 text-sm text-sidebar-accent-foreground placeholder:text-sidebar-foreground/40 focus:outline-none focus:ring-1 focus:ring-sidebar-primary/50"
            />
          </div>
        </div>
      )}

      {/* Nav Items */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
        {filteredItems.map((item) => {
          const isActive = location.pathname === item.url;
          return (
            <NavLink
              key={item.title}
              to={item.url}
              end={item.url === "/"}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                "text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent",
                collapsed && "justify-center px-2"
              )}
              activeClassName="bg-sidebar-accent text-sidebar-primary !font-semibold"
            >
              <item.icon className={cn("w-5 h-5 flex-shrink-0", isActive && "text-sidebar-primary")} />
              {!collapsed && (
                <>
                  <span className="flex-1">{item.title}</span>
                  {item.count && (
                    <span className={cn(
                      "text-xs px-2 py-0.5 rounded-full font-semibold",
                      isActive
                        ? "bg-sidebar-primary/20 text-sidebar-primary"
                        : "bg-sidebar-muted text-sidebar-foreground"
                    )}>
                      {item.count}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-4 space-y-3">
        {!collapsed && (
          <>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full gradient-green flex items-center justify-center text-xs font-bold text-primary-foreground">
                U
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-accent-foreground truncate">Usuário</p>
                <p className="text-xs text-sidebar-foreground/60">Plano BASIC</p>
              </div>
            </div>
            <button className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-sidebar-primary/10 text-sidebar-primary text-sm font-semibold hover:bg-sidebar-primary/20 transition-colors">
              <Crown className="w-4 h-4" />
              Fazer Upgrade
            </button>
          </>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground transition-colors"
        >
          <ChevronUp className={cn("w-4 h-4 transition-transform", collapsed ? "rotate-90" : "-rotate-90")} />
        </button>
      </div>
    </aside>
  );
}
