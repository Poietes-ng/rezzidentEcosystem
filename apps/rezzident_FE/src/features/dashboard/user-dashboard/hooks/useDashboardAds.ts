import { useCallback, useEffect, useState } from 'react'
import type { DashboardAds } from '#/features/dashboard/user-dashboard/types/home.types'
import { getDashboardAds } from '#/features/dashboard/user-dashboard/api/homeQueries'

export interface UseDashboardAdsResult {
  ads: DashboardAds | null
  isLoading: boolean
  isError: boolean
  refetch: () => void
}

export function useDashboardAds(): UseDashboardAdsResult {
  const [ads, setAds] = useState<DashboardAds | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isError, setIsError] = useState<boolean>(false)

  const fetchAds = useCallback(async () => {
    setIsLoading(true)
    setIsError(false)
    try {
      const adsData = await getDashboardAds()
      setAds(adsData)
    } catch {
      setIsError(true)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchAds()
  }, [fetchAds])

  return {
    ads,
    isLoading,
    isError,
    refetch: fetchAds,
  }
}
