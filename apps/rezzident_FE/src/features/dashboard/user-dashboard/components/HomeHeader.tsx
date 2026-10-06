import type { ReactNode } from 'react'
import type { Resident } from '#/features/dashboard/user-dashboard/types/home.types'

export interface HomeHeaderProps {
  resident?: Resident | null
  isLoading?: boolean
  onSupportClick?: () => void
  onNotificationsClick?: () => void
}

export function HomeHeader({
  resident,
  isLoading = false,
  onSupportClick,
  onNotificationsClick,
}: HomeHeaderProps): ReactNode {
  const isGreetingLoading = isLoading || !resident

  // Extract the remaining name after firstName for the clean two-line wrap
  const remainingName =
    resident && resident.fullName.startsWith(resident.firstName)
      ? resident.fullName.slice(resident.firstName.length).trim()
      : resident?.fullName

  return (
    <header className="flex items-start justify-between gap-4">
      {isGreetingLoading ? (
        <div aria-busy="true" className="flex-1 space-y-1.5" aria-label="Loading greeting">
          <span className="sr-only">Loading resident profile</span>
          <div
            aria-hidden="true"
            className="bg-stoneEdge/30 h-[28px] w-36 rounded-md motion-safe:animate-pulse"
          />
          <div
            aria-hidden="true"
            className="bg-stoneEdge/30 h-[28px] w-52 rounded-md motion-safe:animate-pulse"
          />
        </div>
      ) : (
        <h1 className="font-dmsans text-heading-2 text-actionDark leading-[28px] font-semibold tracking-tight">
          <span>Hello, {resident.firstName}</span>
          {remainingName ? (
            <>
              <br />
              <span>{remainingName}</span>
            </>
          ) : null}
        </h1>
      )}

      {/* Static Header Action Icons (Real interactive icons render immediately) */}
      <div className="flex shrink-0 items-center gap-1">
        <button
          type="button"
          onClick={onSupportClick}
          aria-label="Customer support"
          className="text-actionDark flex h-10 w-10 items-center justify-center rounded-full transition-all duration-150 hover:bg-black/5 active:scale-90 active:bg-black/10"
        >
          <span className="material-symbols-outlined text-[24px]" aria-hidden="true">
            support_agent
          </span>
        </button>
        <button
          type="button"
          onClick={onNotificationsClick}
          aria-label="Notifications"
          className="text-actionDark flex h-10 w-10 items-center justify-center rounded-full transition-all duration-150 hover:bg-black/5 active:scale-90 active:bg-black/10"
        >
          <span className="material-symbols-outlined text-[24px]" aria-hidden="true">
            notifications
          </span>
        </button>
      </div>
    </header>
  )
}
