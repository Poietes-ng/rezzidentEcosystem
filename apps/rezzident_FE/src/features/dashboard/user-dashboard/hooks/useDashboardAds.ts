import { useQuery } from '@tanstack/react-query'
import type { DashboardAds } from '#/features/dashboard/user-dashboard/types/home.types'
import { getDashboardAds } from '#/features/dashboard/user-dashboard/api/homeQueries'

export interface UseDashboardAdsResult {
  ads: DashboardAds | null
  isLoading: boolean
  isError: boolean
  refetch: () => void
}

export function useDashboardAds(): UseDashboardAdsResult {
  const { data, isLoading, isError, refetch } = useQuery<DashboardAds>({
    queryKey: ['dashboardAds'],
    queryFn: getDashboardAds,
  })

  return {
    ads: data ?? null,
    isLoading,
    isError,
    refetch: () => {
      void refetch()
    },
  }
}
