import { Link } from '@tanstack/react-router'
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Button } from '../../../shared/components/ui/button'
import { cn } from '../../../shared/utils/cn'

/**
 * WelcomeScreen — rezzident_FE
 *
 * Animation pattern mirrors rezzident_MB/WelcomeScreen.tsx:
 *  - On exit:  fade to 0 + slide up 12px (250ms ease)
 *  - On enter: fade to 1 + spring-slide from 12px below (tension 80, friction 12)
 * Implemented with Framer Motion AnimatePresence + motion.div.
 */

const SLIDES = [
  {
    title: 'Your residence, reimagined.',
    description: 'Smart community living at your fingertips',
  },
  {
    title: 'Stay connected, stay secure.',
    description: 'Manage bills, visitors, and votes in one place',
  },
  {
    title: 'Your community, in your pocket.',
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
      opacity: { duration: 0.35, ease: 'easeOut' },
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
      ease: 'easeIn',
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
  }, [currentSlide])

  const goTo = (idx: number) => {
    if (idx === currentSlide) return
    setCurrentSlide(idx)
  }

  return (
    <div className="flex h-full w-full flex-col bg-white">
      {/* ── Static Hero Image ── */}
      <div className="shrink-0 px-6 pt-6 md:pt-12">
        <div className="relative aspect-[4/3] max-h-[350px] w-full overflow-hidden rounded-t-[24px] bg-gray-100">
          <img
            src={HERO_IMAGE}
            alt="Rezzident hero"
            className="pointer-events-none h-full w-full object-cover select-none lg:object-[center_-70px]"
          />
          {/* Dark overlay */}
          <div
            className="absolute inset-0"
            style={{ background: 'rgba(26,26,26,0.35)' }}
          />
          {/* Centred logo */}
          <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="font-dmsans flex items-center gap-2 text-[28px] font-bold text-white">
              <img
                src="/assets/logo.svg"
                alt="rezzident logo"
                className="h-[28px] w-auto"
              />
              rezzident
            </h1>
          </div>
        </div>
      </div>

      {/* ── Dot Indicators ── */}
      <div className="flex shrink-0 justify-center gap-2 py-8">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goTo(idx)}
            className={cn(
              'h-[4px] rounded-full transition-all duration-300',
              currentSlide === idx
                ? 'bg-actionDark w-[24px]'
                : 'w-[12px] bg-gray-200',
            )}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* ── Animated Text Carousel ── */}
      <div className="flex w-full flex-1 flex-col items-center justify-center overflow-hidden px-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="w-full text-center"
          >
            <h2 className="font-dmsans text-heading-1 text-actionDark mb-3">
              {SLIDES[currentSlide].title}
            </h2>
            <p className="font-dmsans text-body-base text-gray-500">
              {SLIDES[currentSlide].description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── CTA Buttons ── */}
      <div className="flex flex-col gap-4 bg-white px-6 pb-8">
        <Link to="/join" className="w-full">
          <Button variant="default" className="w-full">
            Create Account
          </Button>
        </Link>
        <Link to="/sign-in" className="w-full">
          <Button variant="secondary" className="w-full">
            I already have an account
          </Button>
        </Link>
        <Link
          to="/registration-criteria"
          className="font-dmsans text-body-base text-actionDark hover:decoration-actionDark mt-2 text-center font-medium underline decoration-gray-300 underline-offset-4"
        >
          Create Estate
        </Link>
        <p className="font-dmsans mt-4 text-center text-[10px] text-gray-400">
          By continuing, you agree to our{' '}
          <span className="cursor-pointer underline">Terms</span>
          {' & '}
          <span className="cursor-pointer underline">Privacy Policy</span>
        </p>
      </div>
    </div>
  )
}
