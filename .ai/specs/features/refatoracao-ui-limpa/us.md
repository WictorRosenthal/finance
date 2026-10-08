# US: Padrão visual limpo com tema claro e escuro

> **Feature de origem:** refatoracao-ui-limpa  
> **Status:** happy path  
> **Última atualização:** 2026-10-08

## Job Story

Quando abro o sistema em qualquer dispositivo, eu quero visualizar todas as telas com um padrão visual limpo, consistente e responsivo, para que eu consiga usar o app com mais clareza, conforto e produtividade tanto no modo claro quanto no modo escuro.

## Antes de ler o critério

* **O que entrega:**

| Termo | Significado |
|---|---|
| padrão visual limpo | interface simples, legível, com espaçamento e contraste consistentes |
| tema claro/escuro | opção de visualização em fundo claro e fundo escuro, sem quebrar a legibilidade |
| responsivo para mobile | layout adaptado para telas pequenas, sem truncamento ou elementos inviáveis |

## Exemplo concreto

O usuário entra no dashboard, navega entre contas, transações, convênios e perfil, e percebe que todas as telas compartilham a mesma linguagem visual: cards simples, textos legíveis, botões discretos, ausência de efeitos exagerados, e a possibilidade de alternar entre tema claro e escuro com um ajuste rápido e intuitivo.

Em mobile, as telas reorganizam a informação em uma única coluna, com espaços bem distribuídos, botões de fácil toque e navegação sem sobrecarga visual.

## Critério de Aceite

- [ ] Todas as telas da aplicação seguem um padrão visual consistente de layout, tipografia e espaçamento.
- [ ] A interface apresenta opção de tema claro e escuro, acessível em qualquer tela principal do fluxo do usuário.
- [ ] O design evita efeitos carregados, brilho excessivo, cores saturadas e elementos visuais que distraiam a leitura.
- [ ] O layout se adapta corretamente a smartphones e tablets sem quebrar navegação, legibilidade ou ação principal.
- [ ] Os componentes principais mantêm clareza visual, contraste suficiente e foco na informação financeira.

## Layout / Fluxo

Fluxo principal:

1. O usuário abre a aplicação.
2. A interface carrega com o tema padrão do sistema ou com a preferência última escolhida.
3. O usuário navega entre as telas e observa consistência visual em todas elas.
4. O usuário alterna entre tema claro e escuro.
5. A aplicação mantém a legibilidade e os elementos continuam funcionais em mobile.

## Definições de Tracking

- evento de troca de tema: `theme_switch`
- evento de carregamento de tela: `screen_view`
- evento de interação em mobile: `mobile_interaction`

## Indicadores Primários

- Taxa de uso do tema claro/escuro
- Taxa de retenção em telas mobile
- Taxa de conclusão de fluxo sem erro visual percebido

## Cenários BDD

### Cenário 1, caminho feliz: visual consistente e tema alternável

Dado que o usuário acessa a aplicação em um celular ou desktop,
Quando navega entre as telas principais e alterna entre os temas claro e escuro,
Então a interface continua limpa, legível, consistente e totalmente funcional sem elementos visuais excessivos.

### Cenário 2, tema padrão do sistema

Dado que o usuário nunca alterou a preferência de visual,
Quando abre a aplicação em um dispositivo com tema escuro configurado,
Então a interface inicia no tema escuro, mantendo leitura confortável sem exigir ação manual.

### Cenário 3, preferência persistida

Dado que o usuário selecionou o tema claro,
Quando retorna à aplicação em uma nova sessão,
Então o sistema reaplica esse tema e mantém a consistência visual.

### Cenário 4, mobile sem overflow

Dado que o usuário acessa a aplicação em um smartphone,
Quando navega entre contas, transações e convênios,
Então todos os textos, campos e botões permanecem visíveis e utilizáveis sem rolagem horizontal ou cortes.

### Cenário 5, carregamento e falha

Dado que uma tela está carregando ou falha ao buscar dados,
Quando o usuário a abre,
Então o layout preserva a estrutura visual e informa claramente o estado, sem deixar a interface quebrada ou confusa.

### Cenário 6, alternância de tema em tempo real

Dado que o usuário troca de tema durante o uso da aplicação,
Quando realiza uma ação em qualquer tela principal,
Então o conteúdo continua funcionando normalmente, com contraste adequado e sem perda de interação.

## Critérios de aceite adicionais

- [ ] Se o usuário não definir uma preferência de tema, a interface usa o tema do sistema como padrão.
- [ ] Se o usuário alternar o tema, a preferência deve ser mantida para as próximas sessões, quando suportado pelo navegador.
- [ ] Em telas menores, os componentes continuam legíveis sem overflow, corte de texto, botões inacessíveis ou navegação escondida.
- [ ] Em estados de carregamento ou erro, a interface mantém a estrutura visual do layout em vez de quebrar a página.
- [ ] A troca de tema não deve causar perda de foco, elementos invisíveis nem alteração de comportamento em formulários ou ações principais.
- [ ] Os elementos de ação principal continuam claros e acessíveis mesmo com contraste reduzido ou em modo escuro.

## Depende de

- revisão da estrutura visual atual do frontend
- disponibilidade de tema e tokens de design compartilhados

## Handoff para a Spec

* **Problema em uma frase:** padronizar a experiência visual de todas as telas para um visual limpo, responsivo e com tema claro/escuro.
* **Decisões de escopo já tomadas:** foco no happy path; sem efeitos visuais exagerados; prioridade à legibilidade e mobile-first.
* **Pendências/bloqueios:** confirmar se o tema será persistido entre sessões e se há um design system já adotado pela equipe.
