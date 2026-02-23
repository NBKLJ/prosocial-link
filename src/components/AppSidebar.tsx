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
  Send,
  MessageSquarePlus,
  Mic,
  Clock,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface SubItem {
  title: string;
  url: string;
  icon: typeof Send;
}

interface MenuItem {
  title: string;
  url: string;
  icon: typeof LayoutDashboard;
  count?: number;
  expandable?: boolean;
  subItems?: SubItem[];
}

const menuItems: MenuItem[] = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Conversas", url: "/conversas", icon: MessageCircle, count: 12 },
  { title: "CRM", url: "/crm", icon: BarChart3 },
  {
    title: "Disparos", url: "/disparos", icon: Megaphone, count: 3, expandable: true,
    subItems: [
      { title: "Disparo de Mensagens", url: "/disparos", icon: Send },
      { title: "Recepção Automática", url: "/disparos/recepcao", icon: MessageSquarePlus },
      { title: "Áudio Programado", url: "/disparos/audio", icon: Mic },
      { title: "Agendamento", url: "/disparos/agendamento", icon: Clock },
    ],
  },
  { title: "Automações", url: "/automacoes", icon: Bot, expandable: true },
  { title: "Agendamentos", url: "/agendamentos", icon: CalendarDays, count: 5, expandable: true },
  { title: "Relatórios", url: "/relatorios", icon: TrendingUp, expandable: true },
  { title: "Contatos", url: "/contatos", icon: Users },
  { title: "Conexões", url: "/conexoes", icon: Link2, expandable: true },
];

export function AppSidebar() {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});

  const filteredItems = menuItems.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleExpand = (title: string) => {
    setExpandedMenus((prev) => ({ ...prev, [title]: !prev[title] }));
  };
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
          const isExpanded = expandedMenus[item.title];
          const hasSubItems = item.subItems && item.subItems.length > 0;

          return (
            <div key={item.title}>
              <div className="flex items-center">
                <NavLink
                  to={item.url}
                  end={item.url === "/"}
                  className={cn(
                    "flex-1 flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
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
                </NavLink>
                {hasSubItems && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleExpand(item.title);
                    }}
                    className="p-2 rounded-lg hover:bg-muted/60 transition-colors"
                  >
                    <ChevronDown className={cn(
                      "w-4 h-4 text-muted-foreground/50 transition-transform duration-200",
                      isExpanded && "rotate-180"
                    )} />
                  </button>
                )}
                {item.expandable && !hasSubItems && (
                  <ChevronDown className="w-4 h-4 text-muted-foreground/50 mr-2" />
                )}
              </div>

              {/* Sub Items */}
              {hasSubItems && isExpanded && (
                <div className="ml-8 mt-1 space-y-0.5 border-l-2 border-border pl-3">
                  {item.subItems!.map((sub) => {
                    const isSubActive = location.pathname === sub.url;
                    return (
                      <NavLink
                        key={sub.title}
                        to={sub.url}
                        className={cn(
                          "flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200",
                          "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                        )}
                        activeClassName="text-primary !font-semibold"
                      >
                        <sub.icon className={cn("w-4 h-4 flex-shrink-0 stroke-[1.8]", isSubActive && "text-primary")} />
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
