/** Global fixed background: subtle grid + scanlines + grain. Light, CSS-only. */
export default function Background() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      <div className="bg-grid-global absolute inset-0" />
      <div className="bg-scanlines absolute inset-0" />
      <div className="bg-grain absolute inset-0" />
    </div>
  )
}
