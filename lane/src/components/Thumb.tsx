/* eslint-disable @next/next/no-img-element */
export function Thumb({ src, alt = "", className = "" }: { src?: string; alt?: string; className?: string }) {
  if (!src) return <div className={`bg-rosa-claro ${className}`} />;
  return <img src={src} alt={alt} loading="lazy" decoding="async" className={`object-cover ${className}`} />;
}
