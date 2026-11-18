"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS as items } from "@/lib/nav";


export function Nav() {
  const path = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-rosa/60 bg-creme/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_24px_-12px_rgb(90_18_41/.25)] backdrop-blur">
      <ul className="mx-auto flex max-w-md justify-around">
        {items.map((it) => {
          const active = it.href === "/" ? path === "/" : path.startsWith(it.href);
          return (
            <li key={it.href}>
              <Link href={it.href} prefetch={true} className={`flex flex-col items-center gap-0.5 px-2 py-2.5 text-[11px] ${active ? "text-vinho" : "text-suave"}`}>
                <svg viewBox="0 0 24 24" className={`h-6 w-6 transition ${active ? "-translate-y-0.5 drop-shadow-[0_3px_2px_rgb(90_18_41/.35)]" : ""}`} fill={active ? "currentColor" : "none"} fillOpacity={active ? 0.15 : 0} stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round"><path d={it.d} /></svg>
                {it.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
