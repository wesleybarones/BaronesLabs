/** Mostra o poema respeitando linhas e estrofes; **x** vira destaque (para acrósticos). */
export function PoemText({ body }: { body: string }) {
  const stanzas = body.split(/\n\s*\n/);
  return (
    <div className="space-y-6 font-serif text-xl leading-relaxed sm:text-2xl">
      {stanzas.map((st, i) => (
        <p key={i}>
          {st.split("\n").map((line, j) => (
            <span key={j} className="block">
              {line.split(/(\*\*[^*]+\*\*)/g).map((part, k) =>
                part.startsWith("**") && part.endsWith("**")
                  ? <b key={k} className="text-2xl font-semibold text-vinho sm:text-3xl">{part.slice(2, -2)}</b>
                  : <span key={k}>{part}</span>,
              )}
            </span>
          ))}
        </p>
      ))}
    </div>
  );
}

export const plainPreview = (body: string) => body.replace(/\*\*/g, "").split("\n").slice(0, 2).join(" / ");
