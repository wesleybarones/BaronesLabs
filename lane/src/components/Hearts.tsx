/** Coraçõezinhos quase imperceptíveis caindo devagar no fundo (só CSS).
 *  Posições fixas para não variar entre servidor e navegador. */
const CORES = ["#e8b4b8", "#b83a55", "#e9d8bf"]; // rosa, vermelho, creme

// [left %, tamanho px, duração s, atraso s, opacidade, profundidade px, deriva px]
const HEARTS = [
  [4, 14, 38, 0, 0.22, -200, 30], [11, 10, 46, -20, 0.18, -350, -25], [19, 18, 41, -8, 0.16, -100, 20],
  [27, 12, 52, -33, 0.2, -280, -30], [35, 16, 44, -15, 0.15, -60, 25], [43, 9, 49, -40, 0.22, -380, -20],
  [51, 20, 39, -4, 0.14, -150, 30], [59, 11, 55, -27, 0.2, -320, -25], [66, 15, 43, -12, 0.17, -90, 20],
  [74, 13, 50, -45, 0.2, -240, -30], [82, 17, 40, -22, 0.15, -120, 25], [89, 10, 47, -6, 0.22, -360, -20],
  [96, 14, 53, -30, 0.18, -200, 30], [8, 12, 58, -50, 0.16, -300, -20], [47, 13, 60, -55, 0.18, -220, 25],
  [70, 9, 57, -38, 0.2, -340, -30],
] as const;

export function Hearts() {
  return (
    <div className="ceu" aria-hidden>
      {HEARTS.map(([left, size, t, d, o, z, dx], i) => (
        <span key={i} style={{
          left: `${left}%`, fontSize: size, color: CORES[i % 3],
          ["--z" as string]: `${z}px`, ["--t" as string]: `${t}s`, ["--d" as string]: `${d}s`,
          ["--o" as string]: o, ["--dx" as string]: `${dx}px`,
        }}>♥</span>
      ))}
    </div>
  );
}
