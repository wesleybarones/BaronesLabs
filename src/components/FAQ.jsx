import { useState } from 'react';
import { faq as f } from '../content/site.js';
import { Icon, SectionHead } from './ui.jsx';

export default function FAQ() {
  const [open, setOpen] = useState(null);
  return (
    <section id="faq" aria-labelledby="faq-title" className="section">
      <div className="container-site grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <SectionHead label={f.label} title={f.title} titleId="faq-title" />
        <ul className="border-t border-line">
          {f.items.map((it, i) => {
            const isOpen = open === i;
            return (
              <li key={it.q} className="border-b border-line">
                <h3>
                  <button
                    type="button"
                    id={`faq-q-${i}`}
                    aria-expanded={isOpen}
                    aria-controls={`faq-a-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-6 py-5 text-left font-display text-lg font-semibold text-white transition-colors hover:text-cyan md:text-xl"
                  >
                    {it.q}
                    <span className={`grid h-8 w-8 shrink-0 place-items-center border border-line text-cyan transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}>
                      <Icon name="plus" className="h-4 w-4" />
                    </span>
                  </button>
                </h3>
                <div
                  id={`faq-a-${i}`}
                  role="region"
                  aria-labelledby={`faq-q-${i}`}
                  className="grid transition-[grid-template-rows] duration-300 ease-out"
                  style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
                >
                  <div className="overflow-hidden" inert={isOpen ? undefined : ''}>
                    <p className="pb-6 pr-12 text-muted">{it.a}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
