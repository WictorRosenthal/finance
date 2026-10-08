# Spec: Padronização visual limpa com tema claro e escuro

> **User Story:** .ai/specs/features/refatoracao-ui-limpa/us.md  
> **Status:** rascunho  
> **Última atualização:** 2026-10-08

## Handoff

* **Problema em uma frase:** a aplicação atual concentra visualmente muita informação e efeitos modernos em um tema predominantemente escuro, dificultando consistência, legibilidade e adaptação em mobile.
* **Escopo aprovado:** padronizar todas as telas principais com layout simples, legibilidade, contraste adequado e suporte a tema claro/escuro; manter o uso mobile sem quebra visual.
* **Arquivos relevantes:** `src/styles.css`, `src/components/AppShell.tsx`, `src/routes/login.tsx`, `src/components/TransactionForm.tsx`, rotas de contas, convênios, perfil e dashboard em `src/routes/`.
* **Decisões já tomadas:** sem efeitos visuais excessivos; foco em clareza, consistência e acessibilidade; tema preferencial por sistema ou usuário; prioridade mobile-first.
* **Bloqueios/pendências:** confirmar persistência do tema no navegador e revisar se há componentes compartilhados que devem receber tokens visuais universais.

## Escopo

Esta spec cobre a revisão visual do frontend para unificar o padrão de layout, espaçamento, tipografia e uso de cores em todas as telas relevantes do fluxo financeiro. Inclui a introdução de suporte ao tema claro e escuro e a revisão responsiva de mobile. Não inclui reescrita completa da lógica de negócio, autenticação ou persistência de dados.

## Problema

O dashboard e as telas do app já apresentam uma interface visual bastante carregada, com uso de gradientes, glow e estilos marcantes em um tema predominantemente escuro. Isso pode dificultar legibilidade, reduzir a consistência entre páginas e prejudicar a experiência em telas menores, além de não atender ao objetivo de “padrão limpo e sem efeitos carregados” solicitado.

## Objetivos

- [ ] padronizar visualmente todas as telas do app com uma linguagem visual consistente
- [ ] reduzir excesso de efeitos visuais e priorizar clareza, contraste e espaçamento
- [ ] oferecer suporte a tema claro e escuro em todas as telas principais
- [ ] adaptar o layout para mobile sem overflow, cortes ou ações pouco acessíveis
- [ ] manter o uso e a navegação simples, sem perder identidade do produto

## Fora do Escopo

| Item não coberto | Motivo |
|---|---|
| reestruturação do backend | a mudança é restrita ao frontend visual |
| autenticação/segurança | não altera fluxo de login, JWT ou OAuth |
| refatoração de regras de negócio | objetivo é visual/UX, não domínio |

## Dependências

- CSS/Tailwind da aplicação (`src/styles.css`)
- shell de navegação em `src/components/AppShell.tsx`
- rotas principais em `src/routes/`
- componentes compartilhados em `src/components/ui/`
- suporte de tema via classes do Tailwind e persistência local do navegador

## User Stories

### US-01. Padronizar a linguagem visual do app

* **Prioridade:** P1
* **WHEN** o usuário navega entre dashboard, contas, transações, convênios e perfil,
* **THEN** o sistema apresenta um padrão visual homogêneo em layout, espaçamento, botões, cards e tipografia.
* **SHALL** manter contraste, consistência e simplicidade em todas as telas principais.
* **Teste Independente:** abrir cada rota e verificar que os elementos seguem o mesmo padrão visual sem variação abrupta.

### US-02. Suportar tema claro e escuro

* **Prioridade:** P1
* **WHEN** o usuário acessa a aplicação,
* **THEN** o sistema usa o tema do sistema por padrão, com opção para alternância manual.
* **SHALL** manter legibilidade, contraste e comportamento funcional em ambos os temas.
* **Teste Independente:** alternar o tema em uma tela e verificar que cards, textos, inputs e botões continuam legíveis e funcionais.

### US-03. Garantir responsividade mobile

* **Prioridade:** P1
* **WHEN** o usuário acessa o app em celular,
* **THEN** o sistema reorganiza conteúdo em single-column e mantém áreas de clique e leitura acessíveis.
* **SHALL** evitar overflow, cortes de texto e navegação escondida.
* **Teste Independente:** abrir rotas em viewport mobile e validar que a interface permanece legível e navegável.

### US-04. Reduzir efeitos visuais pesados

* **Prioridade:** P2
* **WHEN** o usuário observa qualquer área crítica da interface,
* **THEN** o sistema evita brilho excessivo, gradientes agressivos e elementos decorativos que competem com o conteúdo.
* **SHALL** priorizar foco na informação financeira e leitura tranquila.
* **Teste Independente:** validar visualmente que os componentes não usem excesso de glow, saturação ou ornamentação.

## Casos Extremos

- usuário nunca definiu tema: usar o tema do sistema
- usuário troca de tema em meio ao fluxo: manter a sessão funcional
- telas com carregamento/erro: preservar layout e indicar estado sem quebrar visual
- dados longos: truncar com boa legibilidade e sem overflow
- dispositivos muito estreitos: empilhar elementos sem esconder ações essenciais

## Rastreabilidade de Requisitos

| ID | História | Fase/Tarefa | Status |
|---|---|---|---|
| US-01 | Padronizar a linguagem visual do app | Frontend UI | Pendente |
| US-02 | Suportar tema claro e escuro | Frontend UI | Pendente |
| US-03 | Garantir responsividade mobile | Frontend UI | Pendente |
| US-04 | Reduzir efeitos visuais pesados | Frontend UI | Pendente |

Cobertura: 4 total, 4 mapeados, 0 não mapeados

## Critérios de Sucesso

- todas as telas principais adotam um mesmo padrão visual
- tema claro e escuro está funcional em desktop e mobile
- a interface continua legível em telas pequenas
- a experiência visual é simples, elegante e sem exageros
- a solução pode ser implementada sem alterar regras do domínio ou backend
