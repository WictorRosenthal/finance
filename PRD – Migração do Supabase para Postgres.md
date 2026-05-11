# PRD – Migração do Supabase para PostgreSQL Local

## Objetivo
Migrar toda a persistência de dados do projeto atualmente baseada no Supabase para um banco de dados PostgreSQL local, garantindo que todas as ações, requisições e integrações passem a utilizar o novo banco, mantendo a integridade, segurança e performance da aplicação.

---

## Justificativa
- Reduzir custos e dependências externas.
- Maior controle sobre dados e infraestrutura.
- Possibilidade de customização avançada e integração com ferramentas locais.

---

## Escopo

### 1. Levantamento e Mapeamento
- Mapear todas as tabelas, views e funções utilizadas no Supabase.
- Identificar endpoints, serviços e módulos que interagem com o Supabase.
- Levantar triggers, policies e regras de autenticação/autorização.

### 2. Infraestrutura
- Provisionar instância PostgreSQL local (Docker, VM ou servidor dedicado).
- Configurar variáveis de ambiente (`DATABASE_URL`) para apontar para o novo banco.

### 3. Migração de Dados
- Exportar dados do Supabase (via dump SQL ou CSV).
- Importar dados para o PostgreSQL local, garantindo integridade e consistência.
- Validar a estrutura (schemas, constraints, índices).

### 4. Refatoração do Backend
- Remover dependências do Supabase client.
- Refatorar serviços, repositórios e controllers para usar Drizzle ORM (ou outro ORM já adotado).
- Atualizar métodos de CRUD, autenticação e autorização para persistirem dados no PostgreSQL.
- Ajustar testes automatizados para refletir a nova fonte de dados.

### 5. Refatoração do Frontend
- Atualizar endpoints e integrações para consumir APIs do backend que agora usam PostgreSQL.
- Garantir que não haja chamadas diretas ao Supabase.

### 6. Testes e Validação
- Testar todos os fluxos de cadastro, login, leitura, atualização e exclusão de dados.
- Validar regras de permissão (admin, leitura).
- Garantir que não há perda de dados ou funcionalidades.

### 7. Documentação e Treinamento
- Atualizar documentação técnica e de ambiente.
- Treinar equipe para uso e manutenção do novo banco.

---

## Critérios de Aceite
- Todas as operações de dados (CRUD, autenticação, autorização) utilizam exclusivamente o PostgreSQL local.
- Não há dependências do Supabase no código.
- Dados migrados com sucesso e validados.
- Testes automatizados e manuais aprovados.
- Documentação atualizada.

---

## Riscos
- Possível perda de dados na migração.
- Incompatibilidade de funções ou triggers.
- Downtime durante a transição.

---

## Cronograma Sugerido
1. Levantamento e planejamento: 2 dias
2. Infraestrutura e configuração: 1 dia
3. Migração de dados: 1 dia
4. Refatoração backend: 2 dias
5. Refatoração frontend: 1 dia
6. Testes e validação: 2 dias
7. Documentação e entrega: 1 dia

---

## Observações
- Backup completo do Supabase antes de iniciar.
- Planejar janela de manutenção para migração final.