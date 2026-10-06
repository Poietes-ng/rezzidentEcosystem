import { createFileRoute } from '@tanstack/react-router'
import { HomePage } from '#/features/dashboard/user-dashboard'

export const Route = createFileRoute('/_authenticated/user-dashboard')({
  component: HomePage,
})
