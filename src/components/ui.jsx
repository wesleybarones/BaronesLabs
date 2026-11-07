import { Fragment } from 'react';

/**
 * Renderiza um título aplicando a convenção *destaque*.
 * Cada palavra destacada vira um <span class="hl"> próprio (quebra bem no mobile).
 */
export function RichTitle({ text, as: Tag = 'h2', className = 'h-section', id }) {
  const parts = text.split(/(\*[^*]+\*)/g).filter(Boolean);
  return (
    <Tag id={id} className={className}>
      {parts.map((part, i) => {
        if (part.startsWith('*') && part.endsWith('*')) {
          const words = part.slice(1, -1).split(' ');
          return (
            <Fragment key={i}>
              {words.map((w, j) => (
                <Fragment key={j}>
                  <span className="hl" data-text={w}>{w}</span>
                  {j < words.length - 1 ? ' ' : ''}
                </Fragment>
              ))}
            </Fragment>
          );
        }
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </Tag>
  );
}

/** Texto puro (sem asteriscos) — útil para aria-label e SEO. */
export const plain = (t) => t.replace(/\*/g, '');

export function SectionLabel({ children, className = '' }) {
  return <p className={`label-mono mb-4 ${className}`}>{children}</p>;
}

export function SectionHead({ label, title, sub, center = false, titleId }) {
  return (
    <header className={`mb-12 md:mb-16 max-w-3xl ${center ? 'mx-auto text-center' : ''}`}>
      <SectionLabel>{label}</SectionLabel>
      <RichTitle text={title} id={titleId} />
      {sub && <p className="sub mt-5">{sub}</p>}
    </header>
  );
}

export function Hud({ as: Tag = 'div', className = '', children, color, ...rest }) {
  return (
    <Tag className={`hud ${className}`} style={color ? { '--c': color } : undefined} {...rest}>
      <span className="hud-c" aria-hidden="true" />
      {children}
    </Tag>
  );
}

export function Stars({ n = 5, className = '' }) {
  return (
    <span className={`star tracking-[0.15em] ${className}`} aria-label={`${n} de 5 estrelas`} role="img">
      {'★'.repeat(n)}
    </span>
  );
}

/* ----------------------------- Ícones ----------------------------- */
const base = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'square', strokeLinejoin: 'miter' };

export function Icon({ name, className = 'h-5 w-5' }) {
  const p = {
    whatsapp: (
      <path fill="currentColor" stroke="none" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.5 0-3-.4-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.7.3-.2.3-.9.9-.9 2.2s.9 2.5 1 2.7c.1.2 1.8 2.8 4.4 3.9 1.6.7 2.3.8 3.1.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z" />
    ),
    arrowRight: <path {...base} d="M4 12h15M13 6l6 6-6 6" />,
    arrowLeft: <path {...base} d="M20 12H5M11 6l-6 6 6 6" />,
    arrowDown: <path {...base} d="M12 4v15M6 13l6 6 6-6" />,
    check: <path {...base} strokeWidth={2} d="M4 12.5l5 5L20 6.5" />,
    plus: <path {...base} d="M12 5v14M5 12h14" />,
    external: <path {...base} d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6" />,
    instagram: (
      <g {...base}>
        <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.3" cy="6.7" r=".6" fill="currentColor" />
      </g>
    ),
    briefcase: <g {...base}><path d="M3 8h18v12H3zM8 8V5h8v3M3 13h18" /></g>,
    scissors: <g {...base}><circle cx="6" cy="7" r="3" /><circle cx="6" cy="17" r="3" /><path d="M8.5 8.5 20 18M8.5 15.5 20 6" /></g>,
    rocket: <g {...base}><path d="M14 4c3 0 6 1 6 1s1 3 1 6c-2 3-6 7-9 8l-4-4c1-3 5-7 6-11ZM9 15l-3 3M6 13l-3-1 3-3h4M11 18l1 3 3-3v-4" /></g>,
    utensils: <g {...base}><path d="M6 3v8M4 3v5a2 2 0 0 0 4 0V3M6 11v10M16 3c-2 1-3 4-3 7h3v11" /></g>,
    shield: <g {...base}><path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z" /><path d="m8.5 12 2.5 2.5 4.5-5" /></g>,
    menu: <path {...base} d="M3 7h18M3 12h18M3 17h18" />,
    close: <path {...base} d="M5 5l14 14M19 5 5 19" />,
    globe: <g {...base}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" /></g>,
    lock: <g {...base}><rect x="5" y="11" width="14" height="10" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></g>,
  }[name];
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      {p}
    </svg>
  );
}
