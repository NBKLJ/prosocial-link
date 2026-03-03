import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ProGate } from "@/components/ui/ProGate";
import { motion } from "framer-motion";
import {
  ListTodo, AlertTriangle, Layers, MessageSquare, CalendarDays,
  ExternalLink, MoreHorizontal, CheckCircle2, Clock, AlertCircle
} from "lucide-react";

const indicadores = [
  { label: "Tarefas Pendentes", value: 3, icon: ListTodo, accent: "text-destructive" },
  { label: "Alertas", value: 1, icon: AlertTriangle, accent: "text-amber-500" },
  { label: "Processos ativos", value: 5, icon: Layers, accent: "text-primary" },
  { label: "CRM", value: 12, icon: MessageSquare, accent: "text-emerald-500" },
  { label: "Audiências futuras", value: 2, icon: CalendarDays, accent: "text-purple-500" },
];

const alertas = {
  tarefas: [
    { id: "t1", titulo: "Preparar documentação - Processo 0001234", vencimento: "03/03/2026", status: "vencida" },
    { id: "t2", titulo: "Enviar contrato revisado ao cliente", vencimento: "05/03/2026", status: "proxima" },
  ],
  processuais: [
    { id: "a1", titulo: "Prazo para contestação - Processo 0005678", vencimento: "04/03/2026", status: "urgente" },
  ],
  aniversarios: [] as { id: string; titulo: string; vencimento: string; status: string }[],
};

const agendaSemana = [
  { dia: "Sáb", num: 28, atual: false },
  { dia: "Dom", num: 1, atual: false },
  { dia: "Seg", num: 2, atual: false },
  { dia: "Ter", num: 3, atual: true },
  { dia: "Qua", num: 4, atual: false },
  { dia: "Qui", num: 5, atual: false },
  { dia: "Sex", num: 6, atual: false },
];

const compromissos = [
  {
    id: "c1", titulo: "Audiência de conciliação - Processo Cível 0001234",
    data: "03/03/2026", dataFatal: "03/03/2026", tipo: "Audiência",
    status: "pendente", vencida: false,
  },
  {
    id: "c2", titulo: "Prazo para contestação trabalhista",
    data: "04/03/2026", dataFatal: "04/03/2026", tipo: "Tarefa",
    status: "pendente", vencida: false,
  },
  {
    id: "c3", titulo: "Reunião com cliente - Pedro Oliveira",
    data: "02/03/2026", dataFatal: "02/03/2026", tipo: "Tarefa",
    status: "pendente", vencida: true,
  },
];

export default function ProcessosPainel() {
  const [alertaTab, setAlertaTab] = useState<"tarefas" | "processuais" | "aniversarios">("processuais");
  const [ocultarAtrasadas, setOcultarAtrasadas] = useState(false);

  const compromissosFiltrados = ocultarAtrasadas ? compromissos.filter(c => !c.vencida) : compromissos;

  return (
    <AppLayout>
      <ProGate title="Painel de Gestão de Processos" description="Visão completa de indicadores, alertas e agenda processual.">
        <div className="space-y-6 max-w-7xl mx-auto animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">Painel de gestão</h1>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="text-xs gap-1.5">
                <Layers className="w-3.5 h-3.5" /> Dados gerais
              </Button>
              <Button variant="outline" size="sm" className="text-xs gap-1.5">
                <ListTodo className="w-3.5 h-3.5" /> Meus dados
              </Button>
              <Button size="sm" className="text-xs gap-1.5">
                <MoreHorizontal className="w-3.5 h-3.5" /> Personalizar painel
              </Button>
            </div>
          </div>

          {/* Indicadores */}
          <div className="glass-card rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-muted-foreground">Indicadores</span>
              <Button variant="ghost" size="icon" className="h-7 w-7"><MoreHorizontal className="w-4 h-4" /></Button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {indicadores.map((ind) => (
                <motion.div
                  key={ind.label}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl border border-border/50 bg-card hover:shadow-md transition-shadow cursor-pointer"
                >
                  <span className={`text-xs font-medium ${ind.accent}`}>{ind.label}</span>
                  <div className="flex items-center justify-between mt-3">
                    <span className={`text-2xl font-bold ${ind.value > 0 ? ind.accent : "text-muted-foreground"}`}>{ind.value}</span>
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                      <ind.icon className="w-4.5 h-4.5 text-primary" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Alertas + Agenda */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Alertas */}
            <div className="glass-card rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">Alertas</span>
                  <Button variant="ghost" size="icon" className="h-5 w-5"><ExternalLink className="w-3 h-3" /></Button>
                </div>
                <Button variant="ghost" size="icon" className="h-7 w-7"><MoreHorizontal className="w-4 h-4" /></Button>
              </div>

              <div className="flex gap-1 mb-4">
                {(["tarefas", "processuais", "aniversarios"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setAlertaTab(t)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${alertaTab === t ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"}`}
                  >
                    {t === "tarefas" ? "Tarefas" : t === "processuais" ? "And. Processuais" : "Aniversários"}
                  </button>
                ))}
              </div>

              <div className="space-y-2 min-h-[120px]">
                {alertas[alertaTab].length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                    <AlertTriangle className="w-10 h-10 opacity-20 mb-2" />
                    <p className="text-xs">Nenhum alerta de {alertaTab === "processuais" ? "andamento processual" : alertaTab}</p>
                  </div>
                ) : (
                  alertas[alertaTab].map((a) => (
                    <div key={a.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/30">
                      <AlertCircle className={`w-4 h-4 shrink-0 ${a.status === "vencida" || a.status === "urgente" ? "text-destructive" : "text-amber-500"}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground truncate">{a.titulo}</p>
                        <p className="text-[10px] text-muted-foreground">{a.vencimento}</p>
                      </div>
                      <Badge variant="outline" className={`text-[9px] ${a.status === "vencida" || a.status === "urgente" ? "border-destructive/20 text-destructive" : "border-amber-500/20 text-amber-500"}`}>
                        {a.status === "vencida" ? "Vencida" : a.status === "urgente" ? "Urgente" : "Próxima"}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Agenda da semana */}
            <div className="glass-card rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">Agenda da semana</span>
                  <Button variant="ghost" size="icon" className="h-5 w-5"><ExternalLink className="w-3 h-3" /></Button>
                </div>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1.5 text-[10px] text-muted-foreground cursor-pointer">
                    Ocultar atividades atrasadas
                    <Switch checked={ocultarAtrasadas} onCheckedChange={setOcultarAtrasadas} className="scale-75" />
                  </label>
                  <Button variant="ghost" size="icon" className="h-7 w-7"><MoreHorizontal className="w-4 h-4" /></Button>
                </div>
              </div>

              {/* Week bar */}
              <div className="flex gap-1 mb-5">
                {agendaSemana.map((d) => (
                  <div
                    key={d.dia + d.num}
                    className={`flex-1 flex flex-col items-center py-2 rounded-xl text-xs transition-colors ${
                      d.atual ? "bg-primary text-primary-foreground font-bold" : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    <span className="text-[10px]">{d.dia}</span>
                    <span className="text-base font-bold mt-0.5">{String(d.num).padStart(2, "0")}</span>
                  </div>
                ))}
              </div>

              {/* Compromissos */}
              <div className="space-y-3">
                {compromissosFiltrados.map((c) => (
                  <div key={c.id} className="p-3 rounded-lg border border-border/30 bg-muted/20 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Badge variant={c.vencida ? "destructive" : "default"} className="text-[9px] mb-1.5">
                          {c.vencida ? "Vencida" : "Pendente"}
                        </Badge>
                        <p className="text-sm font-semibold text-foreground">{c.titulo}</p>
                      </div>
                      <Badge variant="outline" className="text-[9px] shrink-0">
                        <CheckCircle2 className="w-2.5 h-2.5 mr-1" /> {c.tipo}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
                      <span className="flex items-center gap-1"><CalendarDays className="w-3 h-3" /> Data: {c.data}</span>
                      <span className="flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Data fatal: {c.dataFatal}</span>
                    </div>
                    {c.vencida && (
                      <p className="text-[10px] text-destructive flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Vencida há 1 dia
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </ProGate>
    </AppLayout>
  );
}
