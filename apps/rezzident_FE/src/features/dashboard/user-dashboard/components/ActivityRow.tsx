import type { ReactNode } from 'react'
import type { Activity } from '#/features/dashboard/user-dashboard/types/home.types'
import { formatActivityDate } from '#/shared/utils/date'

export interface ActivityRowProps {
  activity: Activity
  onClick?: (activity: Activity) => void
}

export function ActivityRow({ activity, onClick }: ActivityRowProps): ReactNode {
  return (
    <button
      type="button"
      onClick={() => onClick?.(activity)}
      className="flex w-full items-center justify-between gap-3 px-1 py-3 text-left transition-colors duration-150 hover:bg-black/[0.02] active:bg-black/[0.04]"
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <span
          className="material-symbols-outlined text-actionDark shrink-0 text-[20px]"
          aria-hidden="true"
        >
          history_2
        </span>

        <div className="min-w-0 flex-1">
          <p className="font-dmsans text-actionDark truncate text-[14px] leading-snug font-medium">
            {activity.title}
          </p>
          <p className="font-dmsans text-warmGray mt-0.5 text-[12px] leading-none">
            {formatActivityDate(activity.timestamp)}
          </p>
        </div>
      </div>

      <span
        className="material-symbols-outlined text-actionDark shrink-0 text-[20px]"
        aria-hidden="true"
      >
        chevron_right
      </span>
    </button>
  )
}
