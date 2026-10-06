import type { ReactNode } from 'react'
import { Modal } from '#/shared/components/ui/modal'
import { Button } from '#/shared/components/ui/button'
import { useAppUpdate } from '#/features/dashboard/user-dashboard/hooks/useAppUpdate'

export interface UpdateAvailableModalProps {
  open: boolean
  onClose: () => void
  onUpdateComplete?: () => void
}

export function UpdateAvailableModal({
  open,
  onClose,
  onUpdateComplete,
}: UpdateAvailableModalProps): ReactNode {
  const { status, errorMessage, updateNow, later, retry } = useAppUpdate()

  function handleLater(): void {
    later(onClose)
  }

  async function handleUpdateNow(): Promise<void> {
    await updateNow(() => {
      onClose()
      onUpdateComplete?.()
    })
  }

  async function handleRetry(): Promise<void> {
    await retry(() => {
      onClose()
      onUpdateComplete?.()
    })
  }

  return (
    <Modal
      open={open}
      onClose={handleLater}
      placement="top"
      titleId="update-modal-title"
      closeOnOverlayClick={false}
      className="mx-auto w-full max-w-[345px]"
    >
      <div className="mt-[275px] flex h-[178px] w-[345px] max-w-[345px] flex-col justify-between rounded-[12px] bg-blue-500 p-6 text-white shadow-xl">
        <div>
          {/* Header with Info Icon & Title */}
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] font-light text-white [font-variation-settings:'wght'_300]">
              info
            </span>
            <h2
              id="update-modal-title"
              className="font-cabinet text-body-base font-semibold text-white"
            >
              New Update Available
            </h2>
          </div>

          {/* Description */}
          <p className="font-dmsans mt-[23px] text-[13px] leading-tight font-normal text-white">
            A new version is ready to install.
          </p>

          {/* Error message */}
          {errorMessage && (
            <p className="font-dmsans text-caption mt-2 rounded-lg bg-red-600/30 p-2 text-white">
              {errorMessage}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-[20px] flex w-full items-center gap-[13px]">
          <Button
            type="button"
            variant="secondary"
            disabled={status === 'loading'}
            onClick={handleLater}
            className="font-dmsans h-[56px] flex-1 rounded-[12px] border-transparent bg-white/15 text-[15px] font-semibold text-white shadow-none hover:bg-white/25"
          >
            Later
          </Button>

          {status === 'error' ? (
            <Button
              type="button"
              variant="secondary"
              onClick={handleRetry}
              className="font-dmsans text-actionDark h-[56px] flex-1 rounded-[12px] border-transparent bg-white text-[15px] font-semibold shadow-none hover:bg-white/90"
            >
              Retry
            </Button>
          ) : (
            <Button
              type="button"
              variant="secondary"
              disabled={status === 'loading'}
              loading={status === 'loading'}
              loadingText="Updating..."
              onClick={handleUpdateNow}
              className="font-dmsans text-actionDark h-[56px] flex-1 rounded-[12px] border-transparent bg-white text-[15px] font-semibold shadow-none hover:bg-white/90"
            >
              Update Now
            </Button>
          )}
        </div>
      </div>
    </Modal>
  )
}
