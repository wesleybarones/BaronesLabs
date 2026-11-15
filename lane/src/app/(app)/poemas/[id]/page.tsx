import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import { PoemText } from "@/components/PoemText";
import type { Poem } from "@/lib/types";

export default async function Poema({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sb = await supabaseServer();
  const { data: p } = await sb.from("poems").select("*").eq("id", id).maybeSingle<Poem>();
  if (!p) notFound();
  return (
    <main className="space-y-8">
      <div className="flex justify-between text-sm">
        <Link href="/poemas" className="text-suave">← Poemas</Link>
        <Link href={`/poemas/${p.id}/editar`} className="text-suave underline">editar</Link>
      </div>
      <article className="surgir space-y-8 rounded-[2rem] bg-papel px-6 py-10 shadow-sm ring-1 ring-rosa/60 sm:px-12">
        <h1 className="text-center font-serif text-4xl font-semibold text-vinho">{p.title}</h1>
        <div className="mx-auto h-px w-12 bg-rosa" />
        <PoemText body={p.body} />
        <p className="text-right font-serif italic text-suave">— {p.author}</p>
      </article>
    </main>
  );
}
