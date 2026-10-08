# Tasks: Exportar relatório financeiro

## T1. Implementar botão de exportação
- **Onde:** `src/routes/index.tsx`
- **Objetivo:** adicionar o botão no header do dashboard para exportar o relatório atual.
- **Critérios:** botão visível e acionável em desktop/mobile.

## T2. Gerar CSV com resumo e categorias
- **Onde:** `src/routes/index.tsx`, `src/lib/finance.ts`
- **Objetivo:** converter os dados calculados em CSV exportável, incluindo saldos e comparação de metas.
- **Critérios:** arquivo gerado com conteúdo correto e sem quebra em meses sem movimentação.

## T3. Validar UX e comportamento final
- **Onde:** `src/routes/index.tsx`
- **Objetivo:** revisar a experiência e confirmar que a ação está coerente com o restante do app.
- **Critérios:** feedback de sucesso ao exportar e ausência de regressão no dashboard.
