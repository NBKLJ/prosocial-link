

# Plano: Funcionalidades Exclusivas do Plano Pro

Implementacao completa das features Pro, controladas por um helper de verificacao de plano. Usuarios Basic veem badges "PRO" com cadeado e botao de upgrade; usuarios Pro/Premium acessam tudo.

---

## 1. Helper de controle de plano

**Novo arquivo:** `src/lib/planAccess.ts`
- Funcoes `isPro()`, `isPremium()`, `isBasic()` lendo `localStorage("zapprobr_user").plan`

**Novo componente:** `src/components/ui/ProGate.tsx`
- Wrapper: se Pro+ renderiza children, senao mostra card com icone de cadeado + "Funcionalidade do Plano Pro" + botao "Fazer Upgrade"

**Novo componente:** `src/components/ui/ProBadge.tsx`
- Badge pequeno "PRO" reutilizavel

---

## 2. IA de Recepcao Inteligente

**Arquivo:** `src/pages/DisparoRecepcao.tsx`
- Adicionar secao Pro-only apos as regras de anuncio:
  - Selecao de setor da IA (Comercial, Financeiro, Suporte)
  - Toggle para ativar IA de recepcao
  - Preview simulado da resposta da IA baseada no setor
- Envolvido em `ProGate`

---

## 3. IAs Personalizadas por Setor

**Novo arquivo:** `src/pages/IAsSetoriais.tsx` (rota `/ias-setoriais`)
- 3 cards (Comercial, Financeiro, Suporte) com:
  - Prompt editavel, tom de voz (formal/amigavel/tecnico), toggle ativo/inativo
- Toda a pagina envolvida em `ProGate`

**Atualizar:** `src/App.tsx` — nova rota `/ias-setoriais`
**Atualizar:** `src/components/AppSidebar.tsx` — novo item "IAs Setoriais" com icone `Brain` e badge PRO

---

## 4. Agendamento com Google Meet

**Arquivo:** `src/pages/Agendamentos.tsx`
- Secao Pro-only "Agendamento Automatico":
  - Toggle integracao Google Meet (mock)
  - Formulario: titulo, duracao, participantes
  - Lista de reunioes com link Meet mockado
- Envolvido em `ProGate`

---

## 5. CRM Avancado

**Arquivo:** `src/components/crm/types.ts`
- Adicionar campos `origin` (`'whatsapp' | 'site' | 'indicacao' | 'anuncio'`) e `convertedAt` ao tipo Lead

**Arquivo:** `src/components/crm/data.ts`
- Adicionar `origin` aos leads existentes

**Novo componente:** `src/components/crm/LeadOriginChart.tsx`
- Grafico de pizza com origens (recharts)

**Arquivo:** `src/components/crm/PipelineMetrics.tsx`
- Adicionar metricas Pro+: taxa de conversao, leads por origem (envolvidas em ProGate)

**Arquivo:** `src/components/crm/LeadCard.tsx`
- Mostrar badge de origem no card

---

## 6. Distribuicao Automatica de Leads

**Arquivo:** `src/pages/CRM.tsx`
- Botao "Distribuicao Automatica" (Pro-only) no header
- Modal com lista de vendedores, metodo round-robin, toggle ativo/inativo
- Ao criar lead com distribuicao ativa, atribuir `assignee` automaticamente

---

## 7. Automacoes por Gatilho

**Arquivo:** `src/pages/Automacoes.tsx`
- Adicionar automacoes Pro-only: follow-up automatico (tempo configuravel), alertas de inatividade, mover lead no CRM
- Cada item Pro com badge PRO
- Envolvidos em `ProGate`

**Atualizar:** `src/App.tsx` — rota `/automacoes`
**Atualizar:** `src/components/AppSidebar.tsx` — item "Automacoes" no menu

---

## 8. Painel Analitico Pro

**Novos componentes:**
- `src/components/dashboard/ConversionChart.tsx` — AreaChart de conversao por periodo
- `src/components/dashboard/AttendantPerformanceChart.tsx` — BarChart horizontal por atendente
- `src/components/dashboard/LeadOriginPieChart.tsx` — PieChart de origens

**Arquivo:** `src/pages/Index.tsx`
- Adicionar secao Pro-only com os 3 graficos extras abaixo dos atuais
- Metricas extras: taxa de conversao, tempo medio de resposta

---

## 9. Configuracoes — Limite de 5 conexoes

**Arquivo:** `src/pages/Configuracoes.tsx`
- Alterar limite de conexoes para mostrar `5` quando plano Pro (ja existe logica para `currentPlan`)
- Atualizar a descricao do plano Pro no array `plans` com as novas features

---

## Resumo de arquivos

| Acao | Arquivo |
|------|---------|
| Criar | `src/lib/planAccess.ts` |
| Criar | `src/components/ui/ProGate.tsx` |
| Criar | `src/components/ui/ProBadge.tsx` |
| Criar | `src/pages/IAsSetoriais.tsx` |
| Criar | `src/components/crm/LeadOriginChart.tsx` |
| Criar | `src/components/dashboard/ConversionChart.tsx` |
| Criar | `src/components/dashboard/AttendantPerformanceChart.tsx` |
| Criar | `src/components/dashboard/LeadOriginPieChart.tsx` |
| Editar | `src/App.tsx` |
| Editar | `src/components/AppSidebar.tsx` |
| Editar | `src/pages/DisparoRecepcao.tsx` |
| Editar | `src/pages/Agendamentos.tsx` |
| Editar | `src/pages/CRM.tsx` |
| Editar | `src/pages/Automacoes.tsx` |
| Editar | `src/pages/Index.tsx` |
| Editar | `src/pages/Configuracoes.tsx` |
| Editar | `src/components/crm/types.ts` |
| Editar | `src/components/crm/data.ts` |
| Editar | `src/components/crm/PipelineMetrics.tsx` |
| Editar | `src/components/crm/LeadCard.tsx` |

