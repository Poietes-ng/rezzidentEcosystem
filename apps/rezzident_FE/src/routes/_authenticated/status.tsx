import { createFileRoute } from '@tanstack/react-router'
import { StatusPage } from '#/features/status'

export const Route = createFileRoute('/_authenticated/status')({
  component: StatusPage,
})
