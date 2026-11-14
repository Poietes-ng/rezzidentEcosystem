import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import type { ReactNode } from 'react'
import { cn } from '#/shared/utils/cn'

export interface ModalProps {
  open: boolean
  onClose: () => void
  titleId?: string
  ariaLabel?: string
  className?: string
  overlayClassName?: string
  placement?: 'center' | 'top'
  closeOnOverlayClick?: boolean
  children: ReactNode
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function Modal({
  open,
  onClose,
  titleId,
  ariaLabel,
  className,
  overlayClassName,
  placement = 'center',
  closeOnOverlayClick = false,
  children,
}: ModalProps): ReactNode {
  const previousActiveElementRef = useRef<HTMLElement | null>(null)
  const modalRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!open) return

    previousActiveElementRef.current = document.activeElement as HTMLElement | null

    // Lock background scroll
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    // Initial focus trap: move focus to first focusable element inside the modal or the modal itself
    const frameId = requestAnimationFrame(() => {
      if (!modalRef.current) return
      const focusable = modalRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      if (focusable.length > 0) {
        focusable[0].focus()
      } else {
        modalRef.current.focus()
      }
    })

    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }

      if (event.key === 'Tab' && modalRef.current) {
        const focusable = Array.from(
          modalRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
        ).filter((el) => el.offsetParent !== null || el === document.activeElement)

        if (focusable.length === 0) {
          event.preventDefault()
          return
        }

        const firstElement = focusable[0]
        const lastElement = focusable[focusable.length - 1]

        if (event.shiftKey) {
          if (
            document.activeElement === firstElement ||
            !modalRef.current.contains(document.activeElement)
          ) {
            event.preventDefault()
            lastElement.focus()
          }
        } else {
          if (
            document.activeElement === lastElement ||
            !modalRef.current.contains(document.activeElement)
          ) {
            event.preventDefault()
            firstElement.focus()
          }
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      cancelAnimationFrame(frameId)
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleKeyDown)
      if (
        previousActiveElementRef.current &&
        typeof previousActiveElementRef.current.focus === 'function'
      ) {
        previousActiveElementRef.current.focus()
      }
    }
  }, [open, onClose])

  if (!open || typeof document === 'undefined') return null

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-label={ariaLabel}
      ref={modalRef}
      tabIndex={-1}
      className={cn(
        'fixed inset-0 z-50 flex justify-center bg-black/50 px-5 outline-none',
        placement === 'top' ? 'items-start' : 'items-center',
        overlayClassName,
      )}
      onClick={(e) => {
        if (closeOnOverlayClick && e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <div className={cn('w-full', className)}>{children}</div>
    </div>,
    document.body,
  )
}
