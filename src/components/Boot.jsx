import { motion } from 'motion/react'
import { useEffect, useMemo } from 'react'
import { useLang } from '../i18n/LangContext'
import { EASE } from '../lib/motion'
import { LogoHorizontal } from './Logo'

/*
  Abertura (≈2,8s, uma vez por sessão; "pular" ou Esc encerram):
  1. um ponto de luz se acende no centro e cresce;
  2. explode em dezenas de LEDs que voam para fora, com flash e onda de choque;
  3. o logo oficial surge do clarão, piscando como neon ligando;
  4. a tela se abre num corte horizontal e o site aparece.
*/
const T = {
  core: 0.15, // point of light appears
  burst: 0.55, // explosion
  logo: 0.85, // logo ignites
  mount: 1.65, // site content mounts behind the logo
  open: 2.25, // screen splits open
  done: 2.75,
}

function rng(seed) {
  return () => {
    seed = (seed * 16807) % 2147483647
    return (seed - 1) / 2147483646
  }
}

export default function Boot({ onDone, onMountSite, onReveal }) {
  const { t } = useLang()

  useEffect(() => {
    const id = setTimeout(onDone, T.done * 1000)
    // the site mounts while the logo is on screen, so the explosion runs on a free main thread
    const mount = setTimeout(() => onMountSite?.(), T.mount * 1000)
    // the hero starts its entrance while the screen is still splitting open
    const reveal = setTimeout(() => onReveal?.(), T.open * 1000)
    const key = (e) => e.key === 'Escape' && onDone()
    window.addEventListener('keydown', key)
    return () => {
      clearTimeout(id)
      clearTimeout(mount)
      clearTimeout(reveal)
      window.removeEventListener('keydown', key)
    }
  }, [onDone, onMountSite, onReveal])

  // LED particles: direction, distance and colour fixed per visit
  const leds = useMemo(() => {
    const r = rng(2026)
    const reach = Math.max(window.innerWidth, window.innerHeight) * 0.62
    return Array.from({ length: window.innerWidth < 768 ? 60 : 110 }, () => {
      const ang = r() * Math.PI * 2
      const dist = reach * (0.2 + r() * 0.8)
      const pick = r()
      const size = 3 + Math.round(r() * 5)
      return {
        x: Math.cos(ang) * dist,
        y: Math.sin(ang) * dist,
        rot: (ang * 180) / Math.PI,
        size,
        streak: r() < 0.6 ? size * (3 + r() * 5) : size, // most LEDs leave a light trail
        color: pick < 0.7 ? '#00F0FF' : pick < 0.9 ? '#E040D8' : '#7CFFC4',
        delay: T.burst + r() * 0.1,
        dur: 0.9 + r() * 0.7,
      }
    })
  }, [])

  const half = { transition: { duration: 0.42, ease: [0.7, 0, 0.3, 1], delay: T.open } }

  return (
    <motion.div className="fixed inset-0 z-[200] overflow-hidden" exit={{ opacity: 0, transition: { duration: 0.2 } }} aria-live="polite" aria-label="Barones Labs">
      {/* the two halves of the screen that split apart at the end */}
      <motion.div className="absolute inset-x-0 top-0 h-1/2 bg-bg" {...half} animate={{ y: '-100%' }} />
      <motion.div className="absolute inset-x-0 bottom-0 h-1/2 bg-bg" {...half} animate={{ y: '100%' }} />
      <motion.div
        className="absolute inset-x-0 top-1/2 h-px bg-cyan shadow-[0_0_20px_#00F0FF]"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: [0, 1, 1], opacity: [0, 1, 0] }}
        transition={{ duration: 0.55, times: [0, 0.5, 1], delay: T.open - 0.25, ease: EASE }}
      />

      {/* everything inside fades just before the split */}
      <motion.div
        className="absolute inset-0"
        animate={{ opacity: [1, 1, 0] }}
        transition={{ duration: T.open + 0.15, times: [0, (T.open - 0.15) / (T.open + 0.15), 1] }}
      >
        <div className="absolute left-1/2 top-1/2">
          {/* 1. point of light */}
          <motion.span
            className="absolute -left-2 -top-2 h-4 w-4 rounded-full bg-white shadow-[0_0_20px_6px_#00F0FF,0_0_60px_20px_rgba(0,240,255,0.6)]"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 0.6, 1.4, 3, 0], opacity: [0, 1, 1, 1, 0] }}
            transition={{ duration: T.burst + 0.3 - T.core, times: [0, 0.3, 0.7, 0.85, 1], delay: T.core, ease: 'easeIn' }}
          />
          {/* 2a. shockwave rings */}
          {[0, 0.12].map((d) => (
            <motion.span
              key={d}
              className="absolute left-0 top-0 h-[40px] w-[40px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-cyan shadow-[0_0_24px_#00F0FF,inset_0_0_18px_rgba(0,240,255,0.6)]"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0.2, 26], opacity: [1, 0] }}
              transition={{ duration: 1.1, delay: T.burst + d, ease: [0.16, 1, 0.3, 1] }}
            />
          ))}
          {/* 2b. LEDs flying out */}
          {leds.map((l, i) => (
            <motion.span
              key={i}
              className="absolute left-0 top-0"
              style={{ x: 0, y: 0 }}
              initial={{ x: 0, y: 0, opacity: 0 }}
              animate={{ x: l.x, y: l.y, opacity: [0, 1, 1, 0] }}
              transition={{ duration: l.dur, delay: l.delay, ease: [0.12, 0.9, 0.3, 1], times: [0, 0.1, 0.6, 1] }}
            >
              <motion.span
                className="block rounded-full"
                style={{
                  width: l.streak,
                  height: l.size,
                  marginLeft: -l.streak / 2,
                  marginTop: -l.size / 2,
                  rotate: l.rot,
                  background: `linear-gradient(90deg, transparent, ${l.color} 60%, #fff)`,
                  boxShadow: `0 0 ${l.size * 2}px ${l.color}, 0 0 ${l.size * 5}px ${l.color}`,
                }}
                initial={{ scaleX: 0.3 }}
                animate={{ scaleX: [0.3, 1.6, 0.5] }}
                transition={{ duration: l.dur, delay: l.delay, ease: 'easeOut' }}
              />
            </motion.span>
          ))}
        </div>

        {/* 2c. flash */}
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(220,255,255,0.9),rgba(0,240,255,0.35)_25%,transparent_60%)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 0.6, delay: T.burst, times: [0, 0.15, 1] }}
        />

        {/* 3. the logo ignites out of the flash */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
          <div className="relative isolate">
            {/* glow behind the logo (no CSS filter on the image itself) */}
            <motion.span
              aria-hidden
              className="absolute -inset-x-16 -inset-y-10 -z-10 rounded-full bg-[radial-gradient(closest-side,rgba(0,240,255,0.32),transparent)]"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: [0, 1, 0.55], scale: [0.6, 1.1, 1] }}
              transition={{ duration: 1.1, delay: T.logo, ease: EASE }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: [0, 1, 0.2, 1, 0.55, 1], scale: 1 }}
              transition={{
                opacity: { duration: 0.7, delay: T.logo, times: [0, 0.2, 0.35, 0.5, 0.7, 1] },
                scale: { duration: 1.2, delay: T.logo, ease: EASE },
              }}
            >
              <LogoHorizontal className="!h-24 sm:!h-32 md:!h-44" sizes="(min-width: 768px) 430px, 240px" />
            </motion.div>
          </div>
          <motion.span
            className="hud mt-6 text-[11px]"
            initial={{ opacity: 0, letterSpacing: '0.6em' }}
            animate={{ opacity: 1, letterSpacing: '0.18em' }}
            transition={{ duration: 0.7, delay: T.logo + 0.45, ease: EASE }}
          >
            {t.boot.loading}
            <span className="text-yellow">_</span>
          </motion.span>
        </div>
      </motion.div>

      <button
        type="button"
        onClick={onDone}
        className="hud absolute bottom-6 right-6 z-10 px-3 py-2 text-ink-3 transition-colors hover:text-cyan"
      >
        {t.boot.skip} →
      </button>
    </motion.div>
  )
}
