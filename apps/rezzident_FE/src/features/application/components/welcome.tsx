import { Link } from '@tanstack/react-router'
import { useState, useEffect, useRef, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Button } from '../../../shared/components/ui/button'
import { cn } from '../../../shared/utils/cn'

/**
 * WelcomeScreen — rezzident_FE
 *
 * Layout: the screen is split into two equal rows (hero image / carousel + CTAs)
 * using CSS grid `grid-rows-2` (= repeat(2, minmax(0, 1fr))), so both halves are
 * always exactly the same height regardless of device height or content.
 *
 * Animation pattern mirrors rezzident_MB/WelcomeScreen.tsx:
 *  - On exit:  fade to 0 + slide up 12px (250ms ease)
 *  - On enter: fade to 1 + spring-slide from 12px below (tension 80, friction 12)
 * Implemented with Framer Motion AnimatePresence + motion.div.
 */

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

const HERO_IMAGE = '/assets/LoginHeroImageTest2.svg'
const AUTO_SCROLL_MS = 4500

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

export function WelcomeScreen() {
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
    // h-dvh gives the grid a definite height; grid-rows-2 splits it into two equal halves.
    // If this component lives inside a parent with its own definite height, swap h-dvh for h-full.
    <div className="grid h-dvh w-full grid-rows-2 bg-white">
      {/* ── Top half: Static Hero Image ── */}
      <div className="min-h-0 px-4 pt-4 pb-4.25">
        <div className="relative h-full w-full overflow-hidden rounded-t-3xl bg-gray-100">
          <img
            src={HERO_IMAGE}
            alt="Rezzident hero"
            className="pointer-events-none h-full w-full object-cover object-center select-none"
          />
          {/* Dark overlay */}
          <div className="absolute inset-0" style={{ background: 'rgba(30, 30, 31, 0.4)' }} />
          {/* Centred logo */}
          <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="font-dmsans flex items-center text-[28px] font-bold text-white">
              <img src="/assets/logo.svg" alt="rezzident logo" className="h-7 w-auto" />
              rezzident
            </h1>
          </div>
        </div>
      </div>

      {/* ── Bottom half: Carousel + CTA (scrolls only if content is taller than its half) ── */}
      <div className="min-h-0 overflow-y-auto">
        <div className="flex flex-col">
          {/* ── Dots + Animated Text Carousel ── */}
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

          {/* ── CTA Buttons ── */}
          <div className="flex shrink-0 flex-col px-6">
            <div className="flex flex-col gap-4 bg-white">
              <Link to="/app/join" className="w-full">
                <Button variant="primary" className="w-full">
                  Create Account
                </Button>
              </Link>
              <Link to="/app/login" className="w-full">
                <Button variant="secondary" className="w-full">
                  I already have an account
                </Button>
              </Link>
              <Link
                to="/registration-criteria"
                className="font-dmsans text-body-base text-actionDark hover:decoration-actionDark! text-center font-medium underline decoration-gray-300 underline-offset-4"
              >
                <Button variant="ghost">Create Estate</Button>
              </Link>
            </div>

            <p className="font-dmsans pt-6 pb-3 text-center text-[12px] font-normal text-[#9A9488]">
              By continuing, you agree to our{' '}
              <span className="hover:text-actionYellow cursor-pointer font-medium underline transition-colors duration-300 ease-in-out">
                Terms
              </span>
              {' & '}
              <span className="hover:text-actionYellow cursor-pointer font-medium underline transition-colors duration-300 ease-in-out">
                Privacy Policy
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
