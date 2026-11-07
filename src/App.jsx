import { memo, useCallback, useEffect, useRef, useState } from 'react';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import Marquee from './components/Marquee.jsx';
import Diagnostico from './components/Diagnostico.jsx';
import Solucao from './components/Solucao.jsx';
import Projetos from './components/Projetos.jsx';
import Alcance from './components/Alcance.jsx';
import ParaQuem from './components/ParaQuem.jsx';
import Missao from './components/Missao.jsx';
import Processo from './components/Processo.jsx';
import Pacotes from './components/Pacotes.jsx';
import Garantia from './components/Garantia.jsx';
import Sobre from './components/Sobre.jsx';
import Depoimentos from './components/Depoimentos.jsx';
import FAQ from './components/FAQ.jsx';
import Footer, { CTAFinal } from './components/Footer.jsx';
import WhatsAppFloat from './components/WhatsAppFloat.jsx';
import Boot from './components/Boot.jsx';
import Swarm from './components/swarm/Swarm.jsx';
import { isMobile, prefersReducedMotion } from './lib/motion.js';
import { initSmoothScroll, lockScroll, scrollToTarget } from './lib/smooth.js';
import { createChoreography } from './lib/engine.js';
import { heroScript } from './lib/choreography.js';
import AssemblyControls from './components/AssemblyControls.jsx';

// Primeiro render idêntico no servidor (pré-renderização) e no navegador;
// o ambiente real (reduced-motion, mobile) é detectado antes do primeiro paint.
const SSR_ENV = { ready: false, reduced: false, mobile: false };

// Conteúdo estático da página: memoizado para que as mudanças de fase/ambiente
// do App (boot → montagem → pronto) não re-renderizem todas as seções.
const Page = memo(function Page() {
  return (
    <>
      <a href="#conteudo" className="skip-link btn-primary">Pular para o conteúdo</a>
      <div className="bg-system" aria-hidden="true" />
      <div className="bg-scan" aria-hidden="true" />
      <Header />
      <main id="conteudo" tabIndex={-1} className="relative z-10">
        <Hero />
        <Marquee />
        <Diagnostico />
        <Solucao />
        <Projetos />
        <Alcance />
        <ParaQuem />
        <Missao />
        <Processo />
        <Pacotes />
        <Garantia />
        <Sobre />
        <Depoimentos />
        <FAQ />
        <CTAFinal />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
});

export default function App() {
  const [env, setEnv] = useState(SSR_ENV);
  const { ready, reduced, mobile } = env;
  // boot → assemble → done
  const [phase, setPhase] = useState('boot');

  // Detecção do ambiente e preparo da montagem depois do primeiro paint, em tarefas
  // separadas (o boot cobre o herói nesse intervalo; com reduced-motion o CSS já esconde o boot).
  useEffect(() => {
    const r = prefersReducedMotion();
    setEnv({ ready: true, reduced: r, mobile: isMobile() });
    if (r) setPhase('done');
  }, []);

  useEffect(() => {
    if (!ready) return;
    // A montagem acontece no topo: não restaurar a rolagem de uma visita anterior.
    if (!reduced && 'scrollRestoration' in history) { history.scrollRestoration = 'manual'; window.scrollTo(0, 0); }
    initSmoothScroll();
  }, [ready, reduced]);

  // Mini-coreografias e efeitos de rolagem: carregados sob demanda (import dinâmico)
  // e armados uma vez, quando o herói termina.
  const sectionsOff = useRef(null);
  useEffect(() => {
    if (!ready || reduced || phase !== 'done' || sectionsOff.current) return;
    sectionsOff.current = () => {};
    Promise.all([import('./lib/sections.js'), import('./lib/effects.js')]).then(([sec, fx]) => {
      const offSections = sec.initSectionChoreographies({ mobile });
      const offEffects = fx.initScrollEffects({ mobile });
      sectionsOff.current = () => { offSections(); offEffects(); };
    });
  }, [ready, phase, reduced, mobile]);
  useEffect(() => () => sectionsOff.current?.(), []);
  useEffect(() => { if (ready) lockScroll(phase !== 'done'); }, [ready, phase]);

  const engine = useRef(null);
  const build = useCallback(() => {
    engine.current?.destroy();
    engine.current = createChoreography(heroScript, { mobile, onComplete: () => setPhase('done') });
  }, [mobile]);

  // Prepara a montagem (escondida atrás do boot).
  useEffect(() => {
    if (!ready || reduced) return;
    build();
    return () => engine.current?.destroy();
  }, [ready, reduced, build]);

  const onBootDone = useCallback(() => {
    setPhase('assemble');
    engine.current?.play();
  }, []);

  const skip = useCallback(() => engine.current?.skip(), []);
  const replay = useCallback(() => {
    scrollToTarget(document.body);
    setTimeout(() => { build(); setPhase('assemble'); engine.current.play(); }, 450);
  }, [build]);

  return (
    <div className="relative">
      <Page />
      {!reduced && <Swarm mobile={mobile} />}
      {ready && !reduced && <AssemblyControls phase={phase} onSkip={skip} onReplay={replay} />}
      {phase === 'boot' && <Boot onDone={onBootDone} />}
    </div>
  );
}
