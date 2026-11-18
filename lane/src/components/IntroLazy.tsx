"use client";
import dynamic from "next/dynamic";

/** Fundo da abertura, já na primeira pintura (cobre o app enquanto a animação carrega). */
function FundoAbertura() {
  return (
    <div data-noswipe aria-hidden
      className="fixed inset-0 z-[70] bg-[radial-gradient(ellipse_at_50%_40%,#4a1022_0%,#22060f_55%,#0d0206_100%)]" />
  );
}

export const IntroLazy = dynamic(() => import("./Intro").then((m) => m.Intro), {
  ssr: false,
  loading: () => <FundoAbertura />,
});
