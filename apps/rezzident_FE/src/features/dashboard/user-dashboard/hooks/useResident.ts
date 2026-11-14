import { useQuery } from '@tanstack/react-query'
import type { Resident } from '#/features/dashboard/user-dashboard/types/home.types'
import { getResident } from '#/features/dashboard/user-dashboard/api/homeQueries'

export interface UseResidentResult {
  data: Resident | null
  isLoading: boolean
  isError: boolean
  refetch: () => void
}

export function useResident(): UseResidentResult {
  const { data, isLoading, isError, refetch } = useQuery<Resident>({
    queryKey: ['resident'],
    queryFn: getResident,
  })

  return {
    data: data ?? null,
    isLoading,
    isError,
    refetch: () => {
      void refetch()
    },
  }
}
