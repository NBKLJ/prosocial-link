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
  ChevronDown,
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
  { title: "Disparos", url: "/disparos", icon: Megaphone, count: 3, expandable: true },
  { title: "Automações", url: "/automacoes", icon: Bot, expandable: true },
  { title: "Agendamentos", url: "/agendamentos", icon: CalendarDays, count: 5, expandable: true },
  { title: "Relatórios", url: "/relatorios", icon: TrendingUp, expandable: true },
  { title: "Contatos", url: "/contatos", icon: Users },
  { title: "Conexões", url: "/conexoes", icon: Link2, expandable: true },
];

export function AppSidebar() {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = menuItems.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-[260px] flex flex-col bg-card border-r border-border">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 pt-6 pb-4">
        <div className="w-10 h-10 rounded-xl gradient-green flex items-center justify-center flex-shrink-0">
          <Zap className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <span className="text-base font-bold text-foreground tracking-tight block leading-tight">Zap-Pro</span>
          <span className="text-xs text-muted-foreground">WhatsApp Manager</span>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 pb-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-muted/50 border border-border rounded-xl pl-9 pr-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
          />
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
        {filteredItems.map((item) => {
          const isActive = item.url === "/" ? location.pathname === "/" : location.pathname.startsWith(item.url);
          return (
            <NavLink
              key={item.title}
              to={item.url}
              end={item.url === "/"}
              className={cn(
                "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              )}
              activeClassName="bg-primary/10 text-primary !font-semibold shadow-sm"
            >
              <item.icon className={cn("w-[22px] h-[22px] flex-shrink-0 stroke-[1.8]", isActive && "text-primary")} />
              <span className="flex-1">{item.title}</span>
              {item.count && (
                <span className={cn(
                  "text-xs min-w-[22px] h-[22px] flex items-center justify-center rounded-md font-semibold",
                  isActive
                    ? "bg-primary/20 text-primary"
                    : "bg-muted text-muted-foreground"
                )}>
                  {item.count}
                </span>
              )}
              {item.expandable && (
                <ChevronDown className="w-4 h-4 text-muted-foreground/50" />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-border px-4 py-4 space-y-3">
        <NavLink
          to="/configuracoes"
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all"
          activeClassName="bg-primary/10 text-primary !font-semibold"
        >
          <Settings className="w-[22px] h-[22px] stroke-[1.8]" />
          <span>Configurações</span>
        </NavLink>

        <div className="flex items-center gap-3 px-3.5">
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-semibold text-muted-foreground">
            U
          </div>
          <span className="text-sm font-medium text-foreground flex-1">Usuário</span>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md bg-primary/10 text-primary">
            Basic
          </span>
        </div>
      </div>
    </aside>
  );
}
