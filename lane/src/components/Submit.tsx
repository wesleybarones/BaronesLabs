"use client";
import { useFormStatus } from "react-dom";

export function Submit({ children }: { children: React.ReactNode }) {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending} className="botao">{pending ? "Salvando…" : children}</button>;
}
