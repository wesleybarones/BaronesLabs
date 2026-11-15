"use client";
import { useEffect, useState } from "react";
import { elapsed, wallClock, type Parts } from "@/lib/elapsed";
import { NAMORO, CASAMENTO, anniversaryToday } from "@/lib/couple";

const plural = (n: number, um: string, varios: string) => `${n} ${n === 1 ? um : varios}`;
const two = (n: number) => String(n).padStart(2, "0");

function useNow(): Parts | null {
  const [now, setNow] = useState<Parts | null>(null);
  useEffect(() => {
    const tick = () => setNow(wallClock(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

function Placas({ v }: { v: string }) {
  return (
    <span className="placas inline-flex gap-[.08em]">
      {v.split("").map((c, i) => (
        <span key={`${i}-${c}`} className="placa placa-virando">{c}</span>
      ))}
    </span>
  );
}

function Digits({ e, big }: { e: Parts | null; big?: boolean }) {
  const cls = big ? "text-5xl sm:text-6xl" : "text-2xl";
  return (
    <div className={`flex items-center justify-center gap-1.5 font-serif font-semibold [font-variant-numeric:lining-nums_tabular-nums] ${cls}`} aria-live="off">
      <Placas v={e ? two(e.hour) : "--"} /><span className="text-vinho/40">:</span>
      <Placas v={e ? two(e.minute) : "--"} /><span className="text-vinho/40">:</span>
      <Placas v={e ? two(e.second) : "--"} />
    </div>
  );
}

function Calendar({ e, big }: { e: Parts | null; big?: boolean }) {
  if (!e) return <p className="h-8" />;
  const parts = [plural(e.year, "ano", "anos"), plural(e.month, "mês", "meses"), plural(e.day, "dia", "dias")];
  return (
    <p className={`font-serif [font-variant-numeric:lining-nums] ${big ? "text-2xl sm:text-3xl" : "text-lg"} text-tinta`}>
      {parts.join(" · ")}
    </p>
  );
}

export function Clock() {
  const now = useNow();
  const juntos = now && elapsed(NAMORO, now);
  const casados = now && elapsed(CASAMENTO, now);
  const festas = now ? anniversaryToday(now) : [];

  return (
    <section className="space-y-8 text-center">
      {festas.map((f) => (
        <div key={f.kind} className="surgir mx-auto max-w-sm rounded-3xl bg-gradient-to-b from-[#8d2a4b] to-vinho-escuro px-6 py-4 text-creme shadow-[0_6px_0_#3f0c1d,0_18px_30px_-8px_rgb(63_12_29/.5)]">
          <p className="text-sm uppercase tracking-[.25em] text-rosa">hoje é dia</p>
          <p className="font-serif text-3xl [font-variant-numeric:lining-nums]">
            {plural(f.years, "ano", "anos")} de {f.kind === "casamento" ? "casados 💍" : "namoro ♥"}
          </p>
        </div>
      ))}

      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[.3em] text-suave">juntos há</p>
        <Calendar e={juntos} big />
        <Digits e={juntos} big />
        <p className="text-xs text-suave">desde 30 de dezembro de 2014</p>
      </div>

      <div className="mx-auto h-px w-16 bg-rosa" />

      <div className="space-y-1">
        <p className="text-xs uppercase tracking-[.3em] text-suave">casados há</p>
        <Calendar e={casados} />
        <Digits e={casados} />
        <p className="text-xs text-suave">desde 15 de novembro de 2017</p>
      </div>
    </section>
  );
}
