import Reveal from './Reveal'

export default function SectionLabel({ children, className = '', once }) {
  return (
    <Reveal once={once} distance={14} className={`hud mb-5 flex items-center gap-3 ${className}`}>
      <span aria-hidden className="h-px w-8 bg-cyan/50" />
      <span>{children}</span>
    </Reveal>
  )
}
