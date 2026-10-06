import { useCallback, useEffect, useState } from 'react'
import type { Resident } from '#/features/dashboard/user-dashboard/types/home.types'
import { getResident } from '#/features/dashboard/user-dashboard/api/homeQueries'

export interface UseResidentResult {
  data: Resident | null
  isLoading: boolean
  isError: boolean
  refetch: () => void
}

export function useResident(): UseResidentResult {
  const [data, setData] = useState<Resident | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isError, setIsError] = useState<boolean>(false)

  const fetchResident = useCallback(async () => {
    setIsLoading(true)
    setIsError(false)
    try {
      const residentData = await getResident()
      setData(residentData)
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
    isLoading,
    isError,
    refetch: fetchResident,
  }
}
