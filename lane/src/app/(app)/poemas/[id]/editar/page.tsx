import { notFound } from "next/navigation";
import { PoemForm } from "@/components/PoemForm";
import { supabaseServer } from "@/lib/supabase/server";
import type { Poem } from "@/lib/types";

export default async function Editar({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sb = await supabaseServer();
  const { data } = await sb.from("poems").select("*").eq("id", id).maybeSingle<Poem>();
  if (!data) notFound();
  return (
    <main className="space-y-6">
      <h1 className="titulo">Editar poema</h1>
      <PoemForm poem={data} />
    </main>
  );
}
