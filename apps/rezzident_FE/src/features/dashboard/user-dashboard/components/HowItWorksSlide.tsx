import type { ReactNode } from 'react'
import type { HowItWorksSlide as HowItWorksSlideData } from '#/features/dashboard/user-dashboard/types/home.types'

export interface HowItWorksSlideProps {
  slide: HowItWorksSlideData
}

export function HowItWorksSlide({ slide }: HowItWorksSlideProps): ReactNode {
  return (
    <div className="w-full">
      {/* Neutral Illustration Area */}
      <div className="bg-offWhite flex h-[100px] w-full items-center justify-center overflow-hidden rounded-[12px]">
        {slide.illustration ? (
          <img src={slide.illustration} alt={slide.title} className="h-full w-full object-cover" />
        ) : (
          <span className="font-dmsans text-mutedOlive text-body-small font-medium select-none">
            Illustration
          </span>
        )}
      </div>

      {/* Slide Title */}
      <h3 className="font-dmsans text-actionDark text-heading-3 mt-5 font-bold">{slide.title}</h3>

      {/* Slide Description - reserved 2-line min-height to prevent modal jumping */}
      <p className="font-dmsans text-warmGray text-body-small mt-2 min-h-[40px] leading-[20px]">
        {slide.description}
      </p>
    </div>
  )
}
