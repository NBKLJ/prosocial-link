

## Plano: Redesign Completo da Página IAs Setoriais

Baseado na imagem de referência, a página será completamente reestruturada para seguir o mesmo padrão visual e funcional de um gerenciador de agentes de IA profissional.

---

### Nova Estrutura da Página

**1. Bloco Topo — "Criador de IAs Setoriais"**
- Card com ícone + título "Criador de IAs Setoriais" + subtítulo "Crie sua IA setorial personalizada"
- Duas opções lado a lado:
  - **Assistente de Criação** (com badge "Recomendado" verde) — "Responda perguntas simples e criaremos a IA perfeita para você"
  - **Criação Avançada** — "Configure manualmente prompt, tom de voz e regras"
- Ambas abrem modais de criação (simulado por enquanto)

**2. Barra de Busca e Ações**
- Input "Buscar IAs setoriais..."
- Botão "Modelos" com ícone
- Botão escuro "+ Criar do zero"

**3. Banner de Alerta** (condicional)
- Alerta amarelo/laranja: "Nenhuma IA vinculada a uma conexão — Para que uma IA faça o primeiro atendimento, vincule-a a uma conexão do WhatsApp."
- Aparece se alguma IA ativa não tem conexão vinculada

**4. Seção "IAs ATIVAS" (collapsible)**
- Header: "IAS ATIVAS (N)" com chevron para expandir/recolher
- Grid de cards (até 3 por linha), cada card contém:
  - Ícone do setor + Nome em bold + botão power (toggle ativo/inativo)
  - Indicadores de status: Gatilhos, Regras, Etapas, FAQ — cada um "CONFIGURADO" (verde) ou "NÃO CONFIG." (vermelho)
  - Seção "VINCULAR CONEXÃO" com dropdown Select para escolher uma conexão WhatsApp

**5. Seção "IAs INATIVAS" (collapsible)**
- Mesmo padrão, mostra IAs com `active: false`
- Recolhida por padrão

---

### Modelo de Dados Expandido

Adicionar campos ao `SectorIA`:
- `triggers: boolean` — gatilhos configurados
- `rules: boolean` — regras configuradas
- `steps: boolean` — etapas configuradas
- `faq: boolean` — FAQ configurado
- `connectionId: string | null` — conexão vinculada

---

### Detalhes Técnicos

**Arquivo principal**: `src/pages/IAsSetoriais.tsx` — reescrita completa

**Componentes utilizados**: `Select` (radix), `Collapsible` (radix), `Input`, `Button`, `Badge`, `ProGate`, `ProBadge`

**Padrão visual**: bordas `border-border`, fundo `bg-card`, sombras suaves, sem glassmorphism pesado. Cards com `rounded-xl border border-border bg-card`. Badges de status com cores verde/vermelho e texto uppercase `text-[11px] font-bold tracking-wide`.

