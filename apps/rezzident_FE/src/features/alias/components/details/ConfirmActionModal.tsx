import type { ReactNode } from 'react'
import type { ConfirmActionModalProps } from '../../types/alias.types'
import { Button, Modal } from '#/shared/components/ui'

export function ConfirmActionModal({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel,
  cancelLabel = 'Cancel',
  tone = 'destructive',
  isLoading = false,
}: ConfirmActionModalProps): ReactNode {
  const titleId = 'confirm-action-modal-title'

  return (
    <Modal
      open={open}
      onClose={isLoading ? () => {} : onClose}
      titleId={titleId}
      className="max-w-[360px]"
    >
      <div className="flex w-full flex-col rounded-3xl bg-white p-6 shadow-xl">
        {/* Header with Title and Close X */}
        <div className="flex items-center justify-between gap-4">
          <h3
            id={titleId}
            className="font-dmsans text-heading-3 text-actionDark leading-tight font-bold"
          >
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            aria-label="Close"
            className="text-actionDark hover:bg-stoneEdge/20 focus-visible:ring-actionDark flex h-8 w-8 items-center justify-center rounded-full transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40"
          >
            <span className="material-symbols-outlined text-[20px] font-medium" aria-hidden="true">
              close
            </span>
          </button>
        </div>

        {/* Message Body */}
        <p className="font-dmsans text-body-small text-warmGray mt-3 leading-relaxed font-normal">
          {message}
        </p>

        {/* Action Buttons: Cancel and Confirm */}
        <div className="mt-6 flex w-full items-center gap-3">
          <Button
            variant="secondary"
            disabled={isLoading}
            onClick={onClose}
            className="h-12 flex-1 rounded-xl text-[15px] font-semibold"
          >
            {cancelLabel}
          </Button>

          <Button
            variant={tone === 'destructive' ? 'destructive' : 'success'}
            loading={isLoading}
            loadingText="Please wait..."
            disabled={isLoading}
            onClick={onConfirm}
            className="h-12 flex-1 rounded-xl text-[15px] font-semibold"
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
