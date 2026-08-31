import { useState } from 'react'
import { Button } from '../../../shared/components/ui/button'

export function ContactSupportScreen() {
  const [copied, setCopied] = useState(false)
  const supportPhone = '+234 8077784848'

  const handleCopy = () => {
    navigator.clipboard.writeText(supportPhone)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleCall = () => {
    window.location.href = `tel:${supportPhone.replace(/\s/g, '')}`
  }

  return (
    <div className="font-dmsans flex min-h-full w-full flex-col justify-between bg-white px-6 py-4">
      {/* ── Top Bar ── */}
      <div>
        <div className="flex items-center pt-2 pb-6">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="text-actionDark flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-gray-100"
            aria-label="Back"
          >
            <span className="material-symbols-outlined text-4xl">
              chevron_left
            </span>
          </button>
        </div>

        {/* ── Eyebrow & Title ── */}
        <div className="mt-2 mb-6">
          <span className="font-dmsans block text-[14px] font-semibold tracking-wider text-[#8A8578] uppercase">
            ACCOUNT RECOVERY
          </span>
          <h1 className="font-dmsans text-actionDark mt-1 text-[30px] font-bold tracking-tight">
            Contact Support
          </h1>
        </div>

        {/* ── Product Support Badge ── */}
        <div className="mb-4 flex items-center gap-2">
          <h2 className="font-dmsans text-actionDark text-[16px] font-bold">
            Product Support
          </h2>
          <span className="font-dmsans text-actionDark rounded-[4px] bg-[#FFE600] px-2 py-1 text-[12px] font-bold">
            Rezzident
          </span>
        </div>

        {/* ── Yellow Dashed Support Card ── */}
        <div className="rounded-[20px] bg-[#F9F9F8] p-4">
          <div className="flex items-center justify-between rounded-[16px] border border-dashed border-[#FFE043] bg-[#F9F9F8] p-4">
            <div>
              <p className="font-dmsans text-[12px] font-medium text-gray-500">
                Phone Number
              </p>
              <p className="font-dmsans text-actionDark text-[16px] font-bold">
                {supportPhone}
              </p>
            </div>

            <button
              type="button"
              onClick={handleCopy}
              className="text-actionDark flex items-center gap-1.5 rounded-[10px] border border-[#E5E5E5] bg-white px-3 py-1.5 text-[15px] font-bold shadow-sm transition-all hover:bg-gray-50 active:scale-95"
            >
              <span>{copied ? 'Copied!' : 'Copy'}</span>

              <span className="material-symbols-outlined text-black">
                content_copy
              </span>
            </button>
          </div>

          <Button
            type="button"
            onClick={handleCall}
            className="bg-actionDark mt-4 h-[52px] w-full rounded-[14px] text-[15px] font-medium text-white hover:bg-black"
          >
            Call Support
          </Button>

          <p className="font-dmsans mt-3 text-center text-[13px] text-gray-400">
            This will open your phone’s dial pad.
          </p>
        </div>
      </div>
    </div>
  )
}
