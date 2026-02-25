

# Ajuste do Layout da Lista de Conversas

Baseado na imagem de referencia, o layout de cada conversa na lista precisa ser reorganizado para posicionar o nome do atendente e a conexao no lado direito, ao inves de embaixo.

## Layout Atual
```text
[Avatar] Nome do Cliente              | hora
         Ultima mensagem...           | unread
         [Comercial 1] 👤 Ana - Vendas
         [Tag1] [Tag2]
```

## Layout Desejado (conforme imagem)
```text
[Avatar] Nome do Cliente              | ⏐ Lucas Jesus - Tecnologia da Info
         ● Ultima mensagem...    hora | ⏐ 🟢 Contabilidade Positivo
         [Tag1] [Tag2]                |
```

## Mudancas em `src/pages/Conversas.tsx` (linhas ~322-347)

1. **Reorganizar a linha superior** para ter 3 colunas:
   - Esquerda: nome do cliente + mensagem + tags
   - Direita: atendente (com icone de pessoa) + conexao (com icone WhatsApp)

2. **Mover atendente e departamento** para o canto direito, empilhados verticalmente:
   - Linha 1: `⚡ {attendant} - {department}` (com icone de pessoa)
   - Linha 2: `🟢 {connection}` (com icone WhatsApp)
   - Hora fica junto ao nome ou na linha da mensagem

3. **Remover a div separada** (linhas 336-347) que atualmente renderiza conexao/atendente abaixo da mensagem.

4. **Integrar no bloco direito** (linhas 327-334) adicionando atendente e conexao abaixo da hora/unread.

O resultado sera um layout de 2 colunas onde informacoes do cliente ficam a esquerda e informacoes operacionais (atendente, conexao, hora) ficam a direita, como na imagem de referencia.

