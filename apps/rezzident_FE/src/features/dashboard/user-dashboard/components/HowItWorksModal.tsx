import type { ReactNode } from 'react'
import type { HowItWorksSlide as HowItWorksSlideData } from '#/features/dashboard/user-dashboard/types/home.types'
import { HowItWorksSlide } from '#/features/dashboard/user-dashboard/components/HowItWorksSlide'
import { Button, Modal, StepProgress } from '#/shared/components/ui'

export interface HowItWorksModalProps {
  open: boolean
  currentIndex: number
  slides: HowItWorksSlideData[]
  onNext: () => void
  onClose: () => void
}

export function HowItWorksModal({
  open,
  currentIndex,
  slides,
  onNext,
  onClose,
}: HowItWorksModalProps): ReactNode {
  if (!open || slides.length === 0) return null

  const currentSlide = slides[currentIndex] ?? slides[0]

  return (
    <Modal
      open={open}
      onClose={onClose}
      titleId="how-it-works-modal-title"
      className="max-w-[342px]"
      closeOnOverlayClick={false}
    >
      <div className="shadow-alert-modal w-full rounded-[24px] bg-white p-6">
        {/* Header: Title + Close Icon */}
        <div className="flex items-start justify-between gap-2">
          <h2
            id="how-it-works-modal-title"
            className="font-dmsans text-actionDark text-heading-3 font-bold"
          >
            See how Rezzident works
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close how Rezzident works modal"
            className="text-actionDark transition-opacity hover:opacity-70 active:scale-90"
          >
            <span className="material-symbols-outlined text-[22px]" aria-hidden="true">
              close
            </span>
          </button>
        </div>

        {/* 8-Segmented Progress Indicator */}
        <StepProgress
          currentStep={currentIndex + 1}
          totalSteps={slides.length}
          variant="segmented"
          className="mt-4 mb-5"
        />

        {/* Slide Content */}
        <HowItWorksSlide slide={currentSlide} />

        {/* Got It Button */}
        <Button
          variant="primary"
          onClick={onNext}
          className="font-dmsans mt-6 h-[52px] w-full rounded-[12px] text-[16px] font-semibold"
        >
          Got It
        </Button>
      </div>
    </Modal>
  )
}
