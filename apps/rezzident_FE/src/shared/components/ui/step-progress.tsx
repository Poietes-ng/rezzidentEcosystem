import { cn } from '../../utils/cn'

export interface StepProgressProps {
  currentStep: number
  totalSteps: number
  className?: string
  showLabel?: boolean
}

export function StepProgress({
  currentStep,
  totalSteps,
  className,
  showLabel = true,
}: StepProgressProps) {
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
