# Spec: Exportar relatório financeiro

> **User Story:** .ai/specs/features/exportar-relatorio/us.md  
> **Status:** rascunho  
> **Última atualização:** 2026-10-08

## Handoff

* **Problema em uma frase:** permitir que o usuário gere um arquivo do resumo financeiro do mês para compartilhamento ou backup.
* **Escopo aprovado:** exportação de CSV do dashboard atual com indicadores mensais e comparação de orçamento.
* **Arquivos relevantes:** `src/routes/index.tsx`, `src/lib/finance.ts`
* **Decisões já tomadas:** a primeira entrega prioriza CSV simples, sem autenticação nem geração PDF.

## Objetivos

- [ ] Exportar o resumo do mês atual em CSV.
- [ ] Incluir receita, despesa, saldo, meta e status por categoria.
- [ ] Reaproveitar os dados do dashboard já calculados.
- [ ] Manter a operação leve e sem dependências externas.

## Fora do Escopo

- PDF visual com layout avançado
- anexos automáticos por e-mail
- compartilhamento em nuvem
- histórico de exportações

## Requisitos

### RQ-01. Exportação do dashboard
Quando o usuário clica em exportar, o sistema gera um arquivo CSV com os dados filtrados para o mês atual.

### RQ-02. Dados financeiros
O arquivo deve incluir: receitas, despesas, saldo, meta mensal e restante do orçamento.

### RQ-03. Metas por categoria
Quando houver categorias com gastos, o CSV deve listar cada categoria, valor gasto, meta e alerta de excedente.

### RQ-04. Robustez
Se o mês estiver sem movimentações, a exportação ainda deve funcionar com valores zerados.

## Critérios de Sucesso

- O usuário consegue baixar o relatório em segundos.
- O arquivo contém os dados equivalentes ao dashboard atual.
- A feature não exige backend adicional nem fluxo novo de autenticação.
