import { useState, useMemo } from "react";
import {
  Search, Users, MessageSquare, Tag, X, CheckSquare, Square, UserPlus,
  ClipboardPaste, Upload, ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getTagStore } from "@/lib/tagStore";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";

// ─── Types ───
export interface ContactItem {
  id: string;
  name: string;
  phone: string;
  type: "contato" | "grupo";
  tags?: string[];
  avatar?: string;
}

interface ContactSelectorProps {
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
}

// ─── Mock Data ───
const MOCK_CONTACTS: ContactItem[] = [
  { id: "c1", name: "Maria Silva", phone: "(11) 99999-1001", type: "contato", tags: ["Cliente VIP"] },
  { id: "c2", name: "João Oliveira", phone: "(11) 98888-2002", type: "contato", tags: ["Lead Quente"] },
  { id: "c3", name: "Ana Costa", phone: "(21) 97777-3003", type: "contato", tags: ["Lead Frio"] },
  { id: "c4", name: "Carlos Pereira", phone: "(31) 96666-4004", type: "contato", tags: ["Cliente VIP", "Lead Quente"] },
  { id: "c5", name: "Fernanda Santos", phone: "(41) 95555-5005", type: "contato", tags: [] },
  { id: "c6", name: "Ricardo Lima", phone: "(51) 94444-6006", type: "contato", tags: ["Lead Quente"] },
  { id: "c7", name: "Patrícia Souza", phone: "(61) 93333-7007", type: "contato", tags: ["Cliente VIP"] },
  { id: "c8", name: "Bruno Almeida", phone: "(71) 92222-8008", type: "contato", tags: [] },
  { id: "c9", name: "Juliana Ferreira", phone: "(81) 91111-9009", type: "contato", tags: ["Lead Frio"] },
  { id: "c10", name: "Rafael Martins", phone: "(91) 90000-0010", type: "contato", tags: ["Lead Quente"] },
  { id: "c11", name: "", phone: "(11) 99876-5432", type: "contato", tags: [] },
  { id: "c12", name: "", phone: "(21) 98765-4321", type: "contato", tags: ["Lead Frio"] },
  { id: "g1", name: "Clientes Premium", phone: "12 participantes", type: "grupo", tags: [] },
  { id: "g2", name: "Equipe Comercial", phone: "8 participantes", type: "grupo", tags: [] },
  { id: "g3", name: "Suporte Técnico", phone: "5 participantes", type: "grupo", tags: [] },
  { id: "g4", name: "Parceiros 2026", phone: "15 participantes", type: "grupo", tags: [] },
];

type FilterType = "todos" | "contatos" | "grupos" | "tags";

const ITEMS_PER_PAGE = 20;

const ContactSelector = ({ selectedIds, onSelectionChange }: ContactSelectorProps) => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("todos");
  const [filterTag, setFilterTag] = useState<string | null>(null);
  const [showAddManual, setShowAddManual] = useState(false);
  const [manualInput, setManualInput] = useState("");
  const [showPaste, setShowPaste] = useState(false);
  const [pasteInput, setPasteInput] = useState("");
  const [manualContacts, setManualContacts] = useState<ContactItem[]>([]);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  const allContacts = useMemo(() => [...MOCK_CONTACTS, ...manualContacts], [manualContacts]);

  const filteredContacts = useMemo(() => {
    let list = allContacts;

    // Filter by type
    if (filter === "contatos") list = list.filter(c => c.type === "contato");
    else if (filter === "grupos") list = list.filter(c => c.type === "grupo");
    else if (filter === "tags" && filterTag) list = list.filter(c => c.tags?.includes(filterTag));

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(c =>
        c.name.toLowerCase().includes(q) || c.phone.includes(q)
      );
    }

    return list;
  }, [allContacts, filter, filterTag, search]);

  const visibleContacts = filteredContacts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredContacts.length;

  const toggleContact = (id: string) => {
    onSelectionChange(
      selectedIds.includes(id)
        ? selectedIds.filter(i => i !== id)
        : [...selectedIds, id]
    );
  };

  const selectAll = () => {
    const allIds = filteredContacts.map(c => c.id);
    const merged = [...new Set([...selectedIds, ...allIds])];
    onSelectionChange(merged);
  };

  const clearSelection = () => onSelectionChange([]);

  const getInitials = (name: string, phone: string) => {
    if (name) {
      const parts = name.split(" ");
      return parts.length >= 2 ? (parts[0][0] + parts[1][0]).toUpperCase() : parts[0].slice(0, 2).toUpperCase();
    }
    return phone.slice(-2);
  };

  const addManualNumber = () => {
    const cleaned = manualInput.replace(/[^\d+() -]/g, "").trim();
    if (!cleaned) return;
    const newContact: ContactItem = {
      id: `manual-${Date.now()}`,
      name: "",
      phone: cleaned,
      type: "contato",
      tags: [],
    };
    setManualContacts(prev => [...prev, newContact]);
    onSelectionChange([...selectedIds, newContact.id]);
    setManualInput("");
    setShowAddManual(false);
  };

  const addPastedNumbers = () => {
    const lines = pasteInput.split(/[\n,;]+/).map(l => l.trim()).filter(Boolean);
    const newContacts: ContactItem[] = lines.map((line, i) => ({
      id: `paste-${Date.now()}-${i}`,
      name: "",
      phone: line,
      type: "contato" as const,
      tags: [],
    }));
    setManualContacts(prev => [...prev, ...newContacts]);
    onSelectionChange([...selectedIds, ...newContacts.map(c => c.id)]);
    setPasteInput("");
    setShowPaste(false);
  };

  const tags = getTagStore();

  return (
    <div className="space-y-3">
      {/* Selected counter + actions */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-foreground">
          {selectedIds.length > 0 ? (
            <span className="inline-flex items-center gap-1.5">
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-md bg-primary text-primary-foreground text-[10px] font-bold">{selectedIds.length}</span>
              selecionado{selectedIds.length !== 1 ? "s" : ""}
            </span>
          ) : (
            "Nenhum contato selecionado"
          )}
        </span>
        <div className="flex items-center gap-1">
          <button onClick={selectAll} className="text-[10px] font-medium text-primary hover:underline px-1.5 py-0.5">
            Selecionar todos
          </button>
          {selectedIds.length > 0 && (
            <button onClick={clearSelection} className="text-[10px] font-medium text-destructive hover:underline px-1.5 py-0.5">
              Limpar
            </button>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          value={search}
          onChange={e => { setSearch(e.target.value); setVisibleCount(ITEMS_PER_PAGE); }}
          placeholder="Buscar por nome ou número..."
          className="w-full bg-muted/50 border border-border rounded-lg pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
        />
        {search && (
          <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-muted">
            <X className="w-3 h-3 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {([
          { key: "todos" as FilterType, label: "Todos", icon: Users },
          { key: "contatos" as FilterType, label: "Contatos", icon: Users },
          { key: "grupos" as FilterType, label: "Grupos", icon: MessageSquare },
          { key: "tags" as FilterType, label: "Tags", icon: Tag },
        ]).map(f => (
          <button
            key={f.key}
            onClick={() => { setFilter(f.key); setFilterTag(null); setVisibleCount(ITEMS_PER_PAGE); }}
            className={cn(
              "inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all border",
              filter === f.key
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-muted/50 text-muted-foreground border-border hover:border-primary/30"
            )}
          >
            <f.icon className="w-3 h-3" />
            {f.label}
          </button>
        ))}
      </div>

      {/* Tag sub-filter */}
      {filter === "tags" && (
        <div className="flex flex-wrap gap-1.5">
          {tags.map(tag => (
            <button
              key={tag.name}
              onClick={() => { setFilterTag(filterTag === tag.name ? null : tag.name); setVisibleCount(ITEMS_PER_PAGE); }}
              className={cn(
                "text-[10px] font-medium px-2.5 py-1 rounded-full border transition-colors",
                filterTag === tag.name
                  ? "text-white border-transparent"
                  : "bg-muted text-muted-foreground border-border hover:border-primary/20"
              )}
              style={filterTag === tag.name ? { backgroundColor: tag.color } : {}}
            >
              {tag.name}
            </button>
          ))}
        </div>
      )}

      {/* Quick actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => { setShowAddManual(!showAddManual); setShowPaste(false); }}
          className={cn("inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-medium border transition-all",
            showAddManual ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/20"
          )}
        >
          <UserPlus className="w-3 h-3" /> Adicionar número
        </button>
        <button
          onClick={() => { setShowPaste(!showPaste); setShowAddManual(false); }}
          className={cn("inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-medium border transition-all",
            showPaste ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/20"
          )}
        >
          <ClipboardPaste className="w-3 h-3" /> Colar vários
        </button>
        <button className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-medium border border-border text-muted-foreground hover:border-primary/20 transition-all">
          <Upload className="w-3 h-3" /> Importar lista
        </button>
      </div>

      {/* Manual add input */}
      {showAddManual && (
        <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg border border-border">
          <input
            value={manualInput}
            onChange={e => setManualInput(e.target.value)}
            placeholder="(11) 99999-0000"
            className="flex-1 bg-background border border-border rounded-lg px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/20"
            onKeyDown={e => e.key === "Enter" && addManualNumber()}
          />
          <button onClick={addManualNumber} className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90">
            Adicionar
          </button>
        </div>
      )}

      {/* Paste multiple */}
      {showPaste && (
        <div className="space-y-2 p-3 bg-muted/30 rounded-lg border border-border">
          <textarea
            value={pasteInput}
            onChange={e => setPasteInput(e.target.value)}
            placeholder="Cole os números separados por vírgula, ponto e vírgula ou quebra de linha..."
            rows={3}
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/20 resize-none"
          />
          <div className="flex justify-end">
            <button onClick={addPastedNumbers} className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90">
              Adicionar todos
            </button>
          </div>
        </div>
      )}

      {/* Contact list */}
      <div className="border border-border rounded-xl overflow-hidden">
        <div className="max-h-[320px] overflow-y-auto">
          {visibleContacts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center px-4">
              <Search className="w-8 h-8 text-muted-foreground/30 mb-2" />
              <p className="text-sm font-medium text-muted-foreground">Nenhum contato encontrado</p>
              <p className="text-xs text-muted-foreground/70 mt-0.5">Tente buscar por outro nome ou número</p>
            </div>
          ) : (
            <>
              {/* Group headers */}
              {filter === "todos" && (
                <>
                  {/* Contatos */}
                  {visibleContacts.some(c => c.type === "contato") && (
                    <div className="px-3 py-1.5 bg-muted/40 border-b border-border">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        Contatos ({filteredContacts.filter(c => c.type === "contato").length})
                      </span>
                    </div>
                  )}
                  {visibleContacts.filter(c => c.type === "contato").map(contact => (
                    <ContactRow key={contact.id} contact={contact} selected={selectedIds.includes(contact.id)} onToggle={toggleContact} />
                  ))}
                  {/* Grupos */}
                  {visibleContacts.some(c => c.type === "grupo") && (
                    <div className="px-3 py-1.5 bg-muted/40 border-b border-border border-t">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        Grupos ({filteredContacts.filter(c => c.type === "grupo").length})
                      </span>
                    </div>
                  )}
                  {visibleContacts.filter(c => c.type === "grupo").map(contact => (
                    <ContactRow key={contact.id} contact={contact} selected={selectedIds.includes(contact.id)} onToggle={toggleContact} />
                  ))}
                </>
              )}
              {filter !== "todos" && visibleContacts.map(contact => (
                <ContactRow key={contact.id} contact={contact} selected={selectedIds.includes(contact.id)} onToggle={toggleContact} />
              ))}
            </>
          )}
        </div>

        {/* Load more */}
        {hasMore && (
          <button
            onClick={() => setVisibleCount(prev => prev + ITEMS_PER_PAGE)}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 border-t border-border text-xs font-medium text-primary hover:bg-primary/5 transition-colors"
          >
            <ChevronDown className="w-3.5 h-3.5" />
            Carregar mais ({filteredContacts.length - visibleCount} restantes)
          </button>
        )}
      </div>
    </div>
  );
};

// ─── Contact Row ───
const ContactRow = ({ contact, selected, onToggle }: { contact: ContactItem; selected: boolean; onToggle: (id: string) => void }) => {
  const displayName = contact.name || contact.phone;
  const initials = contact.name
    ? contact.name.split(" ").map(p => p[0]).slice(0, 2).join("").toUpperCase()
    : contact.type === "grupo" ? contact.name.slice(0, 2).toUpperCase() : "#";

  return (
    <button
      onClick={() => onToggle(contact.id)}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2.5 text-left transition-all border-b border-border last:border-b-0",
        selected
          ? "bg-primary/5 hover:bg-primary/10"
          : "hover:bg-muted/40"
      )}
    >
      <Checkbox checked={selected} className="pointer-events-none flex-shrink-0" />

      <Avatar className="w-8 h-8 flex-shrink-0">
        <AvatarFallback className={cn(
          "text-[10px] font-bold",
          contact.type === "grupo" ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground",
          selected && "bg-primary/20 text-primary"
        )}>
          {initials}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <p className={cn("text-sm font-medium truncate", selected ? "text-primary" : "text-foreground")}>
          {displayName}
        </p>
        {contact.name && (
          <p className="text-[10px] text-muted-foreground truncate">{contact.phone}</p>
        )}
      </div>

      {contact.type === "grupo" && (
        <span className="text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-accent/50 text-accent-foreground flex-shrink-0">
          Grupo
        </span>
      )}

      {contact.tags && contact.tags.length > 0 && (
        <div className="flex items-center gap-1 flex-shrink-0">
          {contact.tags.slice(0, 2).map(tag => {
            const tagData = getTagStore().find(t => t.name === tag);
            return (
              <span
                key={tag}
                className="text-[8px] font-medium px-1.5 py-0.5 rounded-full text-white"
                style={{ backgroundColor: tagData?.color || "hsl(var(--primary))" }}
              >
                {tag}
              </span>
            );
          })}
        </div>
      )}
    </button>
  );
};

export default ContactSelector;
