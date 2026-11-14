import { useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { aliasKeys } from '../api/aliasKeys'
import { getAlias } from '../api/aliasQueries'
import type { AliasDetailsData } from '../types/alias.types'

export interface UseAliasDetailsReturn {
  data: AliasDetailsData | null
  isLoading: boolean
  isError: boolean
  notFound: boolean
  refetch: () => Promise<void>
}

export function useAliasDetails(aliasId: string): UseAliasDetailsReturn {
  const {
    data: queryData,
    isLoading,
    isError,
    refetch: queryRefetch,
  } = useQuery<AliasDetailsData | null>({
    queryKey: aliasKeys.detail(aliasId),
    queryFn: () => getAlias(aliasId),
    enabled: Boolean(aliasId),
  })

  const data = queryData ?? null
  const notFound = !isLoading && !isError && data === null

  const refetch = useCallback(async (): Promise<void> => {
    await queryRefetch()
  }, [queryRefetch])

  return {
    data,
    isLoading,
    isError,
    notFound,
    refetch,
  }
}
