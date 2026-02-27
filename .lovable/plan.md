

# Plano: Reestruturar Automações com layout dark do HTML fornecido

O HTML do usuario e uma landing page com estilo dark gradient (`#0f172a` → `#1e293b`), glassmorphism cards, e tipografia Inter. Vou aplicar esse visual ao conteudo existente da pagina de Automacoes, mantendo toda a logica funcional.

## Mudancas em `src/pages/Automacoes.tsx`

### Layout principal
- Fundo com gradiente dark: `bg-gradient-to-br from-[#0f172a] to-[#1e293b]` no container principal
- Textos em `text-white` / `text-slate-400` em vez dos tokens padrão
- Cards com estilo glassmorphism: `bg-white/5 backdrop-blur-xl border border-white/10 shadow-lg`

### Header (inspirado no header do HTML)
- Barra superior com titulo "Automações" alinhado a esquerda + nav links (Follow-ups, Etapas, IA, Gatilhos) como links de navegacao estilo `nav a` do HTML
- Botao "Novo Follow-up" no estilo `btn-primary` (`bg-[#2563eb] hover:bg-[#1d4ed8] rounded-xl`)

### Sidebar
- Manter sidebar funcional mas com fundo `bg-[#0f172a]/80 backdrop-blur` e itens com hover `bg-white/5`
- Textos `text-slate-400` com hover `text-white`
- Item ativo com `bg-[#2563eb]/15 text-[#2563eb]`

### Cards de stats
- Fundo `bg-white/5 backdrop-blur-xl border border-white/10`
- Valores em `text-white`, labels em `text-slate-400`
- Badges de percentual com fundo translucido

### Etapas do funil
- Card glassmorphism
- Botoes de etapa com borda `border-white/10`, ativo com `border-[#2563eb]/40 bg-[#2563eb]/10`

### Estado da IA
- Cards glassmorphism com cores sutis por estado

### Follow-ups
- Cards glassmorphism com borda esverdeada quando ativo (`border-emerald-500/20`)
- Barras de progresso mantidas
- Inputs com `bg-[#0f172a] text-white border-none` (estilo do HTML)

### Pro section
- Manter ProGate com visual adaptado ao tema dark

## Arquivos afetados
| Arquivo | Acao |
|---------|------|
| `src/pages/Automacoes.tsx` | Reescrever estilos de todos os elementos para tema dark gradient com glassmorphism |

