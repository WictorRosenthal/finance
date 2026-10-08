# Spec: Renomear o aplicativo para MeuFinanceiro

> **User Story:** .ai/specs/features/renomear-app-para-meu-financeiro/us.md  
> **Status:** aprovada  
> **Última atualização:** 2026-10-08

## Handoff

* **Problema em uma frase:** substituir a marca atual FinanceFlow pela identidade MeuFinanceiro sem introduzir mudanças funcionais ou visuais fora do nome do produto.
* **Escopo aprovado:** alteração da marca exibida em shell, tela de login e metadados da página; sem mudanças de comportamento, regras de negócio ou estrutura.
* **Arquivos relevantes:** `src/components/AppShell.tsx`, `src/routes/login.tsx`, `src/routes/__root.tsx`
* **Decisões já tomadas:** a mudança é pontual e estritamente relacionada ao nome do app; não há alteração de backend, persistência ou fluxos de uso.
* **Bloqueios/pendências:** nenhum.

## Escopo

Esta spec cobre a troca da identidade visual do produto para MeuFinanceiro em todos os pontos visíveis na interface e nos metadados do navegador. O objetivo é manter o restante do sistema inalterado, preservando funcionalidade e layout.

## Problema

O aplicativo ainda se apresenta com o nome FinanceFlow, o que impede que a marca do produto reflita a nova identidade desejada. A alteração precisa acontecer sem introduzir regressão na navegação, autenticação ou qualquer comportamento de uso.

## Objetivos

- [ ] Exibir MeuFinanceiro no shell principal da aplicação.
- [ ] Exibir MeuFinanceiro na tela de autenticação.
- [ ] Atualizar o título da página e metadados do navegador para MeuFinanceiro.
- [ ] Manter a funcionalidade atual intacta e sem mudanças fora do renomeamento.

## Fora do Escopo

| Item não coberto | Motivo |
|---|---|
| redesign visual completo | a mudança pede apenas o renomeamento da marca |
| alteração de regras de negócio | não está relacionado ao objetivo |
| mudança de APIs, backend ou banco | não há necessidade para o objetivo solicitado |
| atualização de assets de branding externos | não há evidence de uso em outros ativos do projeto |

## Dependências

- estrutura atual de rotas e shell do frontend
- componente de autenticação já existente
- metadados do root route para título e SEO

## User Stories

### US-01. Atualizar a marca do shell

* **Prioridade:** P1
* **WHEN** o usuário abre a aplicação em qualquer rota autenticada
* **THEN** o sistema mostra o nome MeuFinanceiro no cabeçalho principal
* **SHALL** manter a navegação e a identidade visual consistentes sem modificar comportamento funcional
* **Teste Independente:** abrir a aplicação autenticada e verificar que o nome do app no header é MeuFinanceiro

### US-02. Atualizar a tela de autenticação

* **Prioridade:** P1
* **WHEN** o usuário acessa a tela de login/cadastro
* **THEN** o sistema mostra MeuFinanceiro como identidade do produto
* **SHALL** manter o fluxo atual de login e cadastro funcional e inalterado
* **Teste Independente:** acessar a rota `/login` e confirmar que o nome exibido no painel de autenticação é MeuFinanceiro

### US-03. Atualizar metadados do navegador

* **Prioridade:** P1
* **WHEN** o usuário abre a aplicação em uma aba do navegador
* **THEN** o título da página e os metadados relevantes refletem MeuFinanceiro
* **SHALL** manter a descrição e demais informações sem alterações não relacionadas ao nome do app
* **Teste Independente:** inspecionar o `title` da aba no navegador e confirmar o valor MeuFinanceiro

## Casos Extremos

- Usuário autenticado em qualquer rota principal: nome do app deve permanecer consistente.
- Usuário não autenticado em `/login`: o nome do app deve aparecer corretamente na autenticação.
- Renderização em tema claro e escuro: a mudança de nome não deve afetar legibilidade nem contraste.
- Rota 404: a marca correta deve continuar sendo exibida se o app usar o shell compartilhado.

## Rastreabilidade de Requisitos

| ID | História | Fase/Tarefa | Status |
|---|---|---|---|
| US-01 | Atualizar a marca do shell | Implementação UI | concluído |
| US-02 | Atualizar a tela de autenticação | Implementação UI | concluído |
| US-03 | Atualizar metadados do navegador | Implementação UI | concluído |

Cobertura: 3 total, 3 mapeados, 0 não mapeados

## Critérios de Sucesso

- O nome apresentado ao usuário é MeuFinanceiro em todos os pontos relevantes da aplicação.
- A marca não altera regras de negócio, autenticação, dados ou navegação.
- O app continua compilando corretamente sem regressões visíveis ou funcionais.
- O título do navegador e o shell principal ficam consistentes com a nova identidade.
