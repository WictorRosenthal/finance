# AI Engineering Framework

> **Gerado a partir do bob_framework:** v1.5.0

Este diretório é a fonte canônica de verdade para a engenharia de IA deste repositório. Ele centraliza a constituição, instruções, agentes, workflows, specs e contexto que orientam a implementação e a revisão de mudanças.

## Objetivo

O `.ai/` padroniza como a equipe e os agentes de IA devem entender o projeto, trabalhar em segurança e manter a arquitetura consistente sem duplicar regras em diversos provedores.

## Estrutura

```text
.ai/
├── constitution/
├── instructions/
├── agents/
├── skills/
├── specs/
├── workflows/
├── context/
├── commands/
├── README.md
├── CHANGELOG.md
└── ...
```

## Diferenças entre as pastas

- `constitution/`: princípios imutáveis do projeto.
- `instructions/`: comportamento operacional esperado.
- `agents/`: papéis especializados dos agentes.
- `skills/`: conhecimento técnico reutilizável e referências de habilidades.
- `specs/`: requisitos/features e tarefas planejadas.
- `workflows/`: fluxos recorrentes de feature, bugfix, review e mapeamento.
- `context/`: conhecimento específico do repositório, baseado em evidência direta.
- `commands/`: gatilhos padronizados `/bob-*` para orquestrar o framework.

## Como usar

1. Use o diretório `.ai/` como fonte primária de instruções antes de propor alterações.
2. Consulte o contexto do repositório em `.ai/context/` para entender stack, arquitetura e convenções.
3. Use os agentes e comandos em `.ai/agents/` e `.ai/commands/` para decompor e validar tarefas.
4. Atualize documentação e contexto quando mudanças de arquitetura ou integração forem feitas.

## Adaptadores de provedor

Arquivos específicos de ferramenta, como `AGENTS.md`, `CLAUDE.md` e `.github/copilot-instructions.md`, funcionam como adaptadores mínimos e apontam para o que está em `.ai/`.

## Versionamento

Este `.ai/` possui seu próprio changelog em `.ai/CHANGELOG.md`, e o carimbo da versão do framework-fonte fica no topo deste README.
