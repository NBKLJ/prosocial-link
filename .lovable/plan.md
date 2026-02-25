

# Plano de Implementacao — Melhorias Gerais ZapProBR

Este plano cobre todas as solicitacoes agrupadas por modulo. Sao ~18 itens de trabalho distribuidos em 7 arquivos principais.

---

## 1. Sidebar — Corrigir contagem de Conversas e Disparos

**Arquivo:** `src/components/AppSidebar.tsx`

- **Conversas count: 12 → 5** — Alterar `count: 12` para `count: 5` (refletindo as 5 conversas existentes).
- **Disparos count: 3 → remover** — Remover a propriedade `count: 3` do item Disparos.
- **Seta Disparos:** Quando sub-items estiverem expandidos, ocultar o icone ChevronDown. Mostra-lo somente quando recolhido. Logica: condicionar renderizacao do ChevronDown a `!isExpanded`.

---

## 2. Conversas — Filtros avancados no topo

**Arquivo:** `src/pages/Conversas.tsx`

- Adicionar filtros ao lado do titulo "Conversas":
  - **Por atendente** (dropdown com lista de atendentes)
  - **Por tag** (dropdown com tags do tagStore)
  - **Por finalizados** (ja existe como status filter, apenas manter visivel)
  - **Por lead** (filtrar conversas que estao no CRM)
- Implementar a logica de filtragem combinada no array `filtered`.

---

## 3. Conversas — Botao de ligacao WhatsApp no header

**Arquivo:** `src/pages/Conversas.tsx`

- Adicionar um botao com icone `Phone` no header do chat (ao lado dos botoes Transferir/Status/Finalizar).
- Ao clicar, abrir link `https://wa.me/{numero}` (simulando ligacao via WhatsApp).

---

## 4. Conversas — Transferencia com modal centralizado

**Arquivo:** `src/pages/Conversas.tsx`

- Substituir o dropdown de transferencia por um **Dialog** (modal centralizado).
- O modal deve conter 3 selects:
  1. **Conexao** (lista de conexoes do sistema: Comercial, Suporte)
  2. **Departamento** (Gestao, Suporte, Vendas, Financeiro)
  3. **Usuario** (lista filtrada por departamento)
- Botao "Transferir" que ao clicar:
  - Remove a conversa da lista do usuario atual
  - Exibe toast de confirmacao

---

## 5. Conversas — Notificacoes de status no topo do chat

**Arquivo:** `src/pages/Conversas.tsx`

- Adicionar sistema de mensagens de sistema no chat (tipo "banners" inline).
- Ao alterar status, iniciar ou finalizar atendimento, inserir uma mensagem de sistema no array `chatMessages` com estilo diferenciado (centralizada, cor neutra, texto pequeno).

---

## 6. Conversas — Mais um atendimento de exemplo

**Arquivo:** `src/pages/Conversas.tsx`

- Adicionar uma 6a conversa ao array `conversations` com status diferente dos existentes para cobrir todos os cenarios visuais. Exemplo: status "atendendo", com tags, com unreads.

---

## 7. Client Detail Panel — Agendamento com audio/imagem

**Arquivo:** `src/components/conversas/ClientDetailPanel.tsx`

- No formulario de "Agendar mensagem", adicionar opcoes de tipo de conteudo:
  - Texto (ja existe)
  - Audio (botao de upload simulado)
  - Imagem (botao de upload simulado)
- Permitir selecionar multiplos tipos simultaneamente (checkboxes ou toggle buttons).

---

## 8. CRM — Sincronizar leads com conversas

**Arquivo:** `src/pages/CRM.tsx` e `src/components/crm/data.ts`

- Alterar `initialPipelines` em `data.ts` para conter apenas leads cujos nomes correspondem as 5 conversas existentes: Joao Silva, Maria Souza, Carlos Lima, Ana Costa, Pedro Rocha.
- Remover leads extras (Fernanda Dias, Ricardo Alves, Juliana Mendes, Lucia Santos).
- Redistribuir os 5 leads entre os estagios.

---

## 9. CRM — Filtros funcionais e remocao do botao Pipeline

**Arquivo:** `src/pages/CRM.tsx`

- Expandir a busca para filtrar por: nome, valor, e-mail e telefone.
- Remover o botao "Pipeline" (segundo botao ao lado dos filtros).
- O botao "Filtros" pode abrir um painel com campos de filtragem avancada (valor min/max, e-mail, telefone).

---

## 10. CRM — Modal Novo Lead mais largo

**Arquivo:** `src/pages/CRM.tsx`

- No Dialog de "Novo Lead", alterar o DialogContent para ser mais largo e menos alto.
- Usar layout em 2 colunas (grid) para os campos do formulario, reduzindo a altura total.

---

## 11. Disparos — Botao "Novo Disparo" funcional

**Arquivo:** `src/pages/Disparos.tsx`

- Ao clicar em "Novo Disparo", abrir um modal completo para criar uma nova campanha.
- O modal deve ter: titulo, tipo (Texto/Audio/Imagem, multi-selecao), conteudo, destinatarios (todos ou por tags), e botao de salvar.
- Salvar deve adicionar o disparo a lista.

---

## 12. Disparos — Agendamento com multi-formato

**Arquivo:** `src/pages/DisparoAgendamento.tsx`

- Alterar selecao de tipo de conteudo de single-select para **multi-select** (checkboxes/toggles).
- Permitir selecionar texto + audio + imagem simultaneamente.
- Mostrar campos de upload/input para cada tipo selecionado.

---

## 13. Recepcao Automatica — Opcao de anuncios

**Arquivo:** `src/pages/DisparoRecepcao.tsx`

- Adicionar secao "Respostas por Anuncio":
  - Campo para palavra-chave/gatilho do anuncio
  - Tipo de resposta (Texto, Audio, Texto+Audio)
  - Conteudo da resposta
  - Botao para adicionar multiplas regras de resposta automatica
- Manter a secao atual de "Resposta automatica" como padrao, e a nova como regras condicionais.

---

## 14. Contatos — Botao para iniciar conversa

**Arquivo:** `src/pages/Contatos.tsx`

- Adicionar na coluna de acoes um botao com icone `MessageCircle`.
- Ao clicar, navegar para `/conversas` passando query param ou state com o contato selecionado para abrir diretamente a conversa.

---

## 15. Configuracoes — Planos visiveis ao clicar upgrade

**Arquivo:** `src/pages/Configuracoes.tsx`

- Ao clicar no botao "Upgrade" ou no badge do plano, exibir um modal/secao com os 3 planos:
  - **Basic** — recursos atuais
  - **Pro** — mais conexoes, automacoes avancadas
  - **Premium** — tudo ilimitado, suporte prioritario
- Cards com preco, features e botao de selecao.

---

## 16. Configuracoes — Etiquetas com visual profissional

**Arquivo:** `src/pages/Configuracoes.tsx`

- Redesenhar a secao de etiquetas:
  - Cada tag em um card/row com: dot de cor, nome, botao editar cor, botao remover.
  - Layout tipo lista ao inves de chips inline.
  - Preview da cor no seletor mais elegante.

---

## 17. Configuracoes — Usuarios com acesso ao login

**Arquivo:** `src/pages/Configuracoes.tsx` e `src/pages/Login.tsx`

- Ao criar um usuario em Configuracoes, salvar no localStorage uma lista de usuarios validos.
- Na tela de Login, alem dos 3 usuarios fixos, verificar tambem a lista dinamica do localStorage.
- Assim, usuarios criados em Configuracoes podem fazer login imediatamente.

---

## Detalhes Tecnicos

- Todos os modais usarao o componente `Dialog` do Radix ja instalado.
- Filtros avancados usarao state local com `useState`.
- Dados continuam em memoria (stores locais), sem backend.
- As conversas e leads serao sincronizados via o `crmStore` existente.
- Icone de telefone: `Phone` do lucide-react.
- Multi-select de tipos de conteudo: array de tipos selecionados com toggle.

---

## Ordem de Implementacao

1. Sidebar (fix counts + chevron) — rapido
2. CRM (sync leads, filtros, modal, remover botao)
3. Conversas (filtros, telefone, transferencia modal, notificacoes, +1 conversa)
4. Client Detail Panel (agendamento multi-formato)
5. Disparos (novo disparo funcional)
6. Agendamento (multi-formato)
7. Recepcao (anuncios)
8. Contatos (botao conversa)
9. Configuracoes (planos, etiquetas, usuarios com login)

