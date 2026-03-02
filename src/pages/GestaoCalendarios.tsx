import { AppLayout } from "@/components/AppLayout";
import { ProGate } from "@/components/ui/ProGate";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Clock, Video, Phone, Users } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface CalendarEvent {
  id: string;
  title: string;
  type: "meeting" | "call" | "follow_up" | "deadline";
  date: string;
  time: string;
  duration: string;
  participants: string[];
}

const mockEvents: CalendarEvent[] = [
  { id: "1", title: "Reunião com MegaCorp", type: "meeting", date: "2026-03-02", time: "09:00", duration: "1h", participants: ["Carlos", "Ana"] },
  { id: "2", title: "Call de follow-up - TechStart", type: "call", date: "2026-03-02", time: "11:00", duration: "30min", participants: ["João"] },
  { id: "3", title: "Apresentação de proposta", type: "meeting", date: "2026-03-02", time: "14:00", duration: "1h30", participants: ["Carlos", "Ana", "João"] },
  { id: "4", title: "Deadline: Envio de contrato", type: "deadline", date: "2026-03-03", time: "18:00", duration: "-", participants: ["Carlos"] },
  { id: "5", title: "Follow-up automático Lead #42", type: "follow_up", date: "2026-03-04", time: "10:00", duration: "15min", participants: ["Ana"] },
];

const typeConfig = {
  meeting: { label: "Reunião", icon: Video, color: "bg-primary/15 text-primary" },
  call: { label: "Ligação", icon: Phone, color: "bg-blue-500/15 text-blue-600" },
  follow_up: { label: "Follow-up", icon: Users, color: "bg-amber-500/15 text-amber-600" },
  deadline: { label: "Prazo", icon: Clock, color: "bg-red-500/15 text-red-600" },
};

export default function GestaoCalendarios() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const todayEvents = mockEvents.filter((e) => {
    if (!selectedDate) return false;
    const eventDate = new Date(e.date);
    return eventDate.toDateString() === selectedDate.toDateString();
  });

  return (
    <AppLayout>
      <ProGate>
        <div className="p-6 space-y-6 overflow-y-auto h-full">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Calendários</h1>
              <p className="text-sm text-muted-foreground">Visualize compromissos, reuniões e prazos da equipe</p>
            </div>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Novo Evento
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardContent className="p-4 flex justify-center">
                <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} className="rounded-md" />
              </CardContent>
            </Card>

            <div className="lg:col-span-2 space-y-3">
              <h2 className="text-sm font-semibold text-foreground">
                Eventos de {selectedDate?.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
              </h2>
              {todayEvents.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center text-muted-foreground text-sm">
                    Nenhum evento para esta data
                  </CardContent>
                </Card>
              ) : (
                todayEvents.map((event) => {
                  const config = typeConfig[event.type];
                  const Icon = config.icon;
                  return (
                    <Card key={event.id} className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4 flex items-start gap-4">
                        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center shrink-0", config.color)}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-foreground">{event.title}</h3>
                            <Badge variant="secondary" className="text-[10px]">{config.label}</Badge>
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{event.time} • {event.duration}</span>
                            <span className="flex items-center gap-1"><Users className="w-3 h-3" />{event.participants.join(", ")}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </ProGate>
    </AppLayout>
  );
}
