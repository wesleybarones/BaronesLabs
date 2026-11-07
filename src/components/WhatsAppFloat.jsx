import { useEffect, useState } from 'react';
import { floating } from '../content/site.js';
import { waLink } from '../config.js';
import { Icon } from './ui.jsx';

/** Botão flutuante: aparece depois que o herói sai da tela. */
export default function WhatsAppFloat() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const hero = document.getElementById('top');
    if (!hero) return;
    const io = new IntersectionObserver(([e]) => setShow(!e.isIntersecting), { threshold: 0 });
    io.observe(hero);
    return () => io.disconnect();
  }, []);

  return (
    <a
      href={waLink()}
      target="_blank"
      rel="noopener"
      aria-label={`${floating.tooltip} pelo WhatsApp`}
      tabIndex={show ? 0 : -1}
      aria-hidden={show ? undefined : 'true'}
      className={`group fixed bottom-5 right-5 z-40 flex items-center transition-[opacity,transform] duration-300 ${
        show ? 'opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
      }`}
    >
      <span className="mr-3 hidden border border-line bg-bg/90 px-3 py-1.5 font-mono text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 md:block">
        {floating.tooltip}
      </span>
      <span className="grid h-14 w-14 place-items-center bg-cyan text-bg shadow-[0_0_0_1px_#00F0FF,0_0_28px_rgba(0,240,255,.5)]">
        <Icon name="whatsapp" className="h-7 w-7" />
      </span>
    </a>
  );
}
