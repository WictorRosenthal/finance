# /bob-adr

## Descrição
Registra uma decisão técnica relevante como ADR dentro do diretório de decisões do projeto.

## Sintaxe
`/bob-adr [instrução ou perguntas]`

## Pré-condições
- `.ai/` presente e estrutura de specs/decisions disponível.
- Contexto técnico ou decisão a ser documentada.

## Aciona
Criação ou substituição de um ADR para registrar a razão, impacto e evolução de uma escolha arquitetural.

## Processo
1. Identificar a decisão técnica relevante.
2. Coletar contexto, trade-offs e alternativas avaliadas.
3. Gerar o ADR em `.ai/specs/decisions/` com formato compatível.
4. Confirmar se substitui um registro anterior ou acrescenta uma nova decisão.

## Saída esperada
Documento de decisão técnica persistido com histórico claro e sem ambiguidade de contexto.
