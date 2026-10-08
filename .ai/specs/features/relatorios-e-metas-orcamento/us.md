# US: Relatórios e metas de orçamento mensais

> **Feature de origem:** relatorios-e-metas-orcamento  
> **Status:** happy path  
> **Última atualização:** 2026-10-08

## Job Story

Quando eu acompanho minhas finanças ao longo do mês, eu quero visualizar relatórios e metas de orçamento em um painel claro e objetivo, para que eu consiga identificar rapidamente se estou acima ou abaixo do que planejei e ajustar meus gastos com mais segurança.

## Antes de ler o critério

* **O que entrega:**

| Termo | Significado |
|---|---|
| relatório mensal | visão consolidada de receitas, despesas e saldo do período |
| meta de orçamento | limite planejado por categoria ou por total mensal |
| alerta de acompanhamento | sinalização quando o gasto estiver acima do planejado |

## Exemplo concreto

O usuário abre o dashboard mensal e vê o total gasto no mês, o que já foi reservado para cada categoria, o saldo restante e avisos quando alguma área ultrapassou a meta. Ele consegue tomar decisão com rapidez sem precisar interpretar vários dados isolados.

## Critério de Aceite

- [ ] O usuário consegue visualizar um resumo mensal de receitas, despesas e saldo.
- [ ] O sistema apresenta metas de orçamento por categoria ou por total mensal.
- [ ] O usuário entende facilmente quando está acima ou abaixo do orçamento planejado.
- [ ] A interface mantém leitura clara, sem excesso de informação ou gráficos confusos.
- [ ] O processo funciona em desktop e mobile sem quebrar a legibilidade.

## Layout / Fluxo

Fluxo principal:

1. O usuário entra no dashboard ou na área de relatórios.
2. O sistema mostra o período atual e o resumo financeiro do mês.
3. O usuário visualiza o orçamento planejado e o acumulado gasto.
4. O sistema destaca categorias acima do limite e o saldo restante.
5. O usuário pode ajustar a meta ou revisar as movimentações relacionadas.

## Definições de Tracking

- evento de abertura de relatório: `budget_report_open`
- evento de seleção de mês: `budget_period_change`
- evento de alerta de orçamento: `budget_threshold_hit`

## Indicadores Primários

- percentual de uso do relatório mensal
- taxa de usuários que alcançam ou ajustam metas
- redução de gastos acima do limite percebido pelo usuário

## Cenários BDD

### Cenário 1, caminho feliz: visão geral do mês

Dado que o usuário acessa o dashboard financeiro,
Quando escolhe o mês atual,
Então o sistema mostra resumo de receitas, despesas, saldo e comparação com a meta prevista.

### Cenário 2, categoria acima do orçamento

Dado que uma categoria de gasto ultrapassou o limite definido,
Quando o usuário visualiza o relatório,
Então essa categoria aparece destacada e o sistema informa o excesso.

### Cenário 3, saldo restante

Dado que o usuário definiu uma meta mensal de gastos,
Quando o relatório calcula o total acumulado,
Então o sistema mostra o saldo restante de forma clara e legível.

### Cenário 4, responsividade

Dado que o usuário acessa o relatório em um celular,
Quando navega pelo resumo e pelas categorias,
Então os cards e as métricas permanecem legíveis e utilizáveis sem overflow.

### Cenário 5, sem informação ambígua

Dado que o usuário está em um mês sem movimentações,
Quando observa o relatório,
Então o sistema mostra dados consistentes e indica que não há transações ou que o orçamento ainda está intacto.

## Depende de

- dashboard financeiro existente
- estrutura de categorias e transações já registradas
- dados de contas e convênios já disponíveis no sistema

## Handoff para a Spec

* **Problema em uma frase:** oferecer ao usuário uma visão clara do orçamento mensal e do desempenho financeiro para decidir sobre gastos e projeções.
* **Decisões de escopo já tomadas:** foco em relatório mensal e metas de orçamento, sem implementar planejamento multi-mês ou cenários complexos.
* **Pendências/bloqueios:** definir como as metas serão configuradas inicialmente: por categoria, total geral ou ambos.
