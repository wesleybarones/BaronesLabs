"use client";
import dynamic from "next/dynamic";

/** Mesma aparência do título interativo, sem JavaScript: aparece na primeira pintura. */
function TituloEstatico({ className }: { className: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="relative px-4">
        <span className={`texto-3d relative inline-flex font-serif font-semibold ${className}`}>
          {"Lane".split("").map((l, i) => <span key={i} className="inline-block">{l}</span>)}
        </span>
      </span>
      <div className="h-8"><p className="text-xs text-suave/70">toque no nome ♥</p></div>
    </div>
  );
}

type Props = { className?: string };
const cache = new Map<string, React.ComponentType<Props>>();

/** Um componente "preguiçoso" por tamanho de título (criado uma vez só, fora da renderização). */
function versao(className: string) {
  let C = cache.get(className);
  if (!C) {
    C = dynamic(() => import("./LaneTitle").then((m) => m.LaneTitle), {
      ssr: false,
      loading: () => <TituloEstatico className={className} />,
    });
    cache.set(className, C);
  }
  return C;
}
const Grande = versao("text-8xl");
const Medio = versao("text-7xl");

/** Título "Lane": o interativo (Motion) carrega depois da primeira pintura. */
export function LaneTitleLazy({ className = "text-7xl" }: Props) {
  const C = className === "text-8xl" ? Grande : className === "text-7xl" ? Medio : versao(className);
  return <C className={className} />;
}
