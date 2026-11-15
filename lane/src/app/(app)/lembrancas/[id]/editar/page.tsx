import { notFound } from "next/navigation";
import { MemoryForm } from "@/components/MemoryForm";
import { supabaseServer } from "@/lib/supabase/server";
import type { Memory } from "@/lib/types";

export default async function Editar({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sb = await supabaseServer();
  const { data } = await sb.from("memories").select("*, memory_photos(photo_id)").eq("id", id)
    .maybeSingle<Memory & { memory_photos: { photo_id: string }[] }>();
  if (!data) notFound();
  return (
    <main className="space-y-6">
      <h1 className="titulo">Editar lembrança</h1>
      <MemoryForm memory={data} selected={data.memory_photos.map((x) => x.photo_id)} />
    </main>
  );
}
