import { AppLayout } from "@/components/AppLayout";
import { Users, Search, Plus, MessageCircle, UserPlus, Settings2, MoreVertical } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface Group {
  id: string;
  name: string;
  avatar: string;
  members: number;
  lastMessage: string;
  lastMessageTime: string;
  unread: number;
  description: string;
}

const mockGroups: Group[] = [
  { id: "1", name: "Equipe Comercial", avatar: "EC", members: 12, lastMessage: "Fechamos o contrato do cliente X!", lastMessageTime: "10:32", unread: 3, description: "Grupo da equipe de vendas" },
  { id: "2", name: "Suporte Técnico", avatar: "ST", members: 8, lastMessage: "Ticket #432 resolvido", lastMessageTime: "09:45", unread: 0, description: "Atendimento e suporte ao cliente" },
  { id: "3", name: "Marketing Digital", avatar: "MD", members: 6, lastMessage: "Campanha aprovada pelo cliente", lastMessageTime: "Ontem", unread: 5, description: "Estratégias de marketing" },
  { id: "4", name: "Financeiro", avatar: "FN", members: 4, lastMessage: "NF enviada para o cliente Y", lastMessageTime: "Ontem", unread: 0, description: "Controle financeiro e cobranças" },
  { id: "5", name: "Leads Quentes 🔥", avatar: "LQ", members: 15, lastMessage: "Novo lead qualificado via site", lastMessageTime: "08:12", unread: 12, description: "Leads com alta chance de conversão" },
  { id: "6", name: "Pós-Venda", avatar: "PV", members: 5, lastMessage: "Cliente satisfeito com onboarding", lastMessageTime: "Seg", unread: 0, description: "Acompanhamento pós-venda" },
];

export default function Grupos() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(mockGroups[0]);

  const filtered = mockGroups.filter(g =>
    g.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="flex h-[calc(100vh-2rem)] gap-0 overflow-hidden rounded-2xl border border-border bg-card">
        {/* Lista de grupos */}
        <div className="w-[340px] flex flex-col border-r border-border">
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-foreground">Grupos</h2>
              <button className="p-2 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar grupo..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-muted/50 border border-border rounded-xl pl-9 pr-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-2 space-y-0.5">
            {filtered.map(group => {
              const isSelected = selectedGroup?.id === group.id;
              return (
                <button
                  key={group.id}
                  onClick={() => setSelectedGroup(group)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all",
                    isSelected ? "bg-primary/10 border border-primary/20" : "hover:bg-muted/50"
                  )}
                >
                  <div className={cn(
                    "w-11 h-11 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0",
                    isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  )}>
                    {group.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-foreground truncate">{group.name}</span>
                      <span className="text-[11px] text-muted-foreground flex-shrink-0">{group.lastMessageTime}</span>
                    </div>
                    <div className="flex items-center justify-between mt-0.5">
                      <span className="text-xs text-muted-foreground truncate">{group.lastMessage}</span>
                      {group.unread > 0 && (
                        <span className="min-w-[20px] h-5 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold px-1.5 flex-shrink-0">
                          {group.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Detalhes do grupo */}
        {selectedGroup ? (
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
                  {selectedGroup.avatar}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">{selectedGroup.name}</h3>
                  <span className="text-xs text-muted-foreground">{selectedGroup.members} membros</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button className="p-2 rounded-lg hover:bg-muted/50 transition-colors text-muted-foreground">
                  <UserPlus className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-lg hover:bg-muted/50 transition-colors text-muted-foreground">
                  <Settings2 className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-lg hover:bg-muted/50 transition-colors text-muted-foreground">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Área de mensagens */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="flex justify-center">
                <span className="text-xs text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">Hoje</span>
              </div>

              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground flex-shrink-0">JC</div>
                <div className="bg-muted/50 border border-border rounded-2xl rounded-tl-md px-4 py-2.5 max-w-[60%]">
                  <span className="text-xs font-semibold text-primary block mb-1">João Carlos</span>
                  <p className="text-sm text-foreground">Bom dia pessoal! Temos novidades sobre o cliente X.</p>
                  <span className="text-[10px] text-muted-foreground mt-1 block text-right">10:30</span>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground flex-shrink-0">ML</div>
                <div className="bg-muted/50 border border-border rounded-2xl rounded-tl-md px-4 py-2.5 max-w-[60%]">
                  <span className="text-xs font-semibold text-primary block mb-1">Maria Lima</span>
                  <p className="text-sm text-foreground">Ótimo! Fechamos o contrato do cliente X! 🎉</p>
                  <span className="text-[10px] text-muted-foreground mt-1 block text-right">10:32</span>
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <div className="bg-primary/10 border border-primary/20 rounded-2xl rounded-tr-md px-4 py-2.5 max-w-[60%]">
                  <p className="text-sm text-foreground">Parabéns equipe! Vamos agendar onboarding para amanhã.</p>
                  <span className="text-[10px] text-muted-foreground mt-1 block text-right">10:35</span>
                </div>
              </div>
            </div>

            {/* Input */}
            <div className="px-6 py-4 border-t border-border">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Digite uma mensagem..."
                  className="flex-1 bg-muted/50 border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
                <button className="p-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                  <MessageCircle className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center space-y-2">
              <Users className="w-12 h-12 mx-auto opacity-40" />
              <p className="text-sm">Selecione um grupo para visualizar</p>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
