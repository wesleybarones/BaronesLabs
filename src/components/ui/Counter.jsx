import { animate, useInView } from 'motion/react'
import { useEffect, useRef } from 'react'
import { useReducedMotion } from '../../lib/hooks'

/** Counts from `from` to `value` when it enters the viewport. */
export default function Counter({ value, from = 0, duration = 1.4, format = (n) => Math.round(n), once = true, className }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once, amount: 0.6 })
  const reduce = useReducedMotion()
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (reduce) {
      el.textContent = format(value)
      return
    }
    if (!inView) {
      el.textContent = format(from)
      return
    }
    const c = animate(from, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => (el.textContent = format(v)),
    })
    return () => c.stop()
  }, [inView, value, from, duration, reduce]) // eslint-disable-line
  return (
    <span ref={ref} className={className}>
      {format(reduce ? value : from)}
    </span>
  )
}
