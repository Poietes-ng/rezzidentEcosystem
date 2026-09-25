import { Link } from '@tanstack/react-router'
import { useState, useEffect, useRef, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Button } from '../../../shared/components/ui/button'
import { cn } from '../../../shared/utils/cn'

const SLIDES = [
  {
    title: (
      <>
        Your residence, <br /> reimagined.
      </>
    ),
    description: 'Smart community living at your fingertips',
  },
  {
    title: (
      <>
        Stay connected, <br /> stay secure.
      </>
    ),
    description: 'Manage bills, visitors, and votes in one place',
  },
  {
    title: (
      <>
        Your community, <br /> in your pocket.
      </>
    ),
    description: 'Report issues, and chat instantly',
  },
]
// Framer Motion variants — mirrors the RN spring/timing config from MB
const slideVariants = {
  enter: {
    opacity: 0,
    y: 12,
  },
  center: {
    opacity: 1,
    y: 0,
    transition: {
      opacity: { duration: 0.35, ease: 'easeOut' as const },
      y: {
        type: 'spring' as const,
        stiffness: 80, // tension: 80
        damping: 12, // friction: 12
      },
    },
  },
  exit: {
    opacity: 0,
    y: -12,
    transition: {
      duration: 0.25,
      ease: 'easeIn' as const,
    },
  },
}

const AUTO_SCROLL_MS = 4500

export default function WelcomeSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const startTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length)
    }, AUTO_SCROLL_MS)
  }, [])

  useEffect(() => {
    startTimer()
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [currentSlide, startTimer])

  const goTo = (idx: number) => {
    if (idx === currentSlide) return
    setCurrentSlide(idx)
  }

  return (
    <div className="flex w-full flex-1 flex-col items-center justify-center px-6 py-3">
      {/* Dot Indicators */}
      <div className="flex shrink-0 justify-center gap-1">
        {SLIDES.map((_, idx) => (
          <motion.button
            layout
            transition={{ layout: { type: 'spring', stiffness: 600, damping: 350 } }}
            key={idx}
            onClick={() => goTo(idx)}
            className={cn(
              'h-0.75 gap-1 rounded-[20px] transition-colors duration-500',
              currentSlide === idx ? 'bg-actionDark w-6.5' : 'w-3.75 bg-gray-200',
            )}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* Fixed min-height so the layout doesn't jump while AnimatePresence
                swaps slides (mode="wait" briefly leaves this empty). Tune to your type scale. */}
      <div className="flex w-full items-center justify-center py-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="w-full text-center"
          >
            <h2 className="font-dmsans lg:text-heading-1 text-heading-2 text-actionDark">
              {SLIDES[currentSlide].title}
            </h2>
            <p className="font-dmsans text-body-base pt-2 text-gray-500">
              {SLIDES[currentSlide].description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
