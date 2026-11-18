/** Letra da música; linhas com o nome dela ganham destaque. */
export function Lyrics({ text }: { text: string }) {
  const lines = text.normalize("NFC").split("\n").map((l) => l.trim())
    .filter((l) => !/^\[title:/i.test(l))
    .map((l) => (/^\[.*\]$/.test(l) ? "" : l))
    .filter((l, i, arr) => !(l === "" && (i === 0 || arr[i - 1] === "")));
  return (
    <details open className="relevo rounded-[2rem] bg-papel px-6 py-6 ring-1 ring-rosa/60">
      <summary className="cursor-pointer text-center text-xs uppercase tracking-[.3em] text-suave">letra</summary>
      <div className="mt-6 space-y-1.5 text-center font-serif text-lg leading-relaxed">
        {lines.map((l, i) =>
          l === "" ? <div key={i} className="h-4" /> : (
            <p key={i} className={/l[aâ]-?ne/i.test(l) ? "text-xl font-semibold text-vinho" : "text-tinta/90"}>{l}</p>
          ),
        )}
      </div>
    </details>
  );
}
