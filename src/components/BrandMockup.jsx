/**
 * Mockups gerados no estilo de cada marca (cores e fontes de `mock` em site.js).
 * Usados quando o projeto não tem prints reais (`shots`).
 * Tamanhos em unidades cqw → escala com o frame.
 */

function Art({ m, compact }) {
  const a = m.accent;
  switch (m.layout) {
    case 'jewel':
      return (
        <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden="true">
          <circle cx="50" cy="50" r="40" fill={m.soft} />
          <circle cx="50" cy="56" r="20" fill="none" stroke={a} strokeWidth="5" />
          <circle cx="50" cy="56" r="20" fill="none" stroke="#fff" strokeOpacity=".6" strokeWidth="1" />
          <path d="M50 26l7 9-7 6-7-6z" fill="#fff" stroke={a} strokeWidth="1.5" />
          <circle cx="72" cy="28" r="2" fill={a} /><circle cx="28" cy="74" r="1.5" fill={a} />
        </svg>
      );
    case 'pattern':
      return (
        <div
          className="h-full w-full"
          style={{
            backgroundColor: m.soft,
            backgroundImage: `radial-gradient(circle at 50% 50%, ${a}55 0 18%, transparent 19%), radial-gradient(circle at 0 0, ${a}33 0 12%, transparent 13%), radial-gradient(circle at 100% 100%, ${a}33 0 12%, transparent 13%), linear-gradient(45deg, transparent 46%, ${a}40 47% 53%, transparent 54%), linear-gradient(-45deg, transparent 46%, ${a}40 47% 53%, transparent 54%)`,
            backgroundSize: compact ? '22% 22%' : '18% 28%',
          }}
          aria-hidden="true"
        />
      );
    case 'barber':
      return (
        <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden="true">
          <defs>
            <linearGradient id="gold" x1="0" x2="1"><stop offset="0" stopColor="#8E6328" /><stop offset=".5" stopColor={a} /><stop offset="1" stopColor="#F1D39A" /></linearGradient>
          </defs>
          <g transform="rotate(-28 50 50)">
            <rect x="18" y="44" width="46" height="12" fill="url(#gold)" />
            <path d="M64 44h18a6 6 0 0 1 0 12H64z" fill="#2A241D" stroke={a} strokeWidth="1" />
            <rect x="18" y="44" width="46" height="2" fill="#fff" opacity=".5" />
          </g>
          <circle cx="50" cy="50" r="44" fill="none" stroke={a} strokeOpacity=".35" strokeWidth=".6" />
        </svg>
      );
    case 'naval':
      return (
        <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden="true">
          <g fill="none" stroke={a} strokeOpacity=".35" strokeWidth=".5" strokeDasharray="1.5 1.5">
            <path d="M30 70C45 50 70 40 92 38" /><path d="M30 70C50 64 70 70 92 80" /><path d="M30 70C34 52 40 30 52 14" />
          </g>
          <circle cx="30" cy="70" r="2.2" fill={a} />
          <g transform="translate(20 52)">
            <path d="M2 22h62l-8 10H10z" fill={m.soft} stroke={a} strokeWidth=".8" />
            <rect x="12" y="12" width="20" height="10" fill="#0A2A5C" stroke={a} strokeWidth=".6" />
            <rect x="34" y="6" width="10" height="16" fill="#0A2A5C" stroke={a} strokeWidth=".6" />
            <path d="M44 6l12-6M44 10l14-3" stroke={a} strokeWidth=".8" />
            <circle cx="22" cy="27" r="1" fill={a} /><circle cx="30" cy="27" r="1" fill={a} />
          </g>
        </svg>
      );
    case 'serene':
    default:
      return (
        <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden="true">
          <defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff" /><stop offset="1" stopColor={a} /></linearGradient></defs>
          <path d="M22 92V44a28 28 0 0 1 56 0v48z" fill="url(#sky)" stroke={a} strokeWidth="1.2" />
          <path d="M50 30v26M41 39h18" stroke="#fff" strokeWidth="2.6" />
          <g fill={a}>{[0, 1, 2, 3, 4, 5, 6].map((i) => <circle key={i} cx={30 + i * 6.6} cy={78 + Math.sin(i) * 2} r="1.5" />)}</g>
        </svg>
      );
  }
}

function MiniSite({ m, mobile }) {
  const heading = { fontFamily: m.headingFont, color: m.fg };
  const body = { fontFamily: m.bodyFont, color: m.fg };
  const isBarber = m.layout === 'barber';

  const Headline = (
    <p style={{ ...heading, fontSize: mobile ? '10cqw' : isBarber ? '6.4cqw' : '4.6cqw', lineHeight: 1.02, textTransform: isBarber ? 'uppercase' : 'none', letterSpacing: isBarber ? '.02em' : 0 }}>
      {m.headline}
      {m.headlineItalic && (
        <span style={{ display: 'block', fontFamily: m.italicFont, fontStyle: 'italic', textTransform: 'none', color: m.accent, fontSize: '0.8em' }}>
          {m.headlineItalic}
        </span>
      )}
    </p>
  );

  const Cta = (
    <span
      style={{
        ...body, display: 'inline-block', marginTop: mobile ? '4cqw' : '2.2cqw',
        background: isBarber || m.layout === 'pattern' ? m.accent : m.layout === 'naval' ? m.accent : m.fg,
        color: isBarber || m.layout === 'pattern' || m.layout === 'naval' ? m.bg : m.bg,
        fontSize: mobile ? '3.6cqw' : '1.5cqw', padding: mobile ? '2.4cqw 4cqw' : '1cqw 1.8cqw',
        borderRadius: m.layout === 'serene' ? '999px' : m.layout === 'jewel' ? '0' : '2px', fontWeight: 600,
      }}
    >
      {m.cta}
    </span>
  );

  return (
    <div className="flex h-full w-full flex-col" style={{ background: m.bg, containerType: 'inline-size' }}>
      {/* nav */}
      <div className="flex items-center justify-between" style={{ padding: mobile ? '4cqw 5cqw' : '1.8cqw 3cqw', borderBottom: `1px solid ${m.accent}33` }}>
        <span style={{ ...heading, fontSize: mobile ? '4.4cqw' : '1.9cqw', fontWeight: 700, letterSpacing: m.layout === 'jewel' ? '.3em' : '.04em' }}>{m.logo}</span>
        {mobile ? (
          <span style={{ width: '5cqw', height: '3cqw', borderTop: `2px solid ${m.fg}`, borderBottom: `2px solid ${m.fg}` }} />
        ) : (
          <span className="flex" style={{ gap: '2.2cqw' }}>
            {m.nav.map((n) => <span key={n} style={{ ...body, fontSize: '1.25cqw', opacity: 0.75 }}>{n}</span>)}
          </span>
        )}
      </div>
      {/* hero */}
      <div className={`flex flex-1 ${mobile ? 'flex-col' : 'flex-row items-center'}`} style={{ padding: mobile ? '6cqw 5cqw' : '3cqw' }}>
        <div style={{ flex: mobile ? 'none' : '1 1 52%' }}>
          {m.price && <span style={{ ...body, fontSize: mobile ? '3.2cqw' : '1.2cqw', color: m.accent, letterSpacing: '.18em', textTransform: 'uppercase' }}>Flix Club · {m.price}</span>}
          {Headline}
          {!mobile && <div style={{ marginTop: '1.4cqw', height: '.5cqw', width: '22cqw', background: `${m.fg}22` }} />}
          {!mobile && <div style={{ marginTop: '.8cqw', height: '.5cqw', width: '16cqw', background: `${m.fg}22` }} />}
          {Cta}
        </div>
        <div style={{ flex: mobile ? '1 1 auto' : '1 1 48%', marginTop: mobile ? '6cqw' : 0, minHeight: 0 }} className="relative">
          <Art m={m} compact={mobile} />
        </div>
      </div>
    </div>
  );
}

export function DesktopMock({ project }) {
  const { shots, mock, name } = project;
  return (
    <div className="overflow-hidden border border-white/10 bg-[#0d0f16] shadow-[0_20px_60px_-20px_rgba(0,0,0,.8)]">
      <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2" aria-hidden="true">
        <span className="h-2 w-2 rounded-full bg-white/20" /><span className="h-2 w-2 rounded-full bg-white/20" /><span className="h-2 w-2 rounded-full bg-white/20" />
        <span className="ml-3 h-3 flex-1 bg-white/5" />
      </div>
      <div className="relative aspect-[16/10]">
        {shots?.desktop ? (
          <img src={shots.desktop} alt={`Página do site ${name} no computador`} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover object-top" />
        ) : (
          <div className="absolute inset-0" role="img" aria-label={`Prévia do site ${name} no computador`}>
            <MiniSite m={mock} />
          </div>
        )}
      </div>
    </div>
  );
}

export function PhoneMock({ project }) {
  const { shots, mock, name } = project;
  return (
    <div className="rounded-[14%/6.5%] border-[3px] border-[#1d2130] bg-[#0d0f16] p-[4%] shadow-[0_20px_40px_-10px_rgba(0,0,0,.9)]">
      <div className="relative aspect-[9/19.5] overflow-hidden rounded-[10%/4.6%]">
        {shots?.mobile ? (
          <img src={shots.mobile} alt={`Página do site ${name} no celular`} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover object-top" />
        ) : (
          <div className="absolute inset-0" role="img" aria-label={`Prévia do site ${name} no celular`}>
            <MiniSite m={mock} mobile />
          </div>
        )}
      </div>
    </div>
  );
}
