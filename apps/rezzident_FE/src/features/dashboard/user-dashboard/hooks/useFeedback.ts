import { useState } from 'react'
import type {
  FeedbackRating,
  SubmitStatus,
} from '#/features/dashboard/user-dashboard/types/home.types'
import { submitFeedback } from '#/features/dashboard/user-dashboard/api/homeQueries'

export interface UseFeedbackReturn {
  selectedRating: FeedbackRating | null
  status: SubmitStatus
  errorMessage: string | null
  selectRating: (rating: FeedbackRating) => void
  submit: (onSuccess?: () => void) => Promise<void>
  skip: (onClose?: () => void) => void
  reset: () => void
}

export function useFeedback(): UseFeedbackReturn {
  const [selectedRating, setSelectedRating] = useState<FeedbackRating | null>(null)
  const [status, setStatus] = useState<SubmitStatus>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  function selectRating(rating: FeedbackRating): void {
    setSelectedRating(rating)
    if (status === 'error') {
      setStatus('idle')
      setErrorMessage(null)
    }
  }

  async function submit(onSuccess?: () => void): Promise<void> {
    if (status === 'loading' || !selectedRating) {
      return
    }

    setStatus('loading')
    setErrorMessage(null)

    try {
      await submitFeedback(selectedRating)
      setStatus('success')
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      setStatus('error')
      setErrorMessage(
        error instanceof Error ? error.message : 'Something went wrong. Please try again.',
      )
    }
  }

  function reset(): void {
    setSelectedRating(null)
    setStatus('idle')
    setErrorMessage(null)
  }

  function skip(onClose?: () => void): void {
    reset()
    if (onClose) {
      onClose()
    }
  }

  return {
    selectedRating,
    status,
    errorMessage,
    selectRating,
    submit,
    skip,
    reset,
  }
}
