"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", label: "Início", d: "M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" },
  { href: "/fotos", label: "Fotos", d: "M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm0 10 4.5-4.5L13 16l3-3 4 4M15 9.5a1.5 1.5 0 1 0 0-.01" },
  { href: "/lembrancas", label: "Lembranças", d: "M12 21s-7.5-4.6-9.2-9.3C1.6 8.4 3.7 5 7 5c2 0 3.4 1.1 5 3 1.6-1.9 3-3 5-3 3.3 0 5.4 3.4 4.2 6.7C19.5 16.4 12 21 12 21z" },
  { href: "/poemas", label: "Poemas", d: "M5 4h10l4 4v12H5zM14 4v5h5M8 13h8M8 17h5" },
  { href: "/musica", label: "Música", d: "M9 18V6l11-2v12M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm11-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" },
];

export function Nav() {
  const path = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-rosa/60 bg-creme/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
      <ul className="mx-auto flex max-w-md justify-around">
        {items.map((it) => {
          const active = it.href === "/" ? path === "/" : path.startsWith(it.href);
          return (
            <li key={it.href}>
              <Link href={it.href} className={`flex flex-col items-center gap-0.5 px-2 py-2.5 text-[11px] ${active ? "text-vinho" : "text-suave"}`}>
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill={active ? "currentColor" : "none"} fillOpacity={active ? 0.15 : 0} stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round"><path d={it.d} /></svg>
                {it.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
