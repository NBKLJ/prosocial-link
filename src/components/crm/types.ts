export interface InteractionEvent {
  id: string;
  type: 'message' | 'call' | 'email' | 'note' | 'stage_change' | 'proposal' | 'meeting';
  description: string;
  timestamp: string;
  by?: string;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  value: number;
  lastContact: string;
  tag?: string;
  company?: string;
  probability?: number;
  assignee?: string;
  createdAt?: string;
  origin?: 'whatsapp' | 'site' | 'indicacao' | 'anuncio';
  convertedAt?: string;
  score?: number;
  channel?: 'whatsapp' | 'email' | 'phone' | 'chat';
  interactionHistory?: InteractionEvent[];
  notes?: string[];
  customFields?: Record<string, string>;
  lastMessageAt?: string;
  responseTime?: string;
}

export interface Conversation {
  id: string;
  leadId: string;
  channel: 'whatsapp' | 'email' | 'phone' | 'chat';
  assignee: string;
  status: 'open' | 'pending' | 'closed';
  sla: { target: number; current: number; unit: 'min' | 'h' };
  avgResponseTime: string;
  rating?: number;
  startedAt: string;
}

export interface Pipeline {
  id: string;
  title: string;
  leads: Lead[];
}
