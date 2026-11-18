"use client";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

type Ctx = {
  src: string | null; title: string; playing: boolean; time: number; duration: number;
  toggle: () => void; seek: (t: number) => void; stop: () => void; fadeIn: () => void;
};
const PlayerCtx = createContext<Ctx | null>(null);
export const usePlayer = () => useContext(PlayerCtx);

export function PlayerProvider({ src, title, children }: { src: string | null; title: string; children: React.ReactNode }) {
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const a = audio.current;
    if (!a) return;
    const on = () => setPlaying(!a.paused);
    const t = () => setTime(a.currentTime);
    const d = () => setDuration(a.duration || 0);
    a.addEventListener("play", on); a.addEventListener("pause", on);
    a.addEventListener("timeupdate", t); a.addEventListener("loadedmetadata", d);
    return () => {
      a.removeEventListener("play", on); a.removeEventListener("pause", on);
      a.removeEventListener("timeupdate", t); a.removeEventListener("loadedmetadata", d);
    };
  }, [src]);

  useEffect(() => {
    if (!("mediaSession" in navigator) || !src) return;
    navigator.mediaSession.metadata = new MediaMetadata({ title, artist: "Wesley para Lane", album: "Lane" });
  }, [src, title]);

  const value: Ctx = {
    src, title, playing, time, duration,
    toggle: () => { const a = audio.current; if (a) (a.paused ? a.play() : a.pause()); },
    seek: (s) => { if (audio.current) audio.current.currentTime = s; },
    stop: () => { const a = audio.current; if (a) { a.pause(); a.currentTime = 0; setTime(0); } },
    // começa a tocar subindo o volume aos poucos (no iPhone o volume é fixo; ela só começa a tocar)
    fadeIn: () => {
      const a = audio.current;
      if (!a || !a.paused) return;
      a.volume = 0;
      a.play().catch(() => {});
      let v = 0;
      const id = setInterval(() => { v = Math.min(1, v + 0.05); a.volume = v; if (v >= 1) clearInterval(id); }, 100);
    },
  };

  return (
    <PlayerCtx.Provider value={value}>
      {src && <audio ref={audio} src={src} preload="metadata" loop />}
      {children}
    </PlayerCtx.Provider>
  );
}

export const fmtTime = (s: number) =>
  Number.isFinite(s) ? `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}` : "0:00";

export function PlayButton({ big = false }: { big?: boolean }) {
  const p = usePlayer();
  if (!p?.src) return null;
  const size = big ? "h-20 w-20" : "h-10 w-10";
  return (
    <button onClick={p.toggle} aria-label={p.playing ? "Pausar" : "Tocar"}
      className={`${size} grid shrink-0 place-items-center rounded-full bg-gradient-to-b from-[#8d2a4b] to-vinho-escuro text-creme shadow-[0_3px_0_#3f0c1d,0_8px_16px_-4px_rgb(63_12_29/.5)] transition active:translate-y-[2px] active:shadow-[0_1px_0_#3f0c1d]`}>
      {p.playing ? (
        <svg viewBox="0 0 24 24" className={big ? "h-8 w-8" : "h-4 w-4"} fill="currentColor"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>
      ) : (
        <svg viewBox="0 0 24 24" className={big ? "ml-1 h-8 w-8" : "ml-0.5 h-4 w-4"} fill="currentColor"><path d="M7 4.5v15a1 1 0 0 0 1.5.86l12.5-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5z"/></svg>
      )}
    </button>
  );
}

export function MiniPlayer() {
  const p = usePlayer();
  const path = usePathname();
  // só aparece depois que a música começou, e não na própria tela de música
  if (!p?.src || path.startsWith("/musica") || (!p.playing && p.time === 0)) return null;
  const pct = p.duration ? (p.time / p.duration) * 100 : 0;
  return (
    <div className="relevo fixed inset-x-3 bottom-[calc(4.5rem+env(safe-area-inset-bottom))] z-30 mx-auto max-w-md overflow-hidden rounded-2xl bg-papel/95 ring-1 ring-rosa backdrop-blur">
      <div className="flex items-center gap-3 px-3 py-2">
        <PlayButton />
        <div className="min-w-0 flex-1">
          <p className="truncate font-serif text-lg leading-tight text-vinho">{p.title}</p>
          <p className="text-xs text-suave">Wesley para Lane</p>
        </div>
        <span className="text-xs tabular-nums text-suave">{fmtTime(p.time)}</span>
        <button onClick={p.stop} aria-label="Encerrar a música"
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-suave transition hover:bg-rosa-claro hover:text-vinho active:scale-90">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18" /></svg>
        </button>
      </div>
      <div className="h-0.5 bg-rosa-claro"><div className="h-full bg-vinho transition-[width]" style={{ width: `${pct}%` }} /></div>
    </div>
  );
}
