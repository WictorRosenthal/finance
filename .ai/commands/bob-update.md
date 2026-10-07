# /bob-update

## Descrição
Sincroniza o `.ai/` com a versão atual do `bob_framework` sem repetir o bootstrap completo.

## Sintaxe
`/bob-update`

## Pré-condições
- Repositório com `.ai/` já criado e reconhecível como gerado pelo framework.
- Versão atual do `bob_framework` disponível para comparação.

## Aciona
Sincronização direta de `.ai/` com a nova versão do framework, incluindo atualização de carimbo e changelog.

## Processo
1. Obter a versão mais recente do `bob_framework`.
2. Comparar com o carimbo registrado em `.ai/README.md`.
3. Resumir mudanças relevantes e gerar preview em `update.temp.md`.
4. Aguardar aprovação explícita.
5. Atualizar `.ai/CHANGELOG.md` e o carimbo do framework no topo de `.ai/README.md`.

## Saída esperada
`.ai/` alinhado com a versão atual do framework, sem perder as decisões e contexto já existentes no projeto.
