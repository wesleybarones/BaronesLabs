import { Nav } from "@/components/Nav";
import { MiniPlayer, PlayerProvider } from "@/components/Player";
import { supabaseServer, signedUrls } from "@/lib/supabase/server";
import type { Song } from "@/lib/types";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const sb = await supabaseServer();
  const { data: song } = await sb.from("song").select("path,title").eq("id", 1).maybeSingle<Song>();
  const urls = song ? await signedUrls([song.path]) : {};
  return (
    <PlayerProvider src={song ? urls[song.path] ?? null : null} title={song?.title ?? ""}>
      <div className="mx-auto min-h-dvh max-w-2xl px-4 pb-44 pt-[calc(1.5rem+env(safe-area-inset-top))]">{children}</div>
      <MiniPlayer />
      <Nav />
    </PlayerProvider>
  );
}
