import { createFileRoute } from '@tanstack/react-router'
import { Support } from '#/features/application'

export const Route = createFileRoute('/app/support')({
  component: Support,
})
