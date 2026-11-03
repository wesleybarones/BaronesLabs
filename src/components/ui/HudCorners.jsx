/** Four L-shaped HUD brackets; they light up on .group:hover or .hud-on */
export default function HudCorners({ inset = 0, size }) {
  const s = size ? { width: size, height: size } : undefined
  const o = typeof inset === 'number' ? `${inset}px` : inset
  return (
    <>
      <span aria-hidden className="hud-corner border-l border-t" style={{ top: o, left: o, ...s }} />
      <span aria-hidden className="hud-corner border-r border-t" style={{ top: o, right: o, ...s }} />
      <span aria-hidden className="hud-corner border-b border-l" style={{ bottom: o, left: o, ...s }} />
      <span aria-hidden className="hud-corner border-b border-r" style={{ bottom: o, right: o, ...s }} />
    </>
  )
}
