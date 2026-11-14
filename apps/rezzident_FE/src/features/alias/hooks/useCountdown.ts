import { useEffect, useState } from 'react'

export interface UseCountdownReturn {
  remainingMs: number
  isExpired: boolean
}

/**
 * Hook that computes the live remaining time and expiration state for a given ISO timestamp.
 * - Uses real timestamps (not decrementing counters)
 * - Auto-syncs on document visibilitychange
 * - Schedules exact expiry callback with timeout
 * - Cleans up all timers on unmount
 */
export function useCountdown(expiresAt: string, onExpire?: () => void): UseCountdownReturn {
  const getRemaining = (): number => {
    const expiryTime = new Date(expiresAt).getTime()
    if (Number.isNaN(expiryTime)) return 0
    return Math.max(0, expiryTime - Date.now())
  }

  const [remainingMs, setRemainingMs] = useState<number>(getRemaining)
  const isExpired = remainingMs <= 0

  useEffect(() => {
    const initial = getRemaining()
    setRemainingMs(initial)

    if (initial <= 0) {
      onExpire?.()
      return
    }

    // Schedule exact expiration
    const expiryTimer = setTimeout(() => {
      setRemainingMs(0)
      onExpire?.()
    }, initial)

    // Periodic tick to refresh displayed minutes/hours
    const interval = setInterval(() => {
      const remaining = getRemaining()
      setRemainingMs(remaining)
      if (remaining <= 0) {
        clearInterval(interval)
        clearTimeout(expiryTimer)
        onExpire?.()
      }
    }, 1000)

    // Re-sync immediately when returning from another tab or sleep
    function handleVisibilityChange(): void {
      if (document.visibilityState === 'visible') {
        const remaining = getRemaining()
        setRemainingMs(remaining)
        if (remaining <= 0) {
          onExpire?.()
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      clearTimeout(expiryTimer)
      clearInterval(interval)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [expiresAt, onExpire])

  return {
    remainingMs,
    isExpired,
  }
}
