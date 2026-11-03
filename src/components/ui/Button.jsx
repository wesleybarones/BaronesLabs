import { motion, useMotionValue, useSpring } from 'motion/react'
import { useRef, useState } from 'react'
import { useFinePointer, useReducedMotion } from '../../lib/hooks'

/**
 * Chamfered CTA with:
 * - magnetic pull (max 10px) on fine pointers
 * - fill sweep left→right + stronger glow + magenta border offset on hover
 * - tap: scale .96 + quick cyan flash
 */
export default function Button({
  href,
  onClick,
  children,
  variant = 'primary',
  size = 'md',
  magnetic = false,
  icon,
  className = '',
  full = false,
  external,
  onHoverChange,
  ...rest
}) {
  const ref = useRef(null)
  const fine = useFinePointer()
  const reduce = useReducedMotion()
  const canMag = magnetic && fine && !reduce
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 170, damping: 18, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 170, damping: 18, mass: 0.4 })
  const [flash, setFlash] = useState(0)

  const move = (e) => {
    if (!canMag || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    const dx = e.clientX - (r.left + r.width / 2)
    const dy = e.clientY - (r.top + r.height / 2)
    x.set(Math.max(-10, Math.min(10, dx * 0.25)))
    y.set(Math.max(-10, Math.min(10, dy * 0.35)))
  }
  const leave = () => {
    x.set(0)
    y.set(0)
    onHoverChange?.(false)
  }

  const isExt = external ?? (href && /^https?:/.test(href))
  const sizes = {
    md: 'min-h-12 px-6 text-[15px]',
    lg: 'min-h-14 px-8 text-[16px]',
    xl: 'min-h-16 px-10 text-[17px] md:min-h-[72px] md:px-12 md:text-[18px]',
  }
  const primary = variant === 'primary'

  return (
    <motion.a
      ref={ref}
      href={href}
      onClick={(e) => {
        setFlash((f) => f + 1)
        onClick?.(e)
      }}
      target={isExt ? '_blank' : undefined}
      rel={isExt ? 'noopener noreferrer' : undefined}
      onPointerMove={move}
      onPointerEnter={() => onHoverChange?.(true)}
      onPointerLeave={leave}
      onFocus={() => onHoverChange?.(true)}
      onBlur={() => onHoverChange?.(false)}
      whileTap={{ scale: 0.96 }}
      style={{ x: sx, y: sy }}
      data-cursor
      className={`group relative inline-flex select-none ${full ? 'w-full' : ''} ${
        primary
          ? '[filter:drop-shadow(0_0_14px_rgba(0,240,255,0.35))] hover:[filter:drop-shadow(0_0_26px_rgba(0,240,255,0.6))_drop-shadow(0_0_1px_#00F0FF)]'
          : ''
      } transition-[filter] duration-500 ${className}`}
      {...rest}
    >
      {/* magenta offset border (chromatic shadow) */}
      <span
        aria-hidden
        className={`chamfer absolute inset-0 transition-transform duration-300 ease-out-expo ${
          primary ? 'bg-magenta opacity-0 group-hover:opacity-100' : 'bg-magenta/0 group-hover:bg-magenta/70'
        } group-hover:translate-x-[3px] group-hover:translate-y-[2px]`}
      />
      {primary ? (
        <span
          className={`chamfer btn-sweep relative inline-flex w-full items-center justify-center gap-3 bg-cyan font-display font-semibold uppercase tracking-[0.08em] text-bg ${sizes[size]}`}
        >
          {children}
          {icon && <span className="transition-transform duration-300 group-hover:translate-x-1">{icon}</span>}
        </span>
      ) : (
        <span className="chamfer relative inline-flex w-full bg-cyan/45 p-px transition-colors duration-300 group-hover:bg-cyan">
          <span
            className={`chamfer btn-sweep relative inline-flex w-full items-center justify-center gap-3 bg-bg font-display font-semibold uppercase tracking-[0.08em] text-cyan [--cyan-sweep:rgba(0,240,255,0.12)] ${sizes[size]}`}
            style={{ '--chamfer': '13px' }}
          >
            {children}
            {icon && <span className="transition-transform duration-300 group-hover:translate-y-0.5">{icon}</span>}
          </span>
        </span>
      )}
      {/* click flash */}
      {flash > 0 && (
        <motion.span
          key={flash}
          aria-hidden
          className="chamfer pointer-events-none absolute inset-0 bg-white mix-blend-overlay"
          initial={{ opacity: 0.85 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        />
      )}
    </motion.a>
  )
}
