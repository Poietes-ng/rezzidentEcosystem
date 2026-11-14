import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import type { ReactNode } from 'react'
import { cn } from '#/shared/utils/cn'

export type ToastVariant = 'success' | 'error'

export interface ToastProps {
  open: boolean
  onClose: () => void
  message: string
  duration?: number
  className?: string
  variant?: ToastVariant
}

export function Toast({
  open,
  onClose,
  message,
  duration = 3500,
  className,
  variant = 'success',
}: ToastProps): ReactNode {
  useEffect(() => {
    if (!open) return

    const timer = setTimeout(() => {
      onClose()
    }, duration)

    return () => {
      clearTimeout(timer)
    }
  }, [open, onClose, duration])

  if (!open || typeof document === 'undefined') return null

  const isError = variant === 'error'

  return createPortal(
    <div
      role={isError ? 'alert' : 'status'}
      aria-live={isError ? 'assertive' : 'polite'}
      className={cn(
        'fixed top-[max(16px,env(safe-area-inset-top))] left-1/2 z-50 flex h-[48px] w-[calc(100%-32px)] max-w-[345px] -translate-x-1/2 items-center justify-center gap-2 rounded-xl px-4 shadow-md transition-all duration-200 motion-reduce:transition-none',
        isError ? 'bg-errorRed' : 'bg-successGreen',
        className,
      )}
    >
      <span className="material-symbols-outlined text-[20px] text-white">
        {isError ? 'cancel' : 'check_circle'}
      </span>
      <span className="font-dmsans text-body-small font-medium text-white">{message}</span>
    </div>,
    document.body,
  )
}
