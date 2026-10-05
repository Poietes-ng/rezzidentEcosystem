import type { Variants } from 'framer-motion'

export const pageVariants: Variants = {
  enter: { opacity: 0, x: 40 },
  center: { opacity: 1, x: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, x: -30, transition: { duration: 0.2, ease: [0.4, 0, 1, 1] } },
}
