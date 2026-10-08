# US: Renomear o aplicativo para MeuFinanceiro

> **Feature de origem:** renomear-app-para-meu-financeiro  
> **Status:** happy path  
> **Última atualização:** 2026-10-08

## Job Story

Quando acesso o aplicativo, eu quero ver o nome MeuFinanceiro em vez do nome atual, para que a marca do produto reflita corretamente a identidade do serviço e a experiência fique consistente em toda a interface.

## Antes de ler o critério

* **O que entrega:**

| Termo | Significado |
|---|---|
| nome do app | nome exibido na interface, na página inicial e em metadados da aplicação |
| identidade visual | apresentação do nome consistente em todos os pontos visíveis do produto |

## Exemplo concreto

O usuário entra no sistema e visualiza o aplicativo identificado como MeuFinanceiro em todas as telas relevantes, incluindo o shell principal, a tela de login e os metadados do navegador, sem qualquer alteração de comportamento funcional ou de layout além do nome exibido.

## Critério de Aceite

- [ ] O nome da aplicação aparece como MeuFinanceiro em toda a interface relevante.
- [ ] O novo nome é exibido no shell principal e na tela de autenticação.
- [ ] O título da página e os metadados do navegador refletem o novo nome do produto.
- [ ] Não há mudanças de funcionalidade fora do renomeamento solicitado.
- [ ] A experiência visual continua consistente em tema claro e escuro.

## Layout / Fluxo

Fluxo principal:

1. O usuário abre a aplicação.
2. O nome MeuFinanceiro aparece no cabeçalho e no login.
3. O navegador exibe MeuFinanceiro no título da aba.
4. O restante da aplicação mantém o comportamento atual sem alterações não relacionadas.

## Definições de Tracking

- nenhum evento novo obrigatório para esta mudança de identidade visual

## Indicadores Primários

- ausência de regressão em navegação e login
- consistência visual do nome em todas as telas relevantes

## Cenários BDD

### Cenário 1, caminho feliz: nome do app atualizado

Dado que o usuário acessa a aplicação,
Quando visualiza o shell principal ou a tela de login,
Então o nome exibido é MeuFinanceiro e a identidade visual está consistente.

### Cenário 2, navegador e metadados

Dado que o usuário abre a aplicação em um navegador,
Quando observa a aba ou os metadados da página,
Então o título mostra MeuFinanceiro como nome do produto.

### Cenário 3, sem alteração funcional

Dado que o usuário usa as telas existentes,
Quando realiza ações normais de navegação e autenticação,
Então o comportamento e os dados continuam idênticos, com a mudança limitada ao nome do app.

## Depende de

- aprovação da troca de nome no produto

## Handoff para a Spec

* **Problema em uma frase:** substituir a marca atual FinanceFlow pela nova identidade MeuFinanceiro sem alterar comportamentos ou áreas fora do nome exibido.
* **Decisões de escopo já tomadas:** a alteração é restrita ao nome do app, sem tocar em regras de negócio, layout funcional ou fluxos de dados.
* **Pendências/bloqueios:** nenhuma; a mudança é pontual e diretamente observável.
