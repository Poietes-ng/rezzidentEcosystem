import * as React from 'react'
import { cn } from '../../utils/cn'
import { Button } from '#/shared/components/ui/button'

export interface ServerDowntimeErrorProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  description?: string
  buttonText?: string
  onRetry?: () => void
  onClose?: () => void
}

export const ServerDowntimeError = React.forwardRef<HTMLDivElement, ServerDowntimeErrorProps>(
  (
    {
      className,
      title = 'Server Downtime',
      description = 'Our servers are currently undergoing maintenance. Please check back shortly.',
      buttonText = 'Retry',
      onRetry,
      onClose,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          'bg-errorRed font-dmsans flex w-full items-start gap-3.5 rounded-2xl p-5 text-white shadow-sm',
          className,
        )}
        {...props}
      >
        <div className="flex-1">
          <div className="flex items-center gap-4 pb-4">
            <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-white text-[14px] font-bold text-white select-none">
              !
            </div>
            <h3 className="font-dmsanstext-[16px] leading-snug font-bold text-white">{title}</h3>
          </div>

          <p className="font-dmsans mt-1 flex-1 pb-4 text-[13px] leading-relaxed text-white/90">
            {description}
          </p>
          {onRetry && (
            <Button variant="secondary" onClick={onRetry} className="w-full">
              {buttonText}
            </Button>
          )}
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 p-0.5 text-white/80 transition-opacity hover:text-white focus:outline-none"
            aria-label="Dismiss alert"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        )}
      </div>
    )
  },
)

ServerDowntimeError.displayName = 'ServerDowntimeError'
