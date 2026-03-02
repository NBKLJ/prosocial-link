import { AppLayout } from "@/components/AppLayout";
import { ProGate } from "@/components/ui/ProGate";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Plus, MoreHorizontal, Shield, UserCheck, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface TeamUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "supervisor" | "atendente";
  status: "online" | "offline" | "busy";
  activeChats: number;
  closedToday: number;
  avgResponseTime: string;
}

const mockUsers: TeamUser[] = [
  { id: "1", name: "Carlos Silva", email: "carlos@birdly.com", role: "admin", status: "online", activeChats: 5, closedToday: 12, avgResponseTime: "2min" },
  { id: "2", name: "Ana Souza", email: "ana@birdly.com", role: "supervisor", status: "online", activeChats: 8, closedToday: 18, avgResponseTime: "1.5min" },
  { id: "3", name: "João Santos", email: "joao@birdly.com", role: "atendente", status: "busy", activeChats: 12, closedToday: 9, avgResponseTime: "3min" },
  { id: "4", name: "Maria Oliveira", email: "maria@birdly.com", role: "atendente", status: "offline", activeChats: 0, closedToday: 15, avgResponseTime: "2.5min" },
];

const roleConfig = {
  admin: { label: "Admin", color: "bg-primary/15 text-primary border-primary/20", icon: Shield },
  supervisor: { label: "Supervisor", color: "bg-amber-500/15 text-amber-600 border-amber-500/20", icon: UserCheck },
  atendente: { label: "Atendente", color: "bg-blue-500/15 text-blue-600 border-blue-500/20", icon: MessageCircle },
};

const statusColors = {
  online: "bg-emerald-500",
  offline: "bg-muted-foreground/40",
  busy: "bg-amber-500",
};

export default function GestaoUsuarios() {
  return (
    <AppLayout>
      <ProGate>
        <div className="p-6 space-y-6 overflow-y-auto h-full">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Usuários</h1>
              <p className="text-sm text-muted-foreground">Gerencie a equipe, permissões e monitore a atividade</p>
            </div>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Adicionar Usuário
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-foreground">{mockUsers.length}</p><p className="text-xs text-muted-foreground">Total de Usuários</p></CardContent></Card>
            <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-emerald-500">{mockUsers.filter(u => u.status === "online").length}</p><p className="text-xs text-muted-foreground">Online Agora</p></CardContent></Card>
            <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-foreground">{mockUsers.reduce((s, u) => s + u.activeChats, 0)}</p><p className="text-xs text-muted-foreground">Conversas Ativas</p></CardContent></Card>
            <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-foreground">{mockUsers.reduce((s, u) => s + u.closedToday, 0)}</p><p className="text-xs text-muted-foreground">Fechadas Hoje</p></CardContent></Card>
          </div>

          <div className="space-y-3">
            {mockUsers.map((user) => {
              const role = roleConfig[user.role];
              const RoleIcon = role.icon;
              return (
                <Card key={user.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="relative">
                      <Avatar className="h-11 w-11">
                        <AvatarFallback className="bg-muted text-foreground font-semibold text-sm">
                          {user.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className={cn("absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-card", statusColors[user.status])} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-foreground">{user.name}</h3>
                        <Badge variant="outline" className={cn("text-[10px]", role.color)}>
                          <RoleIcon className="w-3 h-3 mr-1" />{role.label}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    <div className="hidden md:flex items-center gap-6 text-center">
                      <div><p className="text-sm font-bold text-foreground">{user.activeChats}</p><p className="text-[10px] text-muted-foreground">Ativas</p></div>
                      <div><p className="text-sm font-bold text-foreground">{user.closedToday}</p><p className="text-[10px] text-muted-foreground">Fechadas</p></div>
                      <div><p className="text-sm font-bold text-foreground">{user.avgResponseTime}</p><p className="text-[10px] text-muted-foreground">Resp. Média</p></div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </ProGate>
    </AppLayout>
  );
}
