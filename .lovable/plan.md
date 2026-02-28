

# Reestruturação Total da Landing Page — Estilo "Dubai Tech"

A landing page atual tem um visual dark tech competente mas genérico. A proposta é uma reconstrução completa com estética de luxo tecnológico inspirada em Dubai: ouro sobre preto, geometria angular, transições cinematográficas e sensação de exclusividade absoluta.

## Direção Visual

- Paleta: preto profundo (#05070A), dourado (#C8A55A / #E8C875), branco puro para contraste, azul real (#1E40AF) como acento secundário
- Tipografia: pesos extremos (extra-light + ultra-bold), tamanhos grandes, tracking wide
- Geometria: linhas diagonais, formas hexagonais, padrões de grid com perspectiva
- Glassmorphism premium com bordas douradas sutis

## Seções e Animações

### 1. Hero Cinematográfico
- Fundo com grid em perspectiva 3D (CSS perspective + linhas convergindo ao centro)
- Partículas douradas flutuando lentamente
- Headline com reveal por máscara (clipPath animado, letra por letra)
- Badge "Plataforma #1 do Brasil" com brilho pulsante dourado
- Botão principal com borda dourada animada (gradient rotation)
- Stats inline com contadores animados na própria hero

### 2. Seção "Parceiros/Confiança"
- Logos fictícias em carrossel infinito com marquee animation
- Linha divisória com gradiente dourado

### 3. Features em Grid Angular
- Cards com corte diagonal no canto (clip-path polygon)
- Ícone com ring dourado pulsante no hover
- Linha conectora entre cards com animação de traçado (stroke-dashoffset)
- Hover: card sobe + borda dourada aparece + glow sutil

### 4. Seção "O Sistema" (Demo Interativa)
- Mockup do dashboard dentro de um frame com bordas chanfradas douradas
- Elementos do dashboard aparecem com stagger progressivo
- Efeito de "hologram scan" — linha horizontal percorrendo o mockup

### 5. Seção de Números/Impacto
- Layout em 2 colunas: texto à esquerda + grid de métricas à direita
- Contadores com formatação grande e dourada
- Barras de progresso animadas

### 6. Planos (Pricing)
- Layout de 3 colunas mantido, mas com estética premium
- Plano Pro com moldura dourada e efeito de luz rotativa na borda
- Plano Premium com fundo com textura sutil de carbono
- Badges e checks dourados
- Preços com fonte extra-large e peso bold

### 7. CTA Final
- Fundo com gradiente radial dourado ultra-sutil
- Texto grande centralizado com animação de reveal
- Botão com animação de brilho percorrendo a borda (conic-gradient rotation)

### 8. Footer Premium
- Links organizados em colunas
- Logo com versão dourada
- Linha decorativa dourada no topo

## Implementação

**Arquivo único**: `src/pages/Landing.tsx` — reescrita completa (~900 linhas)

**Componentes internos**:
- `GoldParticles` — partículas douradas com canvas
- `PerspectiveGrid` — grid 3D no fundo do hero
- `RevealText` — texto que aparece com clip-path
- `AngularCard` — card com corte diagonal e glow dourado
- `BorderGlow` — borda com gradiente rotativo (CSS conic-gradient)
- `HologramScan` — linha de scan horizontal no mockup
- `MarqueeRow` — carrossel infinito de logos

**Dependências**: Nenhuma nova, tudo com framer-motion + CSS puro

