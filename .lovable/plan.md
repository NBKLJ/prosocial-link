

## Audit and Fix: Non-Functional Buttons Across the System

After reviewing every page in the application, here is a comprehensive inventory of buttons that currently do nothing or need functionality, organized by page.

---

### Summary of Issues Found

| Page | Non-functional buttons | Priority |
|------|----------------------|----------|
| **Conversas** | 6 buttons (send, emoji insert, attach, transfer feedback, input state, agendar mensagem) | High |
| **CRM** | 6 buttons (Novo Lead, Filtros, Pipeline dropdown, column +, column ..., Adicionar Estágio) | High |
| **Contatos** | 5 buttons (Novo Contato, Excluir, Exportar, Importar, Editar) | High |
| **Disparos** | 2 buttons (Novo Disparo, row click) | Medium |
| **Automacoes** | 2 buttons (Nova Automacao, toggle ativo/inativo) | Medium |
| **Configuracoes** | 4 buttons (Upgrade, Desconectar/Conectar, Edit/Delete conexao) | Medium |
| **Relatorios** | 1 button (Exportar) | Low |
| **Agendamentos** | 1 button (Novo Agendamento) | Low |
| **DisparoRecepcao** | 1 button (Salvar - no feedback) | Low |
| **ClientDetailPanel** | 1 button (Agendar mensagem) | Low |

---

### Implementation Plan

#### 1. Conversas - Chat Functionality (High Priority)

- **Text input**: Add controlled state (`messageText`) so typed text is tracked
- **Send button**: On click (or Enter key), add the typed message to the messages array and clear input
- **Emoji picker**: Clicking an emoji appends it to the input field instead of just closing the picker
- **Attach menu items** (Image, Document, Sticker): Show a toast notification "Funcionalidade em breve" since there's no backend
- **Transfer button**: After selecting a user, show a toast confirming "Conversa transferida para [user]"
- **Finalizar button**: Show toast confirmation "Conversa finalizada"

#### 2. CRM - Pipeline Actions (High Priority)

- **Novo Lead**: Open a modal form to create a new lead (name, phone, value, company, email, probability, tag) and add it to the first pipeline stage
- **Column "+" button**: Same modal but pre-selects that column's stage
- **Column "..." button**: Show a dropdown with "Renomear" and "Limpar" options
- **Adicionar Estágio**: Open a simple input modal to add a new pipeline column
- **Filtros button**: Toggle a filter panel (by tag, value range)
- **Pipeline dropdown**: Show toast "Pipeline padrão" (single pipeline for now)

#### 3. Contatos - Contact Management (High Priority)

- **Novo Contato**: Open a modal form (name, phone, email, tags) and add to the contacts list
- **Editar (Pencil)**: Open the same modal pre-filled with contact data for editing
- **Excluir**: Remove selected contacts from the list with a confirmation toast
- **Exportar**: Generate a CSV download of the filtered contacts
- **Importar**: Show toast "Funcionalidade em breve"

#### 4. Disparos (Medium Priority)

- **Novo Disparo**: Open a modal form (title, type, contacts count) to create a new campaign entry
- **Row click**: Expand or show details of that campaign

#### 5. Automacoes (Medium Priority)

- **Nova Automacao**: Open a modal to create a new automation (name, trigger, action)
- **Toggle Ativo/Inativo**: Make the toggle actually switch the automation's active state in local state

#### 6. Configuracoes (Medium Priority)

- **Upgrade buttons**: Show toast "Redirecionando para planos..." (placeholder)
- **Desconectar/Conectar**: Toggle the connection status in local state with toast feedback
- **Edit connection**: Show toast "Editando conexão..."
- **Delete connection**: Remove from list with confirmation

#### 7. Remaining Pages (Low Priority)

- **Relatorios Exportar**: Show toast "Relatório exportado" (placeholder)
- **Agendamentos Novo Agendamento**: Redirect to the DisparoAgendamento page which already works
- **DisparoRecepcao Salvar**: Show toast "Configuração salva com sucesso"
- **ClientDetailPanel Agendar mensagem**: Open a simple inline form with date/time/message fields

---

### Technical Approach

- Use `sonner` toast (already installed) for all user feedback notifications
- Add controlled state and local array mutations for CRUD operations (no backend)
- Create reusable modal patterns consistent with existing modals (DisparoAgendamento, Configuracoes users)
- CSV export for Contatos using `Blob` + `URL.createObjectURL`
- All changes are local state only - data resets on page refresh (consistent with current pattern)

### Files to be Modified

- `src/pages/Conversas.tsx` - Chat send, emoji insert, transfer/finalizar feedback
- `src/pages/CRM.tsx` - Novo Lead modal, column actions, add stage
- `src/components/crm/PipelineColumn.tsx` - Column header button callbacks
- `src/pages/Contatos.tsx` - CRUD modal, export CSV, delete
- `src/pages/Disparos.tsx` - Novo Disparo modal
- `src/pages/Automacoes.tsx` - Nova Automacao modal, toggle state
- `src/pages/Configuracoes.tsx` - Connection toggle, upgrade toast
- `src/pages/Relatorios.tsx` - Export toast
- `src/pages/Agendamentos.tsx` - Redirect to DisparoAgendamento
- `src/pages/DisparoRecepcao.tsx` - Save feedback toast
- `src/components/conversas/ClientDetailPanel.tsx` - Agendar mensagem form

