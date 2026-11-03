/*
  Barones Labs — marca oficial (arquivos em src/assets/brand, gerados a partir dos PNGs na raiz do repositório).
  Os paths SVG abaixo reproduzem o símbolo em traço e são usados só onde ele precisa ser "desenhado"
  (animação de boot e selo de garantia).
*/
import symbolSrc from '../assets/brand/symbol.webp'
import logoSrc from '../assets/brand/logo.webp'

export const HEX_PATH = 'M50 11 85 30.5v39L50 89 15 69.5v-39Z'
export const HEX_INNER = 'M50 17 79.8 34v33L50 83 20.2 67V34Z'
export const LB_PATH = 'M32 32v34h37M38.5 33H54a8 8 0 0 1 0 16H38.5ZM38.5 49H56a10 5.75 0 0 1 0 11.5H38.5Z'
export const DOT = { cx: 84, cy: 30.5 }

export function LogoSymbol({ className = '', title, style, loading = 'lazy' }) {
  return (
    <img
      src={symbolSrc}
      width={900}
      height={990}
      loading={loading}
      alt={title ?? ''}
      aria-hidden={title ? undefined : true}
      draggable={false}
      decoding="async"
      className={`select-none object-contain ${className}`}
      style={style}
    />
  )
}

export function LogoHorizontal({ className = '', bold = false, loading = 'eager' }) {
  return (
    <img
      src={logoSrc}
      width={720}
      height={296}
      loading={loading}
      alt="Barones Labs"
      draggable={false}
      decoding="async"
      className={`h-12 w-auto select-none object-contain md:h-14 ${
        bold ? '[filter:drop-shadow(0_0_5px_rgba(0,240,255,0.55))]' : ''
      } ${className}`}
    />
  )
}
