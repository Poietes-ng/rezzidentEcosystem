import type { ReactNode } from 'react'
import type { Activity } from '#/features/dashboard/user-dashboard/types/home.types'
import { ActivityRow } from '#/features/dashboard/user-dashboard/components/ActivityRow'
import { AlertCard } from '#/shared/components/ui'

export interface RecentActivitiesProps {
  activities?: Activity[]
  isLoading?: boolean
  isError?: boolean
  onRetry?: () => void
  onActivityClick?: (activity: Activity) => void
}

export function RecentActivities({
  activities = [],
  isLoading = false,
  isError = false,
  onRetry,
  onActivityClick,
}: RecentActivitiesProps): ReactNode {
  return (
    <section
      aria-label="Recent activities"
      className="bg-offWhite w-full rounded-[24px] p-5 shadow-xs"
    >
      <h2 className="font-dmsans text-actionDark text-[16px] leading-[22px] font-semibold">
        Recent activities
      </h2>

      {/* Error state */}
      {isError && (
        <div className="mt-4">
          <AlertCard
            variant="error"
            title="Failed to load activities"
            description="We could not fetch your recent activity history."
            action={onRetry ? { label: 'Retry', onClick: onRetry } : undefined}
          />
        </div>
      )}

      {/* Loading skeleton state */}
      {isLoading && !isError && (
        <div
          aria-busy="true"
          className="mt-2 divide-y divide-black/5"
          aria-label="Loading recent activities"
        >
          <span className="sr-only">Loading recent activities</span>
          {[1, 2, 3, 4].map((index) => (
            <div
              key={index}
              aria-hidden="true"
              className="flex items-center justify-between gap-3 px-1 py-3"
            >
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <div className="bg-stoneEdge/30 h-5 w-5 shrink-0 rounded-full motion-safe:animate-pulse" />
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="bg-stoneEdge/30 h-[18px] w-3/4 rounded motion-safe:animate-pulse" />
                  <div className="bg-stoneEdge/20 h-[12px] w-1/3 rounded motion-safe:animate-pulse" />
                </div>
              </div>
              <div className="bg-stoneEdge/20 h-5 w-5 shrink-0 rounded motion-safe:animate-pulse" />
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !isError && activities.length === 0 && (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <span
            className="material-symbols-outlined text-warmGray/60 text-[32px]"
            aria-hidden="true"
          >
            schedule
          </span>
          <p className="font-dmsans text-actionDark mt-3 text-[16px] font-semibold">
            No activity yet.
          </p>
          <p className="font-dmsans text-warmGray mt-1 text-[14px]">
            Your recent actions will appear here.
          </p>
        </div>
      )}

      {/* Populated state (capped to 4 rows) */}
      {!isLoading && !isError && activities.length > 0 && (
        <div className="mt-2 divide-y divide-black/5">
          {activities.slice(0, 4).map((activity) => (
            <ActivityRow key={activity.id} activity={activity} onClick={onActivityClick} />
          ))}
        </div>
      )}
    </section>
  )
}
