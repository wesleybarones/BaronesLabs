import { motion, useMotionTemplate, useTransform } from 'motion/react'
import { useEffect, useState } from 'react'
import plate from '../assets/live/plate-780.webp'
import person from '../assets/live/person-780.webp'
import visorMask from '../assets/live/visor-mask.png'

/*
  "Live" hero portrait, made from the still photo (no video file):
  - the photo is split into a background plate and a cut-out of the person (see README);
  - with the cursor (or the phone's gyroscope) the two layers move in depth, the person tilts in 3D
    and a cyan key light follows the pointer;
  - the visor gets moving HUD reflections and a glare that slides with the cursor;
  - with no input it keeps breathing/swaying slowly.
  It mounts after the first paint (the plain photo stays the LCP image) and fades in once loaded.
  `sx`/`sy` are the hero's spring motion values in [-1, 1].
*/
export default function LivePortrait({ sx, sy, reduce }) {
  const [mounted, setMounted] = useState(false)
  const [loaded, setLoaded] = useState(0)

  useEffect(() => {
    const go = () => setMounted(true)
    const id = window.requestIdleCallback ? requestIdleCallback(go, { timeout: 1800 }) : setTimeout(go, 900)
    return () => (window.cancelIdleCallback ? cancelIdleCallback(id) : clearTimeout(id))
  }, [])

  const bgX = useTransform(sx, (v) => v * -12)
  const bgY = useTransform(sy, (v) => v * -9)
  const pX = useTransform(sx, (v) => v * 8)
  const pY = useTransform(sy, (v) => v * 5)
  const rotY = useTransform(sx, (v) => v * 5)
  const rotX = useTransform(sy, (v) => v * -3.5)
  const lightX = useTransform(sx, (v) => 50 + v * 32)
  const lightY = useTransform(sy, (v) => 32 + v * 26)
  const light = useMotionTemplate`radial-gradient(42% 36% at ${lightX}% ${lightY}%, rgba(0,240,255,0.38), transparent 70%)`
  const glareX = useTransform(sx, (v) => `${15 + (v + 1) * 32}%`)

  if (!mounted) return null
  const ready = loaded >= 2
  const cover = 'absolute inset-0 h-full w-full object-cover object-[50%_30%]'
  const mask = {
    WebkitMaskImage: `url(${visorMask})`,
    maskImage: `url(${visorMask})`,
    WebkitMaskSize: 'cover',
    maskSize: 'cover',
    WebkitMaskPosition: '50% 30%',
    maskPosition: '50% 30%',
    WebkitMaskRepeat: 'no-repeat',
    maskRepeat: 'no-repeat',
  }

  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 transition-opacity duration-700 ${ready ? 'opacity-100' : 'opacity-0'}`} style={{ perspective: 900 }}>
      {/* background plate (moves opposite to the cursor) */}
      <motion.img src={plate} alt="" decoding="async" onLoad={() => setLoaded((n) => n + 1)} className={`${cover} scale-[1.1]`} style={{ x: bgX, y: bgY }} />
      {/* key light following the cursor */}
      <motion.div className="absolute inset-0 mix-blend-screen" style={{ background: light }} />
      {/* the person, in front, tilting in 3D */}
      <motion.div className="absolute inset-0 [transform-style:preserve-3d]" style={{ x: pX, y: pY, rotateY: rotY, rotateX: rotX, transformOrigin: '50% 42%' }}>
        <div className={`absolute inset-0 ${reduce ? '' : 'live-sway'}`} style={{ transformOrigin: '50% 42%' }}>
          <img src={person} alt="" decoding="async" onLoad={() => setLoaded((n) => n + 1)} className={`${cover} scale-[1.03]`} />
          {/* visor reflections, clipped to the lenses */}
          <div className="absolute inset-0 scale-[1.03]" style={mask}>
            {!reduce && <div className="visor-data absolute inset-0" />}
            <motion.div className="visor-glare absolute bottom-0 top-0 w-[22%]" style={{ left: glareX }} />
          </div>
        </div>
      </motion.div>
    </div>
  )
}
