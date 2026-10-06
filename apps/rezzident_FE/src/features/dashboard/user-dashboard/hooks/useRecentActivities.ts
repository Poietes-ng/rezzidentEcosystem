import { useCallback, useEffect, useState } from 'react'
import type { Activity } from '#/features/dashboard/user-dashboard/types/home.types'
import { getRecentActivities } from '#/features/dashboard/user-dashboard/api/homeQueries'

export interface UseRecentActivitiesResult {
  activities: Activity[]
  isLoading: boolean
  isError: boolean
  refetch: () => void
}

export function useRecentActivities(): UseRecentActivitiesResult {
  const [activities, setActivities] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isError, setIsError] = useState<boolean>(false)

  const fetchActivities = useCallback(async () => {
    setIsLoading(true)
    setIsError(false)
    try {
      const data = await getRecentActivities()
      setActivities(data)
    } catch {
      setIsError(true)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchActivities()
  }, [fetchActivities])

  return {
    activities,
    isLoading,
    isError,
    refetch: fetchActivities,
  }
}
