import type { ReactNode } from 'react'
import { Modal } from '#/shared/components/ui/modal'
import { Button } from '#/shared/components/ui/button'
import { AlertCard } from '#/shared/components/ui/alert-card'
import { FeedbackRatingGroup } from '#/features/dashboard/user-dashboard/components/FeedbackRatingGroup'
import { useFeedback } from '#/features/dashboard/user-dashboard/hooks/useFeedback'

export interface FeedbackModalProps {
  open: boolean
  onClose: () => void
  onFeedbackSubmitted?: () => void
}

export function FeedbackModal({
  open,
  onClose,
  onFeedbackSubmitted,
}: FeedbackModalProps): ReactNode {
  const { selectedRating, status, errorMessage, selectRating, submit, skip } = useFeedback()

  function handleSkip(): void {
    skip(onClose)
  }

  async function handleSubmit(): Promise<void> {
    await submit(() => {
      onClose()
      onFeedbackSubmitted?.()
    })
  }

  return (
    <Modal
      open={open}
      onClose={handleSkip}
      titleId="feedback-modal-title"
      closeOnOverlayClick={false}
      className="mx-auto w-full max-w-[345px]"
    >
      <div className="shadow-alert-modal flex w-full flex-col items-center rounded-[16px] bg-white p-6">
        {/* Top Close X Row */}
        <div className="mb-1 flex w-full justify-end">
          <button
            type="button"
            onClick={handleSkip}
            aria-label="Close feedback modal"
            className="text-actionDark flex h-8 w-8 items-center justify-center rounded-full transition-opacity hover:opacity-70"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Illustration Container */}
        <div className="bg-receiverBubble text-body-base text-slateGray/60 flex h-[160px] w-[297px] max-w-full items-center justify-center rounded-[16px] font-medium">
          Illustration
        </div>

        {/* Title & Subtitle */}
        <h2
          id="feedback-modal-title"
          className="font-cabinet text-actionDark mt-[22px] text-center text-[20px] font-bold"
        >
          User Feedback
        </h2>
        <p className="font-dmsans text-warmGray mt-[14px] text-center text-[16px]">
          How are you enjoying the app so far?
        </p>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mt-4 w-full">
            <AlertCard variant="error" title="Submission Error" description={errorMessage} />
          </div>
        )}

        {/* Rating Faces Group */}
        <div className="mt-[18px] w-full">
          <FeedbackRatingGroup
            value={selectedRating}
            onChange={selectRating}
            disabled={status === 'loading'}
          />
        </div>

        {/* Action Buttons */}
        <div className="mt-[20px] flex w-full items-center gap-3">
          <Button
            type="button"
            variant="secondary"
            disabled={status === 'loading'}
            onClick={handleSkip}
            className="border-stoneEdge/40 font-dmsans text-actionDark hover:bg-stoneEdge/10 h-[56px] flex-1 rounded-[12px] border bg-white text-[15px] font-semibold"
          >
            Skip
          </Button>

          <Button
            type="button"
            variant="primary"
            disabled={!selectedRating || status === 'loading'}
            loading={status === 'loading'}
            loadingText="Submitting..."
            onClick={handleSubmit}
            className="font-dmsans h-[56px] flex-1 rounded-[12px] text-[15px] font-semibold"
          >
            Submit
          </Button>
        </div>
      </div>
    </Modal>
  )
}
