import { useRef } from 'react'
import type { KeyboardEvent, ReactNode } from 'react'
import type { FeedbackRating } from '#/features/dashboard/user-dashboard/types/home.types'
import { FEEDBACK_RATING_OPTIONS } from '#/features/dashboard/user-dashboard/types/home.types'
import { cn } from '#/shared/utils/cn'

export interface FeedbackRatingGroupProps {
  value: FeedbackRating | null
  onChange: (rating: FeedbackRating) => void
  disabled?: boolean
  className?: string
}

export function FeedbackRatingGroup({
  value,
  onChange,
  disabled = false,
  className,
}: FeedbackRatingGroupProps): ReactNode {
  const radioRefs = useRef<(HTMLButtonElement | null)[]>([])

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, currentIndex: number): void {
    if (disabled) return

    let nextIndex: number | null = null

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault()
      nextIndex = (currentIndex + 1) % FEEDBACK_RATING_OPTIONS.length
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault()
      nextIndex =
        (currentIndex - 1 + FEEDBACK_RATING_OPTIONS.length) % FEEDBACK_RATING_OPTIONS.length
    }

    if (nextIndex !== null) {
      const nextOption = FEEDBACK_RATING_OPTIONS[nextIndex]
      onChange(nextOption.id)
      radioRefs.current[nextIndex]?.focus()
    }
  }

  const hasSelection = value !== null

  return (
    <div
      role="radiogroup"
      aria-label="How are you enjoying the app so far?"
      className={cn('flex w-full items-start justify-between gap-1', className)}
    >
      {FEEDBACK_RATING_OPTIONS.map((option, index) => {
        const isSelected = value === option.id
        const isFaded = hasSelection && !isSelected
        const isFocusable = hasSelection ? isSelected : index === 0

        return (
          <button
            key={option.id}
            ref={(el) => {
              radioRefs.current[index] = el
            }}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-label={option.label}
            tabIndex={isFocusable ? 0 : -1}
            disabled={disabled}
            onClick={() => onChange(option.id)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className={cn(
              'group focus-visible:ring-actionDark relative flex min-h-[44px] min-w-[44px] flex-1 flex-col items-center justify-start rounded-lg p-0.5 text-center transition-opacity outline-none focus-visible:ring-2 focus-visible:ring-offset-2 motion-reduce:transition-none',
              isFaded ? 'opacity-40 hover:opacity-60' : 'opacity-100',
              disabled && 'cursor-not-allowed opacity-50',
            )}
          >
            <img
              src={option.imageSrc}
              alt=""
              aria-hidden="true"
              className="h-[40px] w-[40px] object-contain transition-transform group-active:scale-95 motion-reduce:transition-none"
            />

            <span className="text-slateGray mt-1 block max-w-[52px] text-[9px] leading-[11px] font-bold">
              {option.label}
            </span>

            <span
              aria-hidden="true"
              className={cn(
                'mt-1 h-1.5 w-1.5 rounded-full transition-all',
                isSelected ? 'bg-successGreen scale-100 opacity-100' : 'scale-0 opacity-0',
              )}
            />
          </button>
        )
      })}
    </div>
  )
}
