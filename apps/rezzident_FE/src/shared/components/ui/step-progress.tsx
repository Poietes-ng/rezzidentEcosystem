import type { ReactNode } from 'react'
import { cn } from '#/shared/utils/cn'

export interface StepProgressProps {
  currentStep: number
  totalSteps: number
  variant?: 'bar' | 'segmented'
  className?: string
  showLabel?: boolean
}

export function StepProgress({
  currentStep,
  totalSteps,
  variant = 'bar',
  className,
  showLabel = true,
}: StepProgressProps): ReactNode {
  if (variant === 'segmented') {
    return (
      <div
        role="progressbar"
        aria-valuenow={currentStep}
        aria-valuemin={1}
        aria-valuemax={totalSteps}
        aria-label={`Step ${currentStep} of ${totalSteps}`}
        className={cn('flex items-center justify-center gap-1', className)}
      >
        <span className="sr-only">
          Step {currentStep} of {totalSteps}
        </span>
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1
          const isActive = stepNumber === currentStep

          return (
            <div
              key={stepNumber}
              className={cn(
                'h-[3px] shrink-0 rounded-full transition-all duration-150 motion-reduce:transition-none',
                isActive ? 'bg-actionDark w-[26px]' : 'bg-stoneEdge w-[15px]',
              )}
              aria-hidden="true"
            />
          )
        })}
      </div>
    )
  }

  const percentage = Math.min(100, Math.max(0, Math.round((currentStep / totalSteps) * 100)))

  return (
    <div className={cn('gap-web-lg flex w-full flex-col', className)}>
      {/* Full-width progress bar */}
      <div className="bg-stoneEdge/40 relative h-[4px] w-full overflow-hidden rounded-full">
        <div
          className="bg-actionDark absolute top-0 left-0 h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {/* Label */}
      {showLabel && (
        <span className="font-dmsans text-warmGray text-[14px] font-medium tracking-wider uppercase">
          Step {currentStep} of {totalSteps}
        </span>
      )}
    </div>
  )
}
