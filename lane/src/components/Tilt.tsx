"use client";
import { useRef } from "react";

/** Inclina o conteúdo em 3D seguindo o dedo/mouse, com um brilho de luz. */
export function Tilt({ children, className = "", max = 8 }: { children: React.ReactNode; className?: string; max?: number }) {
  const el = useRef<HTMLDivElement>(null);
  const move = (e: React.PointerEvent) => {
    const d = el.current;
    if (!d) return;
    const r = d.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    d.classList.add("ativo");
    d.style.transform = `perspective(800px) rotateX(${(0.5 - y) * max * 2}deg) rotateY(${(x - 0.5) * max * 2}deg)`;
    d.style.setProperty("--bx", `${x * 100}%`);
    d.style.setProperty("--by", `${y * 100}%`);
  };
  const leave = () => {
    const d = el.current;
    if (!d) return;
    d.classList.remove("ativo");
    d.style.transform = "";
  };
  return (
    <div ref={el} onPointerMove={move} onPointerLeave={leave} onPointerUp={leave} onPointerCancel={leave}
      className={`tilt relative ${className}`}>
      {children}
      <span className="tilt-brilho" aria-hidden />
    </div>
  );
}
