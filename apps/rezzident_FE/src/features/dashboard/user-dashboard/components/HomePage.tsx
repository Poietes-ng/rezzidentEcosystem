import type { ReactNode } from 'react'
import type { NavTab } from '#/shared/components/layout/BottomNavigation'
import { HomeHeader } from '#/features/dashboard/user-dashboard/components/HomeHeader'
import { PromoBanner } from '#/features/dashboard/user-dashboard/components/PromoBanner'
import { QuickActions } from '#/features/dashboard/user-dashboard/components/QuickActions'
import { RecentActivities } from '#/features/dashboard/user-dashboard/components/RecentActivities'
import { SecurityAlertedModal } from '#/features/dashboard/user-dashboard/components/SecurityAlertedModal'
import { VerificationBanner } from '#/features/dashboard/user-dashboard/components/VerificationBanner'
import { VisitorCodeCard } from '#/features/dashboard/user-dashboard/components/VisitorCodeCard'
import { usePanic } from '#/features/dashboard/user-dashboard/hooks/usePanic'
import { useRecentActivities } from '#/features/dashboard/user-dashboard/hooks/useRecentActivities'
import { useResident } from '#/features/dashboard/user-dashboard/hooks/useResident'
import { BottomNavigation } from '#/shared/components/layout/BottomNavigation'
import { AlertCard } from '#/shared/components/ui'

export function HomePage(): ReactNode {
  const { data: resident, ads, isLoading, isError, refetch } = useResident()
  const {
    activities,
    isLoading: isActivitiesLoading,
    isError: isActivitiesError,
    refetch: refetchActivities,
  } = useRecentActivities()
  const {
    panicState,
    panicData,
    trigger: handlePanicTrigger,
    dismiss: handlePanicDismiss,
  } = usePanic()

  const isDeactivated = resident?.accountStatus === 'deactivated'

  const dashboardTabs: NavTab[] = [
    { id: 'home', label: 'Home', icon: 'home', to: '/user-dashboard' },
    { id: 'bills', label: 'Bills', icon: 'payments', to: '/bills' },
    { id: 'forum', label: 'Forum', icon: 'group_work', to: '/forum', disabled: isDeactivated },
    { id: 'vote', label: 'Vote', icon: 'how_to_vote', to: '/vote', disabled: isDeactivated },
    { id: 'settings', label: 'Settings', icon: 'settings', to: '/settings' },
  ]

  if (isError) {
    return (
      <div className="bg-lightCream flex min-h-screen w-full items-center justify-center p-4">
        <main className="flex w-full max-w-[768px] flex-col items-center justify-center rounded-2xl bg-white p-8 text-center shadow-xs">
          <div className="text-errorRed flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
            <span className="material-symbols-outlined text-[28px]" aria-hidden="true">
              error
            </span>
          </div>
          <h2 className="font-dmsans text-heading-3 text-actionDark mt-4 font-semibold">
            Failed to load dashboard
          </h2>
          <p className="font-dmsans text-body-small text-warmGray mt-2">
            We encountered an issue loading your profile details. Please try again.
          </p>
          <button
            type="button"
            onClick={refetch}
            className="bg-actionDark font-dmsans text-body-small mt-5 rounded-xl px-6 py-2.5 font-semibold text-white transition-opacity hover:opacity-90 active:scale-95"
          >
            Retry
          </button>
        </main>
      </div>
    )
  }

  return (
    <div className="bg-lightCream flex min-h-screen w-full items-start justify-center">
      <main className="relative flex min-h-screen w-full max-w-[768px] flex-col overflow-hidden bg-white pb-20 shadow-xs">
        {/* 1. Top Promo Strip */}
        <PromoBanner variant="top-strip" ad={ads?.topStrip} />

        {/* 2. Verification Banner */}
        {resident && <VerificationBanner verificationState={resident.verificationState} />}

        {/* 3. Main Dashboard Body */}
        <div className="px-md flex flex-1 flex-col gap-6 pt-5 pb-6">
          {/* Header Greeting & Action Buttons */}
          <HomeHeader resident={resident} isLoading={isLoading} />

          {/* Panic Error Alert */}
          {panicState === 'error' && (
            <AlertCard
              variant="error"
              title="Failed to alert security"
              description="Please check your connection and try again, or call security directly."
              action={{ label: 'Retry', onClick: handlePanicTrigger }}
              onDismiss={handlePanicDismiss}
            />
          )}

          {/* Quick Actions (ID, Alias, Vouch, Panic) */}
          <QuickActions
            accountStatus={resident?.accountStatus}
            onPanicClick={handlePanicTrigger}
            isPanicLoading={panicState === 'loading'}
          />

          {/* Middle Promotional Banner */}
          <PromoBanner variant="mid-promo" ad={ads?.midBanner} />

          {/* Visitor CTA Card */}
          <VisitorCodeCard accountStatus={resident?.accountStatus} />

          {/* Recent Activities Section */}
          <RecentActivities
            activities={activities}
            isLoading={isActivitiesLoading}
            isError={isActivitiesError}
            onRetry={refetchActivities}
          />
        </div>

        {/* Bottom Navigation */}
        <BottomNavigation tabs={dashboardTabs} />

        {/* Panic Confirmation Modal */}
        <SecurityAlertedModal
          open={panicState === 'success'}
          data={panicData}
          onClose={handlePanicDismiss}
        />
      </main>
    </div>
  )
}
