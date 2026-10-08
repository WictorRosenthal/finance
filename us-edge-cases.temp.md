# US: Padrão visual limpo com tema claro e escuro

> **Feature de origem:** refatoracao-ui-limpa  
> **Status:** edge cases em revisão  
> **Última atualização:** 2026-10-08

## Edge cases adicionados

### Critérios de aceite adicionais

- [ ] Se o usuário não definir uma preferência de tema, a interface usa o tema do sistema como padrão.
- [ ] Se o usuário alternar o tema, a preferência deve ser mantida para as próximas sessões, quando suportado pelo navegador.
- [ ] Em telas menores, os componentes continuam legíveis sem overflow, corte de texto, botões inacessíveis ou navegação escondida.
- [ ] Em estados de carregamento ou erro, a interface mantém a estrutura visual do layout em vez de quebrar a página.
- [ ] A troca de tema não deve causar perda de foco, elementos invisíveis nem alteração de comportamento em formulários ou ações principais.
- [ ] Os elementos de ação principal continuam claros e acessíveis mesmo com contraste reduzido ou em modo escuro.

### Cenários BDD adicionais

### Cenário 2, tema padrão do sistema

Dado que o usuário nunca alterou a preferência de visual,
Quando abre a aplicação em um dispositivo com tema escuro configurado,
Então a interface inicia no tema escuro, mantendo uma leitura confortável sem exigir ação manual.

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

## Handoff para a Spec

* **Problema em uma frase:** garantir que o redesign visual seja consistente, acessível e estável em tema, carregamento e dispositivos móveis.
* **Decisões de escopo já tomadas:** foco em legibilidade, simplicidade visual, tema claro/escuro e layout mobile-first.
* **Pendências/bloqueios:** confirmar se a persistência do tema será feita por preferências do navegador e se existem constraints de acessibilidade da equipe.
