# Próximas etapas para continuidade

## Status atual
- Dashboard com resumo mensal de receitas, despesas e saldo
- Metas mensais e por categoria configuráveis
- Destaque visual para categorias acima da meta
- Exportação do relatório em CSV
- Modal de edição de metas funcionando
- Layout responsivo ajustado ao padrão limpo do app

## Ordem recomendada de continuidade

### 1) Refinar a edição de orçamento por categoria
**Objetivo:** deixar a experiência mais clara, com melhor organização e menos ruído visual.

**Ações:**
- organizar metas por categoria em lista mais legível
- adicionar descrição da regra de cálculo para cada categoria
- validar estados vazios e valores zerados
- revisar usabilidade em mobile

**Critério de done:**
- o usuário consegue editar metas com rapidez
- o fluxo fica consistente em telas pequenas
- sem perda de clareza no dashboard

### 2) Adicionar seleção de período mais avançada
**Objetivo:** permitir comparar meses diferentes e entender tendência.

**Ações:**
- incluir filtro por mês/ano no dashboard
- manter resumo e orçamento do período selecionado
- comparar o período atual com o anterior

**Critério de done:**
- o usuário alterna mês sem quebrar os cálculos
- o relatório reflete o período atual corretamente
- a análise de tendência fica fácil de acompanhar

### 3) Melhorar a análise por categoria
**Objetivo:** deixar mais fácil identificar o que está consumindo mais do orçamento.

**Ações:**
- ordenar categorias por excedente e percentual de uso
- mostrar destaque de urgência/alerta para categorias críticas
- exibir “restante por categoria” de forma visual

**Critério de done:**
- o usuário identifica rapidamente os gastos mais relevantes
- a leitura do painel continua objetiva
- os alertas são consistentes com dados reais

### 4) Exportação em formato visual
**Objetivo:** expandir a saída para além de CSV.

**Ações:**
- preparar exportação em PDF simplificado
- manter layout legível para compartilhamento
- incluir cabecalho do mês e resumos principais

**Critério de done:**
- o relatório exportado fica utilizável para apresentação ou envio
- o conteúdo mantém consistência com o dashboard

### 5) Revisão final de UX e validação
**Objetivo:** fechar a feature com qualidade e consistência.

**Ações:**
- validar fluxo em desktop e mobile
- revisar microinterações e mensagens de feedback
- testar cenários com mês vazio, categoria sem meta e gasto acima do limite
- confirmar que o design continua alinhado ao padrão limpo do app

**Critério de done:**
- ausência de regressões no dashboard
- fluxo completo está estável
- feature pronta para release

## Sugestão de próxima implementação
Se for retomar em outro momento, o melhor ponto de partida é:
1. seleção de período por mês
2. refinamento de categoria e alertas
3. exportação visual em PDF

## Arquivos relevantes para continuidade
- [.ai/specs/features/relatorios-e-metas-orcamento/us.md](./us.md)
- [.ai/specs/features/relatorios-e-metas-orcamento/spec.md](./spec.md)
- [.ai/specs/features/relatorios-e-metas-orcamento/tasks.md](./tasks.md)
- [src/routes/index.tsx](../../../../src/routes/index.tsx)
- [src/lib/finance.ts](../../../../src/lib/finance.ts)
