# Arquitetura Observada

A arquitetura real do repositório divide claramente duas partes: frontend e backend.

## Frontend
- Localização: `src/`
- Stack: React + Vite + TanStack Router + Tailwind.
- Estrutura de rotas: `src/routes/` e `src/router.tsx`.
- UI: componentes em `src/components/` e utilitários em `src/lib/`.

## Backend
- Localização: `backend/src/`
- Stack: Fastify + TypeScript + Drizzle + PostgreSQL.
- Estrutura: `application/`, `domain/`, `infrastructure/`, `presentation/`, `shared/`, `types/`.
- Entrada principal: `backend/src/main.ts` registra CORS, handlers de erro e rotas.

## Fluxo principal
1. Frontend chama API via `src/lib/api.ts`.
2. Backend recebe e orquestra rotas em `backend/src/presentation/routes/`.
3. Lógica de aplicação e domínio processa regras.
4. Infraestrutura persiste dados via Drizzle/Postgres.

## Observação
A separação de camadas é evidente no backend, enquanto o frontend segue um modelo de app SPA com rotas declarativas e componentes UI.
