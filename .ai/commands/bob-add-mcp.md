# /bob-add-mcp

## Descrição
Adiciona um servidor MCP aprovado ao ambiente do projeto.

## Sintaxe
`/bob-add-mcp`

## Pré-condições
- Link ou pacote do servidor informado.
- Aprovação explícita do usuário.

## Aciona
Configuração do MCP fora de `.ai/` e atualização em `.ai/context/integrations.md`.

## Processo
1. Verificar utilidade do MCP.
2. Confirmar escopo local/global.
3. Gerar preview e gravar configuração.

## Saída esperada
MCP configurado sem expor segredos em `.ai/`.
