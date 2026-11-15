"use client";
import { useRef, useState } from "react";
import { AnimatePresence, motion, useAnimationControls, useReducedMotion } from "motion/react";

const LETRAS = ["L", "a", "n", "e"];
const CORES = ["#e8b4b8", "#b83a55", "#e9d8bf", "#7a1f3d"];
const FRASES = [
  "Eu te amo",
  "Eu e você pra sempre",
  "9 anos de nós",
  "Mulher da minha vida",
  "Linda, forte e delicada",
  "Meu lugar no mundo",
];

/** Sorteia uma frase diferente da atual. */
export function sortearFrase(atual: number, total = FRASES.length, rand = Math.random): number {
  if (total <= 1) return 0;
  if (atual < 0) return Math.floor(rand() * total);
  const n = Math.floor(rand() * (total - 1));
  return n >= atual ? n + 1 : n;
}

type Coracao = { id: number; x: number; y: number; dx: number; dy: number; giro: number; cor: string; tam: number };

/** O nome "Lane" em 3D: flutua de leve e, ao toque, as letras pulam e giram,
 *  coraçõezinhos explodem do ponto tocado e aparece uma frase de carinho. */
export function LaneTitle({ className = "text-7xl" }: { className?: string }) {
  const reduzir = useReducedMotion();
  const letras = useAnimationControls();
  const caixa = useRef<HTMLButtonElement>(null);
  const [coracoes, setCoracoes] = useState<Coracao[]>([]);
  const [frase, setFrase] = useState(-1);
  const proximo = useRef(0);

  function tocar(e: React.PointerEvent) {
    navigator.vibrate?.(12);
    setFrase((f) => sortearFrase(f));
    if (reduzir) return;

    letras.start((i: number) => ({
      y: [0, -22, 0],
      rotateY: [0, 360],
      scale: [1, 1.12, 1],
      transition: { duration: 0.9, delay: i * 0.08, ease: [0.34, 1.56, 0.64, 1] },
    }));

    const r = caixa.current!.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const novos = Array.from({ length: 14 }, (_, k) => {
      const ang = (Math.PI * 2 * k) / 14 + Math.random() * 0.4;
      const dist = 60 + Math.random() * 70;
      return {
        id: proximo.current++, x, y,
        dx: Math.cos(ang) * dist, dy: Math.sin(ang) * dist - 30,
        giro: (Math.random() - 0.5) * 90, cor: CORES[k % CORES.length], tam: 10 + Math.random() * 12,
      };
    });
    setCoracoes((c) => [...c, ...novos]);
  }

  return (
    <div className="flex flex-col items-center">
      <button
        ref={caixa}
        type="button"
        onPointerDown={tocar}
        aria-label="Lane — toque para um carinho"
        className="relative cursor-pointer select-none px-4 [perspective:700px] [-webkit-tap-highlight-color:transparent]"
      >
        <motion.span
          className={`texto-3d relative inline-flex font-serif font-semibold ${className}`}
          animate={reduzir ? undefined : { y: [0, -4, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          whileTap={reduzir ? undefined : { scale: 0.94 }}
        >
          {LETRAS.map((l, i) => (
            <motion.span key={i} custom={i} animate={letras} className="inline-block [transform-style:preserve-3d]">
              {l}
            </motion.span>
          ))}
          {!reduzir && <span className="brilho-nome" aria-hidden />}
        </motion.span>

        <AnimatePresence>
          {coracoes.map((c) => (
            <motion.span
              key={c.id}
              aria-hidden
              className="pointer-events-none absolute left-0 top-0"
              style={{ color: c.cor, fontSize: c.tam, x: c.x, y: c.y }}
              initial={{ scale: 0, opacity: 1 }}
              animate={{ x: c.x + c.dx, y: c.y + c.dy, scale: [0, 1.3, 1], opacity: [1, 1, 0], rotate: c.giro }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              onAnimationComplete={() => setCoracoes((cs) => cs.filter((z) => z.id !== c.id))}
            >
              ♥
            </motion.span>
          ))}
        </AnimatePresence>
      </button>

      <div className="h-8">
        <AnimatePresence mode="wait">
          <motion.p
            key={frase}
            initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
            transition={{ duration: 0.45 }}
            className={frase < 0 ? "text-xs text-suave/70" : "font-serif text-xl italic text-vinho"}
          >
            {frase < 0 ? "toque no nome ♥" : FRASES[frase]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
