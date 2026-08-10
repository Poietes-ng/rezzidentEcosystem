import { useState, useEffect } from 'react'

/**
 * Generic media query hook. Returns whether the given CSS media query matches.
 *
 * @param query — A valid CSS media query string, e.g. '(max-width: 768px)'
 * @returns boolean — whether the query currently matches
 *
 * @example
 * ```tsx
 * const isTablet = useMediaQuery('(min-width: 640px) and (max-width: 1024px)')
 * ```
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    setMatches(media.matches)

    const listener = () => setMatches(media.matches)
    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
  }, [query])

  return matches
}
