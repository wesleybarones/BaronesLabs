# Contas por Print — Design

## Intenção
Hoje o Wesley anota todas as dívidas num bloco de notas e soma na mão. O app substitui isso:
ele joga o print de cada conta (luz, água, telefone, faturas de cartão) e o app lê, nomeia
e soma sozinho. Uso pessoal primeiro; talvez lançar no futuro.

## Objetivos
- Adicionar uma conta mandando um print (galeria do celular) — a IA identifica nome, tipo e valor.
- Mostrar em destaque o **total a pagar agora**.
- **Trocar o print** de uma conta (ex.: fatura do cartão aumentou): sai o valor antigo, entra o novo.
- Marcar uma conta como **PG**: fica riscada/verde, sai do "a pagar" e entra no "já pago".
- Apagar uma conta: sai do total.
- Gráficos simples: divisão por tipo (casa × cartões, e por conta) e pago × a pagar.

## Sugestões incluídas (pedidas pelo Wesley)
- **Corrigir o valor na mão** se a IA ler errado (nome e tipo também editáveis).
- **Aviso de duplicado**: se o print parecer a mesma conta do mesmo mês já cadastrada, o app
  pergunta se é para substituir, em vez de somar dobrado.

## Não-objetivos (por enquanto)
- Banco de dados, login, contas de usuário, sincronizar entre aparelhos.
- Listar cada compra dentro da fatura do cartão — conta o valor total da fatura.
- App em loja (Play Store / App Store).
- Lembretes de vencimento (o vencimento é lido e mostrado, mas sem notificação).

## Anti-objetivos
- Total errado sem o usuário perceber (por isso: valor sempre visível e editável, aviso de duplicado).
- Ficar mais trabalhoso que o bloco de notas.

## Abordagens consideradas
- **A) Tudo no próprio celular** — sem banco, sem login. **Escolhida pelo Wesley**: é simples e só pra ele.
  Risco: perder dados ao limpar o navegador/trocar de aparelho.
- B) Nuvem com login (Supabase + Vercel) — recusada: mais complexa que o necessário agora.

## Como funciona (decisões)
- **App web instalável no celular** (PWA): abre no navegador e pode ir para a tela inicial.
- **Dados ficam no aparelho** (armazenamento do navegador — IndexedDB), incluindo a miniatura
  do print comprimida.
- **Leitura do print**: uma pequena função na Vercel recebe a imagem e pergunta à IA de visão
  da Anthropic (Claude) o nome, tipo (luz/água/telefone/internet/cartão/outro), valor,
  vencimento e mês de referência. A função **não guarda nada** — só lê e devolve.
  A chave da API fica na Vercel, nunca no celular.
- **Senha simples** no app para usar a função de leitura, para que estranhos que achem o link
  não gastem créditos da API do Wesley.

## Decisões minhas (para o Wesley conferir)
- **Botão "Backup"**: exporta tudo num arquivo e permite importar de volta — protege contra perder
  dados ao trocar de celular, sem precisar de banco.
- Tecnologia: React + TypeScript (Vite), gráficos com Recharts, hospedagem na Vercel.
- Valores em reais (R$), interface em português.

## Fica para quem constrói
- Visual detalhado, ícones por tipo de conta, compressão das imagens, mensagens de erro.

## O que o Wesley precisa providenciar
- Uma chave da API da Anthropic (console.anthropic.com) — custo de centavos por print.
