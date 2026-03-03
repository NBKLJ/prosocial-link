export interface FlowStep {
  id: string;
  type: 'trigger' | 'wait' | 'message' | 'condition' | 'action';
  config: Record<string, any>;
}

export interface AutomationFlow {
  id: string;
  name: string;
  description: string;
  category: 'follow-up' | 'pos-venda' | 'reengajamento' | 'custom';
  active: boolean;
  steps: FlowStep[];
  stats: {
    sent: number;
    replied: number;
    recovered: number;
  };
  createdAt: string;
  lastTriggered?: string;
}

export const VARIABLES = [
  { key: '{nome}', label: 'Nome do cliente' },
  { key: '{dias_sem_resposta}', label: 'Dias sem resposta' },
  { key: '{ultimo_assunto}', label: 'Último assunto tratado' },
  { key: '{atendente}', label: 'Nome do atendente' },
  { key: '{empresa}', label: 'Empresa do cliente' },
  { key: '{produto}', label: 'Produto/serviço de interesse' },
];
