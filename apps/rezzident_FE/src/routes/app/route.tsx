import { createFileRoute } from '@tanstack/react-router'
import { AppLayout } from '../../shared/components/layout/AppLayout'
import { AppNotFound } from '../../shared/components/layout/AppNotFound'
import { AppErrorBoundary } from '../../shared/components/layout/AppErrorBoundary'

export const Route = createFileRoute('/app')({
  component: AppLayout,
  notFoundComponent: AppNotFound,
  errorComponent: AppErrorBoundary,
})
