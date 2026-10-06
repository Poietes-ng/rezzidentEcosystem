import { useState } from 'react'
import type { AppUpdateStatus } from '#/features/dashboard/user-dashboard/types/home.types'
import { startAppUpdate } from '#/features/dashboard/user-dashboard/api/homeQueries'

export interface UseAppUpdateReturn {
  status: AppUpdateStatus
  errorMessage: string | null
  updateNow: (onSuccess?: () => void) => Promise<void>
  later: (onClose?: () => void) => void
  retry: (onSuccess?: () => void) => Promise<void>
  reset: () => void
}

export function useAppUpdate(): UseAppUpdateReturn {
  const [status, setStatus] = useState<AppUpdateStatus>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  async function updateNow(onSuccess?: () => void): Promise<void> {
    if (status === 'loading') {
      return
    }

    setStatus('loading')
    setErrorMessage(null)

    try {
      await startAppUpdate()
      setStatus('success')
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      setStatus('error')
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Failed to update app. Please check your connection and try again.',
      )
    }
  }

  function later(onClose?: () => void): void {
    setStatus('idle')
    setErrorMessage(null)
    if (onClose) {
      onClose()
    }
  }

  async function retry(onSuccess?: () => void): Promise<void> {
    await updateNow(onSuccess)
  }

  function reset(): void {
    setStatus('idle')
    setErrorMessage(null)
  }

  return {
    status,
    errorMessage,
    updateNow,
    later,
    retry,
    reset,
  }
}
