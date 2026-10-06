import { useState } from 'react'
import type { ReactNode } from 'react'
import type { VerificationState } from '#/features/dashboard/user-dashboard/types/home.types'

export interface VerificationBannerProps {
  verificationState?: VerificationState
  onVerify?: () => void
}

export function VerificationBanner({
  verificationState = 'unverified',
  onVerify,
}: VerificationBannerProps): ReactNode {
  const [isDismissed, setIsDismissed] = useState<boolean>(false)

  if (isDismissed || verificationState === 'verified') {
    return null
  }

  const isTier2 = verificationState === 'tier2'

  return (
    <div
      role="region"
      aria-label="Account verification notice"
      className="bg-actionDark px-md py-sm flex w-full items-center justify-between gap-3 text-white"
    >
      <div className="flex min-w-0 flex-1 items-center gap-2.5">
        <span
          className="material-symbols-outlined text-actionYellow shrink-0 text-[20px]"
          aria-hidden="true"
        >
          verified
        </span>
        <div className="font-dmsans text-[13px] leading-tight font-semibold text-white">
          {isTier2 ? (
            <span>
              Upgrade account to Tier2
              <br />
              to vouch
            </span>
          ) : (
            <span>Become Rezzident verified</span>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <button
          type="button"
          onClick={onVerify}
          className="font-dmsans text-actionYellow text-[13px] font-semibold underline underline-offset-2 transition-opacity hover:opacity-80 active:opacity-60"
        >
          Verify now
        </button>
        <button
          type="button"
          onClick={() => setIsDismissed(true)}
          aria-label="Dismiss banner"
          className="flex h-5 w-5 items-center justify-center text-white/80 transition-colors hover:text-white active:scale-95"
        >
          <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
            close
          </span>
        </button>
      </div>
    </div>
  )
}
