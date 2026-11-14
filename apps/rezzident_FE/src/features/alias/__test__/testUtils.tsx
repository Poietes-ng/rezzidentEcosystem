import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { setMockApiDelayMs } from '../api/aliasStore'
import type { ReactNode } from 'react'

// Speed up mock API delay in unit tests while keeping async tick behavior
setMockApiDelayMs(15)

export function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  })
}

export function createTestQueryWrapper(queryClient: QueryClient = createTestQueryClient()) {
  return function TestQueryWrapper({ children }: { children: ReactNode }): ReactNode {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  }
}
