"use client";
/* eslint-disable @next/next/no-img-element */
import { PlayButton, usePlayer } from "./Player";
import { Tilt } from "./Tilt";

/** Cartão da tela inicial: a primeira música da lista ("15 de Novembro"). */
export function SongCard() {
  const p = usePlayer();
  const primeira = p?.tracks[0];
  if (!primeira) return null;
  return (
    <Tilt className="surgir rounded-3xl">
      <section className="relevo flex items-center gap-4 rounded-3xl bg-papel p-4 ring-1 ring-rosa/60">
        {primeira.cover && <img src={primeira.cover} alt="" className="h-14 w-14 shrink-0 rounded-xl object-cover shadow" />}
        <div className="min-w-0 flex-1">
          <p className="text-xs uppercase tracking-[.2em] text-suave">a música que eu fiz pra você</p>
          <p className="truncate font-serif text-xl text-vinho">{primeira.title}</p>
        </div>
        <PlayButton track={0} />
      </section>
    </Tilt>
  );
}
