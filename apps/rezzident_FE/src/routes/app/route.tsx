import { createFileRoute } from '@tanstack/react-router'
import { AppErrorBoundary, AppLayout, AppNotFound } from '../../shared/components/layout'

export const Route = createFileRoute('/app')({
  component: AppLayout,
  notFoundComponent: AppNotFound,
  errorComponent: AppErrorBoundary,
})
