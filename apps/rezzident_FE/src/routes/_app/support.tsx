import { createFileRoute } from '@tanstack/react-router'
import { SupportChannelsScreen } from '#/features/auth'

export const Route = createFileRoute('/_app/support')({
  component: SupportChannelsScreen,
})
