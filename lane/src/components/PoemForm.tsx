import Link from "next/link";
import { savePoem, deletePoem } from "@/app/actions";
import type { Poem } from "@/lib/types";
import { Submit } from "./Submit";

export function PoemForm({ poem }: { poem?: Poem }) {
  return (
    <form action={savePoem.bind(null, poem?.id ?? null)} className="space-y-5">
      <input name="title" required maxLength={200} defaultValue={poem?.title} placeholder="Título" className="campo font-serif text-2xl" />
      <textarea name="body" required rows={14} defaultValue={poem?.body} placeholder={"Escreva verso por verso…\n\nDeixe uma linha em branco entre as estrofes."} className="campo font-serif text-lg leading-relaxed" />
      <label className="block space-y-1">
        <span className="text-sm text-suave">Quem escreveu</span>
        <input name="author" maxLength={60} defaultValue={poem?.author ?? ""} placeholder="Wesley ou Lane" className="campo" />
      </label>
      <p className="text-xs text-suave">Dica: escreva **L** para destacar uma letra (como no acróstico).</p>
      <div className="flex flex-wrap gap-3">
        <Submit>{poem ? "Salvar" : "Guardar poema"}</Submit>
        <Link href={poem ? `/poemas/${poem.id}` : "/poemas"} className="botao-leve">Cancelar</Link>
      </div>
      {poem && (
        <button formAction={deletePoem.bind(null, poem.id)} formNoValidate className="text-sm text-vinho underline">Apagar este poema</button>
      )}
    </form>
  );
}
