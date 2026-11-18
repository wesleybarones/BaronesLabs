"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

const CORACAO = "M12 21s-7.5-4.6-9.2-9.3C1.6 8.4 3.7 5 7 5c2 0 3.4 1.1 5 3 1.6-1.9 3-3 5-3 3.3 0 5.4 3.4 4.2 6.7C19.5 16.4 12 21 12 21z";
const LETRAS = ["L", "a", "n", "e"];
const FAISCAS = [
  [-70, -150, 0.9, "#e8b4b8"], [60, -170, 1.0, "#f5c96b"], [-20, -200, 1.15, "#e9d8bf"],
  [95, -120, 1.05, "#e8b4b8"], [-100, -110, 1.2, "#f5c96b"], [25, -140, 1.3, "#e9d8bf"],
] as const;

/** Abertura: um coração se desenha, bate, o nome "Lane" vira letra por letra
 *  e a cortina se fecha no coração revelando o app. Toque para pular. */
export function Intro() {
  const reduzir = useReducedMotion();
  const [visivel, setVisivel] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setVisivel(false), reduzir ? 900 : 3600);
    document.body.style.overflow = "hidden";
    return () => { clearTimeout(t); document.body.style.overflow = ""; };
  }, [reduzir]);
  useEffect(() => { if (!visivel) document.body.style.overflow = ""; }, [visivel]);

  return (
    <AnimatePresence>
      {visivel && (
        <motion.div
          key="abertura"
          data-noswipe
          aria-label="Abertura do Lane — toque para entrar"
          role="button"
          tabIndex={0}
          onClick={() => setVisivel(false)}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setVisivel(false)}
          className="fixed inset-0 z-[70] flex cursor-pointer flex-col items-center justify-center gap-6 bg-[radial-gradient(ellipse_at_50%_38%,#8d2a4b_0%,#5a1229_55%,#2a0a14_100%)] text-creme"
          initial={false}
          animate={{ clipPath: "circle(150% at 50% 40%)" }}
          exit={reduzir ? { opacity: 0 } : { clipPath: "circle(0% at 50% 40%)" }}
          transition={{ duration: 0.85, ease: [0.7, 0, 0.3, 1] }}
        >
          {/* coração que se desenha e depois bate */}
          <div className="relative h-32 w-32">
            <motion.svg viewBox="0 0 24 24" className="h-full w-full overflow-visible"
              animate={reduzir ? undefined : { scale: [1, 1, 1.14, 1, 1.09, 1] }}
              transition={{ duration: 1.2, delay: 1.3, times: [0, 0.01, 0.2, 0.4, 0.6, 1] }}>
              <defs>
                <linearGradient id="g-coracao" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f2c6ca" />
                  <stop offset="100%" stopColor="#b83a55" />
                </linearGradient>
              </defs>
              <motion.path d={CORACAO} fill="url(#g-coracao)" stroke="#f6e3e4" strokeWidth={0.6} strokeLinejoin="round"
                initial={reduzir ? false : { pathLength: 0, fillOpacity: 0 }}
                animate={{ pathLength: 1, fillOpacity: 1 }}
                transition={{ pathLength: { duration: 1.1, ease: "easeInOut" }, fillOpacity: { duration: 0.4, delay: 1.0 } }}
                style={{ filter: "drop-shadow(0 6px 14px rgb(0 0 0 / .35))" }} />
            </motion.svg>
            {!reduzir && FAISCAS.map(([dx, dy, d, cor], i) => (
              <motion.span key={i} aria-hidden className="absolute left-1/2 top-1/2 text-sm" style={{ color: cor }}
                initial={{ x: 0, y: 0, opacity: 0, scale: 0.4 }}
                animate={{ x: dx, y: dy, opacity: [0, 1, 0], scale: [0.4, 1, 0.8] }}
                transition={{ duration: 1.6, delay: 1.3 + d * 0.3, ease: "easeOut" }}>♥</motion.span>
            ))}
          </div>

          {/* nome letra por letra, girando em 3D */}
          <div className="flex [perspective:600px]">
            {LETRAS.map((l, i) => (
              <motion.span key={i}
                className="inline-block font-serif text-7xl font-semibold [text-shadow:0_2px_0_#3f0c1d,0_4px_0_#2a0a14,0_14px_24px_rgb(0_0_0/.45)]"
                initial={reduzir ? false : { opacity: 0, rotateX: -95, y: 24 }}
                animate={{ opacity: 1, rotateX: 0, y: 0 }}
                transition={{ duration: 0.7, delay: 1.25 + i * 0.13, ease: [0.34, 1.56, 0.64, 1] }}>
                {l}
              </motion.span>
            ))}
          </div>

          <motion.p className="font-serif text-lg italic text-rosa"
            initial={reduzir ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 2.15 }}>
            desde 30 de dezembro de 2014
          </motion.p>

          <motion.p className="absolute bottom-[calc(2rem+env(safe-area-inset-bottom))] text-xs tracking-[.3em] text-rosa/60"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.6, duration: 0.6 }}>
            TOQUE PARA ENTRAR
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
