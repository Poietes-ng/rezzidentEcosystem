import { useRef, useState } from 'react'
import type { ReactNode } from 'react'
import type { PanicResult } from '#/features/dashboard/user-dashboard/types/home.types'
import { Modal } from '#/shared/components/ui/modal'

export interface SecurityAlertedModalProps {
  open: boolean
  data: PanicResult | null
  onClose: () => void
}

export function SecurityAlertedModal({
  open,
  data,
  onClose,
}: SecurityAlertedModalProps): ReactNode {
  const [copied, setCopied] = useState<boolean>(false)
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  if (!open || !data) return null

  const telHref = `tel:${data.securityContact.replace(/\s+/g, '')}`
  const contact = data.securityContact

  async function handleCopy(): Promise<void> {
    try {
      await navigator.clipboard.writeText(contact)
      setCopied(true)
    } catch {
      try {
        const textArea = document.createElement('textarea')
        textArea.value = contact
        textArea.style.position = 'fixed'
        textArea.style.opacity = '0'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        setCopied(true)
      } catch {
        setCopied(false)
        return
      }
    }

    if (copyTimeoutRef.current) {
      clearTimeout(copyTimeoutRef.current)
    }
    copyTimeoutRef.current = setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      titleId="security-alerted-title"
      className="max-w-[342px]"
      closeOnOverlayClick={true}
    >
      <div className="shadow-alert-modal w-full rounded-[24px] bg-white p-6">
        {/* Header: Title + Close Icon */}
        <div className="flex items-start justify-between gap-2">
          <h2
            id="security-alerted-title"
            className="font-dmsans text-successGreen text-[22px] leading-[28px] font-semibold"
          >
            Security Alerted !
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close security alert modal"
            className="text-actionDark transition-opacity hover:opacity-70 active:scale-90"
          >
            <span className="material-symbols-outlined text-[22px]" aria-hidden="true">
              close
            </span>
          </button>
        </div>

        {/* Subtitle */}
        <p className="font-dmsans text-warmGray mt-1 text-[14px] leading-[20px]">
          Help is on the way to your residence
        </p>

        {/* Security Contact Info with Yellow Copy Button */}
        <div className="mt-5 flex items-center justify-between gap-2">
          <div>
            <p className="font-dmsans text-warmGray text-[12px] leading-none">Security Contact</p>
            <p className="font-dmsans text-actionDark mt-1 text-[17px] font-bold">
              {data.securityContact}
            </p>
          </div>

          <button
            type="button"
            onClick={() => void handleCopy()}
            aria-label={copied ? 'Contact copied' : 'Copy security contact number'}
            className="border-actionYellow bg-inputBg font-dmsans text-actionDark hover:bg-actionYellow/20 flex items-center gap-1.5 rounded-[8px] border px-3.5 py-1.5 text-[14px] font-semibold transition-all duration-150 active:scale-95"
          >
            {copied ? 'Copied' : 'Copy'}
            <span className="material-symbols-outlined text-[16px] leading-none" aria-hidden="true">
              {copied ? 'check' : 'content_copy'}
            </span>
          </button>
        </div>

        {/* Timestamp & Date list */}
        <div className="font-dmsans mt-5 space-y-2.5 text-[15px]">
          <div className="flex items-center justify-between">
            <span className="text-actionDark">Time Stamp:</span>
            <span className="text-actionDark">{data.timestamp}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-actionDark">Date:</span>
            <span className="text-actionDark">{data.date}</span>
          </div>
        </div>

        {/* Call Action Button */}
        <a
          href={telHref}
          className="bg-actionDark font-dmsans hover:bg-actionDarkHover active:bg-actionDarkPressed mt-6 flex h-[52px] w-full items-center justify-center rounded-[14px] text-[16px] font-semibold text-white transition-all duration-150 active:scale-[0.98]"
        >
          Call Estate Security
        </a>

        {/* Subtext Dial Pad Note */}
        <p className="font-dmsans text-warmGray mt-4 text-center text-[12px]">
          This will open your phone's dial pad.
        </p>
      </div>
    </Modal>
  )
}
