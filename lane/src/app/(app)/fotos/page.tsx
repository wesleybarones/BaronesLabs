import Link from "next/link";
import { Gallery } from "@/components/Gallery";
import { supabaseServer, signedUrls } from "@/lib/supabase/server";
import { groupByMonth } from "@/lib/group";
import type { Photo } from "@/lib/types";

export const dynamic = "force-dynamic";
const PAGE = 240;

export default async function Fotos({ searchParams }: { searchParams: Promise<{ antes?: string; foto?: string }> }) {
  const { antes, foto } = await searchParams;
  const sb = await supabaseServer();
  let q = sb.from("photos").select("*").order("taken_at", { ascending: false }).limit(PAGE);
  if (antes) q = q.lt("taken_at", antes);
  const { data } = await q.returns<Photo[]>();
  const photos = data ?? [];
  const urls = await signedUrls(photos.flatMap((p) => [p.thumb_path, p.full_path]));
  const groups = groupByMonth(photos).map((g) => ({
    label: g.label,
    items: g.items.map((p) => ({ id: p.id, thumb: urls[p.thumb_path], full: urls[p.full_path], taken_at: p.taken_at })),
  }));

  return (
    <main className="space-y-6">
      <header className="flex items-end justify-between gap-4">
        <div>
          <h1 className="titulo">Nossas fotos</h1>
          <p className="text-sm text-suave">Wesley e Lane, do jeito que o Google Fotos guardou</p>
        </div>
        <Link href="/fotos/importar" className="botao shrink-0 px-4 py-2 text-sm">+ Trazer</Link>
      </header>

      {photos.length === 0 ? (
        <div className="space-y-4 rounded-3xl bg-papel p-8 text-center ring-1 ring-rosa/60">
          <p className="font-serif text-2xl text-vinho">Ainda sem fotos por aqui</p>
          <p className="text-sm text-suave">Busque “Wesley e Lane” no Google Fotos e traga as preferidas.</p>
          <Link href="/fotos/importar" className="botao">Trazer do Google Fotos</Link>
        </div>
      ) : (
        <Gallery groups={groups} openId={foto} />
      )}

      {photos.length === PAGE && (
        <div className="text-center">
          <Link className="botao-leve" href={`/fotos?antes=${encodeURIComponent(photos[photos.length - 1].taken_at)}`}>Ver mais antigas</Link>
        </div>
      )}
    </main>
  );
}
