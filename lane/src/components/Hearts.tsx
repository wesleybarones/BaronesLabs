/** Coraçõezinhos subindo em profundidade (só CSS). Posições fixas para não variar entre servidor e navegador. */
const HEARTS = [
  [6, -400, 14, 0, 0.35, 22], [18, -150, 22, -6, 0.5, 30], [31, -300, 18, -12, 0.3, 18],
  [44, 0, 26, -3, 0.45, 34], [57, -250, 20, -15, 0.35, 20], [69, -80, 24, -9, 0.5, 28],
  [81, -350, 16, -18, 0.3, 16], [92, -120, 28, -5, 0.4, 26],
] as const;

export function Hearts() {
  return (
    <div className="ceu" aria-hidden>
      {HEARTS.map(([left, z, t, d, o, size], i) => (
        <span key={i} style={{
          left: `${left}%`, fontSize: size,
          ["--z" as string]: `${z}px`, ["--t" as string]: `${t}s`, ["--d" as string]: `${d}s`,
          ["--o" as string]: o, ["--dx" as string]: `${i % 2 ? 40 : -40}px`,
        }}>♥</span>
      ))}
    </div>
  );
}
