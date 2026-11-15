# Lane

Um presente do Wesley para a Lane: fotos de vocês dois (importadas do Google Fotos), lembranças por data, poemas, a música e um relógio que conta, segundo a segundo, o tempo que vocês estão juntos.

Tecnologia: Next.js 16, Supabase (login Google, banco e arquivos) e Vercel.

## Configuração (uma vez só)

### 1. Supabase
1. Em supabase.com/dashboard → **New project**: nome `lane`, região **South America (São Paulo)**.
2. **SQL Editor** → cole e rode todo o arquivo `supabase/migrations/0001_lane.sql`.
3. Ainda no SQL Editor, libere os dois e-mails:
   ```sql
   insert into public.members (email) values ('seu-email@gmail.com'), ('email-da-lane@gmail.com');
   ```
4. **Project Settings → API**: anote a **Project URL** e a chave **anon public**.

### 2. Google Cloud
1. Em console.cloud.google.com → **Novo projeto** com o nome `Lane`.
2. **APIs e serviços → Biblioteca** → ative a **Google Photos Picker API**.
3. **Google Auth Platform**:
   - **Branding:** nome `Lane`.
   - **Público:** Externo e em **Teste**. Em usuários de teste, coloque os dois e-mails.
   - **Acesso a dados:** adicione `openid`, `email`, `profile` e `https://www.googleapis.com/auth/photospicker.mediaitems.readonly`.
4. **Clientes → Criar cliente → Aplicativo da Web**:
   - Origens: `http://localhost:3000` e o endereço da Vercel.
   - Redirecionamento: `https://ID-DO-PROJETO.supabase.co/auth/v1/callback`.
5. Copie o Client ID e o Client Secret para o Supabase: **Authentication → Sign In / Providers → Google**.
6. No Supabase, em **Authentication → URL Configuration**:
   - **Site URL:** o endereço da Vercel.
   - **Redirect URLs:** adicione `https://SEU-APP.vercel.app/auth/callback` e `http://localhost:3000/auth/callback`.

### 3. Rodar no computador
```bash
cp .env.example .env.local   # preencha com a URL e a chave anon
npm install
npm run dev
```

### 4. Publicar (Vercel)
1. Importe o repositório na Vercel com **Root Directory** = `lane`.
2. Crie as variáveis `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
3. Faça o deploy e coloque o endereço final no Google (origens) e no Supabase (URLs), como nos passos acima.

## Como funciona a importação de fotos
O Google não deixa mais apps lerem a biblioteca inteira. Por isso o Lane abre a janela oficial do Google Fotos: você busca "Wesley e Lane", seleciona as fotos, e o Lane guarda uma cópia de cada uma no Supabase. Fotos repetidas são ignoradas. O acesso ao Google Fotos dura cerca de 1 hora depois do login; depois disso, o app pede para entrar de novo antes de importar.

## Testes
```bash
npm test
```
