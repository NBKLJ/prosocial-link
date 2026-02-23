
## Paleta de Cores Mais Diversificada

Atualmente o sistema usa praticamente uma unica cor de destaque (azul) em todos os lugares -- icones, badges, graficos, botoes. Isso faz tudo parecer monotono. Vou introduzir cores semanticas distintas para cada area, mantendo o visual profissional.

### Estrategia de Cores

Cada tipo de metrica/funcionalidade tera sua propria cor:

- **Mensagens Enviadas**: Azul (comunicacao)
- **Mensagens Recebidas**: Ciano/Teal (recepcao)
- **Novos Leads**: Violeta/Roxo (oportunidade)
- **Conversoes**: Esmeralda/Verde (sucesso)
- **Alertas/Perdidos**: Coral/Vermelho (atencao)
- **Agendamentos/Tempo**: Ambar/Laranja (urgencia)

### Arquivos a serem editados

**1. `src/index.css` - Novos tokens de cor**

Adicionar variaveis semanticas para uso consistente:
- `--success`: verde esmeralda (160 84% 39%)
- `--warning`: ambar (38 92% 50%)
- `--info`: ciano (190 90% 50%)
- `--accent-violet`: roxo (262 83% 58%)
- `--accent-orange`: laranja (25 95% 53%)
- `--accent-teal`: teal (168 76% 42%)

Atualizar os chart tokens para cores mais vibrantes e distintas entre si.

**2. `src/components/dashboard/MetricCard.tsx` - Cores individuais por card**

Cada MetricCard recebera uma prop `color` para definir a cor do icone e do badge de variacao, em vez de usar `primary` para todos.

**3. `src/pages/Index.tsx` - Aplicar cores nos cards do dashboard**

Passar cores distintas para cada MetricCard:
- Enviadas: azul
- Recebidas: teal
- Novos Leads: violeta
- Conversoes: esmeralda

**4. `src/components/dashboard/MessagesChart.tsx` - Gradientes mais vivos**

Trocar os gradientes de verde/azul desaturados por cores mais vibrantes e contrastantes entre si (azul royal + teal).

**5. `src/components/dashboard/FunnelChart.tsx` - Barras com cores mais diversas**

Atualizar as cores das barras do funil para usar a nova paleta: violeta, azul, esmeralda, coral.

**6. `tailwind.config.ts` - Registrar novas cores no Tailwind**

Adicionar as cores semanticas (`success`, `warning`, `info`, `accent-violet`, `accent-orange`, `accent-teal`) ao config para uso com classes utilitarias.

### Detalhes Tecnicos

**MetricCard - nova interface:**
```typescript
interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  positive: boolean;
  icon: LucideIcon;
  color?: "blue" | "teal" | "violet" | "emerald" | "amber" | "rose";
}
```

Cada cor mapeia para classes Tailwind especificas (ex: `color="violet"` gera `bg-violet-500/10 text-violet-500`).

**Tokens CSS adicionados ao `:root`:**
```css
--success: 160 84% 39%;
--warning: 38 92% 50%;
--info: 190 90% 50%;
--accent-violet: 262 83% 58%;
--accent-orange: 25 95% 53%;
--accent-teal: 168 76% 42%;
```

**Chart tokens atualizados:**
```css
--chart-1: 211 100% 50%;   /* azul */
--chart-2: 168 76% 42%;    /* teal */
--chart-3: 262 83% 58%;    /* violeta */
--chart-4: 38 92% 50%;     /* ambar */
--chart-5: 0 84% 60%;      /* coral */
```

O resultado sera um sistema visualmente mais rico e facil de interpretar, onde cada area funcional tem identidade cromatica propria.
