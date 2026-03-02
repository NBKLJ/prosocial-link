

## Plano: Redesign Completo da Página de Detalhe de Tarefa

### Problemas identificados
1. A seção "Sobre" com o atendimento vinculado existe mas não está visualmente destacada como na imagem de referência
2. Os botões da toolbar de comentários (Bold, Italic, Underline, Link, Image, etc.) são apenas visuais -- nenhum funciona
3. O botão "anexar arquivo" não faz nada
4. O layout geral não está fiel à imagem de referência
5. Tarefas sem `conversationId` não mostram nada útil na seção "Sobre"

### O que será feito

**1. Redesenhar o layout para ficar fiel à imagem de referência**
- Botão "VOLTAR" vermelho com borda no topo esquerdo
- Título grande em lowercase + "Finalizar Tarefa" e "deletar tarefa" alinhados à direita
- Grid de 3 colunas com borda (Responsável | Prazo | Prioridade) exatamente como na imagem
- Seção "Descrição" com link "editar" e "anexar arquivo"
- Seção "Sobre" com card do atendimento vinculado (número clicável + avatar do contato + badge "Resolvido")
- Indicador de tempo ("há X dias") + ícone WhatsApp alinhado à direita
- Área de comentários com toolbar e textarea na parte inferior

**2. Tornar funcionalidades dos comentários operacionais**
- **Bold/Italic/Underline**: aplicar formatação simples ao texto selecionado usando marcadores markdown (`**bold**`, `*italic*`, `__underline__`)
- **Anexar arquivo**: abrir um file input nativo, mostrar o nome do arquivo selecionado (simulado, sem upload real já que não há backend)
- **Enviar comentário**: já funciona, manter
- **H1/H2/Sans Serif/Link/Image/Save**: mostrar toast informando que é funcionalidade PRO ou simplesmente aplicar formatação markdown básica

**3. Garantir a seção "Sobre" com link para o atendimento**
- Quando a tarefa tem `conversationId`, mostrar "Atendimento #XXXXX" como link clicável que navega para `/conversas?atendimento=ID`
- Mostrar avatar + nome do contato de origem (`fromContact`) + badge de status
- Quando não tem atendimento vinculado, mostrar mensagem "Tarefa criada manualmente"

**4. Funcionalidade do "anexar arquivo"**
- Adicionar `<input type="file">` oculto, trigger pelo botão
- Manter lista de arquivos anexados no state (nome + tamanho)
- Exibir os arquivos anexados como chips removíveis
- Tanto na descrição quanto nos comentários

### Detalhes técnicos

**Arquivo editado**: `src/pages/TarefaDetalhe.tsx` (reescrita significativa do componente)

**Mudanças no `TaskComment` em `src/lib/taskStore.ts`**: adicionar campo opcional `attachments?: { name: string; size: string }[]` para persistir arquivos nos comentários.

O layout segue fielmente a imagem: card único com fundo branco, bordas suaves, seções divididas por `border-t`, e a toolbar de comentários com fundo `muted/50`.

