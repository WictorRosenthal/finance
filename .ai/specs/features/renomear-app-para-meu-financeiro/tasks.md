# Tasks: Renomear o aplicativo para MeuFinanceiro

> **Spec de origem:** .ai/specs/features/renomear-app-para-meu-financeiro/spec.md  
> **Última atualização:** 2026-10-08

## Plano de Execução

T1 -> T2 -> T3

## Detalhamento de Tarefas

### T1. [FRONT] Atualizar nome no shell principal

* **O que:** trocar a marca exibida no cabeçalho principal da aplicação para MeuFinanceiro.
* **Onde:** `src/components/AppShell.tsx`
* **Arquivos relevantes:** `src/components/AppShell.tsx`
* **Critérios de aceite:**
  - [ ] o cabeçalho mostra MeuFinanceiro
  - [ ] o texto permanece legível em tema claro e escuro
  - [ ] o restante do shell continua funcional
* **Depende de:** nenhuma
* **Reaproveita:** estrutura atual do shell e navegação
* **Requisito:** US-01
* **Concluído quando:**
  - [ ] nome do app no shell está atualizado
* **Testes:**
  - DEVE mostrar MeuFinanceiro QUANDO o usuário abre a aplicação autenticada
  - DEVE manter a navegação funcional QUANDO o nome muda
* **Gate:** build + revisão visual
* **Branch:** não definido
* **PR/Commit(s):** não definido
* **Exemplo de implementação:** trocar o texto `FinanceFlow` por `MeuFinanceiro` no header
* **Contrato:** texto de identidade do produto em interface compartilhada
* **Esforço/Risco:** 1 ponto | Risco: Baixo
* **Referência:** US-01

### T2. [FRONT] Atualizar tela de autenticação

* **O que:** substituir a marca da tela de login e cadastro para MeuFinanceiro sem alterar o fluxo de autenticação.
* **Onde:** `src/routes/login.tsx`
* **Arquivos relevantes:** `src/routes/login.tsx`
* **Critérios de aceite:**
  - [ ] o nome MeuFinanceiro aparece no painel de autenticação
  - [ ] login e cadastro continuam funcionando normalmente
  - [ ] não há regressão do layout ou do tema
* **Depende de:** nenhuma
* **Reaproveita:** layout atual do formulário de autenticação
* **Requisito:** US-02
* **Concluído quando:**
  - [ ] a tela de login mostra o novo nome do produto
* **Testes:**
  - DEVE mostrar MeuFinanceiro QUANDO o usuário entra na página de login
  - DEVE manter rerender e fluxo de autenticação QUANDO o nome é atualizado
* **Gate:** build + teste manual do login
* **Branch:** não definido
* **PR/Commit(s):** não definido
* **Exemplo de implementação:** alterar o h1 em `login.tsx`
* **Contrato:** texto de identidade do produto em autenticação
* **Esforço/Risco:** 1 ponto | Risco: Baixo
* **Referência:** US-02

### T3. [FRONT] Atualizar metadados do navegador

* **O que:** ajustar o título da página e os metadados do documento para refletir MeuFinanceiro.
* **Onde:** `src/routes/__root.tsx`
* **Arquivos relevantes:** `src/routes/__root.tsx`
* **Critérios de aceite:**
  - [ ] `title` da aba mostra MeuFinanceiro
  - [ ] metadados de SEO/compartilhamento refletem o novo nome
  - [ ] o restante dos metadados permanece consistente
* **Depende de:** T1, T2
* **Reaproveita:** config de head da raiz do app
* **Requisito:** US-03
* **Concluído quando:**
  - [ ] o app responde com o nome novo nos metadados do navegador
* **Testes:**
  - DEVE exibir MeuFinanceiro QUANDO a aba é aberta pelo navegador
  - DEVE manter as descrições sem mudança de conteúdo fora do nome da marca
* **Gate:** build + inspeção do `head`
* **Branch:** não definido
* **PR/Commit(s):** não definido
* **Exemplo de implementação:** alterar `title`, `og:title` e `twitter:title`
* **Contrato:** metadados HTML do documento
* **Esforço/Risco:** 1 ponto | Risco: Baixo
* **Referência:** US-03

## Mapa de Execução Paralela

- T1 e T2 podem avançar em paralelo, desde que a revisão final de identidade esteja alinhada.
- T3 depende de T1 e T2 para refletir uma marca consistente do aplicativo.

## Verificação Cruzada Diagrama-Definição

- Plano: T1 -> T3; T2 -> T3
- Dependências declaradas: T3 depende de T1 e T2; consistentes com o plano.

## Validação de Co-localização de Testes

- mudança de identidade visual: revisão de renderização e inspeção em shell/login
- mudança de metadados: validação do `title` e SEO do documento
- ausência de regressão funcional: build e teste manual de autenticação
