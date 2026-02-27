

# Adicionar "Mensagem Programada" no submenu de Disparos

## Mudança

Adicionar o item **"Mensagem Programada"** no sidebar, logo abaixo de "Áudio Programado", apontando para uma nova rota `/disparos/mensagem`.

## Arquivos

| Arquivo | Ação |
|---------|------|
| `src/components/AppSidebar.tsx` | Adicionar subItem "Mensagem Programada" com ícone `MessageSquare` após "Áudio Programado" |
| `src/pages/DisparoMensagem.tsx` | Criar nova página de mensagem programada (mesmo padrão do DisparoAgendamento — listagem, modal de criação, seleção de conexão, destinatários por tags, data/hora) |
| `src/App.tsx` | Adicionar rota `/disparos/mensagem` com o componente `DisparoMensagem` |

## Detalhes da página DisparoMensagem

- Header "Mensagem Programada" com botão "Nova Mensagem"
- Listagem de mensagens programadas com status (Agendado/Enviado)
- Modal de criação: conexão de envio, título, corpo da mensagem (textarea), data, horário, destinatários (todos ou filtrar por tags)
- Botão excluir para itens agendados
- Layout idêntico ao padrão já usado em DisparoAgendamento/DisparoAudio

