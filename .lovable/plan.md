

## CRM Premium -- Upgrade Completo Enterprise-Grade

O CRM Premium atual ja tem a estrutura de 4 abas (Pipeline, Dashboard Executivo, Motor de Atendimento, Automacao Comportamental). Vou elevar cada modulo ao nivel descrito no briefing, adicionando os componentes e funcionalidades que faltam.

---

### O que sera feito

**1. Modelo de Dados Expandido**
- Expandir a interface `Lead` com campos: `score`, `channel`, `interactionHistory`, `createdAt`, `notes`, `customFields`, `lastMessageAt`, `responseTime`
- Criar interface `Conversation` vinculada ao lead (id, leadId, channel, status, sla, avgResponseTime, rating)
- Atualizar dados mock para refletir o modelo completo

**2. Pipeline Avancado (Aba Pipeline)**
- Adicionar estagio "Fechado Perdido" ao pipeline inicial com cor vermelha
- Criar painel lateral de detalhes do lead ao clicar no card (historico de interacao, notas, timeline, score visual, acoes rapidas)
- Adicionar score badge visual no LeadCard com indicador de temperatura (frio/morno/quente)
- Mostrar canal de origem com icone no card
- Adicionar filtro por responsavel e por origem

**3. Dashboard Executivo (Aba Dashboard) -- Upgrade**
- Adicionar graficos reais com Recharts: funil de conversao interativo, receita por periodo (linha), leads por origem (pizza), performance por atendente (barras)
- Adicionar secao de Previsao de Receita com IA mais detalhada (grafico de projecao)
- Adicionar metricas de ciclo de venda (tempo medio por estagio)
- Adicionar comparativo periodo anterior vs atual com indicadores visuais

**4. Motor de Atendimento (Aba Atendimento) -- Upgrade**
- Tornar regras de SLA editaveis (campos de input para alterar metas)
- Adicionar toggle funcional nas regras de escalacao
- Adicionar secao NPS com grafico de distribuicao
- Adicionar painel de supervisao com acoes funcionais (monitorar, assumir, avaliar com modal de nota)
- Adicionar metricas de taxa de resolucao e conversas por atendente

**5. Automacao Comportamental (Aba Automacao) -- Upgrade**
- Adicionar modal de criacao de novo fluxo de automacao (gatilho, delay, acao)
- Adicionar visualizacao de fluxo estilo timeline/flowchart simplificado
- Adicionar metricas por fluxo com mini-graficos sparkline
- Expandir capacidades de IA com toggles funcionais (ativar/desativar cada modulo IA)

**6. Nova Aba: Seguranca e Compliance (Premium)**
- Adicionar 5a aba exclusiva Premium
- Secao LGPD: politica de retencao de dados, anonimizacao, consentimento
- Log de auditoria com historico de acoes
- Controle de permissoes granular (tabela de roles)
- Indicadores de compliance

**7. Lead Detail Panel (Novo Componente)**
- Slide-over ou sheet lateral que abre ao clicar em um lead
- Timeline completa de interacoes
- Notas internas com campo de adicao
- Score de probabilidade com breakdown
- Acoes: mover estagio, atribuir responsavel, adicionar tag, vincular conversa
- Historico de mensagens resumido

---

### Arquivos impactados

- `src/components/crm/types.ts` -- expandir interfaces
- `src/components/crm/data.ts` -- adicionar estagio perdido, dados enriquecidos
- `src/components/crm/LeadCard.tsx` -- score badge, canal, click handler
- `src/components/crm/LeadDetailPanel.tsx` -- novo componente
- `src/components/crm/ExecutiveDashboard.tsx` -- graficos Recharts, metricas expandidas
- `src/components/crm/AttendanceEngine.tsx` -- SLA editavel, NPS, acoes funcionais
- `src/components/crm/BehavioralAutomation.tsx` -- modal novo fluxo, toggles IA
- `src/components/crm/CompliancePanel.tsx` -- novo componente (5a aba)
- `src/components/crm/PipelineColumn.tsx` -- ajustes menores
- `src/pages/CRM.tsx` -- adicionar aba Compliance, integrar LeadDetailPanel, filtros expandidos

