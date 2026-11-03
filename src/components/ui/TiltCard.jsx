import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import { useRef } from 'react'
import { useFinePointer, useReducedMotion } from '../../lib/hooks'

/** 3D tilt (max `max` deg) + radial spotlight following the pointer. */
export default function TiltCard({ children, className = '', max = 6, style, as = 'div', ...rest }) {
  const ref = useRef(null)
  const fine = useFinePointer()
  const reduce = useReducedMotion()
  const on = fine && !reduce
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const rx = useSpring(useTransform(py, [0, 1], [max, -max]), { stiffness: 160, damping: 20 })
  const ry = useSpring(useTransform(px, [0, 1], [-max, max]), { stiffness: 160, damping: 20 })
  const M = motion[as]

  const move = (e) => {
    if (!on) return
    const r = ref.current.getBoundingClientRect()
    const nx = (e.clientX - r.left) / r.width
    const ny = (e.clientY - r.top) / r.height
    px.set(nx)
    py.set(ny)
    ref.current.style.setProperty('--mx', `${nx * 100}%`)
    ref.current.style.setProperty('--my', `${ny * 100}%`)
  }
  const leave = () => {
    px.set(0.5)
    py.set(0.5)
  }
  return (
    <M
      ref={ref}
      onPointerMove={move}
      onPointerLeave={leave}
      style={on ? { rotateX: rx, rotateY: ry, transformPerspective: 900, ...style } : style}
      className={`group relative ${className}`}
      {...rest}
    >
      {children}
      {on && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: 'radial-gradient(420px circle at var(--mx,50%) var(--my,50%), rgba(0,240,255,0.10), transparent 45%)',
          }}
        />
      )}
    </M>
  )
}
