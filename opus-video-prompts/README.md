# Opus 5.5 Video Prompts

Coleção de **703 prompts** de vídeos virais feitos com Claude Opus 5.5, copiada de
[yihui-dev/awesome-opus5-5-videos](https://github.com/yihui-dev/awesome-opus5-5-videos) (licença MIT; cada prompt pertence ao seu criador, com link no arquivo).

| Categoria | Qtd |
|---|---|
| motion (motion graphics) | 369 |
| 3d (cenas 3D) | 117 |
| explainer | 116 |
| interactive (jogos / interativo) | 101 |

## Arquivos

- `INDEX.md`: todos os prompts por categoria, com resumo e tecnologia (canvas, three.js, svg…)
- `prompts/<slug>.md`: o prompt completo, autor e link do post original
- `videos.json`: os mesmos dados em JSON (slug, category, tech_tags, prompt, author, post_url)

## Como usar

1. Abra o `INDEX.md` e escolha um prompt (ou busque: `grep -ril "logo" opus-video-prompts/prompts`).
2. Copie o bloco **Prompt** do arquivo.
3. Cole no Claude Code e peça para renderizar como **um único arquivo HTML**.
4. Para virar vídeo, peça para gravar a página, ou passe o HTML pela skill **HyperFrames**, que renderiza em MP4.

Exemplo direto no Claude Code:

> Usa o prompt de `opus-video-prompts/prompts/ror-fly-880547.md`, adapta para a marca Barones Labs e renderiza em MP4 com HyperFrames.

Alguns criadores publicaram só parte do prompt. Nesses casos, o arquivo avisa.
