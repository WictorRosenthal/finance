# Arquitetura

A arquitetura deste projeto combina frontend em React com backend em Fastify e persistência Postgres via Drizzle. O código deve respeitar os limites entre interface, aplicação, domínio e infraestrutura.

## Diretrizes

- Respeitar as camadas existentes em `src/` e `backend/src/`.
- Evitar acoplamento entre UI e lógica de infraestrutura diretamente.
- Preferir abstrações já estabelecidas antes de criar novas.
- Reduzir dependências circulares e manter módulos com responsabilidade única.
- Garantir que mudanças de contrato em API ou schema tenham ajustes correspondentes em cliente e backend.
