# Estrutura de Diretórios

## Diretório raiz
- `src/`: frontend da aplicação.
- `backend/`: backend em TypeScript.
- `bob/`: especificação e templates do framework BoB.
- `public`/arquivos de configuração: `vite.config.ts`, `wrangler.jsonc`, `tsconfig.json`, `eslint.config.js`, `package.json`.

## Frontend
- `src/routes/`: rotas do TanStack Router (`login`, `contas`, `convenios`, `transacoes`).
- `src/components/`: UI e shells da aplicação.
- `src/lib/`: API client e utilidades.
- `src/styles.css`: estilos globais.

## Backend
- `backend/src/application/`: DTOs, mappers e use cases.
- `backend/src/domain/`: entidades, repositorios e value objects.
- `backend/src/infrastructure/`: autenticação, container, database, orm.
- `backend/src/presentation/`: controllers, middleware e routes.
- `backend/src/shared/`: erros compartilhados.
- `backend/drizzle/`: migrações geradas pelo Drizzle.

## Referência de mapeamento
- Data: 2026-09-23
- Base: estrutura real do código presente na árvore do repositório.
