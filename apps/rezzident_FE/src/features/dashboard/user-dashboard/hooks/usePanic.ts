import { useCallback, useState } from 'react'
import type { PanicResult } from '#/features/dashboard/user-dashboard/types/home.types'
import { triggerPanic } from '#/features/dashboard/user-dashboard/api/homeQueries'

export type PanicState = 'idle' | 'loading' | 'success' | 'error'

export interface UsePanicResult {
  panicState: PanicState
  panicData: PanicResult | null
  trigger: () => void
  dismiss: () => void
}

export function usePanic(): UsePanicResult {
  const [panicState, setPanicState] = useState<PanicState>('idle')
  const [panicData, setPanicData] = useState<PanicResult | null>(null)

  const trigger = useCallback(() => {
    if (panicState === 'loading') return
    setPanicState('loading')
    setPanicData(null)

    void triggerPanic()
      .then((result) => {
        setPanicData(result)
        setPanicState('success')
      })
      .catch(() => {
        setPanicState('error')
      })
  }, [panicState])

  const dismiss = useCallback(() => {
    setPanicState('idle')
    setPanicData(null)
  }, [])

  return { panicState, panicData, trigger, dismiss }
}
