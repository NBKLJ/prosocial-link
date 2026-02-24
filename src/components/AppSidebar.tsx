import { useState } from "react";
import {
  MessageCircle,
  BarChart3,
  Megaphone,
  Users,
  Settings,
  Search,
  ChevronDown,
  Zap,
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
  icon: typeof MessageCircle;
  count?: number;
  expandable?: boolean;
  subItems?: SubItem[];
}

const menuItems: MenuItem[] = [
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
  { title: "Contatos", url: "/contatos", icon: Users },
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
    <aside className="fixed left-0 top-0 z-40 h-screen w-[260px] flex flex-col bg-[hsl(var(--sidebar-background))] border-r border-[hsl(var(--sidebar-border))]">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 pt-6 pb-4">
        <div className="w-10 h-10 rounded-xl gradient-green flex items-center justify-center flex-shrink-0">
          <Zap className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <span className="text-base font-bold text-[hsl(var(--sidebar-accent-foreground))] tracking-tight block leading-tight">ZapProBR</span>
          <span className="text-xs text-[hsl(var(--sidebar-foreground))]">WhatsApp Manager</span>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 pb-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[hsl(var(--sidebar-foreground))]/60" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[hsl(var(--sidebar-accent))] border border-[hsl(var(--sidebar-border))] rounded-xl pl-9 pr-3 py-2.5 text-sm text-[hsl(var(--sidebar-accent-foreground))] placeholder:text-[hsl(var(--sidebar-foreground))]/50 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--sidebar-ring))]/20 focus:border-[hsl(var(--sidebar-ring))]/30 transition-all"
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
                    "text-[hsl(var(--sidebar-foreground))] hover:text-[hsl(var(--sidebar-accent-foreground))] hover:bg-[hsl(var(--sidebar-accent))]"
                  )}
                  activeClassName="bg-[hsl(var(--sidebar-primary))]/15 text-[hsl(var(--sidebar-primary))] !font-semibold"
                >
                  <item.icon className={cn("w-[22px] h-[22px] flex-shrink-0 stroke-[1.8]", isActive && "text-[hsl(var(--sidebar-primary))]")} />
                  <span className="flex-1">{item.title}</span>
                  {item.count && (
                    <span className={cn(
                      "text-xs min-w-[22px] h-[22px] flex items-center justify-center rounded-md font-semibold",
                      isActive
                        ? "bg-[hsl(var(--sidebar-primary))]/20 text-[hsl(var(--sidebar-primary))]"
                        : "bg-[hsl(var(--sidebar-muted))] text-[hsl(var(--sidebar-foreground))]"
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
                    className="p-2 rounded-lg hover:bg-[hsl(var(--sidebar-accent))] transition-colors"
                  >
                    <ChevronDown className={cn(
                      "w-4 h-4 text-[hsl(var(--sidebar-foreground))]/50 transition-transform duration-200",
                      isExpanded && "rotate-180"
                    )} />
                  </button>
                )}
                {item.expandable && !hasSubItems && (
                  <ChevronDown className="w-4 h-4 text-[hsl(var(--sidebar-foreground))]/50 mr-2" />
                )}
              </div>

              {/* Sub Items */}
              {hasSubItems && isExpanded && (
                <div className="ml-8 mt-1 space-y-0.5 border-l-2 border-[hsl(var(--sidebar-border))] pl-3">
                  {item.subItems!.map((sub) => {
                    const isSubActive = location.pathname === sub.url;
                    return (
                      <NavLink
                        key={sub.title}
                        to={sub.url}
                        className={cn(
                          "flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200",
                          "text-[hsl(var(--sidebar-foreground))] hover:text-[hsl(var(--sidebar-accent-foreground))] hover:bg-[hsl(var(--sidebar-accent))]"
                        )}
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
        <NavLink
          to="/configuracoes"
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-[hsl(var(--sidebar-foreground))] hover:text-[hsl(var(--sidebar-accent-foreground))] hover:bg-[hsl(var(--sidebar-accent))] transition-all"
          activeClassName="bg-[hsl(var(--sidebar-primary))]/15 text-[hsl(var(--sidebar-primary))] !font-semibold"
        >
          <Settings className="w-[22px] h-[22px] stroke-[1.8]" />
          <span>Configurações</span>
        </NavLink>

        <div className="flex items-center gap-3 px-3.5">
          <div className="w-8 h-8 rounded-full bg-[hsl(var(--sidebar-muted))] flex items-center justify-center text-xs font-semibold text-[hsl(var(--sidebar-foreground))]">
            U
          </div>
          <span className="text-sm font-medium text-[hsl(var(--sidebar-accent-foreground))] flex-1">Usuário</span>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md bg-[hsl(var(--sidebar-primary))]/15 text-[hsl(var(--sidebar-primary))]">
            Basic
          </span>
        </div>
      </div>
    </aside>
  );
}
