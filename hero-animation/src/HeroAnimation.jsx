import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Boot from './Boot.jsx';
import Swarm from './swarm/Swarm.jsx';
import { createChoreography } from './engine.js';
import { heroScript } from './choreography.js';
import { isMobile, prefersReducedMotion } from './motion.js';

/**
 * "O site que se constrói sozinho": boot + enxame de cursores montando o herói.
 *
 * Coloque <HeroAnimation /> uma vez na página (ao lado do herói). Os elementos
 * animados são encontrados pelos IDs do script (veja README.md).
 *
 * Props
 *  - logo, logoAlt        imagem do boot
 *  - bootText, bootSkip   textos do boot
 *  - showBoot             false → começa a montagem direto (sem tela de boot)
 *  - script               passos da coreografia (padrão: heroScript)
 *  - skipLabel            texto do botão "Pular animação"
 *  - replayLabel          texto do botão "Rever montagem"
 *  - replaySlot           seletor de onde renderizar o botão "Rever" (ex.: '#replay-slot');
 *                         se não existir na página, o botão não aparece
 *  - lockScroll           trava a rolagem durante boot + montagem (padrão: true)
 *  - onDone               chamado quando a página fica 100% utilizável
 */
export default function HeroAnimation({
  logo,
  logoAlt = '',
  bootText = 'INICIALIZANDO',
  bootSkip = 'pular →',
  showBoot = true,
  script = heroScript,
  skipLabel = 'Pular animação →',
  replayLabel = '↻ Rever montagem',
  replaySlot = '#replay-slot',
  lockScroll = true,
  onDone,
}) {
  // Primeiro render igual no servidor e no navegador; ambiente detectado após o paint.
  const [env, setEnv] = useState({ ready: false, reduced: false, mobile: false });
  const { ready, reduced, mobile } = env;
  const [phase, setPhase] = useState(showBoot ? 'boot' : 'assemble'); // boot → assemble → done
  const engine = useRef(null);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    const r = prefersReducedMotion();
    setEnv({ ready: true, reduced: r, mobile: isMobile() });
    if (r) setPhase('done');
  }, []);

  const build = useCallback(() => {
    engine.current?.destroy();
    engine.current = createChoreography(script, { mobile, onComplete: () => setPhase('done') });
  }, [mobile, script]);

  // Prepara a montagem (o herói fica escondido atrás do boot nesse intervalo).
  useEffect(() => {
    if (!ready || reduced) return;
    build();
    if (!showBoot) engine.current.play();
    return () => engine.current?.destroy();
  }, [ready, reduced, build, showBoot]);

  useEffect(() => {
    if (!ready || !lockScroll) return;
    document.documentElement.classList.toggle('ha-locked', phase !== 'done');
    return () => document.documentElement.classList.remove('ha-locked');
  }, [ready, phase, lockScroll]);

  useEffect(() => { if (ready && phase === 'done') onDoneRef.current?.(); }, [ready, phase]);

  const onBootDone = useCallback(() => {
    setPhase('assemble');
    engine.current?.play();
  }, []);

  const skip = useCallback(() => engine.current?.skip(), []);
  const replay = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => { build(); setPhase('assemble'); engine.current.play(); }, 450);
  }, [build]);

  const [slot, setSlot] = useState(null);
  useEffect(() => { if (replaySlot) setSlot(document.querySelector(replaySlot)); }, [replaySlot]);

  return (
    <>
      {!reduced && <Swarm mobile={mobile} />}
      {ready && !reduced && phase === 'assemble' && (
        <button type="button" onClick={skip} className="ha-btn ha-skip">{skipLabel}</button>
      )}
      {ready && !reduced && phase === 'done' && slot &&
        createPortal(<button type="button" onClick={replay} className="ha-btn ha-replay">{replayLabel}</button>, slot)}
      {showBoot && phase === 'boot' && (
        <Boot onDone={onBootDone} logo={logo} logoAlt={logoAlt} text={bootText} skipLabel={bootSkip} />
      )}
    </>
  );
}
