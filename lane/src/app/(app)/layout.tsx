import { Nav } from "@/components/Nav";
import { Hearts } from "@/components/Hearts";
import { IntroLazy as Intro } from "@/components/IntroLazy";
import { SwipeNav } from "@/components/SwipeNav";
import { MiniPlayer, PlayerProvider } from "@/components/Player";
import { supabaseServer, signedUrls } from "@/lib/supabase/server";
import type { Song } from "@/lib/types";
import { redirect } from "next/navigation";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const sb = await supabaseServer();
  const [{ data: { user } }, { data: membro }, { data: song }] = await Promise.all([
    sb.auth.getUser(),
    sb.rpc("is_member"),
    sb.from("song").select("path,title").eq("id", 1).maybeSingle<Song>(),
  ]);
  if (!user) redirect("/entrar");
  if (!membro) redirect("/so-nosso");
  const urls = song ? await signedUrls([song.path]) : {};
  return (
    <PlayerProvider src={song ? urls[song.path] ?? null : null} title={song?.title ?? ""}>
      <Hearts />
      <div id="conteudo" className="mx-auto min-h-dvh max-w-2xl touch-pan-y px-4 pb-44 pt-[calc(1.5rem+env(safe-area-inset-top))]">{children}</div>
      <MiniPlayer />
      <Nav />
      <SwipeNav />
      <Intro />
    </PlayerProvider>
  );
}
