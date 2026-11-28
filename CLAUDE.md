# BaronesLabs

Repositório da marca Barones Labs. Hoje guarda só os arquivos de identidade visual; ainda não tem código.

## Idioma
- Responder e escrever documentação em português do Brasil.

## Arquivos de marca

| Arquivo | O que é | Tamanho |
|---|---|---|
| `barones-labs-logo.png` | Logo horizontal, fundo sólido | 3600×1536 |
| `barones-labs-logo-transparente.png` | Logo horizontal, fundo transparente | 3600×1536 |
| `barones-labs-icone.png` | Ícone quadrado, fundo sólido | 2048×2048 |
| `barones-labs-icone-transparente.png` | Ícone quadrado, fundo transparente | 2048×2048 |
| `hazhbyxxnkmsgapf8wp2.png` | Imagem de apoio | 1856×2304 |
| `8k.webp` | Imagem de apoio | 825×1024 |
| `Man_wearing_futuristic_sunglasses_f902b7af_1080p.mp4` | Vídeo de apoio, 1080p | ~4 MB |

Qual usar:
- Sobre fundo colorido, foto ou site: versão **transparente**.
- Favicon, avatar e app: **ícone**. Cabeçalho e assinatura: **logo**.
- Para web, gerar cópias otimizadas (WebP/AVIF, tamanho menor) com nome novo; nunca servir os originais de 2–6 MB.

## Regras
- **Nunca alterar, sobrescrever, mover ou apagar os originais.** Um hook (`.claude/hooks/protect-assets.sh`) bloqueia isso. Versões derivadas ganham nome novo (ex.: `barones-labs-logo-512.webp`) ou vão para uma pasta própria.
- Para liberar uma alteração intencional, o usuário exporta `BARONES_ALLOW_ASSET_EDIT=1` antes de abrir o Claude Code.
- Arquivos acima de ~5 MB: considerar Git LFS antes de adicionar mais.

## Quando entrar código
Atualizar este arquivo com stack, comandos de build/teste e estrutura de pastas.
