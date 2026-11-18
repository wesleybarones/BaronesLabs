let ultima: number | null = null;
/** Direção da troca de aba: 1 = veio da esquerda para a direita (aba seguinte), -1 = voltou, 0 = primeira tela. */
export function direcaoPara(indice: number): number {
  const d = ultima === null ? 0 : Math.sign(indice - ultima);
  ultima = indice;
  return d;
}
