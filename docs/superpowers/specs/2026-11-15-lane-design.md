# Lane: design

## Intenção
O Lane é um presente do Wesley para a esposa, Lane. É um lugar só do casal, que ela recebe por link, abre no celular como um app e onde os dois podem adicionar coisas. Ele junta as fotos dos dois, as lembranças por data, poemas com o nome dela e a música que o Wesley compôs.

## Objetivos
- Ela abre o link, entra com a conta Google e já sente que foi feito para ela.
- **Fotos:** importadas do Google Fotos pela janela oficial do Google (Picker), organizadas por data.
- **Lembranças:** uma linha do tempo com data, título, texto e fotos opcionais.
- **Poemas:** leitura bonita; os dois podem escrever e editar.
- **Música:** a música do Wesley, com player sempre acessível.
- Pode ser instalado na tela de início (PWA) e funciona bem no celular.

## Fora do escopo (por agora)
- Sincronização automática com o Google Fotos: a API do Google não permite mais.
- Busca por rosto ou pessoa feita pelo app: quem filtra "Wesley e Lane" é a própria janela do Google.
- App de loja (App Store ou Play Store).
- Vídeos do Google Fotos: entram numa fase 2.

## Anti-objetivos (seria um fracasso mesmo funcionando)
- Qualquer pessoa com o link conseguir ver o conteúdo.
- Cara de sistema ou painel administrativo em vez de presente.
- Fotos que somem depois de um tempo, porque os links do Google expiram.

## Restrições
- Desde março de 2025, a API do Google Fotos só permite que o próprio usuário escolha as fotos pelo Picker. Os links que o Picker devolve expiram em cerca de 60 minutos, então cada foto é **copiada** para o nosso armazenamento na hora da importação.
- Acesso restrito por login Google a uma lista de dois e-mails (Wesley e Lane).
- O projeto no Google Cloud fica em modo "Teste", com os dois e-mails como usuários de teste. O Wesley cria o projeto seguindo o passo a passo.

## Abordagens consideradas
1. **Site que vira app (PWA): Next.js + Vercel + Supabase.** Escolhida. O acesso é por link, dá para instalar na tela de início, o Picker funciona no navegador, e Supabase e Vercel já estão conectados.
2. **App nativo de loja.** Descartada: não dá para entregar por link, e o iPhone exige conta paga da Apple e revisão.
3. **No-code (Lovable).** Descartada: fica menos personalizada e mais difícil de deixar com a cara do casal.

## Decisões do Wesley
- Importação de fotos pela opção A (Picker do Google Fotos).
- Os dois podem adicionar conteúdo.
- Abordagem 1 (PWA).
- Entrada no app por login Google.

## Como vai ser feito (decisões do Claude, podem ser corrigidas)
- **Local:** pasta `lane/` neste repositório. Next.js (App Router) + TypeScript + Tailwind.
- **Login:** Supabase Auth com o provedor Google. A permissão `photospicker.mediaitems.readonly` é pedida no login, e o `provider_token` é usado para o Picker. Se um e-mail fora da lista fizer login, ele é deslogado e vê uma tela gentil de "este lugar é só da Lane e do Wesley".
- **Segurança:** RLS do Supabase em todas as tabelas e no Storage. Só os e-mails da tabela `members` têm acesso. O bucket é privado e as imagens são servidas por URLs assinadas.
- **Fluxo de importação:**
  1. Cria a sessão do Picker.
  2. Abre o `pickerUri`, onde ela ou ele busca "Wesley e Lane" e seleciona as fotos.
  3. Consulta a sessão até `mediaItemsSet`.
  4. Lista os itens.
  5. Uma rota do servidor baixa cada foto (`baseUrl=w2400`, com o token) e envia para o Storage.
  6. Salva `taken_at` (o `createTime`) e o id do Google, que não aceita duplicatas.
  7. Apaga a sessão.
  8. Mostra o progresso na tela.
- **Dados:**
  - `members(email)`
  - `photos(id, google_id unique, path, taken_at, width, height, added_by)`
  - `memories(id, date, title, body, added_by)` + `memory_photos(memory_id, photo_id)`
  - `poems(id, title, body, author, created_at)`
  - `song(path, title)`, com um registro só
- **Telas:**
  - Início: nome dela em destaque, uma frase, atalho para a música e "neste dia" (fotos da mesma data em anos anteriores).
  - Fotos: grade por mês e ano, com visualização em tela cheia.
  - Lembranças: linha do tempo.
  - Poemas.
  - Música.
  - O mini player fica fixo e continua tocando ao trocar de tela.
- **Visual:** romântico e quente, com tons creme e vinho, um título serifado e o texto sem serifa. Animações suaves e sem exageros. A interface é em português. O crédito "feito por Wesley · Barones Labs" fica discreto no rodapé.
- **Música:** o arquivo enviado pelo Wesley vai para o Storage. Também existe a opção de trocar o arquivo por upload no app.

## Conteúdo inicial
- **Datas do casal:** início do namoro em 30/12/2014; casamento em 15/11/2017.
- **Lembranças pré-cadastradas:** "Começo de tudo" (30/12/2014) e "Nosso casamento" (15/11/2017).
- **Início:** relógio em tempo real, atualizado a cada segundo, mostrando quanto tempo estão juntos desde 30/12/2014 00:00 (horário de Brasília), em anos, meses, dias, horas, minutos e segundos. Abaixo dele, "casados há..." desde 15/11/2017, no mesmo formato (pedido do Wesley). Nos aniversários de namoro e de casamento, um destaque especial (decisão do Claude).
- **Poemas iniciais:** os de `lane/content/poemas.md`, carregados no banco como autoria do Wesley e editáveis.

## Deixado para quem construir
Detalhes de layout, ícone e splash do PWA, e textos de estados vazios, sempre no tom de presente.

## Pendências do Wesley (para o setup, não bloqueiam o código)
- O e-mail Google da Lane.
- Revisar os poemas iniciais.
- Criar o projeto no Google Cloud (passo a passo será fornecido).
- O arquivo da música.
