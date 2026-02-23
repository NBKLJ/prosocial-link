import { Pipeline } from "./types";

export const initialPipelines: Pipeline[] = [
  {
    id: "qualified",
    title: "Leads Qualificados",
    leads: [
      { id: "1", name: "João Silva", phone: "(11) 99999-1234", email: "joao@empresa.com", value: 2500, lastContact: "Há 2h", tag: "Quente", company: "Tech Solutions", probability: 20, assignee: "VS" },
      { id: "2", name: "Maria Souza", phone: "(21) 98888-5678", email: "maria@startup.io", value: 1800, lastContact: "Há 5h", company: "Startup.io", probability: 15, assignee: "AL" },
      { id: "3", name: "Carlos Lima", phone: "(31) 97777-9012", value: 4200, lastContact: "Há 1d", tag: "Indicação", company: "Lima & Assoc.", probability: 25, assignee: "VS" },
    ],
  },
  {
    id: "contact",
    title: "Contato Realizado",
    leads: [
      { id: "4", name: "Ana Costa", phone: "(41) 96666-3456", email: "ana@vipgroup.com", value: 5000, lastContact: "Há 3h", tag: "VIP", company: "VIP Group", probability: 40, assignee: "MR" },
      { id: "5", name: "Pedro Rocha", phone: "(51) 95555-7890", value: 3200, lastContact: "Há 1d", company: "Rocha Digital", probability: 35, assignee: "AL" },
    ],
  },
  {
    id: "proposal",
    title: "Proposta Enviada",
    leads: [
      { id: "8", name: "Fernanda Dias", phone: "(11) 91234-5678", email: "fernanda@globaltech.com", value: 12000, lastContact: "Há 4h", company: "GlobalTech", probability: 60, assignee: "MR", tag: "Enterprise" },
      { id: "9", name: "Ricardo Alves", phone: "(21) 98765-4321", value: 7500, lastContact: "Há 2d", company: "Alves Corp", probability: 55, assignee: "VS" },
    ],
  },
  {
    id: "negotiation",
    title: "Em Negociação",
    leads: [
      { id: "10", name: "Juliana Mendes", phone: "(31) 99876-5432", email: "juliana@premium.com", value: 15000, lastContact: "Há 1h", tag: "VIP", company: "Premium Co.", probability: 75, assignee: "AL" },
    ],
  },
  {
    id: "closed",
    title: "Fechado/Ganho",
    leads: [
      { id: "6", name: "Lucia Santos", phone: "(61) 94444-1234", email: "lucia@santos.com", value: 8500, lastContact: "Há 2d", tag: "Recorrente", company: "Santos Ltda", probability: 100, assignee: "MR" },
    ],
  },
];

export const tagColors: Record<string, string> = {
  Quente: "bg-red-500/10 text-red-600 dark:text-red-400 ring-1 ring-red-500/20",
  Indicação: "bg-blue-500/10 text-blue-600 dark:text-blue-400 ring-1 ring-blue-500/20",
  VIP: "bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-1 ring-amber-500/20",
  Recorrente: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-500/20",
  Enterprise: "bg-purple-500/10 text-purple-600 dark:text-purple-400 ring-1 ring-purple-500/20",
};

export const stageColors: Record<string, { bar: string; bg: string; text: string }> = {
  qualified: { bar: "bg-blue-500", bg: "bg-blue-500/8", text: "text-blue-600" },
  contact: { bar: "bg-cyan-500", bg: "bg-cyan-500/8", text: "text-cyan-600" },
  proposal: { bar: "bg-amber-500", bg: "bg-amber-500/8", text: "text-amber-600" },
  negotiation: { bar: "bg-purple-500", bg: "bg-purple-500/8", text: "text-purple-600" },
  closed: { bar: "bg-emerald-500", bg: "bg-emerald-500/8", text: "text-emerald-600" },
};
