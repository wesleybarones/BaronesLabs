/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { saveMemory, deleteMemory } from "@/app/actions";
import { supabaseServer, signedUrls } from "@/lib/supabase/server";
import type { Memory, Photo } from "@/lib/types";
import { Submit } from "./Submit";

export async function MemoryForm({ memory, selected = [] }: { memory?: Memory; selected?: string[] }) {
  const sb = await supabaseServer();
  const { data } = await sb.from("photos").select("id,thumb_path,taken_at").order("taken_at", { ascending: false }).limit(150)
    .returns<Pick<Photo, "id" | "thumb_path" | "taken_at">[]>();
  const photos = data ?? [];
  const urls = await signedUrls(photos.map((p) => p.thumb_path));
  const action = saveMemory.bind(null, memory?.id ?? null);

  return (
    <form action={action} className="space-y-5">
      <label className="block space-y-1">
        <span className="text-sm text-suave">Quando foi?</span>
        <input type="date" name="date" required defaultValue={memory?.date} className="campo" />
      </label>
      <label className="block space-y-1">
        <span className="text-sm text-suave">Um título</span>
        <input name="title" required maxLength={200} defaultValue={memory?.title} placeholder="Ex.: Nossa primeira viagem" className="campo font-serif text-xl" />
      </label>
      <label className="block space-y-1">
        <span className="text-sm text-suave">O que você quer lembrar</span>
        <textarea name="body" rows={6} defaultValue={memory?.body} className="campo" placeholder="Conta como foi…" />
      </label>

      {photos.length > 0 && (
        <fieldset className="space-y-2">
          <legend className="text-sm text-suave">Fotos desse momento (opcional)</legend>
          <div className="grid max-h-80 grid-cols-4 gap-1 overflow-y-auto rounded-xl">
            {photos.map((p) => (
              <label key={p.id} className="relative aspect-square cursor-pointer overflow-hidden rounded-md has-[:checked]:ring-4 has-[:checked]:ring-vinho">
                <input type="checkbox" name="photos" value={p.id} defaultChecked={selected.includes(p.id)} className="peer absolute right-1 top-1 z-10 h-4 w-4 accent-vinho" />
                <img src={urls[p.thumb_path]} alt="" loading="lazy" className="h-full w-full object-cover peer-checked:opacity-80" />
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <Submit>{memory ? "Salvar" : "Guardar lembrança"}</Submit>
        <Link href="/lembrancas" className="botao-leve">Cancelar</Link>
      </div>
      {memory && (
        <button formAction={deleteMemory.bind(null, memory.id)} formNoValidate className="text-sm text-vinho underline">
          Apagar esta lembrança
        </button>
      )}
    </form>
  );
}
