# Riscos e Concerns

## Pontos observados
- O projeto possui um backend e um frontend separados, exigindo sincronização de contratos para evitar regressões em API e UI.
- Há uso de banco Postgres e autenticação; qualquer mudança em schema ou JWT precisa de revisão de segurança/compatibilidade.
- O conteúdo em `PRD` indica implementação de autenticação e migração de serviços; isso exige atenção especial a não quebrar fluxos sensíveis.

## Guardrails
- Não expor segredos em código ou diffs.
- Não ignorar validação de API e autenticação ao alterar contratos.
- Não duplicar regras de autenticação entre frontend e backend.

## Observações
Estas são considerações levantadas a partir dos artefatos do código e da documentação do projeto.
