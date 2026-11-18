"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { sectionIndex } from "@/lib/nav";
import { direcaoPara } from "@/lib/transition";

/** Cada troca de aba entra deslizando do lado certo. */
export default function Template({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const [dir] = useState(() => direcaoPara(sectionIndex(path)));
  const cls = dir > 0 ? "entra-da-direita" : dir < 0 ? "entra-da-esquerda" : "";
  return <div className={cls}>{children}</div>;
}
