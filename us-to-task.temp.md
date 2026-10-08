# Tasks: Padronização visual limpa com tema claro e escuro

> **Spec de origem:** .ai/specs/features/refatoracao-ui-limpa/spec.md  
> **Última atualização:** 2026-10-08

## Plano de Execução

T1 -> T2 -> T4  
T3 -> T4  
T1 e T3 podem começar em paralelo, mas T4 depende de T2 e T3.

## Detalhamento de Tarefas

### T1. [FRONT] Definir tokens visuais e tema base

* **O que:** padronizar tokens de cor, contraste, espaçamento e regras de tema claro/escuro no CSS global da aplicação.
* **Onde:** `src/styles.css`
* **Arquivos relevantes:** `src/styles.css`
* **Critérios de aceite:**
  - [ ] o app possui um conjunto consistente de tokens de cor para fundo, card, texto, borda e acentos
  - [ ] o tema claro e escuro ficam definidos com contraste adequado e sem excesso de saturação
  - [ ] classes utilitárias do design continuam funcionando sem substituir o comportamento existente
* **Depende de:** nenhuma
* **Reaproveita:** tokens já existentes em `src/styles.css` e classes atuais do Tailwind
* **Requisito:** US-01, US-02
* **Concluído quando:**
  - [ ] tema base e tokens claros estão implementados
* **Testes:**
  - DEVE o app manter legibilidade em tema claro e escuro QUANDO alterna a preferência
  - DEVE as classes utilitárias de tema continuarem estáveis QUANDO a tela carrega
* **Gate:** build + revisão visual + testes do frontend
* **Branch:** não definido
* **PR/Commit(s):** não definido
* **Exemplo de implementação:** `:root` e `.dark` com tokens finitos, sem brilho exagerado
* **Contrato:** CSS global de tema/contraste
* **Esforço/Risco:** 3 pontos | Risco: Médio
* **Referência:** US-01, US-02

### T2. [FRONT] Revisar o shell de navegação e layout base

* **O que:** simplificar o AppShell e o layout global para reduzir excesso de gradientes/glow e padronizar header, navegação e área de conteúdo.
* **Onde:** `src/components/AppShell.tsx`
* **Arquivos relevantes:** `src/components/AppShell.tsx`, `src/routes/__root.tsx`, `src/routes/index.tsx`
* **Critérios de aceite:**
  - [ ] o header e nav têm linguagem visual consistente em todas as telas principais
  - [ ] o layout ocupa espaço de forma clara sem excesso decorativo
  - [ ] a navegação continua funcional em mobile e desktop
* **Depende de:** T1
* **Reaproveita:** estrutura atual do `AppShell` e navegação existente
* **Requisito:** US-01, US-03, US-04
* **Concluído quando:**
  - [ ] layout base e navegação estão visivelmente consistentes
* **Testes:**
  - DEVE a navegação principal manter boa legibilidade QUANDO a página é aberta em mobile
  - DEVE o header permanecer consistente QUANDO a rota muda
* **Gate:** build + revisão visual
* **Branch:** não definido
* **PR/Commit(s):** não definido
* **Contrato:** estrutura do layout base e navegação
* **Esforço/Risco:** 3 pontos | Risco: Médio
* **Referência:** US-01, US-03, US-04

### T3. [FRONT] Ajustar telas de autenticação e formulários

* **O que:** aplicar o novo visual em login, cadastro e formulários principais para que sigam o padrão limpo e possam alternar entre temas sem quebrar a usabilidade.
* **Onde:** `src/routes/login.tsx`, `src/components/TransactionForm.tsx`, componentes do formulário em `src/components/ui/`
* **Arquivos relevantes:** `src/routes/login.tsx`, `src/components/TransactionForm.tsx`, `src/components/ui/*.tsx`
* **Critérios de aceite:**
  - [ ] login/cadastro seguem o mesmo sistema visual das demais telas
  - [ ] inputs, botões e labels permanecem legíveis em tema claro/escuro
  - [ ] não há quebrar de layout em mobile
* **Depende de:** T1
* **Reaproveita:** `Input`, `Button`, `Card` e `Label` existentes
* **Requisito:** US-01, US-02, US-03
* **Concluído quando:**
  - [ ] telas de autenticação e formulários ficaram consistentes com o padrão
* **Testes:**
  - DEVE a tela de login manter contraste e usabilidade QUANDO o tema alterna
  - DEVE o formulário principal continuar funcional QUANDO em mobile
* **Gate:** build + teste manual do fluxo principal
* **Branch:** não definido
* **PR/Commit(s):** não definido
* **Contrato:** interface de login e formulários
* **Esforço/Risco:** 5 pontos | Risco: Médio
* **Referência:** US-02, US-03

### T4. [FRONT] Validar responsividade e refinamento visual final

* **O que:** revisar todas as telas principais, ajustar comportamento em dispositivos pequenos e concluir refinamentos gráficos finais para o padrão limpo.
* **Onde:** `src/routes/` e `src/components/`
* **Arquivos relevantes:** `src/routes/*.tsx`, `src/components/*.tsx`, `src/styles.css`
* **Critérios de aceite:**
  - [ ] todas as telas principais seguem o padrão visual padronizado
  - [ ] mobile não apresenta overflow, cortes ou ações inacessíveis
  - [ ] tema claro/escuro e contraste estão estáveis em todas as telas
* **Depende de:** T2, T3
* **Reaproveita:** componentes e estilo já ajustados
* **Requisito:** US-01, US-02, US-03, US-04
* **Concluído quando:**
  - [ ] revisão final visual e responsiva concluída
* **Testes:**
  - DEVE a aplicação manter o padrão visual em todas as telas QUANDO navegada em desktop e mobile
  - DEVE o fluxo principal continuar funcionando sem quebra visual QUANDO o tema muda
* **Gate:** build + revisão manual + testes relevantes
* **Branch:** não definido
* **PR/Commit(s):** não definido
* **Contrato:** revisão final de UI e responsividade
* **Esforço/Risco:** 3 pontos | Risco: Baixo
* **Referência:** US-01, US-02, US-03, US-04

## Mapa de Execução Paralela

- T1 e T3 podem ocorrer em paralelo.
- T2 depende de T1.
- T4 depende de T2 e T3.

## Verificação Cruzada Diagrama-Definição

- Plano: T1 -> T2 -> T4; T3 -> T4
- Dependências declaradas: T2 depende de T1; T4 depende de T2 e T3; consistentes com o plano.

## Validação de Co-localização de Testes

- mudanças de UI/tema: revisão visual + testes de renderização/manutenção de tema
- mudanças de mobile: validação em viewports pequenos
- alterações de componentes reutilizáveis: testes do fluxo principal e componentes-chave
