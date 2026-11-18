/** Trilha sonora da abertura, sintetizada com Web Audio (sem arquivos para baixar). */
export class Sons {
  ctx: AudioContext;
  saida: GainNode;
  ruido: AudioBuffer;

  constructor() {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new AC();
    const comp = this.ctx.createDynamicsCompressor();
    this.saida = this.ctx.createGain();
    this.saida.gain.value = 0.55;
    this.saida.connect(comp).connect(this.ctx.destination);
    this.ruido = this.ctx.createBuffer(1, this.ctx.sampleRate * 2, this.ctx.sampleRate);
    const d = this.ruido.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }

  /** precisa ser chamado dentro do toque (o iPhone só libera o som assim) */
  async liberar() { if (this.ctx.state !== "running") await this.ctx.resume(); }
  get agora() { return this.ctx.currentTime; }

  private env(g: GainNode, t: number, ataque: number, pico: number, dur: number) {
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(pico, t + ataque);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  }
  private osc(tipo: OscillatorType, freq: number, t: number, dur: number, pico: number, ataque = 0.01, destino: AudioNode = this.saida) {
    const o = this.ctx.createOscillator(), g = this.ctx.createGain();
    o.type = tipo; o.frequency.setValueAtTime(freq, t);
    this.env(g, t, ataque, pico, dur);
    o.connect(g).connect(destino); o.start(t); o.stop(t + dur + 0.05);
    return o;
  }
  private barulho(t: number, dur: number, filtro: BiquadFilterType, f0: number, f1: number, pico: number, q = 1) {
    const s = this.ctx.createBufferSource(), f = this.ctx.createBiquadFilter(), g = this.ctx.createGain();
    s.buffer = this.ruido; s.loop = true;
    f.type = filtro; f.Q.value = q;
    f.frequency.setValueAtTime(f0, t); f.frequency.exponentialRampToValueAtTime(f1, t + dur);
    this.env(g, t, dur * 0.35, pico, dur);
    s.connect(f).connect(g).connect(this.saida); s.start(t); s.stop(t + dur + 0.05);
  }

  /** brilho suave quando a luz e a poeira dourada aparecem */
  brilho(t: number) {
    [1568, 2093, 2637, 3136].forEach((f, i) => this.osc("sine", f * (1 + (Math.random() - 0.5) * 0.004), t + i * 0.09, 2.2, 0.025, 0.4));
  }
  /** "whoosh" do cometa desenhando o coração */
  cometa(t: number, dur: number) {
    this.barulho(t, dur, "bandpass", 500, 3800, 0.22, 2.5);
    this.osc("sine", 880, t + dur * 0.8, 0.8, 0.03, 0.05);
  }
  /** líquido enchendo: borbulhas que sobem de tom */
  liquido(t: number, dur: number) {
    this.barulho(t, dur, "lowpass", 300, 900, 0.12, 4);
    for (let k = 0; k < 9; k++) {
      const tt = t + (k / 9) * dur + Math.random() * 0.05;
      const o = this.osc("sine", 300 + k * 45, tt, 0.09, 0.05, 0.005);
      o.frequency.exponentialRampToValueAtTime(600 + k * 60, tt + 0.08);
    }
  }
  /** batida do coração: "tum-tum" grave */
  batida(t: number) {
    for (const [dt, pico] of [[0, 0.95], [0.24, 0.6]] as const) {
      const o = this.ctx.createOscillator(), g = this.ctx.createGain();
      o.type = "sine"; o.frequency.setValueAtTime(95, t + dt); o.frequency.exponentialRampToValueAtTime(42, t + dt + 0.18);
      this.env(g, t + dt, 0.008, pico, 0.32);
      o.connect(g).connect(this.saida); o.start(t + dt); o.stop(t + dt + 0.4);
      this.barulho(t + dt, 0.08, "lowpass", 900, 200, 0.18);
    }
  }
  /** faíscas cintilando na explosão */
  faiscas(t: number) {
    for (let k = 0; k < 26; k++) {
      const tt = t + Math.pow(Math.random(), 1.6) * 1.1;
      this.osc("sine", 2800 + Math.random() * 3800, tt, 0.06 + Math.random() * 0.08, 0.035 * (1 - (tt - t) / 1.3), 0.003);
    }
  }
  /** acorde de sino quando o nome dourado se forma */
  sino(t: number) {
    [523.25, 659.25, 783.99, 1174.66, 1567.98].forEach((f, i) => {
      this.osc("sine", f, t + i * 0.06, 2.8, 0.07 / (1 + i * 0.3), 0.005);
      this.osc("sine", f * 2.76, t + i * 0.06, 0.9, 0.012, 0.003); // parcial metálico
    });
  }
  /** tique-taques do contador de dias (acelera e desacelera como o número) */
  tiques(t: number, dur: number, n = 16) {
    for (let k = 0; k < n; k++) {
      const p = k / (n - 1), tt = t + dur * (1 - Math.pow(1 - p, 2.2));
      this.osc("triangle", 2300 + p * 600, tt, 0.035, 0.05, 0.002);
    }
  }
  /** mergulho dentro do coração */
  mergulho(t: number) {
    this.barulho(t, 1.1, "bandpass", 3000, 250, 0.25, 1.5);
    const o = this.osc("sine", 160, t, 1.2, 0.18, 0.4);
    o.frequency.exponentialRampToValueAtTime(48, t + 1.1);
  }
  fechar() { setTimeout(() => this.ctx.close().catch(() => {}), 3000); }
}
