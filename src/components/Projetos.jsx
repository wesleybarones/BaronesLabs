import { useEffect, useRef } from 'react';
import { projetos as p } from '../content/site.js';
import { waLink } from '../config.js';
import { DesktopMock, PhoneMock } from './BrandMockup.jsx';
import { Hud, Icon, SectionHead } from './ui.jsx';

// Fontes das marcas dos mockups: carregadas sob demanda quando a seção monta.
function useBrandFonts() {
  useEffect(() => { import('../brand-fonts.css'); }, []);
}

/** Arraste com o mouse (toque e trackpad usam o scroll nativo). */
function useDragScroll(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let down = false, startX = 0, startLeft = 0, moved = false;
    const onDown = (e) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      down = true; moved = false; startX = e.clientX; startLeft = el.scrollLeft;
      el.style.scrollSnapType = 'none';
    };
    const onMove = (e) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 4) { moved = true; el.classList.add('cursor-grabbing'); }
      el.scrollLeft = startLeft - dx;
    };
    const onUp = () => {
      if (!down) return;
      down = false; el.classList.remove('cursor-grabbing');
      el.style.scrollSnapType = '';
    };
    const onClick = (e) => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } };
    el.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    el.addEventListener('click', onClick, true);
    return () => {
      el.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      el.removeEventListener('click', onClick, true);
    };
  }, [ref]);
}

function ProjectCard({ project, index }) {
  const live = Boolean(project.url);
  return (
    <li className="proj-card w-[min(88vw,640px)] shrink-0 snap-start" style={{ '--accent': project.accent }}>
      <Hud className="flex h-full flex-col p-5 md:p-6" color={project.accent}>
        <div className="mb-5 flex items-center justify-between font-mono text-[11px] tracking-widest text-muted">
          <span>PRJ_0{index + 1}</span>
          <span className="flex items-center gap-2">
            <span className="h-2 w-2" style={{ background: project.accent, boxShadow: `0 0 10px ${project.accent}` }} aria-hidden="true" />
            {live ? 'ONLINE' : project.paused ? 'PRÉVIA PAUSADA' : 'EM BREVE'}
          </span>
        </div>

        <div className="relative pr-[16%]" draggable="false">
          <DesktopMock project={project} />
          <div className="absolute -bottom-4 right-0 w-[24%]">
            <PhoneMock project={project} />
          </div>
        </div>

        <div className="mt-9 flex flex-1 flex-col">
          <h3 className="text-2xl font-semibold text-white">{project.name}</h3>
          <p className="mt-1 font-mono text-xs uppercase tracking-wider" style={{ color: project.accent }}>{project.category}</p>
          {project.description && <p className="mt-3 text-sm leading-relaxed text-muted">{project.description}</p>}
          <div className="mt-auto pt-6">
            {live ? (
              <a href={project.url} target="_blank" rel="noopener" className="btn-secondary !py-2.5" style={{ color: project.accent, borderColor: project.accent }}>
                {p.cta} <Icon name="external" className="h-4 w-4" />
                <span className="sr-only">: {project.name} (abre em nova aba)</span>
              </a>
            ) : (
              <span className="btn-secondary !py-2.5" aria-disabled="true" role="link">
                <Icon name="lock" className="h-4 w-4" /> {p.soon}
              </span>
            )}
          </div>
        </div>
      </Hud>
    </li>
  );
}

export default function Projetos() {
  const track = useRef(null);
  useBrandFonts();
  useDragScroll(track);

  const scrollBy = (dir) => {
    const el = track.current;
    const card = el?.querySelector('.proj-card');
    if (!el || !card) return;
    el.scrollBy({ left: dir * (card.getBoundingClientRect().width + 24), behavior: 'smooth' });
  };

  return (
    <section id="portfolio" aria-labelledby="proj-title" className="section">
      <div className="container-site">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHead label={p.label} title={p.title} sub={p.sub} titleId="proj-title" />
          <div className="mb-12 hidden gap-2 md:mb-16 md:flex">
            <button type="button" onClick={() => scrollBy(-1)} className="grid h-12 w-12 place-items-center border border-line text-cyan hover:border-cyan" aria-label="Projeto anterior">
              <Icon name="arrowLeft" />
            </button>
            <button id="proj-next" type="button" onClick={() => scrollBy(1)} className="grid h-12 w-12 place-items-center border border-line text-cyan hover:border-cyan" aria-label="Próximo projeto">
              <Icon name="arrowRight" />
            </button>
          </div>
        </div>
      </div>

      <ul
        ref={track}
        id="proj-track"
        className="no-scrollbar flex items-start md:items-stretch cursor-grab snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-4 pb-6 sm:px-6 lg:px-[max(2rem,calc((100vw-1240px)/2+2rem))]"
        style={{ scrollPaddingInline: 'max(1rem, calc((100vw - 1240px) / 2 + 2rem))' }}
        aria-label="Projetos"
        tabIndex={0}
      >
        {p.items.map((proj, i) => <ProjectCard key={proj.id} project={proj} index={i} />)}

        <li className="w-[min(88vw,420px)] shrink-0 snap-start">
          <Hud className="flex h-full min-h-[420px] flex-col justify-between p-7" color="#D4FF24">
            <div>
              <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-lime">
                <span className="dot-live" aria-hidden="true" /> {p.final.tag}
              </p>
              <div className="mt-10 grid aspect-[16/10] place-items-center border border-dashed border-lime/40 text-lime/70">
                <Icon name="plus" className="h-10 w-10" />
              </div>
              <h3 className="mt-8 text-3xl font-semibold text-white">{p.final.title}</h3>
              <p className="mt-2 text-muted">{p.final.text}</p>
            </div>
            <a href={waLink()} target="_blank" rel="noopener" className="btn-primary mt-8">{p.final.cta}</a>
          </Hud>
        </li>
      </ul>
    </section>
  );
}
