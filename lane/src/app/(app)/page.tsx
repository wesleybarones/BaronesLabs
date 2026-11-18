import Link from "next/link";
import { Clock } from "@/components/Clock";
import { PlayButton } from "@/components/Player";
import { Thumb } from "@/components/Thumb";
import { LaneTitle } from "@/components/LaneTitle";
import { Tilt } from "@/components/Tilt";
import { supabaseServer, signedUrls } from "@/lib/supabase/server";
import { wallClock } from "@/lib/elapsed";
import type { Photo, Song } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function Inicio() {
  const sb = await supabaseServer();
  const today = wallClock(new Date());
  const [otd, { data: song }, { count: fotos }] = await Promise.all([
    sb.rpc("photos_on_this_day", { m: today.month, d: today.day, y: today.year }),
    sb.from("song").select("path,title").eq("id", 1).maybeSingle<Song>(),
    sb.from("photos").select("id", { count: "exact", head: true }),
  ]);
  const onThisDay = (otd.data ?? []) as Photo[];
  const urls = await signedUrls(onThisDay.map((p) => p.thumb_path));

  return (
    <main className="relative space-y-12">
      <header className="surgir relative space-y-1 text-center">
        <p className="text-xs uppercase tracking-[.3em] text-suave">para a mulher da minha vida</p>
        <h1><LaneTitle className="text-7xl" /></h1>
      </header>

      <div className="relative"><Clock /></div>

      {song && (
        <Tilt className="surgir rounded-3xl"><section className="relevo flex items-center gap-4 rounded-3xl bg-papel p-4 ring-1 ring-rosa/60">
          <PlayButton />
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[.2em] text-suave">a música que eu fiz pra você</p>
            <p className="truncate font-serif text-xl text-vinho">{song.title}</p>
          </div>
        </section></Tilt>
      )}

      {onThisDay.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-serif text-2xl text-vinho">Neste dia, em outros anos</h2>
          <div data-noswipe className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-8 pt-2">
            {onThisDay.map((p) => (
              <Link key={p.id} href={`/fotos?foto=${p.id}`} className="snap-start shrink-0">
                <Tilt className="rounded-2xl" max={12}><Thumb src={urls[p.thumb_path]} className="relevo h-40 w-32 rounded-2xl" /></Tilt>
                <p className="mt-1 text-center text-xs text-suave">{new Date(p.taken_at).getFullYear()}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="relative grid grid-cols-2 gap-3">
        <Card href="/fotos" title="Nossas fotos" sub={fotos ? `${fotos} momentos` : "importe do Google Fotos"} />
        <Card href="/lembrancas" title="Lembranças" sub="nossa linha do tempo" />
        <Card href="/poemas" title="Poemas" sub="escritos pra você" />
        <Card href="/musica" title="Nossa música" sub="ouvir de novo" />
      </section>

      <footer className="text-center text-xs text-suave">feito com amor por Wesley</footer>
    </main>
  );
}

function Card({ href, title, sub }: { href: string; title: string; sub: string }) {
  return (
    <Tilt className="rounded-3xl" max={10}>
      <Link href={href} className="relevo block h-full rounded-3xl bg-gradient-to-br from-papel to-rosa-claro/60 p-5 ring-1 ring-rosa/60">
        <p className="flutua font-serif text-2xl text-vinho">{title}</p>
        <p className="text-sm text-suave">{sub}</p>
      </Link>
    </Tilt>
  );
}
