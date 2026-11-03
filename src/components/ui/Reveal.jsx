import { motion } from 'motion/react'
import { useApp } from '../../lib/AppContext'
import { EASE } from '../../lib/motion'

/**
 * Directional reveal: enters from below when scrolling down, from above when scrolling up.
 * once=false re-animates on return (narrative sections); once=true for reading sections.
 */
export default function Reveal({
  as = 'div',
  children,
  delay = 0,
  distance = 36,
  once = false,
  amount = 0.3,
  className,
  blur = false,
  ...rest
}) {
  const { dir } = useApp()
  const M = motion[as] ?? motion.div
  return (
    <M
      className={className}
      custom={dir}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      variants={{
        hidden: (d) => ({ opacity: 0, y: distance * (d || 1), filter: blur ? 'blur(8px)' : 'blur(0px)' }),
        show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.75, ease: EASE, delay } },
      }}
      {...rest}
    >
      {children}
    </M>
  )
}

export function Stagger({ as = 'div', children, className, once = false, amount = 0.25, stagger = 0.08, delay = 0, ...rest }) {
  const M = motion[as] ?? motion.div
  return (
    <M
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
      {...rest}
    >
      {children}
    </M>
  )
}

export function StaggerItem({ as = 'div', children, className, distance = 28, ...rest }) {
  const { dir } = useApp()
  const M = motion[as] ?? motion.div
  return (
    <M
      className={className}
      custom={dir}
      variants={{
        hidden: (d) => ({ opacity: 0, y: distance * (d || 1) }),
        show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
      }}
      {...rest}
    >
      {children}
    </M>
  )
}
