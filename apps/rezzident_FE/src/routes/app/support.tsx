import { createFileRoute } from '@tanstack/react-router'
import { SupportChannelsScreen } from '#/features/auth/estate-registration'

export const Route = createFileRoute('/app/support')({
  component: SupportChannelsScreen,
})
