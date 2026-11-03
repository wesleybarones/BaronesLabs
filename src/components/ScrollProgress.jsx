import { motion, useScroll, useSpring, useTransform } from 'motion/react'

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const p = useSpring(scrollYProgress, { stiffness: 200, damping: 30, mass: 0.3 })
  const left = useTransform(p, (v) => `${v * 100}%`)
  return (
    <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-[2px]">
      <motion.div className="h-full origin-left bg-cyan shadow-[0_0_10px_rgba(0,240,255,0.8)]" style={{ scaleX: p }} />
      <motion.span
        className="absolute top-1/2 h-[4px] w-[4px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow shadow-[0_0_8px_#FFE600]"
        style={{ left }}
      />
    </div>
  )
}
