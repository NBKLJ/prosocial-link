

# Reestruturação Completa da Página de Automações

Baseado no XML fornecido, a página será completamente reescrita com o seguinte layout:

## Estrutura Principal

1. **Header** - "Central de Automações" com subtítulo e botão "Criar Nova Automação"

2. **4 Cards de métricas** em grid:
   - Automações Ativas (12, +8%)
   - Mensagens Enviadas (4.280, +12%)
   - Taxa Média de Resposta (46%, +3.2%)
   - Conversões Geradas (389, +5.4%)

3. **Módulos de Automação** - 4 cards com ícones e status:
   - Follow-ups Inteligentes (Ativo, 4 fluxos)
   - Gatilhos por Palavra (Ativo, 6 regras)
   - Sequências Automatizadas (Pausado)
   - Envios em Massa (Ativo, 2 campanhas)

4. **Tabela "Atividade Recente"** com colunas: Automação, Ação, Status, Data

5. **Modal de criação/edição** com campos: nome, gatilho (seletor), ações, status toggle

6. **Barra de busca + filtro por status** acima dos módulos

## Mudanças

| Arquivo | Ação |
|---------|------|
| `src/pages/Automacoes.tsx` | Reescrever completamente |

## Detalhes

- Remove o layout sidebar+content atual, usa layout de página cheia dentro do `AppLayout`
- Mantém `ProGate`/`ProBadge` para automações avançadas
- Modal usa Dialog do shadcn para criar/editar automação
- Cada automação tem: nome, gatilho (trigger), lista de ações, status (Ativa/Pausada), botões editar/excluir
- Filtro dropdown por status (Todas, Ativas, Pausadas)
- Campo de busca filtra por nome da automação
- Tabela de atividade recente com badges de status coloridos (Executado=verde, Pendente=amarelo)
- Layout responsivo: grid de métricas 4→2→1 cols, módulos 4→2→1 cols

