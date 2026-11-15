"use client";
import { useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useFireworks } from "./Fireworks";

/** Quadro de aniversário: ao tocar, afunda em 3D, brilha e solta fogos de artifício. */
export function AnniversaryBanner({ texto }: { texto: string }) {
  const reduzir = useReducedMotion();
  const ref = useRef<HTMLButtonElement>(null);
  const { tela, soltar } = useFireworks();
  const [toques, setToques] = useState(0);

  return (
    <>
      {tela}
      <motion.button
        ref={ref}
        type="button"
        onClick={() => {
          navigator.vibrate?.([10, 40, 10]);
          setToques((t) => t + 1);
          if (!reduzir && ref.current) soltar(ref.current.getBoundingClientRect());
        }}
        aria-label={`${texto} — toque para comemorar`}
        initial={{ opacity: 0, y: 12, rotateX: -20 }}
        animate={reduzir ? { opacity: 1 } : { opacity: 1, y: [0, -3, 0], rotateX: 0 }}
        transition={reduzir ? { duration: 0.3 } : { opacity: { duration: 0.6 }, rotateX: { duration: 0.6 }, y: { duration: 3.5, repeat: Infinity, ease: "easeInOut" } }}
        whileTap={reduzir ? undefined : { scale: 0.95, rotateX: 12 }}
        className="relative z-[45] mx-auto block w-full max-w-sm cursor-pointer overflow-hidden rounded-3xl bg-gradient-to-b from-[#8d2a4b] to-vinho-escuro px-6 py-4 text-creme shadow-[0_6px_0_#3f0c1d,0_18px_30px_-8px_rgb(63_12_29/.5)] [-webkit-tap-highlight-color:transparent]"
        style={{ transformPerspective: 800 }}
      >
        {/* clarão a cada toque */}
        <motion.span
          key={toques}
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_60%,rgb(245_201_107/.55),transparent_65%)]"
          initial={{ opacity: toques ? 1 : 0 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
        />
        <span className="relative block text-sm uppercase tracking-[.25em] text-rosa">hoje é dia</span>
        <span className="relative block font-serif text-3xl [font-variant-numeric:lining-nums]">{texto}</span>
        <span className="relative mt-1 block text-[11px] text-rosa/80">toque para comemorar ✨</span>
      </motion.button>
    </>
  );
}
