import type { ReactNode } from 'react'
import type {
  QuickActionId,
  QuickActionTone,
} from '#/features/dashboard/user-dashboard/types/home.types'

export interface QuickActionTileProps {
  id: QuickActionId
  label: string
  icon: ReactNode
  onClick?: () => void
  disabled?: boolean
  ariaDisabled?: boolean
  loading?: boolean
  tone?: QuickActionTone
}

export function QuickActionTile({
  id,
  label,
  icon,
  onClick,
  disabled = false,
  ariaDisabled = false,
  loading = false,
  tone = 'default',
}: QuickActionTileProps): ReactNode {
  const isDanger = tone === 'danger'
  const isInteractive = !disabled && !ariaDisabled && !loading

  function handleClick(): void {
    if (!isInteractive) return
    onClick?.()
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        id={`quick-action-${id}`}
        disabled={disabled || loading}
        aria-disabled={disabled || ariaDisabled || loading}
        aria-busy={loading}
        onClick={handleClick}
        aria-label={label}
        className={[
          'group relative flex h-[72px] w-full max-w-[76px] items-center justify-center rounded-[12px] transition-all duration-150',
          isDanger
            ? 'bg-receiverBubble text-errorRed hover:bg-chatArea active:bg-stoneEdge/40'
            : 'bg-receiverBubble text-actionDark hover:bg-chatArea active:bg-stoneEdge/40',
          disabled
            ? 'cursor-not-allowed opacity-35 active:scale-100'
            : ariaDisabled
              ? 'cursor-default active:scale-100'
              : 'cursor-pointer active:scale-95',
          loading ? 'cursor-wait opacity-75' : '',
        ].join(' ')}
      >
        {loading ? (
          <span
            data-testid="loading-spinner"
            className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-current border-t-transparent"
            aria-hidden="true"
          />
        ) : (
          icon
        )}
      </button>

      <span
        className={[
          'font-dmsans text-center text-[14px] leading-tight font-medium select-none',
          disabled ? 'text-warmGray/50' : 'text-actionDark',
        ].join(' ')}
      >
        {label}
      </span>
    </div>
  )
}
