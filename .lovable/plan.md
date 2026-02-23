

## Redesign Visual: Mais Profundidade e Separacao

O problema principal e que o background (`98% luminosidade`), os cards (`100% branco puro`) e o muted (`96%`) sao todos quase identicos - nao ha contraste entre eles. Vou criar uma hierarquia visual clara com 3 camadas distintas.

### Mudancas Planejadas

**1. Paleta de Cores (src/index.css)**

Ajustar os tokens CSS para criar camadas visuais bem definidas:

- **Background principal**: Mudar de branco quase puro para um cinza azulado suave (`220 20% 93%`) - isso cria a "base" visual
- **Cards**: Manter branco puro mas com sombra sutil para "flutuar" sobre o fundo
- **Muted/Secondary**: Tom intermediario entre o fundo e os cards (`220 16% 96%`)
- **Bordas**: Ligeiramente mais visiveis (`220 15% 87%`) para separar elementos
- **Sidebar**: Escurecer um pouco mais para maior contraste lateral (`220 18% 10%`)

Tambem vou:
- Adicionar uma sombra padrao sutil nos cards via `.glass-card`
- Refinar o `--input` para campos de formulario ficarem mais distintos

**2. Sidebar (src/components/AppSidebar.tsx)**

- Trocar o fundo de `bg-card` para um fundo escuro constante usando as variaveis do sidebar
- Textos e icones adaptados para contrastar com fundo escuro
- Isso cria a separacao clara que falta entre menu e conteudo

**3. Layout Principal (src/components/AppLayout.tsx)**

- Adicionar um background sutil na area de conteudo para reforcar a hierarquia

**4. Componentes de Pagina**

Ajustes pontuais nos seguintes arquivos para aproveitar o novo contraste:

- **CRM (PipelineColumn, PipelineMetrics)**: Cards dos leads e metricas com sombras sutis
- **Conversas**: Area de chat com fundo ligeiramente diferente da lista de contatos
- **Contatos e Configuracoes**: Tabelas com headers mais marcados

---

### Detalhes Tecnicos

**src/index.css - Novos tokens light mode:**
```
--background: 220 20% 93%;
--card: 0 0% 100%;
--muted: 220 16% 96%;
--border: 220 15% 87%;
--input: 220 15% 91%;
--sidebar-background: 220 20% 10%;
```

**src/components/AppSidebar.tsx:**
- Classe da `aside`: trocar `bg-card border-r border-border` para `bg-[hsl(var(--sidebar-background))]` com textos claros
- Search input, nav items, footer - todos adaptados para fundo escuro
- Logo area com melhor contraste

**src/index.css - Utilidades atualizadas:**
- `.glass-card` recebe `shadow-sm` por padrao
- Nova classe `.surface-elevated` para elementos que precisam se destacar

**Arquivos que serao editados:**
1. `src/index.css` - Tokens de cor
2. `src/components/AppSidebar.tsx` - Sidebar escura
3. `src/components/AppLayout.tsx` - Background do layout
4. `src/components/crm/PipelineColumn.tsx` - Sombras nos cards
5. `src/components/crm/PipelineMetrics.tsx` - Sombras nas metricas
6. `src/pages/Conversas.tsx` - Separacao visual das areas
7. `src/pages/Contatos.tsx` - Headers de tabela mais marcados
8. `src/pages/Configuracoes.tsx` - Tabs e cards com mais contraste
9. `src/pages/Disparos.tsx` - Tabela com headers mais marcados

O resultado final sera um sistema com hierarquia visual clara: fundo cinza -> cards brancos flutuantes -> sidebar escura, mantendo o estilo minimalista Apple.

