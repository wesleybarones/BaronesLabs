import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'motion/react'
import { useRef } from 'react'
import { useLang } from '../i18n/LangContext'
import { scrollToId, useApp } from '../lib/AppContext'
import { useFinePointer, useIsDesktop, useReducedMotion } from '../lib/hooks'
import { EASE } from '../lib/motion'
import { waLink } from '../config'
import RevealHeading from '../components/ui/RevealHeading'
import Button from '../components/ui/Button'
import { LogoSymbol } from '../components/Logo'
import { ABOUT_PHOTO } from '../config'

// Avatar do hero: usa src/assets/wesley-avatar.webp quando existir; senão, cai na foto padrão.
const avatarFiles = import.meta.glob('../assets/wesley-avatar.webp', { eager: true, import: 'default' })
const AVATAR = Object.values(avatarFiles)[0] ?? ABOUT_PHOTO
import { IconArrow, IconArrowDown } from '../components/Icons'
import HudCorners from '../components/ui/HudCorners'
import NeonSign from '../components/NeonSign'

function Chip({ children, className = '', style }) {
  return (
    <motion.span
      style={style}
      className={`glass absolute flex items-center gap-2 border border-line px-3 py-1.5 font-mono text-[10px] tracking-[0.2em] text-cyan shadow-[0_0_20px_rgba(0,240,255,0.12)] md:text-[11px] ${className}`}
    >
      <span className="h-1 w-1 bg-cyan" />
      {children}
    </motion.span>
  )
}

export default function Hero() {
  const { t } = useLang()
  const { ready, lenis } = useApp()
  const ref = useRef(null)
  const fine = useFinePointer()
  const desktop = useIsDesktop()
  const reduce = useReducedMotion()
  const parallax = fine && !reduce

  // cursor parallax (3 depths, max 12px)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 120, damping: 20 })
  const sy = useSpring(my, { stiffness: 120, damping: 20 })
  const d1x = useTransform(sx, (v) => v * 4)
  const d1y = useTransform(sy, (v) => v * 4)
  const d2x = useTransform(sx, (v) => v * -8)
  const d2y = useTransform(sy, (v) => v * -8)
  const d3x = useTransform(sx, (v) => v * 12)
  const d3y = useTransform(sy, (v) => v * 12)

  const onMove = (e) => {
    if (!parallax) return
    const r = ref.current.getBoundingClientRect()
    mx.set(((e.clientX - r.left) / r.width - 0.5) * 2)
    my.set(((e.clientY - r.top) / r.height - 0.5) * 2)
  }

  // scroll-linked: mockups rise slower than text, hex rotates
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const textY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -60])
  const textO = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const mockY = useTransform(scrollYProgress, [0, 1], [0, reduce || !desktop ? 0 : 140])
  const hexRot = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 40])

  const show = ready

  return (
    <section
      id="top"
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={() => {
        mx.set(0)
        my.set(0)
      }}
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden pt-[72px]"
    >
      {/* background: sliding perspective grid + glows */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-x-[-20%] bottom-[-10%] top-[55%] overflow-hidden">
          <div className="perspective-floor absolute inset-x-0 top-0 h-[200%]" />
        </div>
        <div className="absolute right-[-10%] top-[10%] h-[70vmax] w-[70vmax] rounded-full bg-[radial-gradient(circle,rgba(0,240,255,0.10),transparent_60%)]" />
        <div className="absolute left-[-20%] top-[40%] h-[50vmax] w-[50vmax] rounded-full bg-[radial-gradient(circle,rgba(224,64,216,0.06),transparent_60%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-bg to-transparent" />
      </div>

      {/* HUD frame (desktop) */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-x-6 bottom-6 top-[96px] hidden min-[1400px]:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: show ? 1 : 0 }}
        transition={{ duration: 1, delay: 0.9 }}
      >
        <HudCorners size={22} />
        <span className="hud absolute left-8 top-0 text-[11px] text-ink-3">{t.hero.coords}</span>
        <span className="hud absolute right-8 top-0 text-[11px] text-ink-3">SYS.V2.6 // BL-HQ</span>
        <span className="hud absolute bottom-0 left-8 text-[11px] text-ink-3">00 · HOME</span>
      </motion.div>

      <div className="mx-auto grid w-full max-w-[1360px] flex-1 grid-cols-1 items-center gap-12 px-4 pb-16 pt-10 md:px-8 lg:grid-cols-12 lg:gap-8 lg:pb-24 lg:pt-6">
        {/* TEXT */}
        <motion.div className="relative z-10 lg:col-span-7" style={{ y: textY, opacity: textO }}>
          <motion.p
            className="hud mb-7 inline-flex items-center gap-3 border border-line bg-surface/50 px-3.5 py-2 backdrop-blur"
            initial={{ opacity: 0, y: 12 }}
            animate={show ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <span className="live-dot" aria-hidden />
            {t.hero.status}
          </motion.p>

          <RevealHeading as="h1" text={t.hero.title} className="h1 max-w-[13ch] text-ink" glitch animate={show} delay={0.1} />

          <motion.p
            className="lead mt-7 max-w-[540px]"
            initial={{ opacity: 0, y: 16 }}
            animate={show ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE, delay: 0.55 }}
          >
            {t.hero.sub}
          </motion.p>

          <motion.div
            className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center"
            initial={{ opacity: 0, y: 16 }}
            animate={show ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: EASE, delay: 0.7 }}
          >
            <Button href={waLink(t.wa.default)} size="lg" magnetic icon={<IconArrow className="h-5 w-5" />} className="w-full sm:w-auto">
              {t.hero.cta}
            </Button>
            <Button
              href="#portfolio"
              variant="ghost"
              size="lg"
              className="w-full sm:w-auto"
              icon={<IconArrowDown className="h-4 w-4" />}
              onClick={(e) => {
                e.preventDefault()
                scrollToId('portfolio', lenis)
              }}
            >
              {t.hero.secondary}
            </Button>
          </motion.div>

          <motion.ul
            className="mt-8 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-2 md:text-[12px]"
            initial={{ opacity: 0 }}
            animate={show ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            {t.hero.proof.map((p, i) => (
              <li key={p} className="flex items-center gap-5">
                {i > 0 && <span aria-hidden className="hidden text-cyan/50 sm:inline">·</span>}
                {p}
              </li>
            ))}
          </motion.ul>
        </motion.div>

        {/* VISUAL */}
        <motion.div
          className="relative mx-auto w-full max-w-[420px] px-4 sm:max-w-[480px] lg:col-span-5 lg:max-w-none lg:px-6"
          style={{ y: mockY }}
          initial={{ opacity: 0, scale: 0.94, filter: 'blur(14px)' }}
          animate={show ? { opacity: 1, scale: 1, filter: 'blur(0px)' } : {}}
          transition={{ duration: 1.1, ease: EASE, delay: 0.75 }}
        >
          <div className="relative mx-auto aspect-[4/5] w-full max-w-[560px]">
            {/* hex watermark (depth 1) */}
            <motion.div
              aria-hidden
              className="absolute inset-[-14%] opacity-[0.16]"
              style={{ x: d1x, y: d1y, rotate: hexRot }}
            >
              <LogoSymbol className="h-full w-full" />
            </motion.div>
            <div aria-hidden className="absolute inset-[8%] rounded-full bg-[radial-gradient(circle,rgba(0,240,255,0.20),transparent_65%)] blur-2xl" />

            {/* avatar (depth 2) */}
            <motion.figure className="group absolute inset-0" style={{ x: d2x, y: d2y }}>
              <div aria-hidden className="absolute inset-0 translate-x-[-6px] translate-y-[4px] border border-magenta/50" />
              <div className="relative h-full w-full overflow-hidden border border-cyan/70 shadow-[0_0_40px_rgba(0,240,255,0.22)]">
                <img
                  src={AVATAR}
                  alt={t.hero.avatarAlt}
                  className="h-full w-full object-cover object-[50%_30%]"
                  fetchpriority="high"
                  decoding="async"
                />
                {/* lens scan: a thin cyan line sweeps the glasses every few seconds */}
                {!reduce && (
                  <motion.span
                    aria-hidden
                    className="absolute inset-x-0 h-[2px] bg-cyan/70 shadow-[0_0_14px_#00F0FF] mix-blend-screen"
                    initial={{ top: '0%', opacity: 0 }}
                    animate={{ top: ['8%', '92%'], opacity: [0, 0.9, 0.9, 0] }}
                    transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 4.5, ease: 'easeInOut', delay: 2 }}
                  />
                )}
                <div aria-hidden className="bg-scanlines pointer-events-none absolute inset-0 opacity-40" />
                <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-bg via-bg/50 to-transparent" />
                <figcaption className="hud absolute bottom-4 left-4 right-4 flex items-center justify-between text-[10px] text-cyan/80">
                  <span>ID · W.BARONES</span>
                  <span className="flex items-center gap-2">
                    <span className="live-dot scale-75" aria-hidden /> ONLINE
                  </span>
                </figcaption>
              </div>
              <HudCorners inset={-12} size={22} />
            </motion.figure>

            {/* floating HUD chips (depth 3) */}
            <Chip className="-left-[6%] top-[12%]" style={{ x: d3x, y: d3y }}>
              {t.hero.chips[0]}
            </Chip>
            <Chip className="-right-[5%] top-[34%]" style={{ x: d1x, y: d1y }}>
              {t.hero.chips[1]}
            </Chip>
            <Chip className="-left-[5%] top-[48%]" style={{ x: d2x, y: d2y }}>
              {t.hero.chips[2]}
            </Chip>
          </div>

          {/* neon "projetos do zero": outside the photo — left of the frame on desktop, below it on mobile */}
          <NeonSign
            lines={t.hero.neon}
            show={show}
            arrow="right"
            className="absolute bottom-[14%] right-full z-10 mr-6 hidden xl:block"
          />
          <NeonSign lines={t.hero.neon} show={show} arrow="up" className="mt-10 flex justify-center xl:hidden" />
        </motion.div>
      </div>

      <motion.div
        aria-hidden
        className="hud absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[10px] text-ink-3 md:flex"
        initial={{ opacity: 0 }}
        animate={show ? { opacity: 1 } : {}}
        transition={{ delay: 1.4 }}
      >
        {t.hero.scroll}
        <span className="relative h-10 w-px overflow-hidden bg-cyan/15">
          <motion.span
            className="absolute inset-x-0 top-0 h-3 bg-cyan"
            animate={reduce ? {} : { y: [-12, 40] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </span>
      </motion.div>
    </section>
  )
}
