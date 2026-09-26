import { createFileRoute } from '@tanstack/react-router'
import { StatusPage } from '#/features/status/components/StatusPage'

export const Route = createFileRoute('/_authenticated/status')({
  component: StatusPage,
})
