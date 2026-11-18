"use client";
import { useRef } from "react";
import { motion } from "motion/react";
import { useFireworks } from "./Fireworks";

/** Botão de fogos na lembrança do casamento. */
export function MemoryFireworks() {
  const ref = useRef<HTMLButtonElement>(null);
  const { tela, soltar } = useFireworks();
  return (
    <>
      {tela}
      <motion.button
        ref={ref}
        type="button"
        whileTap={{ scale: 0.92 }}
        onClick={() => {
          navigator.vibrate?.([10, 40, 10]);
          const card = ref.current?.closest("[data-lembranca]") ?? ref.current;
          if (card) soltar(card.getBoundingClientRect());
        }}
        className="mt-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-b from-[#8d2a4b] to-vinho-escuro px-4 py-2 text-sm font-medium text-creme shadow-[0_3px_0_#3f0c1d,0_8px_16px_-6px_rgb(63_12_29/.5)]"
      >
        🎆 Soltar fogos
      </motion.button>
    </>
  );
}
