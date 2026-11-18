import { Nav } from "@/components/Nav";
import { Hearts } from "@/components/Hearts";
import { IntroLazy as Intro } from "@/components/IntroLazy";
import { SwipeNav } from "@/components/SwipeNav";
import { MiniPlayer, PlayerProvider, type Track } from "@/components/Player";
import { supabaseServer, signedUrls } from "@/lib/supabase/server";
import type { Song } from "@/lib/types";
import { redirect } from "next/navigation";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const sb = await supabaseServer();
  const [{ data: { user } }, { data: membro }, { data: songs }] = await Promise.all([
    sb.auth.getUser(),
    sb.rpc("is_member"),
    sb.from("songs").select("id,path,title,lyrics,cover_path,position").order("position").order("created_at").returns<Song[]>(),
  ]);
  if (!user) redirect("/entrar");
  if (!membro) redirect("/so-nosso");
  const lista = songs ?? [];
  const urls = await signedUrls(lista.flatMap((m) => (m.cover_path ? [m.path, m.cover_path] : [m.path])));
  const tracks: Track[] = lista
    .filter((m) => urls[m.path])
    .map((m) => ({ id: m.id, title: m.title, src: urls[m.path], cover: m.cover_path ? urls[m.cover_path] ?? null : null, lyrics: m.lyrics }));
  return (
    <PlayerProvider tracks={tracks}>
      <Hearts />
      <div id="conteudo" className="mx-auto min-h-dvh max-w-2xl touch-pan-y px-4 pb-44 pt-[calc(1.5rem+env(safe-area-inset-top))]">{children}</div>
      <MiniPlayer />
      <Nav />
      <SwipeNav />
      <Intro />
    </PlayerProvider>
  );
}
