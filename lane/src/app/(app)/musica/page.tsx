import { MusicPlayer } from "@/components/MusicPlayer";
import { Lyrics } from "@/components/Lyrics";
import { supabaseServer } from "@/lib/supabase/server";

export default async function Musica() {
  const sb = await supabaseServer();
  const { data } = await sb.from("song").select("title,lyrics").eq("id", 1).maybeSingle<{ title: string; lyrics: string | null }>();
  return (
    <main className="space-y-6">
      <h1 className="titulo">Nossa música</h1>
      <MusicPlayer title={data?.title ?? null} />
      {data?.lyrics && <Lyrics text={data.lyrics} />}
    </main>
  );
}
