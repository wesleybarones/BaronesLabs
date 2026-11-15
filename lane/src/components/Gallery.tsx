"use client";
/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { deletePhoto } from "@/app/actions";
import { Tilt } from "./Tilt";

type Item = { id: string; thumb?: string; full?: string; taken_at: string };
const dateFmt = new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "long", year: "numeric", timeZone: "America/Sao_Paulo" });

export function Gallery({ groups, openId }: { groups: { label: string; items: Item[] }[]; openId?: string }) {
  const flat = useMemo(() => groups.flatMap((g) => g.items), [groups]);
  const [open, setOpen] = useState<number | null>(() => {
    const i = openId ? flat.findIndex((p) => p.id === openId) : -1;
    return i >= 0 ? i : null;
  });
  const [pending, start] = useTransition();
  const touchX = useRef<number | null>(null);

  const go = useCallback((d: number) => setOpen((i) => (i === null ? i : Math.min(flat.length - 1, Math.max(0, i + d)))), [flat.length]);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open, go]);

  const cur = open !== null ? flat[open] : null;

  return (
    <>
      <div className="space-y-8">
        {groups.map((g) => (
          <section key={g.label} className="space-y-2">
            <h2 className="font-serif text-xl text-vinho first-letter:uppercase">{g.label}</h2>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {g.items.map((p) => (
                <Tilt key={p.id} className="rounded-lg" max={14}>
                  <button onClick={() => setOpen(flat.indexOf(p))} className="relevo block aspect-square w-full overflow-hidden rounded-lg bg-rosa-claro">
                    {p.thumb && <img src={p.thumb} alt="" loading="lazy" className="h-full w-full object-cover" />}
                  </button>
                </Tilt>
              ))}
            </div>
          </section>
        ))}
      </div>

      {cur && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black/95 text-creme"
          onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
            touchX.current = null;
          }}>
          <div className="flex items-center justify-between p-4 pt-[calc(1rem+env(safe-area-inset-top))]">
            <button onClick={() => setOpen(null)} className="text-2xl" aria-label="Fechar">✕</button>
            <p className="font-serif text-lg">{dateFmt.format(new Date(cur.taken_at))}</p>
            <button disabled={pending} className="text-sm text-rosa" onClick={() => {
              if (!confirm("Tirar esta foto do Lane? (no Google Fotos ela continua)")) return;
              const id = cur.id;
              start(async () => { await deletePhoto(id); setOpen(null); });
            }}>Remover</button>
          </div>
          <div className="relative flex min-h-0 flex-1 items-center justify-center">
            <img key={cur.id} src={cur.full ?? cur.thumb} alt="" className="surgir max-h-full max-w-full object-contain" />
            {open! > 0 && <button onClick={() => go(-1)} className="absolute left-2 hidden rounded-full bg-white/10 p-3 sm:block" aria-label="Anterior">‹</button>}
            {open! < flat.length - 1 && <button onClick={() => go(1)} className="absolute right-2 hidden rounded-full bg-white/10 p-3 sm:block" aria-label="Próxima">›</button>}
          </div>
          <p className="p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] text-center text-xs text-white/50">{open! + 1} de {flat.length}</p>
        </div>
      )}
    </>
  );
}
