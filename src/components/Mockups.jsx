import HudCorners from './ui/HudCorners'

/** Stylised abstract website used until real screenshots are provided. */
function ScreenPlaceholder({ accent = '#00F0FF', name = '', label = 'PREVIEW', mobile = false }) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#0A0D15]">
      <div
        className="absolute inset-0 opacity-60"
        style={{ background: `radial-gradient(120% 70% at 70% 10%, ${accent}22, transparent 60%)` }}
      />
      <div className={`relative flex h-full flex-col ${mobile ? 'gap-2 p-2.5' : 'gap-[4%] p-[5%]'}`}>
        <div className="flex items-center justify-between">
          <span className="block h-[5px] w-1/4 rounded-full" style={{ background: accent, opacity: 0.85 }} />
          {!mobile && (
            <span className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <span key={i} className="block h-[4px] w-6 rounded-full bg-white/15" />
              ))}
            </span>
          )}
        </div>
        <div className={`flex flex-1 ${mobile ? 'flex-col gap-2' : 'gap-[5%]'}`}>
          <div className={`flex flex-col justify-center gap-[7%] ${mobile ? '' : 'w-1/2'}`}>
            <span className="block h-[9%] min-h-[6px] w-[90%] rounded-sm bg-white/80" />
            <span className="block h-[9%] min-h-[6px] w-[65%] rounded-sm bg-white/80" />
            <span className="block h-[4%] min-h-[3px] w-[80%] rounded-sm bg-white/20" />
            <span className="block h-[4%] min-h-[3px] w-[60%] rounded-sm bg-white/20" />
            <span className="mt-[3%] block h-[11%] min-h-[8px] w-[38%] rounded-sm" style={{ background: accent }} />
          </div>
          <div
            className={`relative overflow-hidden rounded-sm ${mobile ? 'flex-1' : 'w-1/2'}`}
            style={{ background: `linear-gradient(140deg, ${accent}40, ${accent}08 60%)` }}
          >
            <div className="absolute inset-[18%] rotate-45 border" style={{ borderColor: `${accent}55` }} />
          </div>
        </div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="glass border border-line px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.25em] text-cyan/80 md:text-[10px]">
          {label}
          {name && !mobile ? ` · ${name.toUpperCase()}` : ''}
        </span>
      </div>
      <div className="bg-scanlines pointer-events-none absolute inset-0 opacity-60" />
    </div>
  )
}

export function Laptop({ src, alt = '', accent, name, label, className = '' }) {
  return (
    <div className={`relative ${className}`}>
      <div className="relative rounded-t-[10px] border border-white/10 bg-[#11151F] p-[2.2%] pb-[3%] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]">
        <span className="absolute left-1/2 top-[0.9%] h-[4px] w-[4px] -translate-x-1/2 rounded-full bg-white/20" />
        <div className="relative aspect-[16/10] overflow-hidden rounded-[3px] ring-1 ring-cyan/15">
          {src ? (
            <img src={src} alt={alt} width={1440} height={900} loading="lazy" decoding="async" className="h-full w-full object-cover object-top" />
          ) : (
            <ScreenPlaceholder accent={accent} name={name} label={label} />
          )}
          <HudCorners inset={6} size={12} />
        </div>
      </div>
      <div className="relative mx-[-6%] h-[10px] rounded-b-[14px] bg-gradient-to-b from-[#1B2130] to-[#0C0F16] md:h-[14px]">
        <span className="absolute left-1/2 top-0 h-[4px] w-[16%] -translate-x-1/2 rounded-b-md bg-black/50" />
      </div>
    </div>
  )
}

export function Phone({ src, alt = '', accent, name, label, className = '' }) {
  return (
    <div
      className={`relative rounded-[18%/8.5%] border border-white/12 bg-[#11151F] p-[4.5%] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.85)] ${className}`}
    >
      <div className="relative aspect-[9/19.5] overflow-hidden rounded-[14%/6.5%] ring-1 ring-cyan/15">
        {src ? (
          <img src={src} alt={alt} width={520} height={1127} loading="lazy" decoding="async" className="h-full w-full object-cover object-top" />
        ) : (
          <ScreenPlaceholder accent={accent} name={name} label={label} mobile />
        )}
        <span className="absolute left-1/2 top-[2%] h-[2.6%] w-[30%] -translate-x-1/2 rounded-full bg-black" />
      </div>
    </div>
  )
}
