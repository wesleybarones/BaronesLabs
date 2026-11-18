"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const PALETAS = [
  ["#f5c96b", "#fff3d6", "#e8b4b8"], // dourado
  ["#e8b4b8", "#ffffff", "#b83a55"], // rosa
  ["#b83a55", "#f5c96b", "#e9d8bf"], // vermelho
  ["#e9d8bf", "#f5c96b", "#ffffff"], // creme
];

type P = { x: number; y: number; px: number; py: number; vx: number; vy: number; vida: number; max: number; cor: string; r: number };
type Foguete = { x: number; y: number; px: number; py: number; vy: number; alvo: number; paleta: string[] };

/** Canvas de tela cheia com fogos de artifício. `soltar(rect)` lança uma rodada a partir de um elemento. */
export function useFireworks() {
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const particulas = useRef<P[]>([]);
  const foguetes = useRef<Foguete[]>([]);
  const raf = useRef<number | null>(null);
  const [noite, setNoite] = useState(false);
  const fimNoite = useRef<ReturnType<typeof setTimeout> | null>(null);

  const quadro = useCallback(() => {
    const c = canvas.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return;
    const dpr = window.devicePixelRatio || 1;
    if (c.width !== innerWidth * dpr || c.height !== innerHeight * dpr) {
      c.width = innerWidth * dpr; c.height = innerHeight * dpr;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    ctx.lineCap = "round";

    // foguetes subindo
    for (const f of foguetes.current) {
      f.px = f.x; f.py = f.y; f.y += f.vy; f.vy *= 0.985;
      ctx.strokeStyle = f.paleta[1]; ctx.lineWidth = 2; ctx.globalAlpha = 0.9;
      ctx.beginPath(); ctx.moveTo(f.px, f.py + 10); ctx.lineTo(f.x, f.y); ctx.stroke();
      if (f.y <= f.alvo) explodir(f);
    }
    foguetes.current = foguetes.current.filter((f) => f.y > f.alvo);

    // faíscas
    for (const p of particulas.current) {
      p.px = p.x; p.py = p.y;
      p.vx *= 0.975; p.vy = p.vy * 0.975 + 0.045;
      p.x += p.vx; p.y += p.vy; p.vida++;
      const a = Math.max(0, 1 - p.vida / p.max);
      ctx.globalAlpha = a;
      ctx.strokeStyle = p.cor; ctx.lineWidth = p.r;
      ctx.beginPath(); ctx.moveTo(p.px, p.py); ctx.lineTo(p.x, p.y); ctx.stroke();
      if (Math.random() < 0.08) { // cintilar
        ctx.fillStyle = "#ffffff"; ctx.globalAlpha = a * 0.8;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 0.9, 0, Math.PI * 2); ctx.fill();
      }
    }
    particulas.current = particulas.current.filter((p) => p.vida < p.max);
    ctx.globalAlpha = 1;

    if (particulas.current.length || foguetes.current.length) raf.current = requestAnimationFrame(quadro);
    else { raf.current = null; ctx.clearRect(0, 0, innerWidth, innerHeight); }
    // o céu volta ao normal pouco depois da última faísca
    if (raf.current === null) {
      if (fimNoite.current) clearTimeout(fimNoite.current);
      fimNoite.current = setTimeout(() => setNoite(false), 200);
    }
  }, []);

  function explodir(f: Foguete) {
    const n = 46 + Math.floor(Math.random() * 20);
    const coracao = Math.random() < 0.35; // às vezes a explosão tem forma de coração
    for (let i = 0; i < n; i++) {
      const t = (Math.PI * 2 * i) / n;
      let vx: number, vy: number;
      if (coracao) {
        vx = (16 * Math.sin(t) ** 3) / 5.5;
        vy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) / 5.5;
      } else {
        const v = 1.6 + Math.random() * 3.2;
        vx = Math.cos(t) * v; vy = Math.sin(t) * v;
      }
      particulas.current.push({
        x: f.x, y: f.y, px: f.x, py: f.y, vx, vy, vida: 0,
        max: 60 + Math.random() * 40, cor: f.paleta[i % f.paleta.length], r: 2 + Math.random() * 1.6,
      });
    }
  }

  const soltar = useCallback((r: DOMRect) => {
    if (fimNoite.current) clearTimeout(fimNoite.current);
    setNoite(true);
    const rodadas = 6;
    for (let k = 0; k < rodadas; k++) {
      setTimeout(() => {
        const x = r.left + r.width * (0.12 + Math.random() * 0.76);
        foguetes.current.push({
          x, y: r.top + r.height * 0.6, px: x, py: r.top, vy: -(7 + Math.random() * 3),
          alvo: Math.max(40, r.top - 60 - Math.random() * 170),
          paleta: PALETAS[(k + Math.floor(Math.random() * 4)) % PALETAS.length],
        });
        if (raf.current === null) raf.current = requestAnimationFrame(quadro);
      }, k * 260 + Math.random() * 120);
    }
  }, [quadro]);

  useEffect(() => () => {
    if (raf.current !== null) cancelAnimationFrame(raf.current);
    if (fimNoite.current) clearTimeout(fimNoite.current);
  }, []);

  const [montado, setMontado] = useState(false);
  useEffect(() => setMontado(true), []);
  const tela = !montado ? null : createPortal(
    <>
      {/* céu de noite: escurece o fundo para os fogos brilharem */}
      <div aria-hidden className={`pointer-events-none fixed inset-0 z-40 bg-[radial-gradient(ellipse_at_50%_20%,rgb(58_14_30/.55),rgb(26_6_14/.78))] transition-opacity duration-700 ${noite ? "opacity-100" : "opacity-0"}`} />
      <canvas ref={canvas} aria-hidden className="pointer-events-none fixed inset-0 z-50 h-full w-full" />
    </>,
    document.body,
  );
  return { tela, soltar };
}
