

# Redesign da Página de Login + Nova Logo Birdly + Paleta Dubai Tech

## Mudanças

### 1. Copiar a imagem do logo Birdly para o projeto
- Copiar `user-uploads://WhatsApp_Image_2026-02-27_at_23.33.29.jpeg` para `src/assets/birdly-logo.png`

### 2. Reescrever `src/pages/Login.tsx` com estética Dubai Tech
- **Fundo**: preto profundo `#05070A` em toda a tela
- **Painel esquerdo**: manter ilustração com overlay escuro + textos em branco/dourado
- **Painel direito**: fundo `#0A0D14` com form estilizado
  - Logo Birdly (imagem enviada) no topo, grande e centralizada
  - Branding "birdly" em texto branco ao lado do logo
  - Labels e placeholders em `#C8A55A` (dourado) / branco
  - Inputs com fundo `rgba(200,165,90,0.08)`, borda `rgba(200,165,90,0.2)`, focus ring dourado
  - Botão "Entrar" com gradiente dourado (`#C8A55A` → `#E8C875`), texto preto
  - Link "Esqueceu a senha?" em dourado
  - Checkbox border dourado
- **Toda a lógica de autenticação permanece idêntica** (USERS fixos + dynamic users)

### 3. Atualizar branding na sidebar (`src/components/AppSidebar.tsx`)
- Trocar import do logo antigo pelo novo Birdly logo
- Atualizar texto de "ZapProBR" para "birdly"

### Paleta aplicada (mesma da Landing):
- Preto: `#05070A`, `#0A0D14`
- Dourado: `#C8A55A`, `#E8C875`
- Texto: branco puro, `rgba(255,255,255,0.6)` para secundários

