# Testes

## Evidência observada
- O backend inclui `vitest` em `backend/package.json`.
- O frontend não apresenta suíte de testes explícita na raiz em `package.json`, mas mantém ESLint e build como validação principal.

## Prática recomendada
- Usar Vitest para testes de backend e comportamentos críticos.
- Favorar testes de regressão para autenticação, transações e regras de domínio.
- Usar build/lint como checagem mínima antes de fechar tarefas.

## Referência de mapeamento
- Data: 2026-09-23
