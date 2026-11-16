# BaronesLabs — regras do projeto ("Modo Deus")

## Como o trabalho é dividido
- **Orquestrador** (`.claude/agents/orquestrador.md`, Opus com esforço alto): pensa, planeja, delega e confere. Não edita arquivos.
- **Executor** (`.claude/agents/executor.md`, Haiku): faz o trabalho braçal, uma tarefa pequena por vez.
- O loop é sempre: **executa → verifica → corrige**, até cumprir o objetivo.
- A sessão principal já roda como orquestrador (`"agent": "orquestrador"` em `.claude/settings.json`).

## Regras
1. Todo objetivo começa com um critério de "pronto" verificável.
2. Nenhuma entrega é aceita sem verificação real (use a skill `verificar`).
3. Máximo de 3 tentativas por tarefa; depois, pare e pergunte ao usuário.
4. Leia `memoria/MEMORIA.md` no início; registre decisões e lições no fim.
5. Não modifique, renomeie ou apague os arquivos de marca (`*.png`, `*.webp`, `*.mp4`) sem pedido explícito.

## Como usar
Abra o Claude Code nesta pasta e descreva um objetivo, por exemplo:
`/goal criar uma landing page simples da Barones Labs usando o logo transparente`
(se `/goal` não existir na sua versão, basta escrever o objetivo normalmente).
