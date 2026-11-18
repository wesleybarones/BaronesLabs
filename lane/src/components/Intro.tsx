"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, animate, motion, useAnimationControls, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { usePlayer } from "./Player";
import { diasJuntos } from "@/lib/days";
import { NAMORO } from "@/lib/couple";
import { wallClock } from "@/lib/elapsed";
import { Sons } from "@/lib/sons";

const CORACAO = "M12 21s-7.5-4.6-9.2-9.3C1.6 8.4 3.7 5 7 5c2 0 3.4 1.1 5 3 1.6-1.9 3-3 5-3 3.3 0 5.4 3.4 4.2 6.7C19.5 16.4 12 21 12 21z";
const LETRAS = [
  { l: "L", x: -160, y: -120, r: -70 },
  { l: "a", x: 140, y: -180, r: 80 },
  { l: "n", x: -120, y: 170, r: 60 },
  { l: "e", x: 170, y: 140, r: -90 },
];
const T = { cometa: 0.9, cheio: 2.2, batida: 2.95, nome: 3.2, dias: 4.25, auto: 6.7 }; // segundos depois do toque
const INICIO_MUSICA = 2; // a música começa no segundo 2 da faixa (pula o silêncio inicial)

type Faisca = { x: number; y: number; z: number; vx: number; vy: number; vida: number; max: number; cor: string; r: number };

/** Canvas: poeira dourada em profundidade + explosão de faíscas na batida do coração. */
function useCeu(canvas: React.RefObject<HTMLCanvasElement | null>, ativo: boolean) {
  const explosao = useRef<(x: number, y: number) => void>(() => {});
  useEffect(() => {
    const c = canvas.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx || !ativo) return;
    const dpr = Math.min(1.5, window.devicePixelRatio || 1);
    const W = innerWidth, H = innerHeight;
    c.width = W * dpr; c.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const CORES = ["#f5c96b", "#f2c6ca", "#e9d8bf", "#ffffff"];
    const poeira = Array.from({ length: 90 }, () => ({
      x: (Math.random() - 0.5) * W * 1.6, y: (Math.random() - 0.5) * H * 1.6, z: Math.random() * 900 + 100,
      cor: CORES[Math.floor(Math.random() * CORES.length)],
    }));
    const faiscas: Faisca[] = [];
    explosao.current = (x, y) => {
      for (let i = 0; i < 90; i++) {
        const a = Math.random() * Math.PI * 2, v = 2 + Math.random() * 7;
        faiscas.push({ x, y, z: 0, vx: Math.cos(a) * v, vy: Math.sin(a) * v, vida: 0, max: 50 + Math.random() * 50,
          cor: CORES[i % CORES.length], r: 1 + Math.random() * 2.2 });
      }
    };
    let raf = 0;
    const quadro = () => {
      ctx.clearRect(0, 0, W, H);
      for (const p of poeira) {
        p.z -= 1.6; if (p.z < 20) { p.z = 1000; p.x = (Math.random() - 0.5) * W * 1.6; p.y = (Math.random() - 0.5) * H * 1.6; }
        const k = 320 / p.z, sx = W / 2 + p.x * k, sy = H * 0.42 + p.y * k;
        ctx.globalAlpha = Math.min(0.8, (1000 - p.z) / 900) * 0.7;
        ctx.fillStyle = p.cor; ctx.beginPath(); ctx.arc(sx, sy, Math.max(0.4, 1.6 * k), 0, Math.PI * 2); ctx.fill();
      }
      for (let i = faiscas.length - 1; i >= 0; i--) {
        const f = faiscas[i];
        const px = f.x, py = f.y;
        f.vx *= 0.955; f.vy = f.vy * 0.955 + 0.04; f.x += f.vx; f.y += f.vy; f.vida++;
        ctx.globalAlpha = Math.max(0, 1 - f.vida / f.max);
        ctx.strokeStyle = f.cor; ctx.lineWidth = f.r; ctx.lineCap = "round";
        ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(f.x, f.y); ctx.stroke();
        if (f.vida >= f.max) faiscas.splice(i, 1);
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(quadro);
    };
    raf = requestAnimationFrame(quadro);
    return () => cancelAnimationFrame(raf);
  }, [canvas, ativo]);
  return explosao;
}

/** Abertura cinematográfica: poeira dourada, cometa que desenha o coração, coração que se enche e bate,
 *  nome em dourado, contador de dias e mergulho dentro do coração ao tocar (com a música). */
export function Intro() {
  const reduzir = useReducedMotion();
  const player = usePlayer();
  const [fase, setFase] = useState<"portao" | "cena" | "mergulho" | "fim">("portao");
  const sons = useRef<Sons | null>(null);
  const [dias, setDias] = useState(0);
  const [tremer, setTremer] = useState(0);
  const tela = useAnimationControls();
  const batida = useAnimationControls();
  const canvas = useRef<HTMLCanvasElement>(null);
  const coracao = useRef<HTMLDivElement>(null);
  const caminho = useRef<SVGPathElement>(null);
  const liquido = useRef<SVGRectElement>(null);
  const progresso = useMotionValue(0);
  const cheio = useMotionValue(24); // y do retângulo que "enche" o coração (24 = vazio, 2 = cheio)
  const [cabeca, setCabeca] = useState({ x: 12, y: 8, v: 0 });
  const explosao = useCeu(canvas, fase !== "fim" && !reduzir);
  const totalDias = useRef(diasJuntos(NAMORO, wallClock(new Date())));

  // trava a rolagem enquanto a abertura está na tela
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // linha do tempo (começa no toque de abertura)
  const comecou = fase !== "portao";
  useEffect(() => {
    if (!comecou) return;
    if (reduzir) {
      setDias(totalDias.current);
      const t = setTimeout(() => setFase((f) => (f === "cena" ? "mergulho" : f)), 1800);
      return () => clearTimeout(t);
    }
    const tl: Array<ReturnType<typeof setTimeout>> = [];
    const em = (s: number, f: () => void) => tl.push(setTimeout(f, s * 1000));
    const ctrl: Array<{ stop: () => void }> = [];
    em(T.cometa, () => ctrl.push(animate(progresso, 1, { duration: 1.25, ease: [0.65, 0, 0.35, 1] })));
    em(T.cheio, () => ctrl.push(animate(cheio, 1, { duration: 0.75, ease: [0.3, 0, 0.2, 1] })));
    em(T.batida, () => {
      const r = coracao.current?.getBoundingClientRect();
      if (r) explosao.current(r.left + r.width / 2, r.top + r.height * 0.55);
      setTremer((n) => n + 1);
      tela.start({ x: [0, -7, 6, -4, 3, 0], y: [0, 4, -5, 3, -2, 0], transition: { duration: 0.45 } });
      batida.start({ scale: [1, 1.28, 0.94, 1.12, 1], transition: { duration: 0.7, times: [0, 0.18, 0.4, 0.62, 1] } });
      navigator.vibrate?.([20, 60, 30]);
    });
    em(T.dias, () => ctrl.push(animate(0, totalDias.current, { duration: 1.3, ease: [0.2, 0.7, 0.2, 1], onUpdate: (v) => setDias(Math.round(v)) })));
    em(T.auto, () => entrarRef.current());
    return () => { tl.forEach(clearTimeout); ctrl.forEach((c) => c.stop()); };
  }, [comecou, reduzir, progresso, cheio, explosao, tela, batida]);

  // o líquido sobe junto com o valor animado
  useEffect(() => cheio.on("change", (v) => liquido.current?.setAttribute("y", String(v))), [cheio]);

  // a cabeça do cometa segue o desenho do coração
  useEffect(() => progresso.on("change", (v) => {
    const p = caminho.current;
    if (!p) return;
    const pt = p.getPointAtLength(p.getTotalLength() * v);
    setCabeca({ x: pt.x, y: pt.y, v });
  }), [progresso]);

  // mergulho: o coração cresce até virar a tela do app
  useEffect(() => {
    if (fase !== "mergulho") return;
    const t = setTimeout(() => { setFase("fim"); document.body.style.overflow = ""; sons.current?.fechar(); }, 1100);
    return () => clearTimeout(t);
  }, [fase]);

  /** Toque de abertura: libera o som (só funciona dentro do toque) e agenda a trilha da cena. */
  const abrir = (comSom: boolean) => {
    if (fase !== "portao") return;
    if (comSom) {
      try {
        const s = new Sons(); sons.current = s; s.liberar();
        player?.prime();
        const t0 = s.agora + 0.05;
        if (!reduzir) {
          s.brilho(t0 + 0.1);
          s.cometa(t0 + T.cometa, 1.25);
          s.liquido(t0 + T.cheio, 0.75);
          s.batida(t0 + T.batida);
          s.faiscas(t0 + T.batida + 0.03);
          s.sino(t0 + T.nome + 0.25);
          s.tiques(t0 + T.dias, 1.3);
        }
      } catch { sons.current = null; }
    }
    setFase("cena");
  };

  /** Fim da abertura: mergulho no coração e a música entra (a partir do segundo 3). */
  const faseAtual = useRef(fase);
  faseAtual.current = fase;
  const entrar = () => {
    if (faseAtual.current !== "cena") return;
    faseAtual.current = "mergulho";
    const s = sons.current;
    if (s) { s.mergulho(s.agora + 0.02); player?.fadeIn(INICIO_MUSICA); }
    setFase("mergulho");
  };
  const entrarRef = useRef(entrar);
  entrarRef.current = entrar;

  const traco = useTransform(progresso, (v) => v);
  const ondaY = useTransform(cheio, (v) => v - 0.6);
  const brilhoCometa = cabeca.v > 0 && cabeca.v < 1;

  return (
    <AnimatePresence>
      {fase !== "fim" && (
        <motion.div
          key="abertura"
          data-noswipe
          role="button"
          tabIndex={0}
          aria-label="Abertura do Lane — toque para entrar"
          onClick={() => (fase === "portao" ? abrir(true) : entrar())}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (fase === "portao" ? abrir(true) : entrar())}
          className="fixed inset-0 z-[70] cursor-pointer overflow-hidden bg-[radial-gradient(ellipse_at_50%_40%,#4a1022_0%,#22060f_55%,#0d0206_100%)] text-creme"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          <canvas ref={canvas} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />

          {comecou && (<>
          {/* luz de fundo que respira */}
          <motion.div aria-hidden className="pointer-events-none absolute left-1/2 top-[40%] h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgb(184_58_85/.45),transparent_65%)]"
            initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: [0, 0.6, 1, 0.8], scale: [0.6, 0.9, 1.15, 1] }}
            transition={{ duration: 4, times: [0, 0.4, 0.75, 1] }} />

          <motion.div className="absolute inset-0 flex flex-col items-center justify-center gap-5" animate={tela}>
            {/* coração */}
            <motion.div ref={coracao} className="relative h-36 w-36"
              style={{ transformOrigin: "50% 58%" }}
              animate={fase === "mergulho" ? { scale: 42 } : { scale: 1 }}
              transition={fase === "mergulho" ? { duration: 1.05, ease: [0.7, 0, 0.84, 0] } : undefined}>
              {/* ponto de luz antes do cometa */}
              <motion.span aria-hidden className="absolute left-1/2 top-[33%] h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_24px_8px_rgb(245_201_107/.8)]"
                initial={{ opacity: 0, scale: 0 }} animate={{ opacity: [0, 1, 0.6, 1, 0], scale: [0, 1, 0.7, 1.2, 0.4] }}
                transition={{ duration: 1.2, delay: 0.15, times: [0, 0.3, 0.55, 0.8, 1] }} />

              <motion.svg viewBox="0 0 24 24" className="h-full w-full overflow-visible" animate={batida}>
                <defs>
                  <linearGradient id="lq" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ffd9dd" />
                    <stop offset="55%" stopColor="#e05a79" />
                    <stop offset="100%" stopColor="#8d1f3f" />
                  </linearGradient>
                  <clipPath id="forma"><path d={CORACAO} /></clipPath>
                  <filter id="brilho" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="0.6" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                </defs>
                {/* líquido subindo */}
                <g clipPath="url(#forma)">
                  <rect ref={liquido} x={0} y={24} width={24} height={30} fill="url(#lq)" />
                  <motion.path d="M0 0 Q3 -0.8 6 0 T12 0 T18 0 T24 0 V2 H0Z" fill="#ffd9dd" opacity={0.5}
                    style={{ y: ondaY }} />
                </g>
                {/* contorno desenhado pelo cometa */}
                <motion.path ref={caminho} d={CORACAO} fill="none" stroke="#fff3d6" strokeWidth={0.45} strokeLinejoin="round" strokeLinecap="round"
                  filter="url(#brilho)" style={{ pathLength: traco }} />
                {brilhoCometa && <circle cx={cabeca.x} cy={cabeca.y} r={0.7} fill="#fff" filter="url(#brilho)" />}
                {/* versão creme para o mergulho */}
                <motion.path d={CORACAO} fill="#fbf6ef" initial={{ opacity: 0 }}
                  animate={{ opacity: fase === "mergulho" ? 1 : 0 }} transition={{ duration: 0.6, delay: 0.25 }} />
              </motion.svg>

              {/* onda de choque da batida */}
              {tremer > 0 && (
                <motion.span key={`o${tremer}`} aria-hidden className="pointer-events-none absolute left-1/2 top-[55%] h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#f5c96b]"
                  initial={{ scale: 0.4, opacity: 0.9 }} animate={{ scale: 4.5, opacity: 0 }} transition={{ duration: 1.1, ease: "easeOut" }} />
              )}
            </motion.div>

            {/* nome em dourado, letras voando em 3D */}
            <motion.div className="flex [perspective:700px] [filter:drop-shadow(0_3px_0_#5a3a0a)_drop-shadow(0_14px_22px_rgb(0_0_0/.55))]" animate={{ opacity: fase === "mergulho" ? 0 : 1 }} transition={{ duration: 0.25 }}>
              {LETRAS.map(({ l, x, y, r }, i) => (
                <motion.span key={i} className="nome-dourado inline-block font-serif text-8xl font-semibold leading-none"
                  initial={reduzir ? false : { opacity: 0, x, y, z: -500, rotateY: r, rotateX: r / 2, scale: 1.4 }}
                  animate={{ opacity: 1, x: 0, y: 0, z: 0, rotateY: 0, rotateX: 0, scale: 1 }}
                  transition={{ duration: 1.1, delay: T.nome + i * 0.09, ease: [0.16, 1, 0.3, 1] }}>
                  {l}
                </motion.span>
              ))}
            </motion.div>

            {/* contador de dias */}
            <motion.div className="flex flex-col items-center"
              initial={reduzir ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: fase === "mergulho" ? 0 : 1, y: 0 }}
              transition={{ duration: fase === "mergulho" ? 0.25 : 0.6, delay: fase === "mergulho" ? 0 : T.dias - 0.1 }}>
              <span className="font-serif text-4xl font-semibold tabular-nums text-[#f5c96b] [font-variant-numeric:lining-nums_tabular-nums] [text-shadow:0_0_24px_rgb(245_201_107/.45)]">
                {dias.toLocaleString("pt-BR")}
              </span>
              <span className="text-xs uppercase tracking-[.4em] text-rosa/90">dias de nós</span>
            </motion.div>
          </motion.div>

          </>)}

          {/* portão: o toque que libera o som */}
          <AnimatePresence>
            {fase === "portao" && (
              <motion.div className="absolute inset-0 flex flex-col items-center justify-center"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
                <motion.span aria-hidden className="mb-[4.5rem] h-3 w-3 rounded-full bg-white shadow-[0_0_24px_8px_rgb(245_201_107/.8)]"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.7, 1, 0.7] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }} />
                <motion.span className="text-sm uppercase tracking-[.35em] text-creme/90"
                  animate={{ opacity: [0.55, 1, 0.55] }} transition={{ duration: 2, repeat: Infinity }}>
                  toque para abrir <span className="text-rosa">♥</span>
                </motion.span>
                <span className="mt-2 text-[11px] text-creme/50">com som</span>
                <button onClick={(e) => { e.stopPropagation(); abrir(false); }}
                  className="absolute bottom-[calc(2rem+env(safe-area-inset-bottom))] rounded-full px-4 py-2 text-xs text-creme/40">
                  abrir sem som
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {fase === "cena" && (
            <button onClick={(e) => { e.stopPropagation(); entrar(); }}
              className="absolute right-4 top-[calc(1rem+env(safe-area-inset-top))] rounded-full px-3 py-1 text-xs text-creme/40">
              pular
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
