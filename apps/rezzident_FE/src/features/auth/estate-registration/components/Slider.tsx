import { useState, useEffect, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { PanInfo } from 'framer-motion'

const SLIDES = [
  { lines: ['Manage Your', 'Estate with', 'Confidence'] },
  { lines: ['Smarter', 'Security for', 'your estate'] },
  { lines: ['Simplify', 'Everyday Estate', 'Operations'] },
  { lines: ['Create a Better', 'Living', 'Experience for', 'Residents'] },
  { lines: ['Make Better', 'Decisions with', 'Real-Time', 'Insights'] },
]

const AUTOPLAY_MS = 4000
const SWIPE_CONFIDENCE_THRESHOLD = 8000

const EASE_IN = [0.22, 1, 0.36, 1] as const
const EASE_OUT = [0.4, 0, 1, 1] as const

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 48 : -48,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.55, ease: EASE_IN },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -48 : 48,
    opacity: 0,
    transition: { duration: 0.32, ease: EASE_OUT },
  }),
}

const textContainer = {
  enter: {},
  center: {
    transition: { staggerChildren: 0.09, delayChildren: 0.12 },
  },
  exit: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 },
  },
}

const textLine = {
  enter: { opacity: 0, y: 22, filter: 'blur(6px)' },
  center: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.55, ease: EASE_IN },
  },
  exit: {
    opacity: 0,
    y: -14,
    filter: 'blur(4px)',
    transition: { duration: 0.28, ease: EASE_OUT },
  },
}

export function Slider() {
  const [[currentSlide, direction], setSlide] = useState<[number, number]>([0, 1])
  const [isInteracting, setIsInteracting] = useState(false)

  const paginate = useCallback((newDirection: number) => {
    setSlide(([current]) => {
      const next = (current + newDirection + SLIDES.length) % SLIDES.length
      return [next, newDirection]
    })
  }, [])

  const goToSlide = useCallback((idx: number) => {
    setSlide(([current]) => [idx, idx > current ? 1 : -1])
  }, [])

  useEffect(() => {
    if (isInteracting) return
    const timer = setTimeout(() => paginate(1), AUTOPLAY_MS)
    return () => clearTimeout(timer)
  }, [currentSlide, isInteracting, paginate])

  const handleDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsInteracting(false)
    const swipePower = info.offset.x * info.velocity.x
    if (swipePower < -SWIPE_CONFIDENCE_THRESHOLD) {
      paginate(1)
    } else if (swipePower > SWIPE_CONFIDENCE_THRESHOLD) {
      paginate(-1)
    }
  }

  const slide = SLIDES[currentSlide]

  return (
    <div className="gap-web-md flex flex-col">
      {/* Slide track */}
      <div className="relative w-full overflow-hidden">
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={currentSlide}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.6}
            onDragStart={() => setIsInteracting(true)}
            onDragEnd={handleDragEnd}
            className="w-full cursor-grab active:cursor-grabbing"
          >
            <motion.h2
              variants={textContainer}
              initial="enter"
              animate="center"
              exit="exit"
              className="font-dmsans font-web-bold text-[64px] leading-[72px] text-white"
            >
              {slide.lines.map((line, lineIdx) => (
                <motion.span key={lineIdx} variants={textLine} className="block">
                  {line}
                </motion.span>
              ))}
            </motion.h2>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dot indicators */}
      <div className="flex gap-2">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              setIsInteracting(true)
              goToSlide(idx)
              setIsInteracting(false)
            }}
            className="relative h-[2px] w-[40px]"
            aria-label={`Go to slide ${idx + 1}`}
          >
            <span className="absolute inset-0 rounded-full bg-white/25" />
            {currentSlide === idx && (
              <motion.span
                layoutId="active-dot"
                className="absolute inset-0 rounded-full bg-white"
                transition={{ type: 'spring', stiffness: 500, damping: 40 }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
