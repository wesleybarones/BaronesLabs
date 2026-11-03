import { motion } from 'motion/react'
import { useReducedMotion } from '../lib/hooks'
import { LogoHorizontal } from './Logo'

/**
 * Footer logo with Motion: a scan line "prints" it in when it enters the screen,
 * then a soft neon light breathes behind it; on hover it does a short glitch.
 *
 * The in-view trigger lives on an outer wrapper that is never clipped: an element that
 * starts fully clipped (clip-path) is not reported as visible, so it would never reveal.
 */
export default function FooterLogo() {
  const reduce = useReducedMotion()
  const ease = [0.22, 1, 0.36, 1]
  return (
    <motion.div
      className="relative isolate inline-block"
      initial={reduce ? 'show' : 'hidden'}
      whileInView="show"
      viewport={{ once: true, amount: 0.1 }}
      whileHover={reduce ? undefined : { x: [0, -3, 3, -1, 0], skewX: [0, -6, 4, 0], transition: { duration: 0.3 } }}
    >
      {/* breathing neon light behind the logo (no CSS filter on the image) */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute -inset-x-6 -inset-y-4 -z-10 rounded-full bg-[radial-gradient(closest-side,rgba(0,240,255,0.22),transparent)] blur-md"
        animate={reduce ? { opacity: 0.6 } : { opacity: [0.25, 0.9, 0.25], scale: [0.96, 1.04, 0.96] }}
        transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
      />
      <motion.div
        variants={{
          hidden: { clipPath: 'inset(0 100% 0 0)', opacity: 0.4 },
          show: { clipPath: 'inset(0 0% 0 0)', opacity: 1, transition: { duration: 1.1, ease } },
        }}
      >
        <LogoHorizontal className="relative !h-16 md:!h-20" loading="lazy" sizes="200px" />
      </motion.div>
      {!reduce && (
        <motion.span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 w-[2px] bg-cyan shadow-[0_0_14px_#00F0FF]"
          variants={{
            hidden: { left: '0%', opacity: 0 },
            show: { left: ['0%', '100%'], opacity: [0, 1, 1, 0], transition: { duration: 1.1, ease } },
          }}
        />
      )}
    </motion.div>
  )
}
