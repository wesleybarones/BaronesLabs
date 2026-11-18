"use client";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export type Track = { id: string; title: string; src: string; cover: string | null; lyrics: string | null };

type Ctx = {
  tracks: Track[]; idx: number; current: Track | null;
  src: string | null; title: string; playing: boolean; time: number; duration: number;
  toggle: () => void; seek: (t: number) => void; stop: () => void; fadeIn: (inicio?: number) => void; prime: () => void;
  playTrack: (i: number) => void; next: () => void; prev: () => void;
};
const PlayerCtx = createContext<Ctx | null>(null);
export const usePlayer = () => useContext(PlayerCtx);

export function PlayerProvider({ tracks, children }: { tracks: Track[]; children: React.ReactNode }) {
  const audio = useRef<HTMLAudioElement>(null);
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const tocarAoTrocar = useRef(false);
  const current = tracks[idx] ?? null;

  useEffect(() => {
    const a = audio.current;
    if (!a) return;
    const on = () => setPlaying(!a.paused);
    const t = () => setTime(a.currentTime);
    const d = () => setDuration(a.duration || 0);
    // só avança se a música realmente chegou ao fim (o Safari às vezes dispara um "fim" falso ao pular trechos)
    const fim = () => {
      const fimDeVerdade = Number.isFinite(a.duration) && a.duration > 10 && a.currentTime >= a.duration - 1.5;
      if (!fimDeVerdade) return;
      tocarAoTrocar.current = true;
      setIdx((i) => (i + 1) % Math.max(1, tracks.length));
    };
    a.addEventListener("play", on); a.addEventListener("pause", on);
    a.addEventListener("timeupdate", t); a.addEventListener("loadedmetadata", d); a.addEventListener("ended", fim);
    return () => {
      a.removeEventListener("play", on); a.removeEventListener("pause", on);
      a.removeEventListener("timeupdate", t); a.removeEventListener("loadedmetadata", d); a.removeEventListener("ended", fim);
    };
  }, [tracks.length]);

  // ao trocar de faixa: carrega e, se era para tocar, toca
  useEffect(() => {
    const a = audio.current;
    if (!a || !current) return;
    setTime(0); setDuration(0);
    if (tocarAoTrocar.current) { tocarAoTrocar.current = false; a.play().catch(() => {}); }
  }, [current]);

  useEffect(() => {
    if (!("mediaSession" in navigator) || !current) return;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: current.title, artist: "Wesley para Lane", album: "Lane",
      artwork: current.cover ? [{ src: current.cover, sizes: "800x800", type: "image/jpeg" }] : [],
    });
    navigator.mediaSession.setActionHandler("nexttrack", () => { tocarAoTrocar.current = true; setIdx((i) => (i + 1) % tracks.length); });
    navigator.mediaSession.setActionHandler("previoustrack", () => { tocarAoTrocar.current = true; setIdx((i) => (i - 1 + tracks.length) % tracks.length); });
  }, [current, tracks.length]);

  const playTrack = (i: number) => {
    const a = audio.current;
    if (i === idx) { if (a?.paused) a.play().catch(() => {}); return; }
    tocarAoTrocar.current = true;
    setIdx(i);
  };

  const value: Ctx = {
    tracks, idx, current, src: current?.src ?? null, title: current?.title ?? "", playing, time, duration,
    toggle: () => { const a = audio.current; if (a) (a.paused ? a.play().catch(() => {}) : a.pause()); },
    seek: (s) => { if (audio.current) audio.current.currentTime = s; },
    stop: () => { const a = audio.current; if (a) { a.pause(); a.currentTime = 0; setTime(0); } },
    playTrack,
    next: () => playTrack((idx + 1) % Math.max(1, tracks.length)),
    prev: () => {
      const a = audio.current;
      if (a && a.currentTime > 4) { a.currentTime = 0; return; } // como nos players: volta ao começo antes
      playTrack((idx - 1 + tracks.length) % Math.max(1, tracks.length));
    },
    // destrava o áudio dentro de um toque: começa a tocar MUDO, para poder soltar o som depois sem novo toque
    prime: () => {
      const a = audio.current;
      if (!a || !a.paused) return;
      a.muted = true;
      a.play().catch(() => { a.muted = false; });
    },
    // a música entra subindo o volume aos poucos, a partir de `inicio` segundos da faixa
    // (no iPhone o volume é fixo; ela só começa a tocar)
    fadeIn: (inicio = 0) => {
      const a = audio.current;
      if (!a) return;
      if (a.muted) { a.currentTime = inicio; a.muted = false; }
      else if (a.paused) { a.currentTime = inicio; a.play().catch(() => {}); }
      else return;
      a.volume = 0;
      let v = 0;
      const id = setInterval(() => { v = Math.min(1, v + 0.05); a.volume = v; if (v >= 1) clearInterval(id); }, 100);
    },
  };

  return (
    <PlayerCtx.Provider value={value}>
      {current && <audio ref={audio} src={current.src} preload="metadata" />}
      {children}
    </PlayerCtx.Provider>
  );
}

export const fmtTime = (s: number) =>
  Number.isFinite(s) ? `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}` : "0:00";

const Icone = {
  play: (c: string) => <svg viewBox="0 0 24 24" className={c} fill="currentColor"><path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5z"/></svg>,
  pause: (c: string) => <svg viewBox="0 0 24 24" className={c} fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>,
};

/** Botão tocar/pausar. Com `track`, toca aquela faixa específica. */
export function PlayButton({ big = false, track }: { big?: boolean; track?: number }) {
  const p = usePlayer();
  if (!p?.current) return null;
  const essa = track === undefined || track === p.idx;
  const tocando = p.playing && essa;
  const size = big ? "h-20 w-20" : "h-10 w-10";
  return (
    <button onClick={() => (track === undefined || essa ? p.toggle() : p.playTrack(track))} aria-label={tocando ? "Pausar" : "Tocar"}
      className={`${size} grid shrink-0 place-items-center rounded-full bg-gradient-to-b from-[#8d2a4b] to-vinho-escuro text-creme shadow-[0_3px_0_#3f0c1d,0_8px_16px_-4px_rgb(63_12_29/.5)] transition active:translate-y-[2px] active:shadow-[0_1px_0_#3f0c1d]`}>
      {tocando ? Icone.pause(big ? "h-8 w-8" : "h-4 w-4") : Icone.play(big ? "ml-1 h-8 w-8" : "ml-0.5 h-4 w-4")}
    </button>
  );
}

export function SkipButton({ dir }: { dir: "prev" | "next" }) {
  const p = usePlayer();
  if (!p || p.tracks.length < 2) return null;
  return (
    <button onClick={dir === "next" ? p.next : p.prev} aria-label={dir === "next" ? "Próxima música" : "Música anterior"}
      className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-vinho transition hover:bg-rosa-claro active:scale-90">
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" style={dir === "prev" ? { transform: "scaleX(-1)" } : undefined}>
        <path d="M5 5.5v13a1 1 0 0 0 1.5.86L16 13.6V18a1 1 0 0 0 2 0V6a1 1 0 0 0-2 0v4.4L6.5 4.64A1 1 0 0 0 5 5.5z"/>
      </svg>
    </button>
  );
}

export function MiniPlayer() {
  const p = usePlayer();
  const path = usePathname();
  // só aparece depois que a música começou, e não na própria tela de música
  if (!p?.current || path.startsWith("/musica") || (!p.playing && p.time === 0)) return null;
  const pct = p.duration ? (p.time / p.duration) * 100 : 0;
  return (
    <div className="relevo fixed inset-x-3 bottom-[calc(4.5rem+env(safe-area-inset-bottom))] z-30 mx-auto max-w-md overflow-hidden rounded-2xl bg-papel/95 ring-1 ring-rosa backdrop-blur">
      <div className="flex items-center gap-2 px-3 py-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {p.current.cover && <img src={p.current.cover} alt="" className="h-10 w-10 shrink-0 rounded-lg object-cover shadow" />}
        <div className="min-w-0 flex-1">
          <p className="truncate font-serif text-lg leading-tight text-vinho">{p.title}</p>
          <p className="text-xs tabular-nums text-suave">{fmtTime(p.time)} · Wesley para Lane</p>
        </div>
        <PlayButton />
        <SkipButton dir="next" />
        <button onClick={p.stop} aria-label="Encerrar a música"
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-suave transition hover:bg-rosa-claro hover:text-vinho active:scale-90">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18" /></svg>
        </button>
      </div>
      <div className="h-0.5 bg-rosa-claro"><div className="h-full bg-vinho transition-[width]" style={{ width: `${pct}%` }} /></div>
    </div>
  );
}
