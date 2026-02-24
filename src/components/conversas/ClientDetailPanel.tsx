import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getTagStore, getTagColor } from "@/lib/tagStore";
import { initialPipelines } from "@/components/crm/data";
import {
  Tag, StickyNote, BarChart3, CalendarClock, Check, Plus, X, Send as SendIcon,
} from "lucide-react";

interface Note {
  id: string;
  text: string;
  date: string;
}

interface ClientDetailPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contact: {
    name: string;
    phone: string;
    avatar: string;
  } | null;
  tags: string[];
  onToggleTag: (tag: string) => void;
}

export function ClientDetailPanel({
  open, onOpenChange, contact, tags, onToggleTag,
}: ClientDetailPanelProps) {
  const [notes, setNotes] = useState<Note[]>([
    { id: "1", text: "Cliente interessado no plano Premium. Retornar na sexta.", date: "24/02/2026" },
  ]);
  const [newNote, setNewNote] = useState("");
  const [crmStage, setCrmStage] = useState<string>("qualified");
  const [scheduledMessages] = useState([
    { id: "1", text: "Lembrete de follow-up", date: "25/02/2026 14:00" },
    { id: "2", text: "Enviar proposta comercial", date: "27/02/2026 10:00" },
  ]);

  const addNote = () => {
    if (!newNote.trim()) return;
    setNotes([
      { id: Date.now().toString(), text: newNote, date: new Date().toLocaleDateString("pt-BR"), },
      ...notes,
    ]);
    setNewNote("");
  };

  const removeNote = (id: string) => {
    setNotes(notes.filter((n) => n.id !== id));
  };

  const stages = initialPipelines.map((p) => ({ id: p.id, title: p.title }));

  if (!contact) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[380px] sm:max-w-[380px] p-0 flex flex-col">
        <SheetHeader className="px-5 pt-5 pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full gradient-green flex items-center justify-center text-sm font-bold text-primary-foreground">
              {contact.avatar}
            </div>
            <div>
              <SheetTitle className="text-base">{contact.name}</SheetTitle>
              <SheetDescription className="text-xs">{contact.phone}</SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1">
          <div className="p-5 space-y-6">

            {/* === TAGS === */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <Tag className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">Etiquetas</h3>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {getTagStore().map((tagItem) => {
                  const isActive = tags.includes(tagItem.name);
                  return (
                    <button
                      key={tagItem.name}
                      onClick={() => onToggleTag(tagItem.name)}
                      className={cn(
                        "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all border",
                        isActive
                          ? "text-white border-transparent"
                          : "text-foreground border-border hover:border-muted-foreground/30"
                      )}
                      style={isActive ? { backgroundColor: tagItem.color } : {}}
                    >
                      {isActive && <Check className="w-3 h-3" />}
                      {tagItem.name}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* === CRM CLASSIFICATION === */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">Classificação CRM</h3>
              </div>
              <div className="space-y-1">
                {stages.map((stage) => (
                  <button
                    key={stage.id}
                    onClick={() => setCrmStage(stage.id)}
                    className={cn(
                      "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all text-left",
                      crmStage === stage.id
                        ? "bg-primary/10 text-primary font-medium ring-1 ring-primary/20"
                        : "text-foreground hover:bg-muted"
                    )}
                  >
                    <div
                      className={cn(
                        "w-2 h-2 rounded-full",
                        crmStage === stage.id ? "bg-primary" : "bg-muted-foreground/30"
                      )}
                    />
                    {stage.title}
                  </button>
                ))}
              </div>
            </section>

            {/* === NOTES === */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <StickyNote className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">Anotações</h3>
              </div>
              <div className="flex gap-2 mb-3">
                <input
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addNote()}
                  placeholder="Nova anotação..."
                  className="flex-1 bg-muted rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                />
                <button
                  onClick={addNote}
                  className="p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2">
                {notes.map((note) => (
                  <div
                    key={note.id}
                    className="bg-muted/50 rounded-lg px-3 py-2.5 group relative"
                  >
                    <p className="text-sm text-foreground pr-6">{note.text}</p>
                    <span className="text-[10px] text-muted-foreground mt-1 block">{note.date}</span>
                    <button
                      onClick={() => removeNote(note.id)}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-muted transition-all"
                    >
                      <X className="w-3 h-3 text-muted-foreground" />
                    </button>
                  </div>
                ))}
                {notes.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-4">Nenhuma anotação</p>
                )}
              </div>
            </section>

            {/* === SCHEDULED MESSAGES === */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <CalendarClock className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">Disparos Programados</h3>
              </div>
              <div className="space-y-2">
                {scheduledMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className="bg-muted/50 rounded-lg px-3 py-2.5 flex items-start gap-3"
                  >
                    <SendIcon className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground">{msg.text}</p>
                      <span className="text-[10px] text-muted-foreground">{msg.date}</span>
                    </div>
                  </div>
                ))}
                <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-dashed border-border text-sm text-muted-foreground hover:text-foreground hover:border-muted-foreground/50 transition-colors">
                  <Plus className="w-4 h-4" />
                  Agendar mensagem
                </button>
              </div>
            </section>

          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
