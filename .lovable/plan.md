

## Plano: Módulo Pastas → Imposto de Renda

### O que será construído

1. **Novo item "Pastas" no menu lateral** com sub-item "Imposto de Renda" (expandível, com ícone `FolderOpen`/`Receipt`)

2. **Nova página `/pastas/imposto-de-renda`** com seção "Distribuição de Lucros e Pró-labore" contendo:
   - Botão "Exportar Planilha" no topo
   - Ao clicar, expande um painel de filtro com dois date pickers (Data Inicial / Data Final) usando Popover + Calendar do shadcn (com `pointer-events-auto`)
   - Botão "Exportar" que gera e baixa um arquivo `.csv` com as empresas que tiveram movimentação no período, organizadas em colunas (Empresa, CNPJ, Tipo, Valor, Data, etc.)

3. **Dados mock** de empresas com movimentações de distribuição de lucros e pró-labore para demonstração

### Alterações por arquivo

| Arquivo | Ação |
|---|---|
| `src/components/AppSidebar.tsx` | Adicionar item "Pastas" expandível com sub-item "Imposto de Renda" (ícones `FolderOpen`, `Receipt`) |
| `src/pages/ImpostoDeRenda.tsx` | Criar página com seção de distribuição, botão exportar, filtro de datas e lógica de geração CSV |
| `src/App.tsx` | Registrar rota `/pastas/imposto-de-renda` protegida |

### Detalhes técnicos

- **Date pickers**: Dois Popover+Calendar (shadcn) com `pointer-events-auto`, formatados com `date-fns` em pt-BR (dd/MM/yyyy)
- **Exportação CSV**: Geração client-side filtrando movimentações pelo período, criando Blob e disparando download via `URL.createObjectURL`
- **Dados mock**: Array de empresas com array de movimentações (tipo: "Distribuição de Lucros" | "Pró-labore", valor, data), filtrados pelo range de datas
- **Layout**: Segue o padrão `AppLayout` já usado nas outras páginas, com ProGate se necessário

