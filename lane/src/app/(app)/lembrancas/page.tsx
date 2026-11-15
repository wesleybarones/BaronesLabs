/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { supabaseServer, signedUrls } from "@/lib/supabase/server";
import type { Memory } from "@/lib/types";
import { Tilt } from "@/components/Tilt";

export const dynamic = "force-dynamic";

const fmt = new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
type Row = Memory & { memory_photos: { photos: { id: string; thumb_path: string } | null }[] };

export default async function Lembrancas() {
  const sb = await supabaseServer();
  const { data } = await sb.from("memories")
    .select("*, memory_photos(photos(id,thumb_path))")
    .order("date", { ascending: false }).returns<Row[]>();
  const memories = data ?? [];
  const urls = await signedUrls(memories.flatMap((m) => m.memory_photos.map((mp) => mp.photos?.thumb_path ?? "").filter(Boolean)));

  return (
    <main className="space-y-8">
      <header className="flex items-end justify-between gap-4">
        <div>
          <h1 className="titulo">Lembranças</h1>
          <p className="text-sm text-suave">a nossa história, dia por dia</p>
        </div>
        <Link href="/lembrancas/nova" className="botao shrink-0 px-4 py-2 text-sm">+ Nova</Link>
      </header>

      <ol className="relative space-y-8 border-l-2 border-rosa pl-6">
        {memories.map((m) => {
          const year = m.date.slice(0, 4);
          return (
            <li key={m.id} id={`m-${m.id}`} className="surgir relative scroll-mt-6">
              <span className="absolute -left-[33px] top-1.5 grid h-4 w-4 place-items-center rounded-full bg-gradient-to-br from-rosa to-vinho shadow-[0_2px_4px_rgb(90_18_41/.5)] ring-4 ring-creme" />
              <p className="text-xs uppercase tracking-[.2em] text-suave">{fmt.format(new Date(m.date))}</p>
              <Tilt className="mt-1 rounded-3xl" max={4}><div className="relevo rounded-3xl bg-papel p-5 ring-1 ring-rosa/60">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="font-serif text-2xl text-vinho">{m.title}</h2>
                  <Link href={`/lembrancas/${m.id}/editar`} className="shrink-0 text-xs text-suave underline">editar</Link>
                </div>
                {m.body && <p className="mt-2 whitespace-pre-line leading-relaxed text-tinta/90">{m.body}</p>}
                {m.memory_photos.length > 0 && (
                  <div className="mt-3 grid grid-cols-3 gap-1">
                    {m.memory_photos.map((mp) => mp.photos && (
                      <Link key={mp.photos.id} href={`/fotos?foto=${mp.photos.id}`} className="aspect-square overflow-hidden rounded-lg">
                        <img src={urls[mp.photos.thumb_path]} alt="" loading="lazy" className="h-full w-full object-cover" />
                      </Link>
                    ))}
                  </div>
                )}
              </div></Tilt>
              <span className="sr-only">{year}</span>
            </li>
          );
        })}
      </ol>
    </main>
  );
}
