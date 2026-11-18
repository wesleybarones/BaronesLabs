"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

/** Portão da abertura já desenhado na primeira pintura (antes de qualquer JavaScript). */
function PortaoEstatico() {
  return (
    <div data-noswipe aria-hidden
      className="abertura-fundo fixed inset-0 z-[70] flex flex-col items-center justify-center bg-[radial-gradient(ellipse_at_50%_40%,#4a1022_0%,#22060f_55%,#0d0206_100%)] text-creme">
      <span className="ponto-pulsando mb-[4.5rem] h-3 w-3 rounded-full bg-white shadow-[0_0_24px_8px_rgb(245_201_107/.8)]" />
      <span className="text-sm uppercase tracking-[.35em] text-creme/90">toque para abrir <span className="text-rosa">♥</span></span>
      <span className="mt-2 text-[11px] text-creme/50">com som</span>
    </div>
  );
}

const Intro = dynamic(() => import("./Intro").then((m) => m.Intro), { ssr: false, loading: () => <PortaoEstatico /> });

/** Mostra a abertura só na primeira vez do dia; nas outras, o app abre direto (sem baixar a animação). */
export function IntroLazy() {
  const [modo, setModo] = useState<"decidindo" | "mostrar" | "pular">("decidindo");
  useEffect(() => {
    setModo(document.documentElement.hasAttribute("data-sem-abertura") ? "pular" : "mostrar");
  }, []);
  if (modo === "pular") return null;
  if (modo === "decidindo") return <PortaoEstatico />;
  return <Intro />;
}
