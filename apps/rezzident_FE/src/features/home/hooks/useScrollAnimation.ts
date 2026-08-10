import { useState, useRef, useEffect } from 'react'

/**
 * Custom hook for triggering entrance animations when an element scrolls into view.
 * Uses IntersectionObserver to detect visibility — fires once and never resets.
 *
 * @param options.threshold — Fraction of element visible to trigger (default: 0.1)
 * @param options.rootMargin — Margin around the root (default: '0px')
 * @returns { ref, isVisible } — attach `ref` to your element, use `isVisible` for animations
 *
 * @example
 * ```tsx
 * const { ref, isVisible } = useScrollAnimation({ threshold: 0.1 })
 * return (
 *   <section ref={ref} style={{ opacity: isVisible ? 1 : 0 }}>
 *     ...
 *   </section>
 * )
 * ```
 */
export function useScrollAnimation(options?: {
  threshold?: number
  rootMargin?: string
}) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          // Once visible, stop observing — animation is one-shot
          observer.unobserve(element)
        }
      },
      {
        threshold: options?.threshold ?? 0.1,
        rootMargin: options?.rootMargin ?? '0px',
      }
    )

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [options?.threshold, options?.rootMargin])

  return { ref, isVisible }
}
