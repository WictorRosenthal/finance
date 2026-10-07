# Flow Guardião

Flow Guardião é uma aplicação de gestão financeira pessoal com dashboard, controle de contas, transações, convênios e autenticação. O projeto combina um frontend em React/TanStack com um backend em Fastify e PostgreSQL, mantendo a lógica de negócio em camadas bem definidas.

## Visão geral

- Dashboard financeiro com visão geral de receitas, despesas e saldo
- Gestão de contas e movimentações
- Cadastro e edição de convênios
- Perfil do usuário e autenticação por JWT
- Integração OAuth com Google
- API REST em TypeScript para consumo do frontend

## Stack

### Frontend
- React
- Vite
- TanStack Start / Router
- Tailwind CSS
- shadcn/ui-inspired components

### Backend
- Node.js + TypeScript
- Fastify
- Drizzle ORM
- PostgreSQL
- JWT + OAuth
- Zod para validações

## Estrutura do repositório

```text
.
├── .ai/                  # fonte canônica de engenharia de IA
├── backend/              # API em TypeScript
│   ├── src/
│   │   ├── application/
│   │   ├── domain/
│   │   ├── infrastructure/
│   │   ├── presentation/
│   │   └── shared/
│   ├── drizzle/
│   ├── tests/
│   └── package.json
├── src/                  # frontend da aplicação
│   ├── components/
│   ├── routes/
│   ├── lib/
│   └── styles.css
├── bob/                  # especificação do framework BoB
├── package.json          # scripts do frontend
├── vite.config.ts
├── tsconfig.json
├── .gitignore
├── PRD - ARQUITETURA.md
├── PRD - Implementação de Autenticação (JWT e OAuth).md
└── README.md
```

## Requisitos

- Node.js 20+
- npm
- PostgreSQL acessível pela aplicação backend

## Primeiros passos

1. Instale as dependências do frontend:

```bash
npm install
```

2. Instale as dependências do backend:

```bash
cd backend
npm install
```

3. Configure as variáveis de ambiente necessárias para o backend, incluindo as exigidas pelo JWT/OAuth e pela conexão com o banco de dados.

Exemplos comuns do projeto:

- `port`
- `host`
- `GOOGLE_CLIENT_ID` para OAuth do Google
- variáveis de conexão do PostgreSQL / Drizzle, conforme a configuração local do ambiente

4. Inicie o backend:

```bash
cd backend
npm run dev
```

5. Inicie o frontend em outro terminal:

```bash
npm run dev
```

A aplicação normalmente fica disponível em:

- Frontend: `http://localhost:5173` (Vite padrão)
- Backend: `http://localhost:3001`

## Scripts

### Frontend

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

### Backend

```bash
cd backend
npm run dev
npm run build
npm run start
npm run test
npm run db:generate
npm run db:push
npm run db:migrate
```

## Funcionalidades principais

### Autenticação
- Registro de usuários
- Login local com JWT
- OAuth callback para login com Google
- Middleware de autenticação nas rotas protegidas

### Financeiro
- Criação, consulta, atualização e remoção de transações
- Controle por usuário
- Organização por conta e convênio
- Visualização por períodos e categorias

### Dados e arquitetura
- Separação de responsabilidades em `domain`, `application`, `infrastructure` e `presentation`
- Repositórios e casos de uso organizados por domínio
- Integração com banco relacional e migrações via Drizzle

## Documentação e requisitos do projeto

Há documentação adicional no repositório em arquivos como:

- `PRD - ARQUITETURA.md`
- `PRD - Implementação de Autenticação (JWT e OAuth).md`
- `PRD – Migração do Supabase para Postgres.md`
- `bob/` e `.ai/` para orientação de engenharia de IA e arquitetura do projeto

## Observações

Este projeto está em desenvolvimento e a organização do backend/data layer evolui ao longo do repositório. O frontend e o backend estão preparados para funcionar em conjunto, com a API exposta em rotas como `/api/accounts`, `/api/transactions`, `/api/agreements` e `/api/user`.

## Licença

Consulte o repositório para verificar a licença adotada e o processo de contribuição.
