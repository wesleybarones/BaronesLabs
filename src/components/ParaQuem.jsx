import { paraQuem as q } from '../content/site.js';
import { Hud, Icon, SectionHead } from './ui.jsx';

export default function ParaQuem() {
  return (
    <section id="para-quem" aria-labelledby="pq-title" className="section">
      <div className="container-site">
        <SectionHead label={q.label} title={q.title} sub={q.sub} titleId="pq-title" />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {q.items.map((it, i) => (
            <li key={it.title}>
              <Hud className="h-full p-6 transition-colors hover:border-cyan/40" color={i % 2 ? '#E040D8' : '#00F0FF'}>
                <span className="grid h-11 w-11 place-items-center border border-line text-cyan">
                  <Icon name={it.icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-6 text-xl font-semibold text-white">{it.title}</h3>
                <p className="mt-2 text-muted">{it.text}</p>
              </Hud>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
