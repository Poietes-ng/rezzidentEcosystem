import { createFileRoute } from '@tanstack/react-router'
import { Support } from '#/features/application/components/support-page'

export const Route = createFileRoute('/app/support')({
  component: Support,
})
