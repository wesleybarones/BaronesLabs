import { motion } from 'motion/react'
import { useReducedMotion } from '../lib/hooks'

/*
  Small neon sign, animated with Motion:
  1. each letter "ignites" with a short flicker, one after another;
  2. a neon arrow draws itself (pathLength) towards the photo;
  3. afterwards the sign breathes slowly and flickers briefly every few seconds.
  `arrow` = 'right' (desktop, photo on the right) or 'up' (mobile, photo above).
*/

// fixed flicker pattern per letter, so it looks organic but is identical on every visit
const FLICKERS = [
  [0, 1, 0.2, 1],
  [0, 0.7, 0.1, 1, 0.6, 1],
  [0, 1],
  [0, 0.4, 1, 0.3, 1],
  [0, 1, 0.5, 1],
]

function Letters({ text, start, show, reduce }) {
  return [...text].map((ch, i) => {
    const kf = FLICKERS[(i * 7 + text.length) % FLICKERS.length]
    return (
      <motion.span
        key={i}
        className="inline-block whitespace-pre"
        initial={{ opacity: reduce ? 1 : 0.06 }}
        animate={show ? { opacity: reduce ? 1 : kf } : {}}
        transition={{ duration: 0.45, delay: start + i * 0.055, ease: 'linear' }}
      >
        {ch}
      </motion.span>
    )
  })
}

export default function NeonSign({ lines, show, arrow = 'right', className = '' }) {
  const reduce = useReducedMotion()
  const [a, b] = lines
  const arrowDelay = 0.2 + (a.length + b.length) * 0.055 + 0.3
  const path =
    arrow === 'right'
      ? 'M4 30 C 40 34, 70 26, 96 10' // curves up-right towards the photo
      : 'M50 58 C 46 40, 54 24, 50 6' // points up at the photo
  const head = arrow === 'right' ? 'M84 6 L97 9.5 L90 21' : 'M41 15 L50 4 L59 15'

  return (
    <motion.div
      aria-label={`${a} ${b}`}
      role="img"
      className={`pointer-events-none select-none ${className}`}
      initial={{ y: 0 }}
      animate={show && !reduce ? { y: [0, -5, 0] } : {}}
      transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: arrowDelay + 1 }}
    >
      <motion.div
        className={`flex ${arrow === 'right' ? 'items-center gap-1' : 'flex-col items-center gap-2'}`}
        // brief random-looking power dip every ~7s once it's lit
        animate={show && !reduce ? { opacity: [1, 1, 0.45, 1, 0.7, 1] } : {}}
        transition={{ duration: 0.5, times: [0, 0.2, 0.35, 0.5, 0.7, 1], repeat: Infinity, repeatDelay: 6.5, delay: arrowDelay + 2 }}
      >
        {arrow === 'up' && <Arrow path={path} head={head} delay={arrowDelay} show={show} reduce={reduce} up />}
        <p aria-hidden className="neon-text -rotate-[5deg] whitespace-nowrap text-center text-[26px] leading-[0.95] lg:text-[clamp(24px,2.1vw,32px)]">
          <Letters text={a} start={0.2} show={show} reduce={reduce} />
          <br />
          <Letters text={b} start={0.2 + a.length * 0.055} show={show} reduce={reduce} />
        </p>
        {arrow === 'right' && <Arrow path={path} head={head} delay={arrowDelay} show={show} reduce={reduce} />}
      </motion.div>
    </motion.div>
  )
}

function Arrow({ path, head, delay, show, reduce, up }) {
  const draw = (d) => ({
    initial: { pathLength: reduce ? 1 : 0, opacity: reduce ? 1 : 0 },
    animate: show ? { pathLength: 1, opacity: 1 } : {},
    transition: { duration: 0.6, delay: d, ease: [0.22, 1, 0.36, 1] },
  })
  return (
    <svg
      viewBox="0 0 100 64"
      className={up ? 'h-10 w-14' : '-mb-2 h-12 w-[72px] lg:w-[84px]'}
      fill="none"
      stroke="#E9FFFF"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ filter: 'drop-shadow(0 0 3px #00F0FF) drop-shadow(0 0 8px #00F0FF) drop-shadow(-2px 0 6px rgba(224,64,216,0.5))' }}
      aria-hidden
    >
      <motion.path d={path} {...draw(delay)} />
      <motion.path d={head} {...draw(delay + 0.5)} />
    </svg>
  )
}
