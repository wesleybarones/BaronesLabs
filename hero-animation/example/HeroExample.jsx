// Exemplo de herói com os IDs que a coreografia usa (classes Tailwind só para o visual).
// Você pode usar o seu próprio markup: o que importa são os IDs.
import { HeroAnimation } from '../src/index.js';

export default function HeroExample() {
  return (
    <section id="top" className="relative px-6 pt-28 pb-20">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <p id="hero-status">● Disponível para novos projetos</p>

          <h1>
            <span id="hero-kicker">Criação de landing pages em Niterói-RJ</span>
            {/* COPY.BOT digita este texto (spans .hl ganham o contorno no fim) */}
            <span id="hero-title" className="block">
              Conectando pessoas. Construindo <span className="hl" data-text="Negócios.">Negócios.</span>
            </span>
          </h1>

          <p id="hero-sub">Landing pages com visual de agência, prontas em até 48h.</p>
          <div id="hero-ctas">{/* botões */}</div>

          <ul id="hero-proofs">
            {/* W.BARONES seleciona, copia e arrasta este item */}
            <li id="proof-48h">Entrega 48h–7 dias</li>
            <li>3 alterações grátis</li>
            <li>Garantia 7 dias</li>
          </ul>
          <ul id="hero-chips"><li>CARREGAR 0,8s</li><li>MOBILE ✓</li><li>SEO ✓</li></ul>

          {/* onde aparece o botão "↻ Rever montagem" depois da animação */}
          <div id="replay-slot" />
        </div>

        <div className="relative">
          {/* UI.BOT desenha o contorno deste bloco */}
          <div id="hero-frame" className="relative aspect-[5/6] overflow-hidden">
            <img src="/brand/wesley-avatar-780.webp" alt="Wesley Barones" width="780" height="968" />
            <div className="absolute inset-x-3 bottom-3 flex justify-between">
              <span id="deploy-progress" className="absolute inset-x-0 bottom-0 h-px origin-left bg-[#D4FF24]" />
              {/* texto final do status (fica "AGUARDANDO DEPLOY_" durante a montagem) */}
              <span id="deploy-status" className="inline-block">ONLINE ✓ · 0.8s</span>
              {/* DEPLOY.BOT clica aqui */}
              <span id="btn-deploy" className="inline-block">DEPLOY</span>
            </div>
          </div>
          {/* destino do arraste (a cópia de #proof-48h encaixa aqui) */}
          <div id="slot-proof" className="absolute -left-10 top-[38%]">Entrega 48h–7 dias</div>
        </div>
      </div>

      <HeroAnimation logo="/brand/logo-720.webp" logoAlt="Barones Labs" />
    </section>
  );
}
