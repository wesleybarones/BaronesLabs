import { TZ } from "./elapsed";

const fmt = new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric", timeZone: TZ });

export function groupByMonth<T extends { taken_at: string }>(items: T[]): { label: string; items: T[] }[] {
  const sorted = [...items].sort((a, b) => b.taken_at.localeCompare(a.taken_at));
  const groups: { label: string; items: T[] }[] = [];
  for (const it of sorted) {
    const label = fmt.format(new Date(it.taken_at));
    const last = groups[groups.length - 1];
    if (last?.label === label) last.items.push(it);
    else groups.push({ label, items: [it] });
  }
  return groups;
}
