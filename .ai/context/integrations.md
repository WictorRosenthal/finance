# Integrações e Sistemas Externos

## Banco de dados
- PostgreSQL, configurado em `backend/drizzle.config.ts`.
- A conexão usa `DATABASE_URL` com fallback local para `postgresql://postgres:1234@localhost:5432/postgres`.

## API do frontend
- `src/lib/api.ts` aponta o cliente para `http://localhost:3001`.
- Há chamada explícita a endpoints como `/api/login` e `/api/register`.

## Infraestrutura de front-end
- `wrangler.jsonc` indica uso do runtime Cloudflare/React Start.

## Ferramentas de IA
- Nenhuma configuração MCP ou status line foi detectada ainda neste repositório.
- O framework BoB foi bootstrapado com estrutura `.ai/`, mas os adaptadores de ferramenta ficam fora de `.ai/` e devem ser configurados quando o ambiente de IA do usuário o exigir.
