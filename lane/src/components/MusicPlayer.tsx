"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PlayButton, fmtTime, usePlayer } from "./Player";
import { supabaseBrowser } from "@/lib/supabase/client";
import { setSong } from "@/app/actions";

export function MusicPlayer({ title }: { title: string | null }) {
  const p = usePlayer();
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);

  async function upload(form: HTMLFormElement) {
    const data = new FormData(form);
    const file = data.get("file") as File | null;
    if (!file || !file.size) return;
    if (!file.type.startsWith("audio/")) return setBusy("Esse arquivo não parece ser de áudio.");
    setBusy("Enviando a música…");
    const ext = (file.name.split(".").pop() || "mp3").replace(/[^a-z0-9]/gi, "").toLowerCase();
    const path = `music/${Date.now()}.${ext}`;
    const { error } = await supabaseBrowser().storage.from("lane").upload(path, file, { contentType: file.type });
    if (error) return setBusy("Não consegui enviar. Tenta de novo?");
    await setSong(path, String(data.get("title") ?? ""));
    setBusy(null);
    form.reset();
    router.refresh();
  }

  return (
    <div className="space-y-10">
      {p?.src ? (
        <section className="relevo surgir space-y-6 rounded-[2rem] bg-papel px-6 py-10 text-center ring-1 ring-rosa/60">
          <div className="mx-auto w-fit [perspective:700px]">
            <div className="[transform:rotateX(28deg)] [transform-style:preserve-3d]">
              <div className={`vinil relative grid h-48 w-48 place-items-center rounded-full ${p.playing ? "animate-[spin_6s_linear_infinite]" : ""}`}>
                <div className="relative z-10 h-3 w-3 rounded-full bg-creme" />
              </div>
            </div>
          </div>
          <div>
            <p className="font-serif text-3xl text-vinho">{title}</p>
            <p className="text-sm text-suave">composta por Wesley, para a Lane</p>
          </div>
          <input type="range" min={0} max={p.duration || 0} step={0.1} value={p.time} onChange={(e) => p.seek(Number(e.target.value))}
            className="w-full accent-vinho" aria-label="Posição da música" />
          <div className="flex justify-between text-xs tabular-nums text-suave"><span>{fmtTime(p.time)}</span><span>{fmtTime(p.duration)}</span></div>
          <div className="flex justify-center"><PlayButton big /></div>
        </section>
      ) : (
        <section className="rounded-3xl bg-papel p-8 text-center ring-1 ring-rosa/60">
          <p className="font-serif text-2xl text-vinho">A música vem aí ♪</p>
          <p className="text-sm text-suave">Envie o arquivo abaixo e ela fica tocando pelo app todo.</p>
        </section>
      )}

      <details className="rounded-2xl p-4 ring-1 ring-rosa/60">
        <summary className="cursor-pointer text-sm text-suave">{p?.src ? "Trocar o arquivo da música" : "Enviar a música"}</summary>
        <form className="mt-4 space-y-3" onSubmit={(e) => { e.preventDefault(); upload(e.currentTarget); }}>
          <input name="title" defaultValue={title ?? ""} placeholder="Nome da música" className="campo" />
          <input name="file" type="file" accept="audio/*" required className="block w-full text-sm" />
          <button className="botao" disabled={!!busy}>Enviar</button>
          {busy && <p className="text-sm text-suave">{busy}</p>}
        </form>
      </details>
    </div>
  );
}
