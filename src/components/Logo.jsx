/*
  Barones Labs — marca oficial (arquivos em src/assets/brand, gerados a partir dos PNGs na raiz do repositório).
  Os paths SVG abaixo reproduzem o símbolo em traço e são usados só onde ele precisa ser "desenhado"
  (animação de boot e selo de garantia).
*/
import symbol480 from '../assets/brand/symbol-480.webp'
import symbol900 from '../assets/brand/symbol-900.webp'
import logo360 from '../assets/brand/logo-360.webp'
import logo720 from '../assets/brand/logo-720.webp'

// responsive sources: each screen downloads only the size it needs
const SYMBOL_SRCSET = `${symbol480} 480w, ${symbol900} 900w`
const LOGO_SRCSET = `${logo360} 360w, ${logo720} 720w`

export const HEX_PATH = 'M50 11 85 30.5v39L50 89 15 69.5v-39Z'
export const HEX_INNER = 'M50 17 79.8 34v33L50 83 20.2 67V34Z'
export const LB_PATH = 'M32 32v34h37M38.5 33H54a8 8 0 0 1 0 16H38.5ZM38.5 49H56a10 5.75 0 0 1 0 11.5H38.5Z'
export const DOT = { cx: 84, cy: 30.5 }

// hexagon outline of each brand file, in that file's pixels (measured on the cyan line)
const SYMBOL_HEX = 'M445.5 26 852 259v473L445.5 963 39 731V259Z'
const LOGO_HEX = 'M133.7 8 251.3 77v142L133.7 287 14.4 219V77Z'

/** Light running around the logo's hexagon (same effect as the guarantee seal). CSS-only, no JS per frame. */
function HexShine({ d, w, h, sw, c, dash }) {
  // c = hexagon centre; the dotted inner hexagon is the outline scaled to 85% and slowly rotating
  return (
    <svg aria-hidden viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid meet" className="logo-shine pointer-events-none absolute inset-0 h-full w-full overflow-visible" style={{ '--shine-w': sw }}>
      <g className="logo-inner" style={{ transformOrigin: `${c[0]}px ${c[1]}px` }}>
        <path d={d} transform={`translate(${c[0]} ${c[1]}) scale(0.85) translate(${-c[0]} ${-c[1]})`} style={{ strokeWidth: sw * 0.35, strokeDasharray: `${dash} ${dash}` }} />
      </g>
      <path d={d} pathLength="1" className="logo-shine-a" />
      <path d={d} pathLength="1" className="logo-shine-b" />
    </svg>
  )
}

export function LogoSymbol({ className = '', title, style, loading = 'lazy', sizes = '240px', shine = true }) {
  return (
    <span className={`relative block aspect-[900/990] select-none ${className}`} style={style}>
      <img
        src={symbol480}
        srcSet={SYMBOL_SRCSET}
        sizes={sizes}
        width={900}
        height={990}
        loading={loading}
        alt={title ?? ''}
        aria-hidden={title ? undefined : true}
        draggable={false}
        decoding="async"
        className="h-full w-full select-none object-contain"
      />
      {shine && <HexShine d={SYMBOL_HEX} w={900} h={990} sw={9} c={[445.5, 494.5]} dash={14} />}
    </span>
  )
}

export function LogoHorizontal({ className = '', bold = false, loading = 'eager', sizes = '160px', shine = true }) {
  return (
    <span className={`relative inline-block aspect-[720/296] h-12 w-auto select-none md:h-14 ${className}`}>
      <img
        src={logo360}
        srcSet={LOGO_SRCSET}
        sizes={sizes}
        width={720}
        height={296}
        loading={loading}
        alt="Barones Labs"
        draggable={false}
        decoding="async"
        className={`h-full w-full select-none object-contain ${bold ? '[filter:drop-shadow(0_0_5px_rgba(0,240,255,0.55))]' : ''}`}
      />
      {shine && <HexShine d={LOGO_HEX} w={720} h={296} sw={10} c={[133.7, 147.5]} dash={5} />}
    </span>
  )
}
