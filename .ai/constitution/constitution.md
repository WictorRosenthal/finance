# Constituição do Projeto

## Princípios fundamentais

- Integridade arquitetural e clareza de responsabilidades.
- Manutenibilidade e redução de complexidade desnecessária.
- Segurança, validação de entrada e tratamento de erros explícitos.
- Type safety quando a stack suportar.
- Testabilidade e cobertura de regressão para mudanças de comportamento.
- Separação entre domínio, infraestrutura, transporte e interface.
- Reuso de padrões e módulos já existentes antes de criar novos.
- Compatibilidade retroativa e documentação de mudanças relevantes.

## Regras

1. Não introduzir artefatos sem necessidade clara.
2. Não duplicar lógica já existente em outra camada.
3. Não criar dependências ou abstrações sem justificativa.
4. Não contornar guardrails de segurança, autenticação ou validação.
5. Qualquer mudança não trivial deve ser validada antes de ser considerada concluída.
