import { useCallback, useState } from 'react'
import type { ToastVariant } from '#/shared/components/ui'

export interface UseToastStateReturn {
  open: boolean
  isOpen: boolean
  message: string
  variant: ToastVariant
  show: (message: string, variant?: ToastVariant) => void
  close: () => void
  hide: () => void
}

export function useToastState(): UseToastStateReturn {
  const [open, setOpen] = useState<boolean>(false)
  const [message, setMessage] = useState<string>('')
  const [variant, setVariant] = useState<ToastVariant>('success')

  const show = useCallback((msg: string, v: ToastVariant = 'success'): void => {
    setMessage(msg)
    setVariant(v)
    setOpen(true)
  }, [])

  const close = useCallback((): void => {
    setOpen(false)
  }, [])

  return {
    open,
    isOpen: open,
    message,
    variant,
    show,
    close,
    hide: close,
  }
}
