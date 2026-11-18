"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

function QuadroEstatico({ texto }: { texto: string }) {
  return (
    <div className="relative z-[45] mx-auto block w-full max-w-sm overflow-hidden rounded-3xl bg-gradient-to-b from-[#8d2a4b] to-vinho-escuro px-6 py-4 text-center text-creme shadow-[0_6px_0_#3f0c1d,0_18px_30px_-8px_rgb(63_12_29/.5)]">
      <span className="relative block text-sm uppercase tracking-[.25em] text-rosa">hoje é dia</span>
      <span className="relative block font-serif text-3xl [font-variant-numeric:lining-nums]">{texto}</span>
      <span className="relative mt-1 block text-[11px] text-rosa/80">toque para comemorar ✨</span>
    </div>
  );
}

type Props = { texto: string };
const Interativo = dynamic<Props>(() => import("./AnniversaryBanner").then((m) => m.AnniversaryBanner), { ssr: false });

/** Quadro de aniversário: aparece na hora e vira interativo (fogos) quando a animação carrega. */
export function AnniversaryBannerLazy({ texto }: Props) {
  // o dynamic() não repassa props ao "loading": mostramos o estático até o interativo estar baixado
  const [pronto, setPronto] = useState(false);
  useEffect(() => { import("./AnniversaryBanner").then(() => setPronto(true)); }, []);
  return pronto ? <Interativo texto={texto} /> : <QuadroEstatico texto={texto} />;
}
