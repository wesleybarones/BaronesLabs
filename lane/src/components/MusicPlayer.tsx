"use client";
/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PlayButton, SkipButton, fmtTime, usePlayer } from "./Player";
import { Lyrics } from "./Lyrics";
import { supabaseBrowser } from "@/lib/supabase/client";
import { addSong, songUploadUrl } from "@/app/actions";
import { readId3 } from "@/lib/id3";

export function MusicPlayer() {
  const p = usePlayer();
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);

  async function upload(form: HTMLFormElement) {
    const data = new FormData(form);
    const file = data.get("file") as File | null;
    if (!file || !file.size) return setBusy("Escolha o arquivo da música primeiro.");
    const ext = (file.name.split(".").pop() || "").toLowerCase();
    const isAudio = file.type.startsWith("audio/") || ["mp3", "m4a", "aac", "wav", "ogg", "opus", "flac"].includes(ext);
    if (!isAudio) return setBusy(`Esse arquivo não parece ser de áudio (${file.name}).`);
    try {
      setBusy("Enviando a música…");
      const tags = readId3(await file.slice(0, 1024 * 1024).arrayBuffer());
      const { path, token } = await songUploadUrl(ext || "mp3");
      const { error } = await supabaseBrowser().storage.from("lane")
        .uploadToSignedUrl(path, token, file, { contentType: file.type || "audio/mpeg" });
      if (error) throw error;
      await addSong(path, String(data.get("title") ?? "") || tags.title || file.name.replace(/\.[^.]+$/, ""), tags.lyrics ?? null);
      setBusy(null);
      form.reset();
      router.refresh();
    } catch (e) {
      setBusy(`Não consegui enviar: ${(e as Error).message || "erro desconhecido"}. Tenta de novo?`);
    }
  }

  const atual = p?.current;
  return (
    <div className="space-y-8">
      {atual ? (
        <section className="relevo surgir space-y-6 rounded-[2rem] bg-papel px-6 py-10 text-center ring-1 ring-rosa/60">
          <div className="mx-auto w-fit [perspective:700px]">
            <div className="[transform:rotateX(28deg)] [transform-style:preserve-3d]">
              <div className={`vinil relative grid h-52 w-52 place-items-center rounded-full ${p.playing ? "animate-[spin_6s_linear_infinite]" : ""}`}>
                {atual.cover
                  ? <img src={atual.cover} alt="" className="relative z-10 h-[38%] w-[38%] rounded-full object-cover ring-4 ring-[#1f070f]" />
                  : <div className="relative z-10 h-[34%] w-[34%] rounded-full bg-rosa" />}
                <div className="absolute z-20 h-3 w-3 rounded-full bg-creme shadow" />
              </div>
            </div>
          </div>
          <div>
            <p className="font-serif text-3xl text-vinho">{atual.title}</p>
            <p className="text-sm text-suave">composta por Wesley, para a Lane</p>
          </div>
          <input type="range" min={0} max={p.duration || 0} step={0.1} value={p.time} onChange={(e) => p.seek(Number(e.target.value))}
            className="w-full accent-vinho" aria-label="Posição da música" />
          <div className="flex justify-between text-xs tabular-nums text-suave"><span>{fmtTime(p.time)}</span><span>{fmtTime(p.duration)}</span></div>
          <div className="flex items-center justify-center gap-6"><SkipButton dir="prev" /><PlayButton big /><SkipButton dir="next" /></div>
        </section>
      ) : (
        <section className="rounded-3xl bg-papel p-8 text-center ring-1 ring-rosa/60">
          <p className="font-serif text-2xl text-vinho">A música vem aí ♪</p>
          <p className="text-sm text-suave">Envie o arquivo abaixo e ela fica tocando pelo app todo.</p>
        </section>
      )}

      {p && p.tracks.length > 1 && (
        <section className="space-y-2">
          <h2 className="font-serif text-2xl text-vinho">Nossas músicas</h2>
          <ul className="space-y-2">
            {p.tracks.map((t, i) => {
              const essa = i === p.idx;
              return (
                <li key={t.id}>
                  <button onClick={() => p.playTrack(i)}
                    className={`relevo flex w-full items-center gap-3 rounded-2xl p-2 pr-4 text-left ring-1 transition active:scale-[.99] ${essa ? "bg-rosa-claro ring-vinho/30" : "bg-papel ring-rosa/60"}`}>
                    {t.cover ? <img src={t.cover} alt="" className="h-14 w-14 shrink-0 rounded-xl object-cover shadow" />
                      : <div className="h-14 w-14 shrink-0 rounded-xl bg-rosa" />}
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-serif text-xl text-vinho">{t.title}</p>
                      <p className="text-xs text-suave">{essa && p.playing ? "tocando agora" : "Wesley Barones"}</p>
                    </div>
                    {essa && p.playing
                      ? <span className="flex h-5 items-end gap-0.5" aria-hidden>{[0, 1, 2].map((k) => <span key={k} className="barra w-1 rounded-full bg-vinho" style={{ animationDelay: `${k * 0.15}s` }} />)}</span>
                      : <svg viewBox="0 0 24 24" className="h-5 w-5 text-vinho/60" fill="currentColor"><path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5z"/></svg>}
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {atual?.lyrics && <Lyrics key={atual.id} text={atual.lyrics} />}

      <details className="rounded-2xl p-4 ring-1 ring-rosa/60">
        <summary className="cursor-pointer text-sm text-suave">Adicionar uma música</summary>
        <form className="mt-4 space-y-3" onSubmit={(e) => { e.preventDefault(); upload(e.currentTarget); }}>
          <input name="title" placeholder="Nome da música" className="campo" />
          <input name="file" type="file" accept="audio/*,.mp3,.m4a,.wav,.aac,.ogg,.opus,.flac" required className="block w-full text-sm"
            onChange={async (e) => {
              const f = e.currentTarget.files?.[0];
              const titleInput = e.currentTarget.form?.elements.namedItem("title") as HTMLInputElement | null;
              if (!f || !titleInput) return;
              const t = readId3(await f.slice(0, 1024 * 1024).arrayBuffer());
              if (t.title && !titleInput.value) titleInput.value = t.title;
            }} />
          <p className="text-xs text-suave">No iPhone, toque em “Escolher arquivo” → <b>Arquivos</b> e ache a música. Se o arquivo tiver a letra gravada, ela aparece embaixo do player.</p>
          <button className="botao" disabled={!!busy}>Enviar</button>
          {busy && <p className="text-sm text-suave">{busy}</p>}
        </form>
      </details>
    </div>
  );
}
