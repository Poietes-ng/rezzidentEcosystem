import { createFileRoute } from '@tanstack/react-router'
import { ResetPinScreen } from '#/features/auth'

export const Route = createFileRoute('/_app/reset-pin')({
  component: ResetPinScreen,
})
