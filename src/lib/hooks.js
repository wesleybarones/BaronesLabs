import { useEffect, useState } from 'react'

export function useMediaQuery(query) {
  const get = () => (typeof window !== 'undefined' ? window.matchMedia(query).matches : false)
  const [matches, setMatches] = useState(get)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const on = () => setMatches(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [query])
  return matches
}

export const useReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)')
/** desktop with a precise pointer: enables cursor, tilt, magnetic, parallax */
export const useFinePointer = () => useMediaQuery('(hover: hover) and (pointer: fine)')
export const useIsDesktop = () => useMediaQuery('(min-width: 1024px)')
