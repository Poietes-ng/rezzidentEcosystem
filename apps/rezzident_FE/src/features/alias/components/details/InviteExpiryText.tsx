import { useCountdown } from '../../hooks/useCountdown'
import { formatTimeRemaining } from '../../utils/formatTimeRemaining'
import type { InviteExpiryTextProps } from '../../types/alias.types'
import type { ReactNode } from 'react'

export function InviteExpiryText({ expiresAt, onExpire }: InviteExpiryTextProps): ReactNode {
  const { remainingMs, isExpired } = useCountdown(expiresAt, onExpire)

  if (isExpired) {
    return (
      <div className="flex flex-col gap-1">
        <p role="alert" className="font-dmsans text-errorRed text-[14px] font-normal">
          Link has expired, generate a new link
        </p>
        <span className="sr-only" aria-live="polite">
          The alias invite link has expired.
        </span>
      </div>
    )
  }

  const formatted = formatTimeRemaining(remainingMs)

  return (
    <time dateTime={expiresAt} className="font-dmsans text-warmGray text-[14px] font-normal">
      Link expires in {formatted}
    </time>
  )
}
