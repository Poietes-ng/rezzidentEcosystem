import { useCallback, useEffect, useState } from 'react'
import type { DashboardAds, Resident } from '#/features/dashboard/user-dashboard/types/home.types'
import { getDashboardAds, getResident } from '#/features/dashboard/user-dashboard/api/homeQueries'

export interface UseResidentResult {
  data: Resident | null
  ads: DashboardAds | null
  isLoading: boolean
  isError: boolean
  refetch: () => void
}

export function useResident(): UseResidentResult {
  const [data, setData] = useState<Resident | null>(null)
  const [ads, setAds] = useState<DashboardAds | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isError, setIsError] = useState<boolean>(false)

  const fetchResident = useCallback(async () => {
    setIsLoading(true)
    setIsError(false)
    try {
      const [residentData, adsData] = await Promise.all([getResident(), getDashboardAds()])
      setData(residentData)
      setAds(adsData)
    } catch {
      setIsError(true)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchResident()
  }, [fetchResident])

  return {
    data,
    ads,
    isLoading,
    isError,
    refetch: fetchResident,
  }
}
