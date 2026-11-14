import { useQuery } from '@tanstack/react-query'
import type { Activity } from '#/features/dashboard/user-dashboard/types/home.types'
import { getRecentActivities } from '#/features/dashboard/user-dashboard/api/homeQueries'

export interface UseRecentActivitiesResult {
  activities: Activity[]
  isLoading: boolean
  isError: boolean
  refetch: () => void
}

export function useRecentActivities(): UseRecentActivitiesResult {
  const {
    data = [],
    isLoading,
    isError,
    refetch,
  } = useQuery<Activity[]>({
    queryKey: ['recentActivities'],
    queryFn: getRecentActivities,
  })

  return {
    activities: data,
    isLoading,
    isError,
    refetch: () => {
      void refetch()
    },
  }
}
