import { colors } from '@rezzident/design-tokens'
import { INVITE_LINK_DISPLAY_PREFIX } from '../../constants/inviteLink'
import type { ReactNode } from 'react'
import type { InviteLinkFieldProps } from '../../types/alias.types'
import { Button } from '#/shared/components/ui'
import { cn } from '#/shared/utils/cn'

export function InviteLinkField({
  code,
  isExpired,
  copied,
  onCopy,
}: InviteLinkFieldProps): ReactNode {
  const displayUrl = `${INVITE_LINK_DISPLAY_PREFIX}${code}`

  return (
    <div
      className={cn(
        'bg-offWhite flex w-full items-center justify-between gap-3 rounded-2xl border-2 border-dashed p-3 transition-colors',
        isExpired ? 'border-errorRed' : 'border-actionYellow',
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-2.5">
        <span
          className={cn(
            'material-symbols-outlined shrink-0 text-[20px]',
            isExpired ? 'text-errorRed' : 'text-actionDark',
          )}
          aria-hidden="true"
        >
          link
        </span>
        <span
          className={cn(
            'font-dmsans truncate text-[14px] font-medium',
            isExpired ? 'text-mutedOlive' : 'text-actionDark',
          )}
        >
          {displayUrl}
        </span>
      </div>

      <Button
        size="sm"
        variant="outlined"
        buttonStyle={{
          bgColor: colors.inputBg,
          textColor: colors.actionDark,
          borderColor: colors.actionYellow,
          hoverBgColor: colors.actionYellowHover,
          pressedBgColor: colors.actionYellowPressed,
        }}
        aria-disabled={isExpired}
        onClick={
          isExpired
            ? (e) => {
                e.preventDefault()
              }
            : onCopy
        }
        className="font-dmsans h-8 shrink-0 gap-1.5 rounded-lg px-3 text-[14px] font-semibold"
      >
        <span className="font-dmsans">{copied ? 'Copied' : 'Copy'}</span>
        <span className="material-symbols-outlined text-[16px] leading-none" aria-hidden="true">
          content_copy
        </span>
      </Button>
    </div>
  )
}
