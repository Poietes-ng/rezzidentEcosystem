import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import type { ReactNode } from 'react'
import { cn } from '#/shared/utils/cn'

export interface ToastProps {
  open: boolean
  onClose: () => void
  message: string
  duration?: number
  className?: string
}

export function Toast({
  open,
  onClose,
  message,
  duration = 3500,
  className,
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

  return createPortal(
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'bg-successGreen fixed top-[max(16px,env(safe-area-inset-top))] left-1/2 z-50 flex h-[48px] w-[calc(100%-32px)] max-w-[345px] -translate-x-1/2 items-center justify-center gap-2 rounded-xl px-4 shadow-md transition-all duration-200 motion-reduce:transition-none',
        className,
      )}
    >
      <span className="material-symbols-outlined text-[20px] text-white">check_circle</span>
      <span className="font-dmsans text-body-small font-medium text-white">{message}</span>
    </div>,
    document.body,
  )
}
