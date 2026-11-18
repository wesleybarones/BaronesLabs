"use client";
import { useEffect, useState } from "react";
import { elapsed, wallClock, type Parts } from "@/lib/elapsed";
import { NAMORO, CASAMENTO, anniversaryToday } from "@/lib/couple";
import { AnniversaryBannerLazy as AnniversaryBanner } from "./AnniversaryBannerLazy";

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
        <AnniversaryBanner key={f.kind}
          texto={`${plural(f.years, "ano", "anos")} de ${f.kind === "casamento" ? "casados 💍" : "namoro ♥"}`} />
      ))}

      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[.3em] text-suave">casados há</p>
        <Calendar e={casados} big />
        <Digits e={casados} big />
        <p className="text-xs text-suave">desde 15 de novembro de 2017, às 15h</p>
      </div>

      <div className="mx-auto h-px w-16 bg-rosa" />

      <div className="space-y-1">
        <p className="text-xs uppercase tracking-[.3em] text-suave">juntos há</p>
        <Calendar e={juntos} />
        <Digits e={juntos} />
        <p className="text-xs text-suave">desde 30 de dezembro de 2014, à 1h da manhã</p>
      </div>
    </section>
  );
}
