import { Pipeline } from "./types";

export const initialPipelines: Pipeline[] = [
  {
    id: "qualified",
    title: "Leads Qualificados",
    leads: [
      {
        id: "1", name: "João Silva", phone: "(11) 99999-1234", email: "joao@empresa.com", value: 2500,
        lastContact: "Há 2h", tag: "Quente", company: "Tech Solutions", probability: 20, assignee: "VS",
        origin: "whatsapp", score: 72, channel: "whatsapp", createdAt: "2026-02-15",
        responseTime: "3m", lastMessageAt: "2026-03-02T10:00:00",
        notes: ["Interessado no plano Pro", "Pediu demo para equipe"],
        interactionHistory: [
          { id: "e1", type: "message", description: "Primeiro contato via WhatsApp", timestamp: "2026-02-15T09:00:00", by: "VS" },
          { id: "e2", type: "proposal", description: "Proposta enviada - Plano Pro", timestamp: "2026-02-20T14:00:00", by: "VS" },
          { id: "e3", type: "note", description: "Cliente pediu prazo para avaliar", timestamp: "2026-02-25T11:00:00", by: "VS" },
        ],
      },
      {
        id: "2", name: "Maria Souza", phone: "(21) 98888-5678", email: "maria@startup.io", value: 1800,
        lastContact: "Há 5h", company: "Startup.io", probability: 15, assignee: "AL",
        origin: "site", score: 45, channel: "email", createdAt: "2026-02-18",
        responseTime: "8m", lastMessageAt: "2026-03-01T15:00:00",
        notes: ["Veio pelo blog"],
        interactionHistory: [
          { id: "e4", type: "email", description: "Cadastro via formulário do site", timestamp: "2026-02-18T10:00:00" },
          { id: "e5", type: "message", description: "Follow-up automático enviado", timestamp: "2026-02-20T09:00:00", by: "AL" },
        ],
      },
    ],
  },
  {
    id: "contact",
    title: "Contato Realizado",
    leads: [
      {
        id: "4", name: "Ana Costa", phone: "(41) 96666-3456", email: "ana@vipgroup.com", value: 5000,
        lastContact: "Há 3h", tag: "VIP", company: "VIP Group", probability: 40, assignee: "MR",
        origin: "indicacao", score: 85, channel: "whatsapp", createdAt: "2026-02-10",
        responseTime: "1m", lastMessageAt: "2026-03-02T08:30:00",
        notes: ["Indicação do João Silva", "Empresa de grande porte", "Interessada em Premium"],
        interactionHistory: [
          { id: "e6", type: "call", description: "Ligação de qualificação - 15min", timestamp: "2026-02-12T14:00:00", by: "MR" },
          { id: "e7", type: "meeting", description: "Reunião presencial com diretoria", timestamp: "2026-02-18T10:00:00", by: "MR" },
          { id: "e8", type: "proposal", description: "Proposta Premium personalizada enviada", timestamp: "2026-02-22T16:00:00", by: "MR" },
        ],
      },
    ],
  },
  {
    id: "proposal",
    title: "Proposta Enviada",
    leads: [
      {
        id: "5", name: "Pedro Rocha", phone: "(51) 95555-7890", value: 3200,
        lastContact: "Há 1d", company: "Rocha Digital", probability: 55, assignee: "VS",
        origin: "anuncio", score: 63, channel: "whatsapp", createdAt: "2026-01-28",
        responseTime: "5m", lastMessageAt: "2026-03-01T12:00:00",
        notes: ["Visualizou proposta 3x"],
        interactionHistory: [
          { id: "e9", type: "message", description: "Contato via anúncio Instagram", timestamp: "2026-01-28T20:00:00" },
          { id: "e10", type: "proposal", description: "Proposta Pro enviada", timestamp: "2026-02-10T11:00:00", by: "VS" },
          { id: "e11", type: "stage_change", description: "Movido para Proposta Enviada", timestamp: "2026-02-10T11:05:00", by: "VS" },
        ],
      },
    ],
  },
  {
    id: "negotiation",
    title: "Em Negociação",
    leads: [
      {
        id: "3", name: "Carlos Lima", phone: "(31) 97777-9012", value: 4200,
        lastContact: "Há 1d", tag: "Indicação", company: "Lima & Assoc.", probability: 75, assignee: "VS",
        origin: "whatsapp", score: 91, channel: "whatsapp", createdAt: "2026-01-15",
        responseTime: "2m", lastMessageAt: "2026-03-01T18:00:00",
        notes: ["Negociando desconto para contrato anual", "Precisa de aprovação do sócio"],
        interactionHistory: [
          { id: "e12", type: "message", description: "Primeiro contato - indicação", timestamp: "2026-01-15T09:00:00" },
          { id: "e13", type: "meeting", description: "Demo online - 45min", timestamp: "2026-01-22T14:00:00", by: "VS" },
          { id: "e14", type: "proposal", description: "Proposta Premium + desconto 15%", timestamp: "2026-02-01T10:00:00", by: "VS" },
          { id: "e15", type: "call", description: "Negociação de valores - contraproposta", timestamp: "2026-02-15T16:00:00", by: "VS" },
          { id: "e16", type: "note", description: "Aguardando aprovação do sócio até sexta", timestamp: "2026-02-28T11:00:00", by: "VS" },
        ],
      },
    ],
  },
  {
    id: "closed",
    title: "Fechado/Ganho",
    leads: [],
  },
  {
    id: "lost",
    title: "Fechado/Perdido",
    leads: [],
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
  lost: { bar: "bg-red-500", bg: "bg-red-500/8", text: "text-red-600" },
};
