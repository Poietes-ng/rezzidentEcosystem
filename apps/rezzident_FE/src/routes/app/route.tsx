import { createFileRoute } from '@tanstack/react-router'
import { AppLayout, AppNotFound, AppErrorBoundary } from '../../shared/components/layout'

export const Route = createFileRoute('/app')({
  component: AppLayout,
  notFoundComponent: AppNotFound,
  errorComponent: AppErrorBoundary,
})
