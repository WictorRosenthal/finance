# Spec: Relatórios e metas de orçamento mensais

> **User Story:** .ai/specs/features/relatorios-e-metas-orcamento/us.md  
> **Status:** rascunho  
> **Última atualização:** 2026-10-08

## Handoff

* **Problema em uma frase:** permitir que o usuário acompanhe seu orçamento e desempenho financeiro mensal com visão clara de receitas, despesas, saldo e metas.
* **Escopo aprovado:** painel de resumo mensal, comparação por categoria, metas de orçamento e visualização de excedentes/pendências.
* **Arquivos relevantes:** `src/routes/index.tsx`, `src/lib/finance.ts`, `src/routes/transacoes.index.tsx`, `src/components/ui/*`
* **Decisões já tomadas:** o foco será em relatório mensal com destaque para legibilidade, categorias e indicação de excesso de orçamento; não há escopo para projeção avançada ou múltiplos períodos complexos.
* **Bloqueios/pendências:** definir se a meta será configurada por categoria, por total geral, ou por ambos na primeira entrega.

## Escopo

Esta spec cobre a criação de um módulo de relatório financeiro mensal com indicadores de orçamento e acompanhamento do desempenho do usuário ao longo do mês. O objetivo é fornecer leitura rápida do comportamento financeiro e apoiar decisões de corte ou ajuste de gastos.

## Problema

O usuário já registra transações e acompanha os dados de forma básica no dashboard, mas ainda não consegue comparar o que foi gasto com o que planejou gastar. Sem essa visão, o controle financeiro fica parcial e mais difícil de ajustar rapidamente.

## Objetivos

- [ ] Exibir um resumo mensal de receitas, despesas e saldo.
- [ ] Comparar despesas reais com metas de orçamento mensais.
- [ ] Destacar categorias ou totais acima do limite planejado.
- [ ] Manter a interface legível e responsiva em desktop e mobile.
- [ ] Reaproveitar dados já existentes de transações, categorias e dashboard.

## Fora do Escopo

| Item não coberto | Motivo |
|---|---|
| projeções multi-mês | fora do escopo inicial |
| orçamento dinâmico por usuário/empresa | exige modelagem adicional |
| automatização de alertas por e-mail | é funcionalidade complementar |
| recorrência de metas complexas | deve ser tratada em uma entrega posterior |

## Dependências

- dados de transações já salvos e agrupáveis por categoria
- dashboard existente com layout principal e filtros por data
- suporte de categorias e valores financeiros já presentes em `src/lib/finance.ts`

## User Stories

### US-01. Visualizar resumo financeiro mensal

* **Prioridade:** P1
* **WHEN** o usuário acessa o dashboard ou a área de relatórios
* **THEN** o sistema mostra receitas, despesas e saldo do mês atual em forma resumida
* **SHALL** manter o layout organizado, com foco em leitura e comparação rápida
* **Teste Independente:** abrir a tela de dashboard e confirmar que o resumo mensal aparece corretamente

### US-02. Definir e acompanhar metas de orçamento

* **Prioridade:** P1
* **WHEN** o usuário define uma meta de gasto para o mês ou por categoria
* **THEN** o sistema compara o valor atual com o limite planeado e indica o restante ou excedente
* **SHALL** permitir leitura imediata do desempenho do orçamento ao longo do período
* **Teste Independente:** inserir ou usar uma meta de exemplo e verificar a comparação no relatório

### US-03. Destacar excesso de gasto por categoria

* **Prioridade:** P1
* **WHEN** uma categoria ultrapassa o valor planejado
* **THEN** o sistema realça esse item no relatório para chamar atenção
* **SHALL** deixar claro que a categoria está acima do limite, sem ocultar o comportamento real
* **Teste Independente:** simular um gasto acima da meta e validar a indicação visual da categoria

### US-04. Acompanhar em mobile

* **Prioridade:** P2
* **WHEN** o usuário acessa o relatório em um celular
* **THEN** os dados continuam legíveis e os cards/ações do relatório permanecem utilizáveis
* **SHALL** manter o layout responsivo sem overflow ou cortes
* **Teste Independente:** abrir a tela em viewport móvel e validar que as métricas não se sobrepõem

## Casos Extremos

- mês sem movimentações: relatório deve indicar ausência de dados sem quebrar o layout
- categoria sem meta definida: sistema deve continuar exibindo os dados e sinalizar que não há meta
- transação excluída ou alterada: relatório deve refletir o cálculo novo imediatamente
- dados muito grandes: o relatório deve manter resposta visual sem sobrecarregar a tela

## Rastreabilidade de Requisitos

| ID | História | Fase/Tarefa | Status |
|---|---|---|---|
| US-01 | Visualizar resumo financeiro mensal | implementação dashboard/report | planejado |
| US-02 | Definir e acompanhar metas de orçamento | implementação orçamento | planejado |
| US-03 | Destacar excesso de gasto por categoria | implementação alertas | planejado |
| US-04 | Acompanhar em mobile | refinamento responsivo | planejado |

Cobertura: 4 total, 4 mapeados, 0 não mapeados

## Critérios de Sucesso

- O usuário consegue entender em poucos segundos o saldo e o gasto do mês.
- O sistema comunica claramente quando houve excesso de orçamento.
- A interface permanece funcional e legível em mobile e desktop.
- O dashboard e o relatório aproveitam o conjunto de dados já existente no app sem duplicação desnecessária.
