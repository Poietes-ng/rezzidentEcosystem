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
        <div className="mt-3 divide-y divide-black/5">
          {[1, 2, 3, 4].map((index) => (
            <div key={index} className="flex items-center justify-between gap-3 px-1 py-3">
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <div className="bg-stoneEdge/40 h-5 w-5 shrink-0 animate-pulse rounded-full" />
                <div className="flex-1 space-y-1.5">
                  <div className="bg-stoneEdge/40 h-4 w-3/4 animate-pulse rounded" />
                  <div className="bg-stoneEdge/30 h-3 w-1/3 animate-pulse rounded" />
                </div>
              </div>
              <div className="bg-stoneEdge/30 h-4 w-4 shrink-0 animate-pulse rounded" />
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
