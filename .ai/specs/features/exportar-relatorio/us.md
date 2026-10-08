# US: Exportar relatório financeiro

> **Feature de origem:** exportar-relatorio  
> **Status:** happy path  
> **Última atualização:** 2026-10-08

## Job Story

Quando eu reviso minhas finanças mensais, eu quero exportar o relatório em arquivo simples, para que eu possa compartilhar ou guardar uma visão do período sem perder os dados do dashboard.

## Critério de Aceite

- [ ] O usuário consegue exportar o resumo mensal atual em CSV.
- [ ] O arquivo inclui receitas, despesas, saldo e meta do período.
- [ ] O conteúdo reflete os dados visíveis no dashboard.
- [ ] A ação funciona de forma rápida e sem quebra visual.

## Fluxo

1. O usuário acessa o dashboard do mês atual.
2. Clica em "Exportar relatório".
3. O sistema gera um arquivo CSV para download.
4. O usuário pode abrir ou enviar o arquivo sem precisar reproduzir manualmente os dados.

## Cenários BDD

### Cenário 1, caminho feliz
Dado que o usuário está no dashboard do mês,
Quando exporta o relatório,
Então o sistema baixa um CSV com receitas, despesas, saldo e orçamento.

### Cenário 2, categoria acima da meta
Dado que o orçamento do mês tem categoria em alerta,
Quando exporta o relatório,
Então o arquivo registra também esse status por categoria.

### Cenário 3, sem dados
Dado que o mês não tem movimentações,
Quando exporta o relatório,
Então o arquivo ainda é gerado com os valores zerados e a identificação do período.
