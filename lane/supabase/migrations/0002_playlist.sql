-- Lane: várias músicas (playlist) com capa
create table public.songs (
  id uuid primary key default gen_random_uuid(),
  path text not null,
  title text not null,
  lyrics text,
  cover_path text,
  position int not null default 0,
  created_at timestamptz not null default now()
);
create index songs_position_idx on public.songs (position, created_at);
alter table public.songs enable row level security;
create policy "membros_tudo" on public.songs for all to authenticated
  using (public.is_member()) with check (public.is_member());

-- a música que já existia vira a primeira da lista
insert into public.songs (path, title, lyrics, position)
select path, title, lyrics, 0 from public.song where id = 1;
