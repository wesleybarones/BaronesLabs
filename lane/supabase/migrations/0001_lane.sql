-- Lane: esquema, segurança e conteúdo inicial

create table public.members (
  email text primary key
);

create or replace function public.is_member()
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.members
    where lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;
grant execute on function public.is_member() to anon, authenticated;

create table public.photos (
  id uuid primary key default gen_random_uuid(),
  google_id text not null unique,
  full_path text not null,
  thumb_path text not null,
  taken_at timestamptz not null,
  width int,
  height int,
  added_by text default (auth.jwt() ->> 'email'),
  created_at timestamptz not null default now()
);
create index photos_taken_at_idx on public.photos (taken_at desc);

create table public.memories (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  title text not null check (length(title) between 1 and 200),
  body text not null default '',
  added_by text default (auth.jwt() ->> 'email'),
  created_at timestamptz not null default now()
);
create index memories_date_idx on public.memories (date desc);

create table public.memory_photos (
  memory_id uuid not null references public.memories(id) on delete cascade,
  photo_id uuid not null references public.photos(id) on delete cascade,
  primary key (memory_id, photo_id)
);

create table public.poems (
  id uuid primary key default gen_random_uuid(),
  title text not null check (length(title) between 1 and 200),
  body text not null,
  author text not null default 'Wesley',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.song (
  id int primary key default 1 check (id = 1),
  path text not null,
  title text not null default 'Nossa música',
  lyrics text,
  updated_at timestamptz not null default now()
);

-- RLS: tudo só para membros
do $$
declare t text;
begin
  foreach t in array array['members','photos','memories','memory_photos','poems','song'] loop
    execute format('alter table public.%I enable row level security', t);
  end loop;
  foreach t in array array['photos','memories','memory_photos','poems','song'] loop
    execute format('create policy "membros_tudo" on public.%I for all to authenticated using (public.is_member()) with check (public.is_member())', t);
  end loop;
end $$;
create policy "membros_leem" on public.members for select to authenticated using (public.is_member());

-- Storage: bucket privado
insert into storage.buckets (id, name, public) values ('lane', 'lane', false)
on conflict (id) do nothing;

create policy "lane_membros_le" on storage.objects for select to authenticated
  using (bucket_id = 'lane' and public.is_member());
create policy "lane_membros_insere" on storage.objects for insert to authenticated
  with check (bucket_id = 'lane' and public.is_member());
create policy "lane_membros_atualiza" on storage.objects for update to authenticated
  using (bucket_id = 'lane' and public.is_member());
create policy "lane_membros_apaga" on storage.objects for delete to authenticated
  using (bucket_id = 'lane' and public.is_member());

-- Conteúdo inicial
insert into public.memories (date, title, body, added_by) values
  ('2014-12-30', 'Começo de tudo', 'Um dia antes do ano acabar, começou o nosso.', 'Wesley'),
  ('2017-11-15', 'Nosso casamento', 'O dia em que a gente disse sim.', 'Wesley');

insert into public.poems (title, body, author, created_at) values
  ('Lane', $poema$**L**uz que chegou sem pedir licença,
**A**briu janelas que eu nem sabia ter;
**N**ome que eu digo como quem agradece —
**E**terno ainda é pouco pra te querer.$poema$, 'Wesley', now() - interval '4 minutes'),
  ('30 de dezembro de 2014', $poema$Faltava um dia pro ano acabar
e o mundo inteiro contava as horas.
Eu, distraído, só sabia olhar
pra você — e o resto ficou lá fora.

Todo mundo guardava os fogos
pro primeiro minuto do ano novo.
O meu chegou um dia mais cedo:
tinha o seu nome, Lane, e nenhum medo.$poema$, 'Wesley', now() - interval '3 minutes'),
  ('15 de novembro de 2017', $poema$Num quinze de novembro eu disse sim,
a voz falhando e a certeza verdadeira.
Você vinha andando em direção a mim
e eu soube: era você, a vida inteira.

Não foi a festa, nem o altar, nem a hora —
foi teu olhar dizendo "agora somos nós".
E desde então eu conto a vida assim, Lane:
o que veio antes, e tudo o que veio após.$poema$, 'Wesley', now() - interval '2 minutes'),
  ('Nove anos de sim', $poema$Hoje faz nove anos do nosso sim
e quase doze do primeiro "nós".
Mudou a casa, mudou muito em mim,
só não mudou o que eu sinto na tua voz.

Teve café dividido e conta pra pagar,
teve briga boba e o perdão logo depois,
teve dia difícil que a gente soube atravessar
porque nunca foi um — sempre foi dois.

Por isso este app, esta música, este verso:
não é presente, é só um jeito de dizer
que, se eu pudesse escolher o universo,
eu escolheria, de novo, você.$poema$, 'Wesley', now() - interval '1 minutes');

-- "Neste dia": fotos do mesmo dia/mês em anos anteriores (respeita RLS)
create or replace function public.photos_on_this_day(m int, d int, y int)
returns setof public.photos
language sql stable
as $$
  select * from public.photos
  where extract(month from taken_at at time zone 'America/Sao_Paulo') = m
    and extract(day from taken_at at time zone 'America/Sao_Paulo') = d
    and extract(year from taken_at at time zone 'America/Sao_Paulo') < y
  order by taken_at desc
  limit 12;
$$;
grant execute on function public.photos_on_this_day(int, int, int) to authenticated;
