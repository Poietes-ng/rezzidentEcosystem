import { useState } from 'react'
import type { HowItWorksSlide } from '#/features/dashboard/user-dashboard/types/home.types'
import {
  MOCK_HOW_IT_WORKS_OPEN,
  mockHowItWorksSlides,
} from '#/features/dashboard/user-dashboard/mocks/home.mocks'

export interface UseHowItWorksReturn {
  open: boolean
  currentIndex: number
  currentSlide: HowItWorksSlide
  totalSlides: number
  slides: HowItWorksSlide[]
  openModal: () => void
  next: () => void
  close: () => void
  reset: () => void
}

export function useHowItWorks(
  initialOpen: boolean = MOCK_HOW_IT_WORKS_OPEN,
  slides: HowItWorksSlide[] = mockHowItWorksSlides,
): UseHowItWorksReturn {
  const [open, setOpen] = useState<boolean>(initialOpen)
  const [currentIndex, setCurrentIndex] = useState<number>(0)

  const totalSlides = slides.length

  function openModal(): void {
    setCurrentIndex(0)
    setOpen(true)
  }

  function next(): void {
    if (currentIndex < totalSlides - 1) {
      setCurrentIndex((prev) => prev + 1)
    } else {
      setOpen(false)
      setCurrentIndex(0)
    }
  }

  function close(): void {
    setOpen(false)
    setCurrentIndex(0)
  }

  function reset(): void {
    setCurrentIndex(0)
  }

  return {
    open,
    currentIndex,
    currentSlide: slides[currentIndex] ?? slides[0],
    totalSlides,
    slides,
    openModal,
    next,
    close,
    reset,
  }
}
