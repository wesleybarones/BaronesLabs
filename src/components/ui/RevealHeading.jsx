import { motion } from 'motion/react'
import { Fragment } from 'react'
import { EASE } from '../../lib/motion'

/** Parse "Sites que dizem *uau*." → [{w:'Sites'},...,{w:'uau',hl:true,tail:'.'}] */
export function parseWords(text) {
  const out = []
  let inHl = false
  for (const raw of text.split(' ')) {
    let w = raw
    let starts = false
    if (w.startsWith('*')) {
      inHl = true
      starts = true
      w = w.slice(1)
    }
    const end = w.indexOf('*')
    if (inHl && end !== -1) {
      out.push({ w: w.slice(0, end), tail: w.slice(end + 1), hl: true, first: starts })
      inHl = false
    } else {
      out.push({ w, hl: inHl, first: starts })
    }
  }
  return out
}

/** Plain render (no animation) of the *highlight* syntax */
export function Rich({ text, glitch = false }) {
  return parseWords(text).map((p, i) => (
    <Fragment key={i}>
      {i > 0 && ' '}
      {p.hl ? (
        <span className={`hl ${glitch ? 'glitch glitch-periodic' : ''}`} data-text={p.w}>
          {p.w}
        </span>
      ) : (
        p.w
      )}
      {p.tail}
    </Fragment>
  ))
}

/**
 * Word-by-word masked reveal (bottom → top), stagger 60ms.
 * `animate` (controlled) overrides whileInView — used by the hero after boot.
 */
export default function RevealHeading({
  as = 'h2',
  text,
  className = 'h2',
  glitch = false,
  once = false,
  amount = 0.5,
  delay = 0,
  animate,
  stagger = 0.06,
  id,
  kicker, // optional visible lead-in inside the heading (e.g. the page's keyword for SEO)
  kickerClassName = '',
  kickerId,
}) {
  const M = motion[as]
  const words = parseWords(text)
  const ctl =
    animate !== undefined
      ? { initial: 'hidden', animate: animate ? 'show' : 'hidden' }
      : { initial: 'hidden', whileInView: 'show', viewport: { once, amount } }
  return (
    <M
      id={id}
      className={className}
      {...ctl}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
    >
      {/* one single copy of the text (no sr-only duplicate), so search engines read the heading once */}
      {kicker && (
        <motion.span
          id={kickerId}
          className={`block ${kickerClassName}`}
          variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } } }}
        >
          {kicker}
          <span className="sr-only">: </span>
        </motion.span>
      )}
      <span>
        {words.map((p, i) => (
          <Fragment key={i}>
            <span className="-mb-[0.14em] -ml-[0.06em] inline-block overflow-hidden pb-[0.14em] pl-[0.06em] align-bottom">
              <motion.span
                className="inline-block will-change-transform"
                // the mask (overflow-hidden parent) hides the word; no opacity fade, so headings count as painted early (LCP)
                variants={{
                  hidden: { y: '115%' },
                  show: { y: '0%', transition: { duration: 0.8, ease: EASE } },
                }}
              >
                {p.hl ? (
                  <span className={`hl ${glitch ? 'glitch glitch-periodic' : ''}`} data-text={p.w}>
                    {p.w}
                  </span>
                ) : (
                  p.w
                )}
                {p.tail}
              </motion.span>
            </span>
            {i < words.length - 1 && ' '}
          </Fragment>
        ))}
      </span>
    </M>
  )
}
