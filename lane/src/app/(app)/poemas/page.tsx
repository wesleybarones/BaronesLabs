import Link from "next/link";
import { supabaseServer } from "@/lib/supabase/server";
import { plainPreview } from "@/components/PoemText";
import type { Poem } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function Poemas() {
  const sb = await supabaseServer();
  const { data } = await sb.from("poems").select("*").order("created_at", { ascending: true }).returns<Poem[]>();
  return (
    <main className="space-y-6">
      <header className="flex items-end justify-between gap-4">
        <div>
          <h1 className="titulo">Poemas</h1>
          <p className="text-sm text-suave">escritos com o seu nome</p>
        </div>
        <Link href="/poemas/novo" className="botao shrink-0 px-4 py-2 text-sm">+ Escrever</Link>
      </header>
      <ul className="space-y-3">
        {(data ?? []).map((p, i) => (
          <li key={p.id} className="surgir" style={{ animationDelay: `${i * 80}ms` }}>
            <Link href={`/poemas/${p.id}`} className="block rounded-3xl bg-papel p-5 shadow-sm ring-1 ring-rosa/60 transition hover:ring-vinho/40">
              <h2 className="font-serif text-2xl text-vinho">{p.title}</h2>
              <p className="mt-1 line-clamp-2 font-serif italic text-tinta/70">{plainPreview(p.body)}</p>
              <p className="mt-2 text-xs text-suave">por {p.author}</p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
