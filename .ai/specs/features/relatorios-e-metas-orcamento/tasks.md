# Tasks: Relatórios e metas de orçamento mensais

> **Spec de origem:** .ai/specs/features/relatorios-e-metas-orcamento/spec.md  
> **Última atualização:** 2026-10-08

## Plano de Execução

T1 -> T2 -> T4  
T3 -> T4  
T1 e T3 podem ocorrer em paralelo, mas T4 depende de T2 e T3

## Detalhamento de Tarefas

### T1. [FRONT] Criar resumo mensal no dashboard

* **O que:** incluir indicadores de receita, despesa, saldo e comparação do mês atual no dashboard existente.
* **Onde:** `src/routes/index.tsx`
* **Arquivos relevantes:** `src/routes/index.tsx`, `src/lib/finance.ts`
* **Critérios de aceite:**
  - [ ] o dashboard exibe resumo mensal de receitas, despesas e saldo
  - [ ] os dados refletem o mês selecionado corretamente
  - [ ] a leitura continua clara e responsiva
* **Depende de:** nenhuma
* **Reaproveita:** cálculos existentes do dashboard e utilitários de formatação financeira
* **Requisito:** US-01
* **Concluído quando:**
  - [ ] o resumo mensal está visível no painel principal
* **Testes:**
  - DEVE mostrar receitas, despesas e saldo QUANDO o usuário abre o dashboard
  - DEVE refletir o mês selecionado QUANDO a data muda
* **Gate:** build + revisão visual
* **Branch:** não definido
* **PR/Commit(s):** não definido
* **Exemplo de implementação:** calcular `receitas`, `despesas`, `saldo` a partir de `monthTx`
* **Contrato:** dados mensal agregados para rendering
* **Esforço/Risco:** 3 pontos | Risco: Médio
* **Referência:** US-01

### T2. [FRONT] Implementar metas de orçamento

* **O que:** permitir definir e comparar uma meta de orçamento mensal e por categoria usando os dados já existentes de transações.
* **Onde:** `src/routes/index.tsx`, `src/lib/finance.ts`
* **Arquivos relevantes:** `src/routes/index.tsx`, `src/lib/finance.ts`, `src/components/ui/*`
* **Critérios de aceite:**
  - [ ] o usuário consegue comparar gasto atual com a meta definida
  - [ ] o sistema identifica quanto resta ou excedeu
  - [ ] o comportamento funciona sem quebrar o dashboard atual
* **Depende de:** T1
* **Reaproveita:** categorização e cálculo de valores já implementados
* **Requisito:** US-02
* **Concluído quando:**
  - [ ] as metas são calculadas e apresentadas no relatório
* **Testes:**
  - DEVE mostrar o restante do orçamento QUANDO a meta e os gastos são conhecidos
  - DEVE indicar excesso QUANDO o total ultrapassa o limite
* **Gate:** build + validação manual do cálculo
* **Branch:** não definido
* **PR/Commit(s):** não definido
* **Exemplo de implementação:** `metaTotal`, `gastoTotal`, `restante = meta - gasto`
* **Contrato:** cálculo de meta x realizado
* **Esforço/Risco:** 3 pontos | Risco: Médio
* **Referência:** US-02

### T3. [FRONT] Destacar excedentes por categoria

* **O que:** marcar categorias de gasto que ultrapassaram a meta e deixar o alerta claro no relatório.
* **Onde:** `src/routes/index.tsx`
* **Arquivos relevantes:** `src/routes/index.tsx`, `src/components/ui/badge.tsx`, `src/lib/finance.ts`
* **Critérios de aceite:**
  - [ ] categorias acima do limite aparecem destacadas
  - [ ] o excesso é visível em textos/indicadores
  - [ ] os itens restantes continuam legíveis
* **Depende de:** T1
* **Reaproveita:** agrupamento por categoria e estilos de badge/card já existentes
* **Requisito:** US-03
* **Concluído quando:**
  - [ ] alertas visuais de excedente estão funcionando
* **Testes:**
  - DEVE destacar a categoria QUANDO o gasto ultrapassa a meta
  - DEVE manter o restante da tela legível QUANDO o alerta aparece
* **Gate:** build + revisão visual
* **Branch:** não definido
* **PR/Commit(s):** não definido
* **Exemplo de implementação:** usar `Badge`/`Card` com variação visual para categoria em alerta
* **Contrato:** alerta visual por categoria
* **Esforço/Risco:** 2 pontos | Risco: Baixo
* **Referência:** US-03

### T4. [FRONT] Refinar responsividade e revisão final do relatório

* **O que:** ajustar o layout final do relatório para mobile e validar consistência visual com o resto do app.
* **Onde:** `src/routes/index.tsx`, `src/styles.css`
* **Arquivos relevantes:** `src/routes/index.tsx`, `src/styles.css`, `src/components/AppShell.tsx`
* **Critérios de aceite:**
  - [ ] o relatório funciona em mobile sem overflow
  - [ ] a leitura do resumo e dos alertas permanece sem ruído visual
  - [ ] a linguagem visual continua coerente com o padrão limpo do app
* **Depende de:** T2, T3
* **Reaproveita:** sistema visual já adotado pela refatoração UI
* **Requisito:** US-01, US-02, US-03, US-04
* **Concluído quando:**
  - [ ] revisão final do relatório está concluída em desktop e mobile
* **Testes:**
  - DEVE manter legibilidade e estabilidade QUANDO o relatório é exibido em mobile
  - DEVE manter a consistência visual QUANDO o usuário alterna o tema
* **Gate:** build + teste manual em viewport pequeno
* **Branch:** não definido
* **PR/Commit(s):** não definido
* **Exemplo de implementação:** cards em coluna em mobile e indicadores em linha em desktop
* **Contrato:** responsividade final do módulo
* **Esforço/Risco:** 2 pontos | Risco: Baixo
* **Referência:** US-01, US-02, US-03, US-04

## Mapa de Execução Paralela

- T1 e T3 podem ocorrer em paralelo.
- T2 depende de T1.
- T4 depende de T2 e T3.

## Verificação Cruzada Diagrama-Definição

- Plano: T1 -> T2 -> T4; T3 -> T4
- Dependências declaradas: T2 depende de T1; T4 depende de T2 e T3; consistentes com o plano.

## Validação de Co-localização de Testes

- mudança de dashboard/report: revisão visual + validação de resumo financeiro
- mudança de orçamento: validação do cálculo e alerta de excedente
- mudança de mobile: revisão em viewport pequeno
