# Claude SEO: a skill grátis que audita o seu site para o Google e para as respostas de IA

## O que é

Plugin gratuito e de código aberto para o Claude Code, criado por Agrici Daniel (repositório [AgriciDaniel/claude-seo](https://github.com/AgriciDaniel/claude-seo), licença MIT, mais de 30 mil estrelas no GitHub em 18/11/2026).

Segundo o README (resumo e tradução nossos): você passa um site e ele faz uma auditoria completa de SEO em 10 a 15 minutos, e entrega um plano de ação ordenado pelo que mais importa. Usa até 17 agentes trabalhando no site ao mesmo tempo.

## O que ele confere (resumo nosso do README)

- **SEO técnico:** rastreamento, indexação, sitemap, robots.txt, redirecionamentos, velocidade.
- **Conteúdo:** qualidade, páginas fracas, cobertura dos assuntos.
- **Dados estruturados (Schema.org):** encontra, valida e escreve.
- **Busca por IA:** a chance de as respostas de IA do Google, o ChatGPT, o Perplexity e o Gemini citarem as suas páginas.
- **SEO local:** Perfil da Empresa no Google, avaliações e o bloco do mapa.

## Como instalar (comandos copiados do README)

Precisa do Claude Code 1.0.33 ou mais novo. Rode estes três comandos dentro dele:

```
/plugin marketplace add AgriciDaniel/claude-seo
/plugin install claude-seo@agricidaniel-claude-seo
/seo setup
```

O `/seo setup` prepara o que a skill precisa (um ambiente Python próprio e um navegador sem janela). O `/seo doctor` confere se está tudo pronto.

## Como usar (comandos copiados do README, com explicação traduzida por nós)

| Comando | O que faz |
| --- | --- |
| `/seo audit https://seusite.com.br` | auditoria completa, com plano priorizado |
| `/seo geo https://seusite.com.br` | quão pronto o site está para a busca por IA |
| `/seo local https://seusite.com.br` | SEO local e Perfil da Empresa no Google |
| `/seo page https://seusite.com.br/pagina` | uma página só, em profundidade |
| `/seo schema https://seusite.com.br` | confere e gera dados estruturados |

Digitar só `/seo` mostra todos os comandos.

## Atenção

- A skill audita e entrega um plano. Ela não garante posição no Google, e avaliação de cliente não se resolve por comando.
- Requisitos, segundo o README: Claude Code 1.0.33 ou mais novo e Python 3.11 a 3.14.
- A auditoria completa gasta mais do seu plano do Claude do que a análise de uma página só, porque parte dos agentes roda no modelo mais caro.
- Sem chaves das APIs do Google (gratuitas, opcionais), os números de velocidade são estimativas de laboratório.
- As páginas analisadas são enviadas ao Claude, como qualquer coisa que você faz no Claude Code. Os relatórios ficam salvos no seu computador.
- O autor também divulga uma comunidade paga, com uma versão privada da skill. A versão pública é gratuita.

## Referência

<https://github.com/AgriciDaniel/claude-seo> — README lido em 18/11/2026.
